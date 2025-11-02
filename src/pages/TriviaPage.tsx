import React from 'react';

const events = [
    {
        title: 'The Big Bang',
        date: '13.8 Billion Years Ago',
        time_ago_bya: 13.8,
        description: 'The universe begins from a single point, expanding outwards in a massive explosion of energy and matter.',
        imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'First Stars & Galaxies',
        date: '13.6 Billion Years Ago',
        time_ago_bya: 13.6,
        description: 'Gravity pulls clouds of gas together, igniting the first stars. These stars cluster to form the earliest galaxies.',
        imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1841&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Milky Way Forms',
        date: '13.2 Billion Years Ago',
        time_ago_bya: 13.2,
        description: 'Our home galaxy begins to form from a swirling disc of gas and dust, growing over billions of years.',
        imageUrl: 'https://images.unsplash.com/photo-1538370965246-fe2b0d873b24?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Solar System Forms',
        date: '4.6 Billion Years Ago',
        time_ago_bya: 4.6,
        description: 'A giant molecular cloud collapses, forming the Sun. The remaining material flattens into a disk from which planets form.',
        imageUrl: 'https://images.unsplash.com/photo-1614726353900-195e48711317?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Earth Forms',
        date: '4.5 Billion Years Ago',
        time_ago_bya: 4.5,
        description: 'Our planet is formed through accretion from the solar nebula, starting as a molten mass before cooling.',
        imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'First Life Appears',
        date: '3.8 Billion Years Ago',
        time_ago_bya: 3.8,
        description: 'The first simple, single-celled organisms emerge in Earth\'s oceans, marking the beginning of life.',
        imageUrl: 'https://images.unsplash.com/photo-1578508687212-20c24c7f093a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Dinosaur Extinction',
        date: '66 Million Years Ago',
        time_ago_bya: 0.066,
        description: 'An asteroid impact causes a mass extinction event, wiping out non-avian dinosaurs and paving the way for mammals.',
        imageUrl: 'https://images.unsplash.com/photo-1606990374636-39b592186715?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Modern Humans Emerge',
        date: '200,000 Years Ago',
        time_ago_bya: 0.0002,
        description: 'Homo sapiens appears in Africa. These early humans develop language, art, and complex tools.',
        imageUrl: 'https://images.unsplash.com/photo-1529008987943-d0fe89309a80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

const TOTAL_DURATION = 13.8; // Total timeline duration in Billion Years

const TriviaPage: React.FC = () => {
    return (
        <div className="relative z-10 flex flex-col items-center p-4 sm:p-6 lg:p-12">
            <div className="content-box w-full max-w-7xl text-center p-8 space-y-4 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10">
                <h2>Timeline of the Universe</h2>
                <p>From the Big Bang to the present day, hover over the circles to explore key moments in cosmic history.</p>
            </div>

            <div className="w-full flex justify-center items-center mt-32 mb-48 px-8">
                <div className="relative w-full h-1 bg-gradient-to-r from-purple-800 via-purple-500 to-cyan-400 rounded-full">
                    {/* Timeline Labels */}
                    <span className="absolute -left-2 -top-8 text-xs text-gray-400">Big Bang</span>
                    <span className="absolute -right-1 -top-8 text-xs text-gray-400">Now</span>

                    {/* Event Markers */}
                    {events.map((event, index) => {
                        const position = ((TOTAL_DURATION - event.time_ago_bya) / TOTAL_DURATION) * 100;
                        const isCardAbove = index % 2 === 0;

                        let cardPositionClass = 'left-1/2 -translate-x-1/2';
                        let pointerPositionClass = 'left-1/2 -translate-x-1/2';

                        // When near the left edge, align the card to the right of the dot
                        if (position < 15) {
                            cardPositionClass = 'left-0';
                            pointerPositionClass = 'left-4';
                        }
                        // When near the right edge, align the card to the left of the dot
                        else if (position > 85) {
                            cardPositionClass = 'right-0';
                            pointerPositionClass = 'right-4';
                        }

                        return (
                            <div
                                key={event.title}
                                className="group absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center"
                                style={{ left: `${position}%` }}
                            >
                                {/* The clickable/hoverable circle */}
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-black group-hover:bg-purple-400 transition-all duration-300 cursor-pointer"></div>

                                {/* The info card */}
                                <div
                                    className={`absolute transform ${cardPositionClass} w-64 p-4 space-y-2 
                    bg-gray-900/60 backdrop-blur-md rounded-lg border border-gray-700/80 shadow-lg shadow-purple-900/20
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                    ${isCardAbove ? 'bottom-full mb-6' : 'top-full mt-6'}`}
                                >
                                    {/* Card Pointer */}
                                    <div className={`absolute transform ${pointerPositionClass} w-3 h-3 bg-gray-900/60 border-gray-700/80
                    ${isCardAbove ? 'bottom-0 -mb-1.5 border-b border-r rotate-45' : 'top-0 -mt-1.5 border-t border-l rotate-45'}`}>
                                    </div>

                                    <div className="w-full h-24 rounded-md overflow-hidden bg-gray-800">
                                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-base font-bold text-purple-300">{event.title}</h3>
                                    <p className="text-xs font-semibold text-cyan-300">{event.date}</p>
                                    <p className="text-xs text-gray-300">{event.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TriviaPage;
