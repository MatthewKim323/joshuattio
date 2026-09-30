/**
 * Port captured pages into the app.
 *
 *   bun scripts/port.ts css                       app/site.css: every stylesheet any captured route loads
 *                                                 (reference/shared/css, see fetch-sources.py), in load order
 *   bun scripts/port.ts page <ref> <route>        one component per top-level block of that route's main:
 *                                                 home (`site /`) -> components/sections/NN-*.tsx,
 *                                                 others -> components/pages/<route>/NN-*.tsx + app/<route>/page.tsx
 *
 * Existing section files are never overwritten (hand edits live there); pass --force to regenerate.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const REFS = path.join(ROOT, 'reference');
const refDirs = fs.readdirSync(REFS).filter((d) => d.startsWith('site') && fs.existsSync(path.join(REFS, d, '.origin.json')))
  .sort((a, b) => (a === 'site' ? -1 : b === 'site' ? 1 : a.localeCompare(b)));
const origin = JSON.parse(fs.readFileSync(path.join(REFS, 'site', '.origin.json'), 'utf8'));
// every harvested asset of every captured route, with the capture dir it lives in
const manifest: { originalUrl: string; localPath: string; ref: string }[] = refDirs.flatMap((d) => {
  const f = path.join(REFS, d, 'assets', 'manifest.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).map((a: any) => ({ ...a, ref: d })) : [];
});
const BRAND = 'Joshuattio';
const host: string = origin.host.replace(/^www\./, '');

// ---------- scrub ----------
const tokens: string[] = [...origin.tokens].sort((a, b) => b.length - a.length);
const tokenRes = tokens.map((t) => {
  const body = t.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&').replace(/[a-zA-Z]/g, (c) => `[${c.toUpperCase()}${c.toLowerCase()}]`);
  return new RegExp(`(?<![A-Za-z0-9])(${body})(?![a-z0-9])`, 'g');
});
const matchCase = (s: string) => (s === s.toUpperCase() && s.length > 1 ? BRAND.toUpperCase() : s[0] === s[0].toUpperCase() ? BRAND : BRAND.toLowerCase());
export function scrub(text: string) {
  for (const re of tokenRes) text = text.replace(re, (m) => (m.includes('.') ? BRAND.toLowerCase() + '.com' : matchCase(m)));
  return text;
}

// ---------- assets ----------
const keyOf = (u: string) => {
  u = u.replace(/&amp;/g, '&');
  if (u.includes('/_next/image')) u = new URL(u, 'http://x').searchParams.get('url') || u;
  return u.split('?')[0].split('/').pop()!;
};
const byKey = new Map<string, { localPath: string; ref: string }>();
for (const a of manifest) {
  // failed downloads are saved as empty files: never let one stand in for the real asset
  try { if (fs.statSync(path.join(REFS, a.ref, a.localPath)).size === 0) continue; } catch { continue; }
  const k = keyOf(a.originalUrl);
  // a scrubbed dom refers to some files by their brand-rewritten name
  for (const kk of [k, scrub(k)]) if (!byKey.has(kk)) byKey.set(kk, a);
}
function localAsset(u: string): string | null {
  const hit = byKey.get(keyOf(u));
  if (!hit) return null;
  const lp = hit.localPath;
  const kind = lp.startsWith('assets/fonts') ? 'fonts' : lp.startsWith('assets/videos') ? 'media' : 'img';
  const name = path.basename(lp);
  const dst = path.join(ROOT, 'public', kind, name);
  if (!fs.existsSync(dst)) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(path.join(REFS, hit.ref, lp), dst); }
  return `/${kind}/${name}`;
}
function fixLink(href: string) {
  try {
    const u = new URL(href, `https://${host}/`);
    if (!/^https?:$/.test(u.protocol)) return scrub(href);
    const h = u.hostname.replace(/^www\./, '');
    if (h === host) return scrub((u.pathname || '/') + u.search + u.hash);
    if (h.endsWith('.' + host)) return '#';
    return scrub(href);
  } catch { return href; }
}

// ---------- css ----------
/** url(...) references inside css text, pointed at the local copies */
function cssUrls(css: string) {
  return css.replace(/url\(([^)]+)\)/g, (m, raw) => {
    const u = raw.replace(/^["']|["']$/g, '');
    if (u.startsWith('data:') || u.startsWith('#')) return m;
    const l = localAsset(u);
    return l ? `url(${l})` : 'url()';
  });
}
// local file names of fonts whose original file name marks them as commercially licensed
const UNLICENSED_FONTS = manifest.filter((a) => /tiempos/i.test(a.originalUrl)).map((a) => path.basename(a.localPath));
function portCss() {
  const dir = path.join(REFS, 'shared', 'css');
  const names: string[] = [];
  for (const d of refDirs) {
    const f = path.join(REFS, d, 'css-order.json');
    if (fs.existsSync(f)) for (const n of JSON.parse(fs.readFileSync(f, 'utf8'))) if (!names.includes(n)) names.push(n);
  }
  const out = names.map((f) => {
    let css = fs.readFileSync(path.join(dir, f), 'utf8');
    css = cssUrls(css);
    // font subsets the capture never loaded (unused unicode ranges) have nothing to point at
    css = css.replace(/@font-face\{[^}]*url\(\)[^}]*\}/g, '');
    // commercially licensed faces are not shipped; their declared fallbacks (local system fonts) take over
    for (const f of UNLICENSED_FONTS) css = css.replace(new RegExp(`@font-face\\{[^}]*${f.replace('.', '\\.')}[^}]*\\}`, 'g'), '');
    return scrub(css);
  });
  fs.writeFileSync(path.join(ROOT, 'app', 'site.css'), out.join('\n'));
}

