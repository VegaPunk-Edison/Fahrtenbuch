# Fahrtenbuch

Ein einfaches, lokal laufendes Fahrtenbuch als Single-Page-App (eine einzige `index.html`, keine Abhängigkeiten, keine Build-Schritte).

## Nutzung

`index.html` einfach im Browser öffnen (oder z. B. mit `npx serve` bereitstellen). Alle Daten werden ausschließlich im `localStorage` des Browsers gespeichert.

## Funktionen

- **Neue Fahrt**: Start- und Zieladressen (mit Autovervollständigung aus Adressbuch & bisherigen Fahrten), beliebig viele Zwischenziele, Teilstrecken-km, optionale Rückfahrt mit automatisch vorgeschlagener bekannter Strecke.
- **Fahrten**: Liste aller erfassten Fahrten mit Bearbeiten/Löschen.
- **Adressen**: Adressbuch für häufig genutzte Ziele.
- **Übersicht**: Kilometer pro Woche/Monat, Monatsverlauf mit Detailansicht, Fahrten duplizieren (z. B. für wiederkehrende Strecken), JSON-Export/Import als Backup.
