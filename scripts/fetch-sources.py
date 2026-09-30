"""Download a captured route's stylesheets and client chunks into reference/shared/, keyed by file name.

usage: python3 scripts/fetch-sources.py <ref-dir> [<ref-dir> ...]
Writes reference/shared/css/<name>.css, reference/shared/js/<name>.js (raw, unscrubbed: reference/ never ships)
and <ref-dir>/css-order.json (the stylesheet order that route loads).
"""
import json, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARED = os.path.join(ROOT, 'reference', 'shared')

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()

for ref in sys.argv[1:]:
    ref = os.path.abspath(ref)
    base = json.load(open(os.path.join(ref, '.origin.json')))['url']
    html = open(os.path.join(ref, 'dom', 'full.html')).read()
    order = []
    for kind, pat in (('css', r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css[^"]*)"'), ('js', r'(/_next/static/[^"\s]+\.js)')):
        os.makedirs(os.path.join(SHARED, kind), exist_ok=True)
        for href in dict.fromkeys(re.findall(pat, html)):
            name = href.split('?')[0].rsplit('/', 1)[-1]
            dst = os.path.join(SHARED, kind, name)
            if kind == 'css':
                order.append(name)
            if not os.path.exists(dst):
                try:
                    open(dst, 'wb').write(get(urllib.parse.urljoin(base, href)))
                except Exception as e:
                    print('fail', href, e, file=sys.stderr)
    json.dump(order, open(os.path.join(ref, 'css-order.json'), 'w'), indent=1)
    print(os.path.basename(ref), len(order), 'stylesheets')
