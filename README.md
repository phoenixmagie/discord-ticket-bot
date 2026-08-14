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
└── package.json                 # Node.js Abhängigkeiten & Scripts```
