# StellarSpace

**StellarSpace** is an interactive web-based simulation and learning platform that allows users to explore a miniature model of the solar system, engage with trivia about cosmic history, and simulate environments in space. The project is built using **React**, **TypeScript**, **Three.js**, and **TailwindCSS**, with a focus on immersive visual experiences and educational content.

---

## **Features**

### **Simulation Page**
- Real-time 3D solar system simulation using **Three.js**.
- **Mars-focused simulation**: Only Mars is rendered with realistic color, size, rotation, and orbit.
- Interactive controls: Orbit, zoom, and pan using mouse or trackpad.
- Dynamic **starfield background** and glowing Sun.

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
src/
├─ components/ # Reusable components like BackgroundLayout
├─ pages/ # HomePage, SimulationPage, TriviaPage
├─ App.tsx # Main routing and layout
├─ main.tsx # App bootstrap
├─ App.css # Global styles & animations

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

---

## **License**
This project is open-source under the **MIT License**.
