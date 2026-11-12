"""Regression: beide bislang verwendeten App-Adressen müssen alle Assets liefern."""
from pathlib import Path
from tempfile import TemporaryDirectory
import importlib.util
import re
import shutil

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('prepare_pages', root / 'prepare-pages.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with TemporaryDirectory() as folder:
    isolated = Path(folder)
    shutil.copytree(root / 'dist', isolated / 'dist')
    output = module.prepare(isolated)
    for relative in ['', 'dist']:
        served = output / relative
        for source in (isolated / 'dist').rglob('*'):
            if source.is_file():
                assert (served / source.relative_to(isolated / 'dist')).read_bytes() == source.read_bytes()
        html = (served / 'index.html').read_text()
        for asset in re.findall(r'(?:src|href)="([^"#?]+)"', html):
            if not asset.startswith(('https:', 'http:', 'data:')):
                assert (served / asset).is_file(), (relative, asset)
        for private in ['Code.gs', 'backend/Code.gs', 'kraftfahrerausbildung.zip']:
            assert not (served / private).exists()
    # Wiederholung ersetzt nur den lokalen Veröffentlichungsordner.
    assert module.prepare(isolated) == output
    assert (output / 'dist/service-worker.js').is_file()
print('PASS: Hauptadresse und /dist/ enthalten vollständige identische App-Dateien; keine Backend- oder Installationsdateien veröffentlicht.')
