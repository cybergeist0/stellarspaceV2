import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center p-4 sm:p-6">
      <div className="content-box w-full max-w-4xl p-8 space-y-6 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10">
        <h1>Welcome Colonist!</h1>
        <p>
          You have arrived at StellarSpace where you can ensure you are maintaining proper oxygen and water levels while exploring the cosmos.
        </p>
        <p>
          Use the navigation bar to explore different sections including your habitat status, trivia about space, and interactive simulations of our solar system.
        </p>
        <p>
          Enjoy your journey among the stars!
        </p>
      </div>
    </div>
  );
};

export default HomePage;
