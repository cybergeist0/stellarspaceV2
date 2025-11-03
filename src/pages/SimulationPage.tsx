import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Ring } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetData {
  name: string;
  color?: string;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
}

const planetData: PlanetData[] = [
  {
    name: 'Mars',
    color: '#d86e6e',
    size: 0.53,
    distance: 18,
    orbitSpeed: 0.01,
    rotationSpeed: 0.018,
  },
];

interface PlanetProps extends PlanetData {
  onClick?: () => void;
}

const Planet: React.FC<PlanetProps> = ({
  name,
  color,
  size,
  distance,
  orbitSpeed,
  rotationSpeed,
  onClick,
}) => {
  const planetRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed * 10;
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);
    if (planetRef.current) {
        planetRef.current.position.set(x, 0, z);
        planetRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      <mesh ref={planetRef} onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.8}
          metalness={0}
        />
      </mesh>
      <Ring
        args={[distance - 0.02, distance + 0.02, 128]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.2} />
      </Ring>
    </>
  );
};

const SolarSystem: React.FC<{ onPlanetClick?: (p: PlanetData) => void }> = ({ onPlanetClick }) => {
  const sunData: PlanetData = {
    name: 'Sun',
    color: '#ffd48c',
    size: 2.5,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
  };

  const SunMesh: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    const ref = React.useRef<THREE.Mesh>(null!);
    let sunTexture: THREE.Texture | null = null;
    try {
      sunTexture = useLoader(THREE.TextureLoader, '/textures/planets/sun_color.jpg') as THREE.Texture;
    } catch (e) {
      sunTexture = null;
    }

    useFrame(() => {
      if (ref.current) ref.current.rotation.y += 0.002;
    });

    return (
      <mesh ref={ref} onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}>
        <sphereGeometry args={[sunData.size, 64, 64]} />
        <meshStandardMaterial
          emissive="#ffd48c"
          emissiveMap={sunTexture || undefined}
          emissiveIntensity={2}
          color="#ffd48c"
          roughness={1}
          metalness={0}
        />
      </mesh>
    );
  };

  return (
    <Canvas camera={{ position: [0, 25, 45], fov: 45 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#ffd48c" />

      <Stars radius={200} depth={50} count={5000} factor={7} saturation={0} fade speed={1} />
            
      <SunMesh onClick={() => onPlanetClick && onPlanetClick(sunData)} />
            
            {planetData.map(planet => (
              <Planet
                key={planet.name}
                {...planet}
                onClick={() => onPlanetClick && onPlanetClick(planet)}
              />
            ))}

            
            <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={100} />
        </Canvas>
    )
}

const SimulationPage: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  const handlePlanetClick = (p: PlanetData) => {
    setSelectedPlanet(p);
  };

  const closeModal = () => setSelectedPlanet(null);

  return (
    <div className="relative z-10 flex flex-col items-center p-4 sm:p-6">
      <div className="content-box w-full max-w-5xl p-8 space-y-6 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10">
        <h1>Solar System Simulation</h1>
        <p>
          Explore a miniature model of our solar system in relation to solely the Sun and Mars. Click and drag to orbit, scroll to zoom, and right-click to pan. Click on Mars to learn additional information.
        </p>
        <div className="w-full h-[60vh] rounded-lg overflow-hidden bg-black/50 border border-gray-700/50 cursor-grab active:cursor-grabbing">
          <SolarSystem onPlanetClick={handlePlanetClick} />
        </div>

        {selectedPlanet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
            <div className="relative bg-gray-800/95 dark:bg-gray-900 rounded-lg p-0 max-w-4xl w-full mx-4 shadow-2xl">
              <button className="absolute top-3 right-3 text-white z-10" onClick={closeModal}>✕</button>
              <div className="p-6 max-h-[70vh] overflow-y-auto text-gray-200 antialiased" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
                <h2 className="text-2xl font-bold mb-2 text-white">{selectedPlanet.name}</h2>
                <p className="text-sm text-gray-300 mb-4">A comprehensive overview of {selectedPlanet.name} with geological, atmospheric, historical, and mission-focused detail.</p>

                {selectedPlanet.name === 'Sun' ? (
                  <>
                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Overview</h3>
                      <p className="text-sm text-gray-300">The Sun is a G-type main-sequence star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, whose enormous mass governs the orbits of the planets and supplies the energy that drives planetary climates and supports life on Earth. The Sun's visible surface (the photosphere) and its outer atmosphere (the chromosphere and corona) exhibit complex structures and dynamic activity driven by magnetic fields and convection.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Structure and energy generation</h3>
                      <p className="text-sm text-gray-300">The Sun's internal structure includes the core (where thermonuclear fusion converts hydrogen into helium, releasing energy), the radiative zone (where energy is transported outward by photons), and the convective zone (where energy is transported by convective motions). At the core, temperatures reach roughly 15 million kelvin and pressures are immense, allowing proton–proton fusion chains to proceed. The net result is a steady output of electromagnetic radiation and neutrinos that we detect on Earth.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Atmosphere and corona</h3>
                      <p className="text-sm text-gray-300">Above the photosphere lies the chromosphere and then the corona — the Sun's tenuous outer atmosphere. The corona is unexpectedly hot (millions of kelvin) compared to the photosphere and is the source of the solar wind: a supersonic outflow of charged particles that permeates the heliosphere. The corona is highly structured by magnetic fields and is visible during solar eclipses as a pearly halo.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Magnetic activity and space weather</h3>
                      <p className="text-sm text-gray-300">Solar magnetic activity manifests as sunspots, prominences, flares, and coronal mass ejections (CMEs). The approximately 11-year solar cycle modulates the frequency of these events. Powerful flares and CMEs can accelerate particles and hurl billions of tons of plasma into space, causing geomagnetic storms at Earth that can disrupt satellites, communications, and power grids. Understanding and forecasting space weather is essential for protecting technological assets and human explorers.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Heliosphere and solar wind</h3>
                      <p className="text-sm text-gray-300">The Sun drives a continuous stream of charged particles (the solar wind) that defines a bubble in the interstellar medium called the heliosphere. The solar wind and interplanetary magnetic field interact with planetary magnetospheres and atmospheres, sculpting planetary space environments. Voyager spacecraft have crossed the heliopause, directly sampling the boundary between our Sun's influence and interstellar space.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Impact on Earth and exploration</h3>
                      <p className="text-sm text-gray-300">Solar irradiance is the primary energy input to Earth's climate system. Variations in solar output, though small in relative amplitude, can influence climate dynamics on long timescales. Solar storms present hazards to astronauts and electronics; therefore, missions planning (both robotic and human) incorporate space weather forecasting and mitigation strategies. Instruments on missions like SOHO, SDO, Parker Solar Probe, and Solar Orbiter are providing unprecedented views of the Sun and improving our physical models.</p>
                    </section>

                    <section className="mb-2 text-sm text-gray-400">
                      <p>For more on the Sun, see NASA's Solar System Exploration pages (https://solarsystem.nasa.gov/), the Solar Dynamics Observatory (SDO), Parker Solar Probe mission pages, and heliophysics literature.</p>
                    </section>

                    <div className="mt-4 text-right">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={closeModal}>Close</button>
                    </div>
                  </>
                ) : (
                  <>
                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Overview</h3>
                      <p className="text-sm text-gray-300">Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, after Mercury. It has a thin atmosphere composed mostly of carbon dioxide, traces of nitrogen and argon, and surface features reminiscent of both the Moon (cratered highlands) and Earth (valleys, polar ice caps, and weather patterns). The planet's reddish appearance is due to iron oxide (rust) prevalent in its soil.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Physical characteristics</h3>
                      <p className="text-sm text-gray-300">Mean radius: 3,389.5 km. Mass: ≈6.4171 × 10^23 kg (≈0.107 Earth masses). Surface gravity is about 0.378 g, meaning an object weighs roughly 38% of its weight on Earth. The planet's axial tilt is ~25.19°, producing seasons similar in nature—though different in length—to Earth's seasons because of Mars' eccentric orbit.</p>
                      <br />
                      <p className="text-sm text-gray-300">Mars' surface temperature varies widely: daytime equatorial highs can reach around 20 °C during summer, while polar winter lows drop below −125 °C. The atmosphere is thin (surface pressure ~0.6% of Earth's), which limits its ability to retain heat and reduces the effectiveness of liquid water stability on the surface under most conditions.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Geology and surface features</h3>
                      <p className="text-sm text-gray-300">Mars hosts the largest volcano in the Solar System, Olympus Mons, rising roughly 21–22 km above the surrounding plains. The Valles Marineris canyon system stretches over 4,000 km and is up to 7 km deep in places. The northern hemisphere has vast lowland plains, while the southern hemisphere is dominated by heavily cratered highlands. Evidence from orbiters and rovers indicates ancient river channels, delta deposits, and mineralogical signatures consistent with past liquid water activity.</p>
                      <br />
                      <p className="text-sm text-gray-300">Regolith (the loose surface material) is rich in iron and sulfur compounds, often oxidized into reddish iron oxides. Localized deposits of hydrated minerals (clays, sulfates) point to long-term aqueous alteration in Mars' past. Polar caps contain water ice layered with seasonal CO2 frost—seasonal sublimation and deposition drive large changes in albedo and atmospheric pressure.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Atmosphere and climate</h3>
                      <p className="text-sm text-gray-300">The Martian atmosphere is about 95% CO2, 2.7% N2, 1.6% Ar, with trace oxygen and water vapor. Its low density causes large diurnal temperature swings. Mars experiences global dust storms that can envelop the entire planet and last weeks or months; dust is a key driver of atmospheric heating by absorbing sunlight and altering temperature gradients.</p>
                      <br />
                      <p className="text-sm text-gray-300">Seasonal cycles are pronounced due to Mars' axial tilt and orbital eccentricity. During certain seasons, CO2 freezes out at the poles forming seasonal caps, and in other seasons it sublimates, changing atmospheric pressure measurably.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Water on Mars</h3>
                      <p className="text-sm text-gray-300">While liquid water is not stable at most places on the current Martian surface, abundant geomorphological evidence indicates that liquid water flowed in the ancient past—river valleys, lakebeds, and deltaic deposits are widespread. Subsurface ice exists at mid-latitudes and is abundant at higher latitudes; radar sounding from orbiters has detected extensive subsurface ice sheets and possible buried glaciers. Transient liquid brines may form under certain conditions, but their persistence and extent remain subjects of active research.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Exploration history and notable missions</h3>
                      <p className="text-sm text-gray-300">Early flybys and orbiters from Mariner missions provided the first close-up views. Since then, many successful orbiters (Mars Global Surveyor, Mars Odyssey, Mars Reconnaissance Orbiter, MAVEN, and others) have mapped Mars' surface, climate, and subsurface. Landers and rovers—including Viking 1 & 2, Pathfinder, Spirit, Opportunity, Phoenix, Curiosity, and Perseverance—have performed in-situ analyses revealing complex geology, organic precursor chemistry, and habitability indicators.</p>
                      <br />
                      <p className="text-sm text-gray-300">Perseverance (NASA, 2020) is actively collecting samples intended for future return to Earth, and carries instruments to search for biosignatures and to test technologies for human exploration (for example, MOXIE—an experiment that produces oxygen from the CO2-rich atmosphere).</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Potential for past or present life</h3>
                      <p className="text-sm text-gray-300">Mars is a primary target in the search for past life because of abundant evidence that it once had liquid water, energy sources, and a longer-lived habitable environment early in its history. While no definitive biosignatures have been found, detections of organic molecules by Curiosity and sedimentary structures consistent with ancient lakes keep Mars strongly within reach of astrobiological interest. The question of extant life—microscopic niches in subsurface aquifers or transient brine habitats—remains open and is a central motivation for sample return and further subsurface exploration.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Human exploration considerations</h3>
                      <p className="text-sm text-gray-300">Human missions to Mars face many challenges: long-duration transit (months), radiation exposure, life support and in-situ resource utilization (ISRU) needs, and landing heavy payloads safely. Mars' lower gravity aids launch from the surface but complicates human physiology. ISRU concepts (extracting water and oxygen from regolith and atmosphere) are key to sustainable presence—MOXIE is a technology demonstrator for oxygen production from Martian CO2.</p>
                    </section>

                    <section className="mb-4">
                      <h3 className="font-semibold text-white">Interesting facts</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Two small moons: Phobos (≈22.2 km across) and Deimos (≈12.6 km).</li>
                        <li>Olympus Mons is nearly three times the height of Mount Everest.</li>
                        <li>Evidence suggests Mars underwent major climate transitions from wetter to colder, driven by loss of its magnetic field and atmospheric escape.</li>
                      </ul>
                    </section>

                    <section className="mb-2 text-sm text-gray-400">
                      <p>For citations and source material, consult NASA mission pages (e.g., <a className="text-blue-300 underline" href="https://mars.nasa.gov/" target="_blank" rel="noreferrer">mars.nasa.gov</a>), peer-reviewed planetary geology literature, and planetary datasets hosted by USGS and ESA.</p>
                    </section>

                    <div className="mt-4 text-right">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={closeModal}>Close</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;