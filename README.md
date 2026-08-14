# 🎫 Discord Ticket Bot

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18%2B-brightgreen?style=for-the-badge&logo=nodedotjs" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js Version">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge" alt="License">
</p>

Eine hochflexible, voll konfigurierbare und professionelle **Discord Ticket Bot** Lösung. Biete deinen Servermitgliedern ein einfaches Support-System mit Kategorie-Auswahl, Team-Dashboard, Schließanfragen und automatischer **HTML/Text-Transkriptspeicherung auf GitHub**.

---

## 📋 Inhaltsverzeichnis

- [✨ Features](#-features)
- [📁 Projektstruktur](#-projektstruktur)
- [🛠️ Voraussetzungen](#️-voraussetzungen)
- [🚀 Installation \& Schnellstart](#-installation--schnellstart)
- [⚙️ Konfiguration](#️-konfiguration)
  - [1. Umgebungsvariablen (.env)](#1-umgebungsvariablen-env)
  - [2. Bot-Einstellungen (config.json)](#2-bot-einstellungen-configjson)
- [🖥️ Team Dashboard \& Funktionen](#️-team-dashboard--funktionen)
- [📝 Transkript-System (GitHub Integration)](#-transkript-system-github-integration)
- [❓ FAQ \& Troubleshooting](#-faq--troubleshooting)
- [📜 Lizenz](#-lizenz)

---

## ✨ Features

- **🗂️ Mehrere Support-Kategorien:** Benutzer können über ein Dropdown-Menü gezielt das passende Thema (z.B. *Allgemeiner Support*, *Bug Report*, *Kaufberatung*) auswählen.
- **🛠️ Interaktives Team-Dashboard:** Support-Mitarbeiter können Tickets beanspruchen (*Claim*), freigeben (*Unclaim*), direkt schließen oder Schließanfragen an den User senden.
- **🤝 Schließanfragen-System:** Vermeidet versehentliches Schließen – der Ticket-Ersteller muss die Schließung erst per Button bestätigen.
- **📜 Automatische Transkripte:** Nach dem Schließen eines Tickets wird der komplette Verlauf automatisch auf GitHub hochgeladen und verlinkt.
- **🎨 100% Anpassbar:** Sämtliche Embeds, Nachrichtentexte, Button-Beschriftungen und Fehlermeldungen können zentral über die `config.json` lokalisiert und angepasst werden.
- **🔒 Sicherheit:** Berechtigungsprüfungen verhindern, dass Nicht-Teammitglieder Admin-Funktionen oder Schließ-Aktionen ausführen.

---

## 📁 Projektstruktur

```text
discord-ticket-bot/
├── config.json         # Hauptkonfigurationsdatei (Texte, Rollen, Kategorien)
├── .env                # Sensible Daten (Tokens, IDs)
├── package.json        # Node.js Abhängigkeiten
├── README.md           # Projektdokumentation
└──                 # Quellcode des Bots

🛠️ Voraussetzungen
Stelle sicher, dass folgende Komponenten vor der Installation eingerichtet sind:
 * Node.js: Version 18.0.0 oder höher.
 * Discord Developer Bot Token:
   * Erstelle eine Anwendung im Discord Developer Portal.
   * Aktiviere unter Bot die Privileged Gateway Intents: Server Members Intent und Message Content Intent.
 * GitHub Personal Access Token (PAT):
   * Wird benötigt, wenn Transkripte automatisch in ein GitHub-Repository hochgeladen werden sollen.
   * Erstelle ein Token unter GitHub Einstellungen -> Developer Settings -> Personal Access Tokens mit Schreibrechten (repo).
🚀 Installation & Schnellstart
1. Repository klonen oder als Template nutzen
Klicke oben auf "Use this template" oder klone das Repository manuell:
git clone [https://github.com/DEIN_USERNAME/discord-ticket-bot.git](https://github.com/DEIN_USERNAME/discord-ticket-bot.git)
cd discord-ticket-bot

2. Abhängigkeiten installieren
npm install

3. Umgebungsvariablen einrichten
Erstelle eine Datei namens .env im Hauptverzeichnis des Projekts (oder benenne .env.example um) und trage deine Daten ein.
cp .env.example .env

4. Bot starten
# Entwicklung / Standard-Start
npm start

⚙️ Konfiguration
1. Umgebungsvariablen (.env)
Die .env-Datei schützt deine sensiblen Zugangsdaten. Gib diese Datei niemals weiter und lade sie nicht auf GitHub hoch!
# Discord Credentials
DISCORD_TOKEN=DEIN_DISCORD_BOT_TOKEN_HIER
CLIENT_ID=DEIN_BOT_CLIENT_ID_HIER
GUILD_ID=DEIN_DISCORD_SERVER_ID_HIER

# GitHub API Credentials (für Transkripte)
GITHUB_TOKEN=DEIN_GITHUB_PERSONAL_ACCESS_TOKEN_HIER

2. Bot-Einstellungen (config.json)
In der config.json wird das Verhalten sowie das Erscheinungsbild des Bots gesteuert.
Vollständige Beispiel-config.json:
{
  "github_settings": {
    "repository_owner": "YOUR_GITHUB_USERNAME",
    "repository_name": "YOUR_GITHUB_REPOSITORY",
    "tickets_path": "transcripts",
    "base_transcript_url": "[https://your-domain.com/transcripts](https://your-domain.com/transcripts)"
  },
  "ticket_settings": {
    "support_role_id": "YOUR_SUPPORT_ROLE_ID",
    "category_id": "YOUR_CATEGORY_ID",
    "name_format": "ticket-{id}-{categorie}",
    "inside_embed": {
      "title": "Ticket: {categorie}",
      "description": "Willkommen <@{user}>! Ein Teammitglied wird sich in Kürze um dich kümmern.",
      "color": "#00ff00"
    }
  },
  "transcript_settings": {
    "log_channel_id": "YOUR_LOG_CHANNEL_ID"
  },
  "texts": {
    "log_title": "Ticket Geschlossen",
    "log_desc": "Ticket **{ticket_name}** wurde von <@{user_id}> geschlossen.\nGrund: {reason}\nTranskript: {url}",
    "txt_no_reason": "Kein Grund angegeben",
    "btn_claim": "Ticket Beanspruchen",
    "btn_close_reason": "Mit Grund Schließen",
    "btn_dashboard": "Team Dashboard",
    "btn_yes": "Ja",
    "btn_no": "Nein",
    "btn_accept_close": "Schließung Akzeptieren",
    "dash_placeholder": "Aktion auswählen...",
    "dash_unclaim": "Ticket Freigeben",
    "dash_close": "Sofort Schließen",
    "dash_close_reason": "Mit Grund Schließen",
    "dash_closereq": "Schließung Anfragen",
    "dash_closereq_reason": "Schließung mit Grund Anfragen",
    "modal_reason_title": "Grund für Schließung",
    "modal_reason_input": "Gib einen Grund ein:",
    "msg_ticket_created": "Dein Ticket wurde erstellt: <#{channel}>",
    "msg_claimed": "Ticket wurde von <@{user}> beansprucht.",
    "msg_unclaimed": "Ticket wurde freigegeben und steht dem Team wieder zur Verfügung.",
    "msg_action_done": "Aktion erfolgreich ausgeführt.",
    "msg_closing": "Ticket wird geschlossen...",
    "msg_closing_reason": "Ticket wird mit Grund geschlossen...",
    "msg_close_accepted": "Schließanfrage wurde akzeptiert.",
    "msg_request_sent": "Schließanfrage an den Benutzer gesendet.",
    "closereq_msg": "Ein Teammitglied hat vorgeschlagen, dieses Ticket zu schließen. Klicke unten, um zuzustimmen.",
    "closereq_msg_reason": "Schließanfrage: {reason}\nKlicke unten, um zuzustimmen.",
    "confirm_close": "Bist du sicher, dass du dieses Ticket schließen möchtest?",
    "txt_reason_accepted": "Schließanfrage vom Benutzer akzeptiert",
    "err_no_perms": "Du hast keine Berechtigung für diese Aktion.",
    "err_no_config": "Konfigurationsdatei konnte nicht geladen werden."
  },
  "ticket_counter": 0,
  "setup_embed": {
    "title": "Support Tickets",
    "description": "Wähle unten eine Kategorie aus, um ein Ticket zu öffnen.",
    "color": "#0099ff"
  },
  "menu_placeholder": "Kategorie auswählen...",
  "categories": [
    {
      "label": "Allgemeiner Support",
      "description": "Fragen und allgemeine Hilfe",
      "value": "general_support",
      "emoji": "❓",
      "role_id": "YOUR_SUPPORT_ROLE_ID"
    },
    {
      "label": "Bug Report",
      "description": "Melde Fehler oder technische Probleme",
      "value": "bug_report",
      "emoji": "🐛",
      "role_id": "YOUR_SUPPORT_ROLE_ID"
    }
  ]
}

Wichtige Parameter erklärt:
| Parameter | Beschreibung |
|---|---|
| github_settings.repository_owner | Dein GitHub-Benutzername oder Orga-Name. |
| github_settings.repository_name | Name des Repositories, in dem Transkripte verarbeitet werden. |
| ticket_settings.category_id | Die Discord-Kategorie ID, unter der neue Ticket-Kanäle erstellt werden. |
| ticket_settings.support_role_id | Standard-Rollen-ID für Support-Mitarbeiter. |
| transcript_settings.log_channel_id | Channel-ID auf Discord, in den der Transkript-Log gepostet wird. |
| ticket_counter | Zähler für die Ticket-IDs (wird automatisch vom Bot hochgezählt). |
| categories | Array aus auswählbaren Ticket-Typen im Dropdown. |
🖥️ Team Dashboard & Funktionen
Support-Mitarbeiter erhalten im geschaffenen Ticket-Kanal Zugriff auf erweiterte Aktionen:
 * Ticket Claimen / Unclaimen: Der Supporter ordnet sich das Ticket zu bzw. gibt es für andere Teammitglieder wieder frei.
 * Schließung anfragen: Schickt dem User eine Bestätigungsnachricht. Erst nach Bestätigung wird das Ticket geschlossen.
 * Schließen mit Grund: Öffnet ein Modal (Eingabemaske), in dem der Grund eingegeben werden kann, welcher danach im Transkript-Log erscheint.
📝 Transkript-System (GitHub Integration)
Sobald ein Ticket geschlossen wird, führt der Bot folgende Schritte aus:
 * Formatierung: Der vollständige Chatverlauf des Channels wird ausgelesen und formatiert.
 * Upload: Über die GitHub-API wird eine neue Datei unter github_settings.tickets_path im konfigurierten Repository erstellt.
 * Logging: Im Discord-Kanal (log_channel_id) wird ein Log-Embed versendet, das den Betroffenen, Schließungsgrund und einen direkten Link zum Transkript enthält.
❓ FAQ & Troubleshooting
<details>
<summary><b>1. Der Bot startet nicht / Token-Fehler</b></summary>
Stelle sicher, dass deine .env-Datei existiert und der DISCORD_TOKEN ohne Anführungszeichen oder Leerzeichen eingetragen ist.
</details>
<details>
<summary><b>2. Die Dropdown-Menüs / Buttons reagieren nicht</b></summary>
Prüfe, ob im Discord Developer Portal die Intentionen <b>Message Content Intent</b> und <b>Server Members Intent</b> aktiviert sind.
</details>
<details>
<summary><b>3. Der Zähler (ticket_counter) setzt sich nach Neustart zurück?</b></summary>
Der Bot liest und schreibt den <code>ticket_counter</code> direkt in die <code>config.json</code>. Stelle sicher, dass der Bot Schreibrechte im Anwendungsverzeichnis hat.
</details>
<details>
<summary><b>4. Transkripte werden nicht hochgeladen</b></summary>
Überprüfe, ob dein <code>GITHUB_TOKEN</code> gültig ist und Schreibzugriff (<code>repo</code>-Scope) auf das angegebene GitHub-Repository hat.
</details>
📜 Lizenz
Dieses Projekt ist unter der Apache License 2.0 lizenziert. Weitere Informationen findest du in der Datei LICENSE.