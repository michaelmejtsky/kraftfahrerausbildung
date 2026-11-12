"""Lokales Installationspaket. Keine Downloads im öffentlichen App-Verzeichnis."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parent
(root/'artifacts').mkdir(exist_ok=True)
(root/'artifacts'/'Kraftfahrerausbildung_Code.gs.txt').write_bytes((root/'backend'/'Code.gs').read_bytes())
paths=[*sorted((root/'dist').glob('*')),*sorted((root/'backend').glob('*')),*sorted((root/'tests').glob('*')),root/'INSTALLATION.md',root/'README.md',root/'START_HIER.md',root/'RECHTE_UND_NACHWEISE.md',root/'CLOUDFLARE_EINRICHTUNG.md',root/'LERNEN_UND_PRUEFEN.md',root/'wrangler.jsonc',root/'index.html',root/'pack.py',root/'.github/workflows/pages.yml',root/'.gitignore']
with ZipFile(root/'artifacts/kraftfahrerausbildung.zip','w',ZIP_DEFLATED) as out:
    for p in paths:
        if p.is_file() and p.name!='kraftfahrerausbildung.zip':
            out.write(p,p.relative_to(root))
print('Installationspaket lokal in artifacts/ erstellt; kein Bestandteil der App-Veröffentlichung.')
