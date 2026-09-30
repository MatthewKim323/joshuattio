"""Harvest media a route references but the capture never loaded (inactive tabs, lazy slides).

usage: python3 scripts/fetch-media.py <ref-dir> [...]
Scans the route's dom (including its server payload) and the client chunks it loads for static media paths,
downloads the ones missing from its assets manifest as content-addressed files, and appends them to the manifest.
"""
import hashlib, json, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARED_JS = os.path.join(ROOT, 'reference', 'shared', 'js')
# static build media, and the CMS asset store the page content points at
MEDIA = re.compile(r'(?:/_next/static/immutable/media/|https://a\.storyblok\.com/f/\d+/[\dx]+/[a-f0-9]+/)[A-Za-z0-9._~-]+\.(?:avif|webp|png|jpe?g|gif|svg|mp4|webm)')

def key(u):
    u = u.replace('&amp;', '&')
    if '/_next/image' in u:
        q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query).get('url')
        if q: u = q[0]
    return u.split('?')[0].rsplit('/', 1)[-1]

for ref in sys.argv[1:]:
    ref = os.path.abspath(ref)
    base = json.load(open(os.path.join(ref, '.origin.json')))['url']
    mpath = os.path.join(ref, 'assets', 'manifest.json')
    manifest = json.load(open(mpath))
    have = {key(a['originalUrl']) for a in manifest}
    html = open(os.path.join(ref, 'dom', 'full.html')).read()
    text = html.replace('\\u002F', '/').replace('\\/', '/')
    for src in dict.fromkeys(re.findall(r'/_next/static/[^"\s]+\.js', html)):
        f = os.path.join(SHARED_JS, src.rsplit('/', 1)[-1])
        if os.path.exists(f): text += open(f, errors='replace').read()
    found = dict.fromkeys(MEDIA.findall(text))
    added = 0
    for path in found:
        if key(path) in have: continue
        # a scrubbed dom has the brand written into file names; try the path with each origin word put back
        origin = json.load(open(os.path.join(ref, '.origin.json')))
        tries = [path] + [path.replace('joshuattio', t) for t in origin['tokens'] if '.' not in t]
        data = None
        for cand in tries:
            try:
                data = urllib.request.urlopen(urllib.request.Request(urllib.parse.urljoin(base, cand), headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()
                path = cand
                break
            except Exception as e:
                err = e
        if data is None:
            print('fail', tries[0], err, file=sys.stderr); continue
        ext = path.rsplit('.', 1)[-1]
        kind = 'videos' if ext in ('mp4', 'webm') else 'images'
        name = f"{'vid' if kind == 'videos' else 'img'}-{hashlib.sha1(data).hexdigest()[:10]}.{ext}"
        os.makedirs(os.path.join(ref, 'assets', kind), exist_ok=True)
        open(os.path.join(ref, 'assets', kind, name), 'wb').write(data)
        manifest.append({'originalUrl': urllib.parse.urljoin(base, path), 'localPath': f'assets/{kind}/{name}', 'type': kind, 'bytes': len(data), 'harvested': 'payload'})
        have.add(key(path)); added += 1
    json.dump(manifest, open(mpath, 'w'), indent=1)
    print(os.path.basename(ref), 'referenced', len(found), 'added', added)
