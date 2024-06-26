---
title: "Schweinhund"
date: 2023-06-18
draft: false
---


Erste Schritte
Anforderungen
CYPEX wird als Satz von Docker-Bildern verteilt, die von Docker Compose gestartet werden.

docker
docker-compose (>= 1.27.0)
git (>= 2.20.1)
bash (>= 4.0)
jq
Um die Anwendung auf MacOS auszuführen:

Das Programm sed auf dem Mac ist kein Standard-(GNU-)Programm. Um das normale Programm zu erhalten, verwenden Sie brew:

brew install gnu-sed
Ändern Sie danach den PATH. Fügen Sie beispielsweise die folgende Zeile zu Ihrer ~/.bash_profile hinzu:

PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"

Bilder beziehen (nur Enterprise Edition)
CYPEX-Bilder können über Docker Hub bezogen werden.

Docker Hub
Bitte kontaktieren Sie uns, wenn Ihrem Konto kein Zugriff auf die entsprechenden Bilder gewährt wurde.
bash
Copiar código
cat ~/password.txt | docker login --username <username> --password-stdin
CYPEX einrichten und starten
1. CYPEX herunterladen.
Um den Installationsprozess der Konfiguration zu erleichtern, stellt CYBERTEC ein CYPEX-Skript-Repository zur Verfügung, das es dem Benutzer ermöglicht, die Umgebung Schritt für Schritt zu erstellen. Wählen Sie eine Option:

Repository klonen: