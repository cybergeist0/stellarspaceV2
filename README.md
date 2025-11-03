# StellarSpace

**StellarSpace V2** is an interactive space simulation and life-support monitoring system, designed to model and visualize a miniature solar system while also providing a foundation for real-world environmental monitoring and control. The system includes a web-based simulation interface, sensor and control modules using a Pi Pico microcontroller, a Raspberry Pi client, and a workstation server for coordination.

The project aims to provide:

- A realistic Solar System simulation with **Mars accurately modeled** in color, orbit, and rotation.
- A foundation for life-support monitoring using sensors for environmental factors like oxygen, temperature, and power usage.
- Integration of Pi Pico and Raspberry Pi modules for sensor data collection and server communication.
- A responsive web interface for visualization and control, using React, Three.js, and Tailwind CSS.

---
## **Summary**
# StellarSpaceV2

StellarSpaceV2 is a centralized smart dashboard prototype designed to manage life-support systems and personal living needs for a small Martian or Lunar habitat. The system simulates real-time monitoring and control of critical modules including oxygen levels, temperature, food inventory, power usage, sleep cycles, and mental wellness alerts for a small group of 4–6 users living in a closed environment. The project combines a fully interactive web-based interface with simulated sensor data, alerts, and user-specific recommendations, creating a functional representation of the "brain" of a space home.

The frontend interface is built using React, TypeScript, TailwindCSS, and React Three Fiber for 3D visualization. The dashboard includes multiple pages such as a control panel, simulation, and informational timelines, all of which are fully responsive and visually consistent with a futuristic space aesthetic. The simulation page models the solar system with a focus on Mars, rendered with accurate color, rotation, and orbital characteristics. Users can interact with the 3D environment through zooming, panning, and rotation, providing an immersive educational experience alongside the life-support monitoring interface.

Backend components are developed in TypeScript and Python, coordinating data from simulated sensors and real hardware devices. Pi Pico microcontrollers generate mock sensor readings for environmental factors, while a Raspberry Pi serves as the client to process and transmit this data to the backend server. Python scripts automate data collection, simulate anomalies, and handle alerts, providing real-time feedback that is visualized through the dashboard. Individual user profiles allow for custom notifications, such as hydration reminders, sleep recommendations, or mental wellness alerts, demonstrating a personalized approach to life-support management.

Key deliverables of StellarSpaceV2 include:

- **Interactive Solar System Simulation:** A 3D model rendered in React Three Fiber with accurate Mars modeling, orbital paths, and rotational dynamics, including user-controlled camera manipulation.  
- **Frontend Dashboard:** Fully responsive pages including `HomePage`, `SimulationPage`, `ControlPanel`, and `TriviaPage` with styled, readable content and animated backgrounds to enhance user experience.  
- **Hardware Integration:** Pi Pico and Raspberry Pi scripts simulating environmental data, including sensor input and output pipelines, coordinated with the backend server for live visualization.  
- **API & Data Layer:** TypeScript-based backend (`backend.ts`) providing structured endpoints to feed the frontend with simulated or real-time data from connected devices.  
- **User Interaction Features:** Alerts, notifications, and interactive visual elements like `SensorCard` and `AlertModal` to demonstrate practical applications of life-support monitoring.  
- **Static Assets & Utilities:** Centralized asset management (`assets`, `public`) and reusable components for clean, maintainable code structure.  

In summary, the project deliverables include a functional prototype of the centralized dashboard, fully interactive 3D simulation of Mars, and modular backend infrastructure to manage sensor data and alerts. Additionally, the project includes reusable frontend components such as `SensorCard` and `AlertModal`, API endpoints for real-time data streaming, and visual enhancements such as animated backgrounds and translucent content boxes to maintain readability while reflecting a futuristic, space-oriented design. StellarSpaceV2 provides a proof-of-concept platform for life-support management in extraterrestrial habitats, illustrating both software-hardware integration and interactive visualization of critical living conditions.

Overall, StellarSpaceV2 demonstrates a holistic approach to building a digital ecosystem for space habitats, combining real-time monitoring, anomaly detection, user-specific alerts, and 3D interactive simulations. The project is modular and extensible, allowing future integration with additional sensors, expanded user functionality, or more complex planetary simulations, while remaining aligned with the core goal of creating the central brain for a Martian or Lunar living environment.

---
## **Features**

### **Simulation Page**
- Real-time 3D solar system simulation using **Three.js**.
- **Mars-focused simulation**: Only Mars is rendered with realistic color, size, rotation, and orbit.
- Interactive controls: Orbit, zoom, and pan using mouse or trackpad.
- Dynamic **starfield background** and glowing Sun.

**3D interactive Solar System** rendered in the browser with `@react-three/fiber` and `@react-three/drei`.

**Mars-focused simulation**:
  - Correct color approximation.
  - Accurate orbit and rotation speed relative to the Sun.
  - Only Mars is displayed (all other planets removed except the Sun).
- **Interactive controls**:
  - Click and drag to orbit the camera.
  - Scroll to zoom in/out.
  - Right-click to pan.
- **Visual enhancements**:
  - Glow and emissive Sun.
  - Starfield background using `Stars` component.
  - Planet orbit paths visualized with rings.

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

├─ backend/                **Backend scripts and servers**

│  ├─ pico/

│  │  └─ code.py

│  └─ rpi/

│     ├─ client.py

│     └─ script.sh

├─ workstation/

│  └─ server.py

├─ public/                 **Static assets**

│  └─ vite.svg

├─ src/

│  ├─ api/

│  │  └─ backend.ts

│  ├─ assets/

│  │  └─ react.svg

│  ├─ components/

│  │  ├─ AlertModal.tsx

│  │  ├─ BackgroundLayout.tsx

│  │  └─ SensorCard.tsx

│  ├─ pages/

│  │  ├─ ControlPanel.tsx

│  │  ├─ HomePage.tsx

│  │  ├─ SimulationPage.tsx

│  │  └─ TriviaPage.tsx

│  ├─ App.css

│  ├─ App.tsx

│  └─ main.tsx

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
## **Contributors**
- Satej Gandre - Backend & Hardware
- Ajay Balusu - Backend & Hardware
- Dhriti Koppela - Health & Database
- Rohit Shivarajkumar - Frontend & Docs

## **License**
This project is open-source under the **MIT License**.
