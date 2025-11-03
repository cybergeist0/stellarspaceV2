# StellarSpace

**StellarSpace V2** is an interactive space simulation and life-support monitoring system, designed to model and visualize a miniature solar system while also providing a foundation for real-world environmental monitoring and control. The system includes a web-based simulation interface, sensor and control modules using a Pi Pico microcontroller, a Raspberry Pi client, and a workstation server for coordination.

The project aims to provide:

- A realistic Solar System simulation with **Mars accurately modeled** in color, orbit, and rotation.
- A foundation for life-support monitoring using sensors for environmental factors like oxygen, temperature, and power usage.
- Integration of Pi Pico and Raspberry Pi modules for sensor data collection and server communication.
- A responsive web interface for visualization and control, using React, Three.js, and Tailwind CSS.

---
---

## **Features**

### **Simulation Page**
- Real-time 3D solar system simulation using **Three.js**.
- **Mars-focused simulation**: Only Mars is rendered with realistic color, size, rotation, and orbit.
- Interactive controls: Orbit, zoom, and pan using mouse or trackpad.
- Dynamic **starfield background** and glowing Sun.
- 

### **Home Page**
- Futuristic translucent content area with glow effects.
- Welcome message and description of the simulation.

### **Trivia Page**
- Timeline of the universe from the Big Bang to modern humans.
- Hoverable event markers with information cards, images, and descriptions.
- Fully responsive layout for desktop and mobile.

---

## **Technologies Used**
- **React 19** & **TypeScript** – Component-based front-end development.
- **Three.js & @react-three/fiber** – 3D graphics rendering.
- **@react-three/drei** – Helpers for camera controls, stars, and geometry.
- **TailwindCSS** – Rapid UI styling with utility classes.
- **Vite** – Fast development server and build tool.
- **Git & GitHub** – Version control and project deployment.

---

## **Project Structure**
stellarspaceV2/
├─ backend/ # Backend scripts and servers
│ ├─ pico/
│ │ └─ code.py
│ └─ rpi/
│ ├─ client.py
│ └─ script.sh
├─ workstation/
│ └─ server.py
├─ public/ # Static assets
│ └─ vite.svg
├─ src/
│ ├─ api/
│ │ └─ backend.ts
│ ├─ assets/
│ │ └─ react.svg
│ ├─ components/
│ │ ├─ AlertModal.tsx
│ │ ├─ BackgroundLayout.tsx
│ │ └─ SensorCard.tsx
│ ├─ pages/
│ │ ├─ ControlPanel.tsx
│ │ ├─ HomePage.tsx
│ │ ├─ SimulationPage.tsx
│ │ └─ TriviaPage.tsx
│ ├─ App.css
│ ├─ App.tsx
│ └─ main.tsx
├─ .gitignore
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

## **How to Run Locally**
1. Clone the repository:

  git clone https://github.com/yourusername/stellarspace.git

2. Navigate into the project:

  cd stellarspace

3. Install dependencies:

  npm install

4. Start the development server:

  npm run dev

5. Open `http://localhost:5173` in your browser.

---

## **Future Improvements**
- Add more realistic textures for Mars and other celestial bodies.
- Include additional planets with accurate orbital mechanics.
- Implement user interactivity with planetary data panels.
- Extend the trivia timeline with more interactive visuals.
- Increase precision of O2 data collection.

---

## **License**
This project is open-source under the **MIT License**.
