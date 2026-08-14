# 🎫 Discord Ticket Bot

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18%2B-brightgreen?style=for-the-badge&logo=nodedotjs" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Discord.js-v14-blue?style=for-the-badge&logo=discord" alt="Discord.js Version">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge" alt="License">
</p>

Eine hochflexible, voll konfigurierbare und professionelle **Discord Ticket Bot** Lösung. Biete deinen Servermitgliedern ein einfaches Support-System mit Kategorie-Auswahl, Team-Dashboard, Schließanfragen und automatischer **HTML-Transkriptspeicherung auf GitHub**.

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

- **🗂️ Mehrere Support-Kategorien:** Benutzer können über ein Dropdown-Menü gezielt das passende Thema (z.B. *Allgemeiner Support*, *Bug Report*) auswählen.
- **🛠️ Interaktives Team-Dashboard:** Support-Mitarbeiter können Tickets beanspruchen (*Claim*), freigeben (*Unclaim*), direkt schließen oder Schließanfragen an den User senden.
- **🤝 Schließanfragen-System:** Vermeidet versehentliches Schließen – der Ticket-Ersteller muss die Schließung erst per Button bestätigen.
- **📜 Automatische HTML-Transkripte:** Nach dem Schließen eines Tickets wird der komplette Verlauf über ein HTML-Template auf GitHub hochgeladen und verlinkt.
- **🎨 100% Anpassbar:** Sämtliche Embeds, Nachrichtentexte, Button-Beschriftungen und Fehlermeldungen können zentral über die `config.json` angepasst werden.
- **🔒 Sicherheit:** Berechtigungsprüfungen verhindern, dass Nicht-Teammitglieder Admin-Funktionen oder Schließ-Aktionen ausführen.

---

## 📁 Projektstruktur

