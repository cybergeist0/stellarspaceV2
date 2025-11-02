import React, { useState, useEffect } from 'react';
import BackgroundLayout from './components/BackgroundLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import SimulationPage from './pages/SimulationPage.tsx';
import TriviaPage from './pages/TriviaPage.tsx';

const routes: { [key: string]: React.FC } = {
  '/': HomePage,
  '/simulation': SimulationPage,
  '/trivia': TriviaPage,
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Function to update state based on current URL path
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleLocationChange);

    // This function will handle clicks on local links to prevent page reloads
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      // Intercept click if it's a local link, not opening in a new tab, and not a special click (e.g., cmd+click)
      if (
        anchor &&
        anchor.href &&
        anchor.origin === window.location.origin &&
        anchor.target !== '_blank' &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault(); // Prevent full page reload
        const newPath = new URL(anchor.href).pathname;

        // Only push to history and update state if the path is different
        if (newPath !== window.location.pathname) {
          window.history.pushState({}, '', newPath);
          handleLocationChange(); // Manually trigger a state update to re-render
        }
      }
    };

    // Add the global click listener
    document.addEventListener('click', handleLinkClick);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const PageComponent = routes[currentPath] || HomePage; // Default to HomePage if route not found

  return (
    <>
      <main className="min-h-screen bg-black text-gray-200 relative overflow-hidden">
        <BackgroundLayout />

        <nav className="top-0 w-full p-6 z-50 flex justify-between items-center backdrop-blur-sm bg-black/20 border-b border-gray-800/50">
          <div className="flex items-center space-x-8 text-sm font-medium">
            <a href="/simulation" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">Simulation</a>
            <a href="#" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">Machine Learning</a>
            <a href="/trivia" className="text-gray-300 hover:text-purple-300 transition-colors duration-300">Trivia</a>
          </div>
          <div>
            <a href="/">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                StellarSpace
              </h1>
            </a>
          </div>
        </nav>

        <PageComponent />

      </main>
    </>
  );
};

export default App;