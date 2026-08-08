<div align="center">
  <img src="./fire_favicon.png" alt="Resilience Engine Logo" width="100" height="100" />
  <h1>Resilience & Mindset Quotes Engine</h1>
  
  <p>
    <strong>A production-grade, meticulously crafted resilience and mental model engine.</strong>
  </p>

  <p>
    <a href="https://your-live-demo-link.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <a href="https://github.com/yourusername/resilience-engine/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
    <img src="https://img.shields.io/badge/Tech-HTML%20%7C%20Tailwind%20%7C%20JS-orange?style=for-the-badge" alt="Tech Stack" />
    <img src="https://img.shields.io/badge/Optimized-Mobile%20First-purple?style=for-the-badge&logo=apple" alt="Mobile Optimized" />
  </p>
</div>

<br />

## 📖 Overview / The "Why"
Moving beyond basic tutorials and wrapper applications, the **Resilience & Mindset Quotes Engine** was engineered to serve as a practical, high-impact tool for cultivating mental toughness, lateral thinking, and compounding growth. 

It strips away the noise and focuses strictly on high-leverage insights. The architecture is deeply optimized for an Apple-inspired minimalist aesthetic, bringing forth a frictionless user experience—whether you are swiping through insights on an iPhone SE or seamlessly scrolling a dynamic grid on a desktop monitor.

## ✨ Key Features & Architecture

- **Apple-Inspired Minimalism**: A beautiful dark-mode interface (`#0c0c0e`) combined with frosted glass modals and dynamic radial background glows that shift depending on the active category.
- **Flawless Responsive Architecture**: 
  - *Mobile*: A TikTok-style full-screen CSS scroll-snap feed (`snap-y mandatory`) optimized for touch gestures.
  - *Desktop*: A dynamic multi-column grid layout leveraging native browser scroll engines for perfect trackpad and mouse-wheel accessibility.
- **Local Personalization Engine**: A frosted-glass `+ Add Quote` modal allowing users to save their own insights. Custom items are persisted indefinitely via `localStorage` and dynamically injected into the DOM without a page refresh.
- **Custom Item Management**: Users maintain full control over their personalized data with seamless, animation-backed deletion mechanics exclusively for their custom entries.
- **High-Resolution Card-to-Image Exporter**: A powerful integration with `html2canvas` allows users to capture any quote card and automatically download a crisp, 2x scale PNG image to their local device or camera roll.
- **Zero-Latency Interactions**: Double-tap bookmarking with micro-animations (`@keyframes heartPop`), categorized filtering pills, and dynamic DOM routing with absolutely zero page reloads.

## 🛠️ Tech Stack & Libraries

This project was intentionally built without heavy frameworks like React or Vue to demonstrate the raw power and extreme performance of modern web standards.

* **Core**: Pure HTML5 & Vanilla JavaScript (ES6+)
* **Styling**: Tailwind CSS (via CDN)
* **Icons**: Lucide Icons
* **Export Engine**: html2canvas (v1.4.1)
* **Storage**: Browser LocalStorage API
* **Deployment**: Optimized for Vercel / GitHub Pages

## 🚀 Local Setup & Installation Guide

Getting the engine running locally takes less than 30 seconds.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/resilience-engine.git
   ```
2. **Navigate into the directory:**
   ```bash
   cd resilience-engine
   ```
3. **Launch the application:**
   > [!WARNING]
   > **LOCAL SERVER REQUIRED:** Do not open `index.html` directly via `file://`. This app utilizes browser features (like `html2canvas`) and ES modules that require a local server to avoid CORS (Cross-Origin Resource Sharing) and security origin restrictions. 
   
   *Please use a local server like VS Code Live Server or one of the commands below:*
   ```bash
   # Using Python 3
   python3 -m http.server 3000
   
   # Or using Node (npx)
   npx serve .
   ```
4. **View in browser:**
   Navigate to `http://localhost:3000`.

## 📁 Project Structure

A clean, modular architecture separating concerns efficiently:

```
resilience-engine/
├── index.html          # Semantic HTML layout, modals, and Tailwind config
├── styles.css          # Core CSS variables, animations, and desktop scroll resets
├── app.js              # State management, DOM manipulation, and export logic
├── quotesData.js       # The foundational database of high-impact quotes
├── fire_favicon.png    # Custom production-grade favicon asset
└── README.md           # Project documentation
```

## 🔮 Future Roadmap & Contributions

We are actively expanding the Engine. Upcoming milestones include:
- **Daily Push Notifications**: Opt-in browser notifications delivering the quote of the day.
- **Cloud Syncing**: Optional Firebase integration to sync personalized quotes across multiple devices.
- **Theme Customization**: Allowing users to modify the radial glow hex codes.

### Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