// ---------- html -> jsx ----------
const ATTR: Record<string, string> = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', srcset: 'srcSet', crossorigin: 'crossOrigin',
  fetchpriority: 'fetchPriority', playsinline: 'playsInline', autoplay: 'autoPlay', readonly: 'readOnly',
  maxlength: 'maxLength', minlength: 'minLength', colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete',
  datetime: 'dateTime', frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', enctype: 'encType',
  contenteditable: 'contentEditable', spellcheck: 'spellCheck', 'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace',
  'xmlns:xlink': 'xmlnsXlink', 'xml:lang': 'xmlLang', 'xlink:title': 'xlinkTitle', 'accept-charset': 'acceptCharset',
  'http-equiv': 'httpEquiv', referrerpolicy: 'referrerPolicy', novalidate: 'noValidate', inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint', usemap: 'useMap', formaction: 'formAction', popovertarget: 'popoverTarget',
  srcdoc: 'srcDoc', srclang: 'srcLang', cellpadding: 'cellPadding', cellspacing: 'cellSpacing',
  checked: 'defaultChecked', value: 'defaultValue', muted: 'muted', 'clip-rule': 'clipRule', 'fill-rule': 'fillRule',
};
const BOOL = new Set(['hidden', 'disabled', 'defaultChecked', 'muted', 'loop', 'autoPlay', 'playsInline', 'controls', 'open', 'inert', 'readOnly', 'required', 'multiple', 'allowFullScreen', 'noValidate', 'async', 'defer', 'selected']);
// attributes react types as numbers
const NUMERIC = new Set(['tabIndex', 'rows', 'cols', 'size', 'span', 'start', 'maxLength', 'minLength', 'colSpan', 'rowSpan', 'high', 'low', 'optimum']);
const DROP = new Set(['script', 'noscript', 'template', 'link', 'meta', 'iframe', 'next-route-announcer']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'source', 'track', 'wbr']);
const camel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function styleObj(s: string): string {
  const parts: string[] = [];
  for (const decl of s.split(/;(?![^(]*\))/)) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const k = decl.slice(0, i).trim();
    const v = cssUrls(scrub(decl.slice(i + 1).trim()));
    if (!k) continue;
    let key = k.startsWith('--') ? k : k.startsWith('-ms-') ? 'ms' + camel(k.slice(3)).replace(/^./, (c) => c.toUpperCase()) : k.startsWith('-') ? camel(k.slice(1)).replace(/^./, (c) => c.toUpperCase()) : camel(k);
    parts.push(`${JSON.stringify(key)}:${JSON.stringify(v)}`);
  }
  return `{{${parts.join(',')}}}`;
}