```text
discord-ticket-bot/
├── assets/
│   └── transcript-template.html # HTML-Template für Chat-Transkripte
├── commands/
│   └── ticket-setup.js          # Command-Handler für den Ticket-Setup-Befehl
├── events/
│   └── interactionsCreate.js    # Event-Handler für Buttons, Menüs & Modals
├── .env                         # Sensible Daten (Tokens, IDs)
├── LICENSE                      # Apache 2.0 Lizenz
├── README.md                    # Projektdokumentation
├── config.json                  # Hauptkonfiguration (Texte, Kategorien, Rollen)
├── index.js                     # Haupteinstiegspunkt des Bots
└── package.json                 # Node.js Abhängigkeiten & Scripts

🛠️ Voraussetzungen
Stelle sicher, dass folgende Komponenten vor der Installation eingerichtet sind:
 * Node.js: Version 18.0.0 oder höher.
 * Discord Developer Bot Token:
   * Erstelle eine Anwendung im Discord Developer Portal.
   * Aktiviere unter Bot die Privileged Gateway Intents: Server Members Intent und Message Content Intent.
 * GitHub Personal Access Token (PAT):
   * Wird benötigt, um Transkripte automatisch in ein GitHub-Repository hochzuladen.
   * Erstelle ein Token unter GitHub Einstellungen -> Developer Settings -> Personal Access Tokens mit Schreibrechten (repo).
🚀 Installation & Schnellstart
1. Repository klonen oder als Template nutzen
Klicke oben auf "Use this template" oder klone das Repository manuell:
git clone [https://github.com/DEIN_USERNAME/discord-ticket-bot.git](https://github.com/DEIN_USERNAME/discord-ticket-bot.git)
cd discord-ticket-bot

2. Abhängigkeiten installieren
npm install

3. Umgebungsvariablen einrichten
Erstelle eine .env-Datei im Hauptverzeichnis und trage deine Tokens ein.
DISCORD_TOKEN=DEIN_DISCORD_BOT_TOKEN_HIER
CLIENT_ID=DEIN_BOT_CLIENT_ID_HIER
GUILD_ID=DEIN_DISCORD_SERVER_ID_HIER
GITHUB_TOKEN=DEIN_GITHUB_PERSONAL_ACCESS_TOKEN_HIER

4. Bot starten
# Bot starten
npm start

⚙️ Konfiguration (config.json)
Sämtliche Texte, Rollen und Kategorien werden bequem über die config.json angepasst.
{
  "github_settings": {
    "repository_owner": "YOUR_GITHUB_USERNAME",
    "repository_name": "YOUR_GITHUB_REPOSITORY",
    "tickets_path": "YOUR_FOLDER",
    "base_transcript_url": "YOUR_DOMAIN_WHERE_THE_TRANSCRIPTS_ARE_HERE"
  },
  "ticket_settings": {
    "support_role_id": "YOUR_SUPPORT_ROLE_ID",
    "category_id": "YOUR_CATEGORY_ID",
    "name_format": "ticket-{id}-{categorie}",
    "inside_embed": {
      "title": "Ticket: {categorie}",
      "description": "Welcome <@{user}>! A staff member will assist you shortly.",
      "color": "#00ff00"
    }
  },
  "transcript_settings": {
    "log_channel_id": "YOUR_LOG_CHANNEL_ID"
  },
  "texts": {
    "log_title": "Ticket Closed",
    "log_desc": "Ticket **{ticket_name}** closed by <@{user_id}>.\nReason: {reason}\nTranscript: {url}",
    "txt_no_reason": "No reason provided",
    "btn_claim": "Claim Ticket",
    "btn_close_reason": "Close with Reason",
    "btn_dashboard": "Team Dashboard",
    "btn_yes": "Yes",
    "btn_no": "No",
    "btn_accept_close": "Accept Close Request",
    "dash_placeholder": "Select an action...",
    "dash_unclaim": "Unclaim Ticket",
    "dash_close": "Close Immediately",
    "dash_close_reason": "Close with Reason",
    "dash_closereq": "Request Close",
    "dash_closereq_reason": "Request Close with Reason",
    "modal_reason_title": "Close Reason",
    "modal_reason_input": "Enter reason:",
    "msg_ticket_created": "Your ticket has been created: <#{channel}>",
    "msg_claimed": "Ticket claimed by <@{user}>.",
    "msg_unclaimed": "Ticket unclaimed and released to the support team.",
    "msg_action_done": "Action executed successfully.",
    "msg_closing": "Closing ticket...",
    "msg_closing_reason": "Closing ticket with reason...",
    "msg_close_accepted": "Close request accepted.",
    "msg_request_sent": "Close request sent to user.",
    "closereq_msg": "A staff member requested to close this ticket. Click below to accept.",
    "closereq_msg_reason": "Close request: {reason}\nClick below to accept.",
    "confirm_close": "Are you sure you want to close this ticket?",
    "txt_reason_accepted": "Close request accepted by user",
    "err_no_perms": "You do not have permission to use this action.",
    "err_no_config": "Configuration file could not be loaded."
  },
  "ticket_counter": 0,
  "setup_embed": {
    "title": "Support Tickets",
    "description": "Select a category below to open a ticket.",
    "color": "#0099ff"
  },
  "menu_placeholder": "Select a category...",
  "categories": [
    {
      "label": "General Support",
      "description": "Questions and general help",
      "value": "general_support",
      "emoji": "❓",
      "role_id": "YOUR_SUPPORT_ROLE_ID"
    }
  ]
}

🖥️ Team Dashboard & Funktionen
Support-Mitarbeiter erhalten über den Team Dashboard-Button Zugriff auf praktische Verwalter-Funktionen:
 * Ticket Claimen / Unclaimen: Das Ticket einem Supporter zuweisen oder wieder freigeben.
 * Schließung anfragen: Fordert den User auf, das Schließen des Tickets per Button zu bestätigen.
 * Schließen mit Grund: Öffnet ein Modal, um einen Schließungsgrund anzugeben, der im Log-Embed und Transkript vermerkt wird.
📝 Transkript-System (assets/transcript-template.html)
Sobald ein Ticket geschlossen wird:
 * Der Bot liest alle Nachrichten des Kanals aus.
 * Das Ergebnis wird mithilfe der Vorlage assets/transcript-template.html als HTML-Datei aufbereitet.
 * Die HTML-Datei wird automatisch über die GitHub API im konfigurierten Repository hochgeladen und der Link im Discord-Log-Kanal gesendet.
❓ FAQ & Troubleshooting
<details>
<summary><b>1. Der Bot startet nicht / Token-Fehler</b></summary>
Stelle sicher, dass deine .env-Datei existiert und der DISCORD_TOKEN korrekt hinterlegt ist.
</details>
<details>
<summary><b>2. Die Dropdown-Menüs / Buttons reagieren nicht</b></summary>
Prüfe im Discord Developer Portal, ob die <b>Message Content Intent</b> und <b>Server Members Intent</b> aktiviert sind.
</details>
<details>
<summary><b>3. Der Zähler (ticket_counter) erhöht sich nicht</b></summary>
Der Bot liest und aktualisiert den ticket_counter direkt in der config.json. Stelle sicher, dass der Bot Schreibrechte in seinem Stammverzeichnis besitzt.
</details>
📜 Lizenz
Dieses Projekt ist unter der Apache License 2.0 lizenziert. Weitere Informationen findest du in der Datei LICENSE.