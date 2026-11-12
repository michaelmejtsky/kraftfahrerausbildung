"""Die App unter der Hauptadresse und unter dem bisherigen /dist/-Pfad ausliefern."""
from pathlib import Path
import shutil


def prepare(root: Path) -> Path:
    source = root / 'dist'
    target = root / '.pages'
    if not (source / 'index.html').is_file():
        raise RuntimeError('App-Oberfläche dist/index.html fehlt.')
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)
    # Bestehende Installationen, Service-Worker und gespeicherte Links behalten
    # ihren bisherigen relativen Pfad einschließlich Manifest, Icons und Skripten.
    shutil.copytree(source, target / 'dist')
    return target


if __name__ == '__main__':
    output = prepare(Path(__file__).resolve().parent)
    print('App für Hauptadresse und bisherigen /dist/-Pfad vorbereitet.')
