import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center p-4 sm:p-6">
      <div className="content-box w-full max-w-4xl p-8 space-y-6 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10">
        <h1>Welcome!</h1>
        <p>
          This is the main content area. It's designed to be translucent, allowing the cosmic-ahh background to show through while keeping the text perfectly readable. The text itself has a subtle glow, enhancing the futuristic, stellar theme of the website. You can place any page elements you need right here.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
