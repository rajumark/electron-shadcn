# 🐟 Pilotfish

**The ADB Powerhouse Desktop App - Bridge Your Android Development Workflow Like Never Before**

![Pilotfish Icon](assets/icons/icon.png)

> *From Android Studio to Desktop Mastery - One App to Rule Them All*

---

## 🚀 Why Pilotfish?

**Pilotfish** is your unified desktop companion that brings the power of Android Debug Bridge (ADB) to your desktop with a stunning, modern interface. Built for developers who demand efficiency and elegance in their development workflow.

### 🎯 What Makes Pilotfish Special

| Feature | Traditional Approach | Pilotfish | 🏆 Advantage |
|---------|-------------------|-----------|------------|
| **ADB Integration** | Terminal commands | Visual GUI | Intuitive control |
| **Device Management** | Manual tracking | Auto-detection | Effortless setup |
| **Performance** | Multiple tools | Single app | Streamlined workflow |
| **User Experience** | Complex commands | Click interface | User-friendly |

---

## 🛠️ Tech Stack That Impresses

### Core Architecture
- **⚡ Electron 40** - Desktop app mastery
- **⚛️ React 19.2** - Latest React with Compiler optimizations
- **🎨 TailwindCSS 4** - Utility-first CSS at its finest
- **🧩 shadcn/ui** - Beautiful and accessible component library
- **🔥 Vite 7** - Blazing fast builds and HMR

### Developer Experience
- **📘 TypeScript 5.9** - Type safety for robust development
- **🚀 TanStack Router** - Intuitive file-based routing system
- **🔄 TanStack Query** - Powerful state management
- **✅ Zod 4** - Runtime validation for data integrity
- **🌍 i18next** - Built-in internationalization support

### Testing & Quality
- **🧪 Vitest** - Fast and reliable unit testing
- **🎭 Playwright** - Comprehensive end-to-end testing
- **📋 React Testing Library** - Component testing excellence

---

## 🤖 ADB Superpowers

Pilotfish transforms your ADB experience from command-line headaches to visual bliss:

### 📱 Device Management
- **Real-time device detection** - No more `adb devices` refresh loops
- **Visual device selector** - Click instead of typing device IDs
- **Device information dashboard** - CPU, memory, storage at a glance

### 🚀 App Deployment
- **Drag-and-drop APK installation** - Forget `adb install` commands
- **Batch app operations** - Install/uninstall multiple apps simultaneously
- **App version management** - Track and compare app versions across devices

### 📊 Performance Monitoring
- **Live performance metrics** - CPU, memory, network usage in real-time
- **Logcat viewer** - Colored, filtered logs for easy debugging
- **Screen recording** - Capture device screens without complex commands

---

## 🎨 Modern User Interface

Built with **shadcn/ui** and **TailwindCSS 4**, Pilotfish delivers a stunning desktop experience:

- **🌙 Dark/Light themes** - Comfortable viewing in any environment
- **📱 Responsive design** - Works on any screen size
- **⚡ Smooth animations** - 60fps interactions that feel native
- **🎯 Intuitive navigation** - File-based routing that just makes sense

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Android SDK with ADB installed
- Your favorite Android device 😉

### Installation

```bash
# Clone the repository
git clone https://github.com/LuanRoger/electron-shadcn.git
cd electron-shadcn

# Install dependencies
npm install

# Start the app
npm run start
```

### First Run
1. Launch Pilotfish
2. Connect your Android device
3. Watch the magic happen ✨

---

## 📦 Build & Distribution

### Automated CI/CD
**Smart commit triggers** - Build what you need, when you need it:

```bash
git commit -m "l"     # Linux (.AppImage)
git commit -m "w"     # Windows (.exe) 
git commit -m "m"     # macOS (.dmg) - Intel + M-series
git commit -m "#go"   # All platforms - Release everything!
```

### Tag-based Releases
```bash
git tag v1.0.0
git push origin v1.0.0
# Boom! All platforms built automatically
```

### Platform Matrix
| Platform | Architecture | File Type | Trigger |
|----------|-------------|-----------|---------|
| Ubuntu | x64 | `.AppImage` | `l`, `#go` |
| Windows | x64 | `.exe` | `w`, `#go` |
| macOS | Intel + M-series | `.dmg` | `m`, `#go` |

---

## 🔧 Development Workflow

### Project Structure
```
src/
├── routes/          # File-based routing system
├── components/      # Reusable UI components
├── ipc/            # Inter-process communication
├── actions/        # ADB command handlers
└── styles/         # Global styles and themes
```

### Key Features
- **🔄 React Compiler** - Automatic optimizations enabled
- **🛡️ Context Isolation** - Security first approach
- **🎯 Custom Title Bar** - Native-like experience
- **📱 React DevTools** - Built-in debugging tools

---

## 🧪 Testing Suite

Comprehensive testing for reliable applications:

```bash
# Unit tests
npm run test:unit

# E2E tests  
npm run test:e2e

# All tests
npm run test:all
```

---

## 📚 Documentation

- **📖 Full Docs**: [docs.luanroger.dev/electron-shadcn](https://docs.luanroger.dev/electron-shadcn)
- **🔧 CI/CD Guide**: [`.github/workflows/README.md`](.github/workflows/README.md)

---

## 🌟 Showcased In

- **yaste** - Super simple text editor with Electron power
- **eletric-drizzle** - shadcn/ui meets Drizzle ORM
- **Wordle Game** - Cross-platform gaming experience
- **Mehr 🌟** - Local AI chatbot with modern UI

> *Built with Pilotfish? Add your project here!*

---

## 🛡️ License

**⚠️ IMPORTANT LICENSE NOTICE**

This project is licensed under the **MIT License** with the following restrictions:

- ✅ **Personal Use** - Completely free for personal projects
- ✅ **Open Source** - Free for open source projects  
- ✅ **Educational** - Free for learning and teaching
- ❌ **COMMERCIAL SALE PROHIBITED** - You **CANNOT** sell this software or derivatives
- ❌ **RESALE RESTRICTED** - No redistribution for commercial gain

> **Why this license?** We believe in empowering developers, not corporations. Use it to build amazing things, learn, and contribute to the community. But don't sell our hard work.

See [LICENSE](LICENSE) for full details.

---

## 🤝 Contributing

We welcome contributions from the development community! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/LuanRoger/electron-shadcn/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/LuanRoger/electron-shadcn/discussions)
- 📖 **Documentation**: [docs.luanroger.dev/electron-shadcn](https://docs.luanroger.dev/electron-shadcn)

---

<div align="center">

**Made with ❤️ by developers, for developers**

*Empowering your development workflow*

[⭐ Star this repo](https://github.com/LuanRoger/electron-shadcn) • [🐛 Report Issues](https://github.com/LuanRoger/electron-shadcn/issues) • [💡 Suggest Features](https://github.com/LuanRoger/electron-shadcn/discussions)

</div>
