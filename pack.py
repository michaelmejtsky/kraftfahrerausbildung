"""Reproduzierbares eigenständiges Installationspaket, ohne Zugangsdaten/Git-Metadaten."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parent
(root/'dist'/'Kraftfahrerausbildung_Code.gs.txt').write_bytes((root/'backend'/'Code.gs').read_bytes())
paths=[*sorted((root/'dist').glob('*')),*sorted((root/'backend').glob('*')),*sorted((root/'tests').glob('*')),root/'INSTALLATION.md',root/'README.md',root/'START_HIER.md',root/'CLOUDFLARE_EINRICHTUNG.md',root/'wrangler.jsonc',root/'pack.py',root/'.github/workflows/pages.yml',root/'.gitignore']
with ZipFile(root/'dist/kraftfahrerausbildung.zip','w',ZIP_DEFLATED) as out:
    for p in paths:
        if p.is_file() and p.name!='kraftfahrerausbildung.zip':
            out.write(p,p.relative_to(root))
print('Installationspaket erstellt.')
