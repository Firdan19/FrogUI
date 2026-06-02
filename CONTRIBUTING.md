# Contributing to FrogUI 🐸

First off, thank you for considering contributing to FrogUI! 🎉 

We believe that autonomous AI agents shouldn't be locked inside boring terminal screens. By contributing to FrogUI, you are helping build the bridge that brings these powerful agents to a beautiful, accessible Web GUI.

Every contribution matters. Whether you are fixing a typo, designing a new UI theme, writing documentation, or adding core Rust features, your help is deeply appreciated!

## 🤝 How You Can Help

Here are a few ways you can jump in and start contributing:

1. **Add Support for New Agents**: Test new CLI-based agents (like new versions of OpenClaw or Hermes) and write integration guides in our docs.
2. **UI/UX Improvements**: Are you a frontend wizard? Help us make the Web Components look even more premium, add themes, or implement new UI layouts.
3. **Rust API Gateway**: Help optimize our Server-Sent Events (SSE) streaming, add better error handling, or implement new endpoints.
4. **Bug Reports & Ideas**: Simply opening a GitHub Issue to report a bug or suggest a feature is a huge contribution!

## 🛠️ Development Setup

Getting started locally is super easy.

1. **Fork & Clone**: Fork this repository to your GitHub account and clone it locally.
2. **Environment**: Copy `.env.example` to `.env`.
3. **Run Services**: 
   ```bash
   docker compose up --build
   ```
4. **Access the UI**: Open `http://localhost:5173` and start testing your changes!

## 📝 Pull Request Process

1. Create a new branch for your feature or bugfix: `git checkout -b feature/amazing-new-thing`
2. Write clean, readable code and include comments where necessary.
3. Make sure the Rust code is formatted correctly:
   ```bash
   cd apps/api-gateway && cargo fmt && cargo clippy
   ```
4. Commit your changes with a clear message: `git commit -m "feat: add amazing new thing"`
5. Push to your branch and open a Pull Request (PR) against the `main` branch.

## 🌟 Code of Conduct

We are a welcoming and inclusive community. Please treat everyone with respect and kindness in issues and PR reviews. Let's build something awesome together!
