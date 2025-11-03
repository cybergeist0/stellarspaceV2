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
        title: 'Recombination & CMB',
        date: '≈13.7997 Billion Years Ago',
        time_ago_bya: 13.7997,
        description: 'Electrons combine with protons to form neutral hydrogen; the Universe becomes transparent and the Cosmic Microwave Background radiation is released.',
        imageUrl: 'https://ned.ipac.caltech.edu/level5/Sept02/Kinney/Figures/figure3.jpg',
    },
    {
        title: 'Cosmic Dark Ages',
        date: '≈13.7 Billion Years Ago',
        time_ago_bya: 13.7,
        description: 'Following recombination, the Universe cooled and darkened — there are no luminous sources yet until the first stars form.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/06/webb-universe-timeline-jpeg.webp',
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
        imageUrl: 'https://cosmosatyourdoorstep.com/wp-content/uploads/2023/02/sagittarius_collisions_trigger_star_formation_in_milky_way_article.jpg',
    },
    {
        title: 'Reionization',
        date: '≈13.0 - 12.7 Billion Years Ago',
        time_ago_bya: 13.0,
        description: 'Radiation from the first stars and galaxies ionizes the surrounding hydrogen, ending the cosmic dark ages and changing the intergalactic medium.',
        imageUrl: 'https://astrobites.org/wp-content/uploads/2015/05/cover.png',
    },
    {
        title: 'Heavy Element Enrichment',
        date: '≈11 - 9 Billion Years Ago',
        time_ago_bya: 11.0,
        description: 'Successive generations of stars create heavier elements via fusion and supernovae, enriching the gas that will later form metal-rich stars and planets.',
        imageUrl: 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2024/09/scorching_hot_iron_within_supernova_remnant_n132d/26320307-1-eng-GB/Scorching_hot_iron_within_supernova_remnant_N132D_card_medium.png',
    },
    {
        title: 'Solar System Forms',
        date: '4.6 Billion Years Ago',
        time_ago_bya: 4.6,
        description: 'A giant molecular cloud collapses, forming the Sun. The remaining material flattens into a disk from which planets form.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/07/149890main-betapictdiskbmac.jpg',
    },
    {
        title: 'Moon Forms',
        date: '≈4.51 Billion Years Ago',
        time_ago_bya: 4.51,
        description: 'A Mars-sized body (Theia) collides with the proto-Earth; debris from the impact accretes to form the Moon.',
        imageUrl: 'https://cdn.zmescience.com/wp-content/uploads/2015/02/earth_impact_moon.jpg',
    },
    {
        title: 'Earth Forms',
        date: '4.5 Billion Years Ago',
        time_ago_bya: 4.5,
        description: 'Our planet is formed through accretion from the solar nebula, starting as a molten mass before cooling.',
        imageUrl: 'https://th-thumbnailer.cdn-si-edu.com/ROtM91PFiWHDcET559a_fajgGuk=/1280x960/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/7e/59/7e593e43-c61b-4635-9fac-8a6cd1a36ed3/accretion-nature.jpg',
    },
    {
        title: 'Late Heavy Bombardment',
        date: '≈4.1 - 3.8 Billion Years Ago',
        time_ago_bya: 4.0,
        description: 'A period of frequent and intense asteroid impacts reshapes planetary surfaces across the inner solar system.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/10/osirisrexshot.jpg',
    },
    {
        title: 'First Life Appears On Earth',
        date: '3.8 Billion Years Ago',
        time_ago_bya: 3.8,
        description: 'The first simple, single-celled organisms emerge in Earth\'s oceans, marking the beginning of life.',
        imageUrl: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/EE3B/production/_94878906_firstlife.jpg',
    },
    {
        title: 'Great Oxygenation Event',
        date: '≈2.4 Billion Years Ago',
        time_ago_bya: 2.4,
        description: 'Photosynthetic microbes produce oxygen, transforming Earth\'s atmosphere and enabling aerobic life to evolve.',
        imageUrl: 'https://envirobites.org/wp-content/uploads/2022/06/1599px-Archean.png',
    },
    {
        title: 'First Multicellular Life',
        date: '≈1.0 Billion Years Ago',
        time_ago_bya: 1.0,
        description: 'Eukaryotic cells form cooperative assemblies, giving rise to multicellular organisms and increased biological complexity.',
        imageUrl: 'https://astrobiology.nasa.gov/uploads/filer_public_thumbnails/filer_public/25/af/25af2567-af6e-4c9e-a1a5-1679108d9941/79911_web-600x520.jpg__1240x510_q85_subsampling-2.jpg',
    },
    {
        title: 'Third, Most Severe Ice Age',
        date: '≈720 to 635 Million Years Ago',
        time_ago_bya: 0.7,
        description: 'The third ice age, and possibly most severe, is estimated to have occurred from 720 to 635 Ma (million years) ago, in the Neoproterozoic Era, and it has been suggested that it produced a second "Snowball Earth", i.e. a period during which Earth was completely covered in ice.',
        imageUrl: 'https://www.climate.gov/sites/default/files/styles/full_width_620_original_image/public/2021-08/Enceladus_JPL_Cassini_lrg.jpg?itok=zDeJ-_GB',
    },
    {
        title: 'Cambrian Explosion',
        date: '541 Million Years Ago',
        time_ago_bya: 0.541,
        description: 'A rapid diversification of animal life produces most of the major animal phyla we recognize today.',
        imageUrl: 'https://media.springernature.com/full/springer-static/image/art%3A10.1038%2F530268a/MediaObjects/41586_2016_Article_BF530268a_Figa_HTML.jpg',
    },
    {
        title: 'First Land Plants',
        date: '≈470 Million Years Ago',
        time_ago_bya: 0.47,
        description: 'Plants colonize land, altering ecosystems and enabling terrestrial habitats to flourish.',
        imageUrl: 'https://news.uoregon.edu/sites/default/files/styles/landscape_xl/public/field/image/ordovician_land_plants.jpg?itok=fCG2EAkT',
    },
    {
        title: 'First Tetrapods',
        date: '≈370 Million Years Ago',
        time_ago_bya: 0.37,
        description: 'Fish with limb-like fins evolve the ability to move onto land, leading to four-limbed vertebrates.',
        imageUrl: 'data:image/jpeg;base64,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',
    },
    {
        title: 'Flowering Plants Appear',
        date: '≈140 Million Years Ago',
        time_ago_bya: 0.14,
        description: 'Angiosperms (flowering plants) diversify and become a dominant group in many ecosystems.',
        imageUrl: 'https://static.scientificamerican.com/sciam/cache/file/1F314E87-E812-4398-85E40AC30A904FDF_source.jpg?crop=16%3A9%2Csmart&w=1920',
    },
    {
        title: 'Dinosaur Extinction',
        date: '66 Million Years Ago',
        time_ago_bya: 0.066,
        description: 'An asteroid impact causes a mass extinction event, wiping out non-avian dinosaurs and paving the way for mammals.',
        imageUrl: 'https://ichef.bbci.co.uk/images/ic/1024x576/p080nn1d.jpg',
    },
    {
        title: 'Modern Humans Emerge',
        date: '200,000 Years Ago',
        time_ago_bya: 0.0002,
        description: 'Homo sapiens appears in Africa. These early humans develop language, art, and complex tools.',
        imageUrl: 'https://cdn.sci.news/images/2019/10/image_7745f-Early-Farmers.jpg',
    },
    {
        title: 'Agriculture Begins',
        date: '≈12,000 Years Ago',
        time_ago_bya: 0.000012,
        description: 'Humans begin domesticating plants and animals, leading to settled communities and the rise of civilizations.',
        imageUrl: 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2153245617/settings_images/6a5baa6-cb18-35fe-ee5c-fccb5e22248_kmwCgl2TY6q7oXhjTHkd_pasted_image_0_12.png',
    },
    {
        title: 'Writing Emerges',
        date: '≈5,000 Years Ago',
        time_ago_bya: 0.000005,
        description: 'The invention of writing systems enables record-keeping, administration, and complex cultural transmission.',
        imageUrl: 'https://dl6pgk4f88hky.cloudfront.net/2021/06/p08rsrc1.jpg',
    },
    {
        title: 'Industrial Revolution',
        date: '≈250 Years Ago',
        time_ago_bya: 0.00000025,
        description: 'Rapid technological and social change driven by mechanization, fossil fuels, and industry reshapes human societies.',
        imageUrl: 'https://res.cloudinary.com/aenetworks/image/upload/v1737659929/second_industrial_revolution_gettyimages-51632462-1.jpg',
    },
    {
        title: 'Space Age Begins (Sputnik)',
        date: '1957 CE',
        time_ago_bya: 0.000001966,
        description: 'The launch of Sputnik 1 marks the beginning of human-made objects in Earth orbit and the modern space age.',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNxXUMqJjbFohPIetkEtNgYbgIVcVSsN0Iyg&s',
    },
    {
        title: 'First Human on the Moon',
        date: '1969 CE',
        time_ago_bya: 0.000001956,
        description: 'Apollo 11 lands humans on the Moon for the first time, a milestone in exploration and engineering.',
        imageUrl: 'https://i.natgeofe.com/k/1ef0d42f-adf7-49e7-a2de-7d381fd18f95/moon-landing-textimage_4x3.png',
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

                                    <div className="w-full h-24 rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
                                        {event.imageUrl ? (
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image yet</div>
                                        )}
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
            <div className="content-box w-full max-w-7xl text-center p-8 space-y-4 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10 mt-64">
                <h2>Mars Trivia</h2>
                <br />
                <img src="https://www.solarsystemscope.com/spacepedia/images/handbook/renders/mars.png" alt="Mars rotating against black background, showing its distinctive red-orange surface color, polar ice caps, and multiple impact craters across its terrain. Three images showing different sides of the planet as it completes one rotation." style={{ display: 'block', margin: '0 auto' }}/>
                <p>Dear Colonizer, Mars is one of the most explored bodies in our solar system, it's the only planet where we've sent rovers to roam the alien landscape, and potentially our future home; and therefore, it is critical to know the distinct properties and nature of this fascinating celestial body.</p>
                <br />
                <ul className="list-disc list-inside text-left max-w-3xl mx-auto space-y-2">
                    <li>Mars is the fourth planet from the Sun and is often referred to as the "Red Planet" due to its reddish appearance, which is caused by iron oxide (rust) on its surface.</li>
                    <li>Mars has the largest volcano in the solar system, Olympus Mons, which stands about 13.6 miles (22 kilometers) high, nearly three times the height of Mount Everest.</li>
                    <li>The Martian day, known as a sol, is approximately 24 hours and 39 minutes long, slightly longer than an Earth day.</li>
                    <li>Mars has two small moons, Phobos and Deimos, which are thought to be captured asteroids.</li>
                    <li>Evidence suggests that liquid water once flowed on Mars' surface, and there are polar ice caps made of water and dry ice (frozen carbon dioxide).</li>
                    <li>The atmosphere of Mars is very thin, composed mostly of carbon dioxide, with traces of nitrogen and argon, making it inhospitable for human life without proper equipment.</li>
                    <li>Numerous missions have been sent to Mars, including rovers like Spirit, Opportunity, Curiosity, and Perseverance, which have provided valuable data about the planet's geology and potential for past life.</li>
                </ul>
            </div>
        </div>
    );
};

export default TriviaPage;
