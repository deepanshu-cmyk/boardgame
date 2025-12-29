import React from 'react'
import dot from '../assets/dots.png'
import stuckoBg from '../assets/stucco_bg-992.png'
import coronaLogo from '../assets/corona-logo.png'

const HomePage = ({ onNext }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4  relative overflow-hidden ">
            {/* Remove the background from the main container */}

            <div className="w-full max-w-xl relative z-10">
                {/* Main Card Container - Apply background HERE */}
                <div
                    className="relative bg-transparent rounded-lg overflow-hidden border border-[#2a5d5d] shadow-2xl backdrop-blur-sm"
                    style={{
                        backgroundImage: `url(${stuckoBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Remove the separate background div inside the card since it's now on the card itself */}

                    {/* Main Content Area */}
                    <div className="p-6 relative z-10">
                        {/* Dotted Divider - Top */}
                        <div className="flex justify-center mb-2">
                            <img
                                src={dot}
                                alt="divider"
                                className="w-full max-w-md h-auto"
                            />
                        </div>

                        {/* Main Heading */}
                        <div className="text-center mb-2 px-4">
                            <h1 className="text-xl md:text-xl font-bold text-[#0f2951] tracking-tight uppercase ">
                                PLAY THE CORONA  MATCH GAME
                            </h1>

                            <h3 className="text-xl md:text-xl font-bold text-[#0f2951] tracking-wide ">
                                FOR A CHANCE TO WIN PRIZES
                            </h3>
                        </div>

                        {/* Dotted Divider */}
                        <div className="flex justify-center ">
                            <img
                                src={dot}
                                alt="divider"
                                className="w-full max-w-md h-auto"
                            />
                        </div>

                        {/* First Image - Corona Logo/Bottle */}
                        <div className="mb-2">
                            <div className=" rounded-lg   relative">
                                <div className="flex justify-center">
                                    <img
                                        src={coronaLogo}
                                        alt="Corona Logo"
                                        className="w-auto h-auto"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dotted Divider */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={dot}
                                alt="divider"
                                className="w-full max-w-md h-auto"
                            />
                        </div>

                        {/* Play Button */}
                        <div className="text-center mb-8">
                            <button
                                onClick={onNext}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#ffcc00] via-[#ff9900] to-[#ffcc00] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-bold text-s px-12 py-1 rounded-lg uppercase tracking-wider hover:scale-105 transition-transform shadow-lg border-2 border-[#0f2951]">
                                    PLAY TO ENTER
                                </div>
                            </button>
                        </div>

                        {/* Footer Text - Legal */}
                        <div className="text-center text-[#0c2042] text-[7px] space-y-2 px-4">
                            <p className="cursor-pointer">This promotion is an example of past client work for demonstration purposes only. It is not active, no entry is possible, and no prizes will be awarded. All brand names, logos, and trademarks are used with permission and remain the property of their respective owners.</p>

                        </div>


                    </div>
                </div>


            </div>
        </div>
    )
}

export default HomePage