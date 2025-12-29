import { X } from 'lucide-react'
import stuckoBg from '../assets/stucco_bg-992.png'
import frameNoTop from '../assets/frame-no-top.png'
import frameBottom from '../assets/frame-bottom.png'
import coronaLogo from '../assets/corona-logo.png'

const LooseModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white p-4 rounded mx-auto  relative overflow-hidden flex flex-col"
                style={{
                    backgroundImage: `url(${stuckoBg})`,
                    backgroundSize: '100% auto',
                    maxWidth: '340px',
                    minHeight: '500px' // Add min-height for vertical centering
                }}
            >


                {/* Main Content Container - Centered with flex */}
                <div
                    className="relative text-[#0f2951] flex flex-col items-center justify-center flex-grow"
                    style={{ zIndex: 50000 }}
                >
                    {/* Logo and How to Play centered */}
                    <div className="flex flex-col items-center px-4">
                        <img
                            src={coronaLogo}
                            alt="Match Game"
                            className="mb-2 w-60"
                        />
                        {/* <img
                            src={howToPlayIcon}
                            alt="How to Play"
                            className="mb-3 w-40"
                        /> */}
                    </div>

                    {/* Game Rules - Centered */}
                    <div className="p-2 text-[12px] font-semibold text-center  flex flex-col justify-center"
                        style={{ flexGrow: .5 }}>
                        <p className=" text-2xl">You Didn't Get A</p>
                        <p className=" text-2xl">Match. Play Again</p>
                        <p className="mb-2 text-2xl">Tomorrow</p>
                        <p className="mb-2">You've been entered into the sweepstakes! Play every day to increase your chance of winning.</p>

                    </div>

                    {/* Button - Centered */}
                    <div className="w-full flex justify-center">
                        <button
                            onClick={() => window.open("https://www.coronausa.com/pages/corona-premier", "_blank")}
                            className="bg-yellow-500 hover:bg-yellow-600 text-[#0f2951] font-bold py-3 px-4 rounded-full shadow-lg w-auto min-w-[200px] transition-colors"
                        >
                            Visit CoronaUSA.com
                        </button>
                    </div>
                </div>

                {/* Bottom Frame - Initially hidden */}
                <div className="absolute left-0 right-0 bottom-0 w-full z-0 mb-2 hidden">
                    <img
                        src={frameBottom}
                        alt=""
                        className="w-full"
                    />
                </div>

                {/* Top Frame (without top) */}
                <div className="absolute top-0 left-0 right-0 h-full w-full z-0">
                    <img
                        src={frameNoTop}
                        alt=""
                        className="w-full mt-2"
                    />
                </div>
            </div>
        </div >
    )
}

export default LooseModal