function attrs(node: any): string {
  const out: string[] = [];
  const isInput = node.tagName === 'input' || node.tagName === 'textarea' || node.tagName === 'select';
  for (const a of node.attrs as { name: string; value: string; prefix?: string }[]) {
    let name = a.prefix ? `${a.prefix}:${a.name}` : a.name;
    let v = a.value;
    if (/^on[a-z]+$/.test(name)) continue;
    if (name === 'imagesrcset' || name === 'imagesizes' || name === 'nonce') continue;
    // `type` only means something on these; a trigger div carrying it would not typecheck
    if (name === 'type' && !['button', 'input', 'source', 'script', 'style', 'ol', 'embed', 'object', 'a', 'link', 'menu'].includes(node.tagName)) continue;
    if (name === 'style') { out.push(`style=${styleObj(v)}`); continue; }
    if ((name === 'value' || name === 'checked') && !isInput) { if (name === 'value') out.push(`value=${JSON.stringify(v)}`); continue; }
    let key = ATTR[name] ?? (name.startsWith('data-') || name.startsWith('aria-') ? name : name.includes('-') || name.includes(':') ? camel(name.replace(':', '-')) : name);
    if (key === 'src' || key === 'poster' || (key === 'href' && /\.(png|jpe?g|webp|svg|gif|avif|mp4)(\?|$)/.test(v))) {
      v = localAsset(v) ?? v;
    } else if (key === 'srcSet') {
      v = v.split(',').map((p) => { const [u, d] = p.trim().split(/\s+/); return [localAsset(u) ?? u, d].filter(Boolean).join(' '); }).join(', ');
    } else if (key === 'href' || key === 'action') {
      v = fixLink(v);
    } else {
      v = scrub(v);
    }
    if (BOOL.has(key) && (v === '' || v === key.toLowerCase())) { out.push(key); continue; }
    // hidden="until-found" (find-in-page accordions) is valid html the react types do not know yet
    if (key === 'hidden') { out.push(`{...({ hidden: ${JSON.stringify(v)} } as object)}`); continue; }
    if ((NUMERIC.has(key) || /^aria-value(max|min|now)$/.test(key)) && /^-?\d+(\.\d+)?$/.test(v)) { out.push(`${key}={${v}}`); continue; }
    // jsx string attributes have no escapes: anything with a quote, backslash or newline goes in an expression
    out.push(/["\\\n]/.test(v) ? `${key}={${JSON.stringify(v)}}` : `${key}=${JSON.stringify(v)}`);
  }
  if (node.tagName === 'input' || node.tagName === 'textarea') out.push('suppressHydrationWarning');
  return out.length ? ' ' + out.join(' ') : '';
}

function jsx(node: any, depth = 0): string {
  const pad = '  '.repeat(depth);
  if (node.nodeName === '#text') {
    const t = scrub(node.value);
    if (!t.trim()) return /\n/.test(t) ? '' : `${pad}{${JSON.stringify(t)}}`;
    return `${pad}{${JSON.stringify(t)}}`;
  }
  if (node.nodeName === '#comment') return '';
  const tag: string = node.tagName;
  if (!tag || DROP.has(tag)) return '';
  if (tag === 'style') {
    const css = node.childNodes.map((c: any) => c.value || '').join('');
    return `${pad}<style dangerouslySetInnerHTML={{__html:${JSON.stringify(cssUrls(scrub(css)))}}} />`;
  }
  const a = attrs(node);
  const kids = (tag === 'template' ? node.content.childNodes : node.childNodes) as any[];
  if (VOID.has(tag) || !kids.length) return `${pad}<${tag}${a} />`;
  if (tag === 'textarea') return `${pad}<textarea${a} defaultValue=${JSON.stringify(kids.map((k) => k.value || '').join(''))} />`;
  const inner = kids.map((k) => jsx(k, depth + 1)).filter(Boolean);
  if (!inner.length) return `${pad}<${tag}${a} />`;
  return `${pad}<${tag}${a}>\n${inner.join('\n')}\n${pad}</${tag}>`;
}

// ---------- pick blocks ----------
const [mode, refName = 'site', route = '/'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (mode === 'css') { portCss(); console.log('wrote app/site.css'); process.exit(0); }
if (mode !== 'page') { console.error('usage: bun scripts/port.ts css | page <ref> <route>'); process.exit(1); }
const isHome = route === '/';
const html = fs.readFileSync(path.join(REFS, refName, 'dom', 'full.html'), 'utf8');
const doc = parse(html);
const find = (n: any, pred: (n: any) => boolean): any => {
  if (pred(n)) return n;
  for (const c of n.childNodes || []) { const r = find(c, pred); if (r) return r; }
  return null;
};
const cls = (n: any) => (n.attrs || []).find((a: any) => a.name === 'class')?.value || '';
const text = (n: any): string => (n.nodeName === '#text' ? n.value : (n.childNodes || []).map(text).join(' '));
const kidsOf = (n: any) => n.childNodes.filter((c: any) => c.tagName && !DROP.has(c.tagName));
// the usual page frame; some templates put header, content and footer straight into <body>
const shell = find(doc, (n) => n.tagName === 'div' && cls(n).includes('min-h-screen') && cls(n).includes('overflow-x-clip')) ?? find(doc, (n) => n.tagName === 'body');
const header = shell.childNodes.find((n: any) => n.tagName === 'div' && cls(n).includes('sticky'));
// body-level extras that are not page content (overlays, consent, widgets) stay out of the port
const NOT_CONTENT = (n: any) => ['section', 'div'].includes(n.tagName) && /(fixed|pointer-events-none fixed|intercom|grecaptcha)/.test(cls(n) + (n.attrs || []).map((a: any) => a.value).join(' ')) || (n.attrs || []).some((a: any) => a.name === 'aria-label' && /Notifications|Cookie consent/.test(a.value));
const main = find(shell, (n) => n.tagName === 'main');
const footer = shell.childNodes.find((n: any) => n.tagName === 'footer');
// some templates put their content straight into the page frame, between header and footer
let mainBlocks = main ? kidsOf(main) : kidsOf(shell).filter((n: any) => n !== header && n !== footer && !NOT_CONTENT(n));
// content the frame holds beside <main> (a page header above it, say) is kept, in order, around <main>
const frameKids = kidsOf(shell).filter((n: any) => n !== header && n !== footer && !NOT_CONTENT(n));
const mainInFrame = main && frameKids.includes(main) ? main : null;
const extras = mainInFrame ? frameKids.filter((n: any) => n !== main) : [];
// a route that wraps everything in one element: its children are the sections
while (mainBlocks.length === 1 && kidsOf(mainBlocks[0]).length > 1 && !['section', 'article'].includes(mainBlocks[0].tagName)) mainBlocks = kidsOf(mainBlocks[0]);
const mainWrapper = main && kidsOf(main).length === 1 && mainBlocks !== kidsOf(main) ? kidsOf(main)[0] : null;
const blocks = isHome ? [header, ...mainBlocks, footer] : [...extras, ...mainBlocks];
// readable names for blocks, keyed by their first heading (or shape)
const NAMES: Record<string, string> = {
  'welcome-to-agentic-revenue': 'hero', 'the-intelligent-system-that': 'pillars', 'live-from-day-one': 'self-building',
  'universal-context': 'universal-context', 'run-at-any-scale': 'scale', 'trusted-by-30-000': 'customers',
  'better-as-you-grow': 'changelog', 'agentic-revenue-runs-on': 'cta',
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 4).join('-');
const routeSlug = route.replace(/^\/|\/$/g, '');
const names: string[] = [];
const outDir = isHome ? path.join(ROOT, 'components', 'sections') : path.join(ROOT, 'components', 'pages', routeSlug);
fs.mkdirSync(outDir, { recursive: true });
const manifestOut: { file: string; component: string; name: string }[] = [];

blocks.forEach((b: any, i: number) => {
  const h = find(b, (n) => /^h[1-3]$/.test(n.tagName || ''));
  const shape = b.tagName === 'svg' ? 'divider' : cls(b).includes('max-lg:hidden') ? 'spacer' : !h && find(b, (n) => n.tagName === 'a') ? 'logos' : 'block';
  let name = isHome && i === 0 ? 'header' : b === footer ? 'footer' : h ? NAMES[slug(scrub(text(h)))] ?? slug(scrub(text(h))) : shape;
  if (!name) name = 'block';
  if (names.includes(name)) name = `${name}-${i}`;
  names.push(name);
  const comp = name.split('-').map((w: string) => w[0].toUpperCase() + w.slice(1)).join('').replace(/^\d/, 'S$&');
  const file = `${String(i).padStart(2, '0')}-${name}`;
  const body = jsx(b, 2);
  const src = `// Generated by scripts/port.ts. Hand edits are expected from here on.\nexport function ${comp}() {\n  return (\n${body}\n  );\n}\n`;
  const dst = path.join(outDir, `${file}.tsx`);
  if (!fs.existsSync(dst) || process.argv.includes('--force')) fs.writeFileSync(dst, src);
  manifestOut.push({ file, component: comp, name });
});
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(manifestOut, null, 1));

if (!isHome) {
  // the route page: shared shell, this route's blocks, `?only=<name>` for one block without the shell
  const title = scrub((find(doc, (n) => n.tagName === 'title')?.childNodes?.[0]?.value || '').trim());
  const desc = scrub((find(doc, (n) => n.tagName === 'meta' && (n.attrs || []).some((a: any) => a.name === 'name' && a.value === 'description'))?.attrs || []).find((a: any) => a.name === 'content')?.value?.trim() || '');
  let wrapOpen = mainWrapper ? `<${mainWrapper.tagName}${attrs(mainWrapper)}>` : '<>';
  let wrapClose = mainWrapper ? `</${mainWrapper.tagName}>` : '</>';
  const imports = manifestOut.map((m) => `import { ${m.component} } from "@/components/pages/${routeSlug}/${m.file}";`).join('\n');
  const reg = manifestOut.map((m) => `  ${JSON.stringify(m.name)}: ${m.component},`).join('\n');
  const pageDir = path.join(ROOT, 'app', routeSlug);
  const pageFile = path.join(pageDir, 'page.tsx');
  fs.mkdirSync(pageDir, { recursive: true });
  if (!fs.existsSync(pageFile) || process.argv.includes('--force')) fs.writeFileSync(pageFile, `import type { Metadata } from "next";
import { SiteShell } from "@/components/shell/site-shell";
${imports}

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(desc)},
};

// Top-level blocks of main, in page order. \`?only=<name>\` renders one block without the shell.
const SECTIONS = {
${reg}
} as const;

export default async function Page({ searchParams }: PageProps<${JSON.stringify('/' + routeSlug)}>) {
  const only = (await searchParams).only;
  const pick = typeof only === "string" && only in SECTIONS ? (only as keyof typeof SECTIONS) : null;
  if (pick) {
    const One = SECTIONS[pick];
    return <main><One /></main>;
  }
${extras.length ? `  const entries = Object.entries(SECTIONS);
  // blocks the frame holds beside <main> render around it, in reference order
  const before = entries.slice(0, ${frameKids.indexOf(mainInFrame)});
  const inMain = entries.slice(${frameKids.indexOf(mainInFrame)}, ${frameKids.indexOf(mainInFrame) + mainBlocks.length});
  const after = entries.slice(${frameKids.indexOf(mainInFrame) + mainBlocks.length});
  return (
    <SiteShell bare>
      {before.map(([name, S]) => <S key={name} />)}
      <main${attrs(mainInFrame)}>
        ${wrapOpen}
          {inMain.map(([name, S]) => <S key={name} />)}
        ${wrapClose}
      </main>
      {after.map(([name, S]) => <S key={name} />)}
    </SiteShell>
  );` : `  return (
    <SiteShell>
      ${wrapOpen}
        {Object.entries(SECTIONS).map(([name, S]) => <S key={name} />)}
      ${wrapClose}
    </SiteShell>
  );`}
}
`);
}
console.log(manifestOut.map((m) => `${m.file}  ${m.component}`).join('\n'));
