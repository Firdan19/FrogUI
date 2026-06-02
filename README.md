<div align="center">
  <img src="https://raw.githubusercontent.com/Firdan19/FrogUI/main/assets/logo-placeholder.png" alt="FrogUI Logo" width="150" />
  <h1>🐸 FrogUI</h1>
  <p><strong>Stop staring at your terminal. Give your AI Agents the beautiful GUI they deserve.</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Rust](https://img.shields.io/badge/Rust-Gateway-orange.svg)](https://www.rust-lang.org/)
  [![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](#-contributing)
  
  <br/>
  
  *( 🚧 **Insert your epic demo GIF here** - Show the split screen of a boring CLI vs FrogUI 🚧 )*
</div>

---

## ⚡ Why FrogUI?

Autonomous AI agent frameworks (like **Hermes Agent**, **OpenClaw**, and many other emerging tools) are incredibly powerful. But let's be honest: tracking their complex reasoning streams in a scrolling black terminal is exhausting and hard to demo to non-technical users.

**FrogUI bridges that gap.** 

It is a lightweight, universal **Terminal Subprocess Manager and Web UI**. It wraps around your favorite CLI agents, executes them in the background, and streams their terminal output straight to a premium, framework-agnostic web dashboard.

## ✨ Features

- 🖥️ **Live Visual Command Panel:** Watch your agent's thoughts and terminal output stream in real-time.
- 🦀 **Blazing Fast Rust Gateway:** Handles process spawning and secure Server-Sent Events (SSE) streaming with zero lag.
- 🎨 **Minimalist Premium UI:** A beautiful Web Components interface that feels modern and responsive out of the box.
- 🔒 **100% Private & Self-Hosted:** Keep your data completely local. If your agent is offline, FrogUI is offline.

---

## 🚀 Quick Start (Under 60 Seconds)

### 1. Clone & Configure
```bash
git clone https://github.com/Firdan19/FrogUI.git
cd FrogUI
cp .env.example .env
```

> **Pro Tip:** In your `.env` file, change `AGENT_CLI_COMMAND` to whatever terminal command runs your favorite agent (e.g., `AGENT_CLI_COMMAND="openclaw run"`). By default, it runs a mock simulation script so you can test it instantly!

### 2. Launch
```bash
docker compose up --build
```

### 3. Enjoy the View
Open your browser and navigate to [http://localhost:5173](http://localhost:5173). Start chatting with your agent visually!

---

## 🏗️ Architecture

FrogUI is extremely lightweight and decoupled:

1. **User Browser (Web UI):** Sends commands via HTTP and listens to the SSE stream.
2. **Rust API Gateway:** Reads your `.env`, spawns your CLI Agent as a background process, and intercepts `stdout/stderr`.
3. **The Agent (CLI):** Your actual AI agent doing the hard work in the background.

---

## 🗺️ Roadmap (We need your help!)

FrogUI is growing fast, and there are so many exciting features on the horizon. If you want to contribute, here are some ideas:

- [ ] **Dark / Light Mode Toggle:** Because developers love dark mode.
- [ ] **Syntax Highlighting:** Automatically detect and format code blocks in the agent's output.
- [ ] **Agent Profiles:** Ability to switch between different CLI commands (e.g., Hermes vs OpenClaw) directly from the UI.
- [ ] **Desktop App:** Package the Web UI and Rust Gateway into a lightweight Tauri/Electron app.

## 🤝 Contributing

**We love Pull Requests!** FrogUI is built for the community, by the community. 

Whether you are fixing a typo, adding a massive feature, or writing a tutorial, we want your help to make this the standard GUI for terminal agents.

Please check out our [Contributing Guidelines](CONTRIBUTING.md) to get started. It's super easy!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Let's build the future of AI interfaces together!
