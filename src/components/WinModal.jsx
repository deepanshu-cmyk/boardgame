import { X } from 'lucide-react'
import stuckoBg from '../assets/stucco_bg-992.png'
import frameNoTop from '../assets/frame-no-top.png'
import frameBottom from '../assets/frame-bottom.png'
import coronaLogo from '../assets/corona-logo.png'
import video from '../assets/TULLAMORE_DEW_PAID_SOCIAL_REELS_DB_PILSNER_FINAL_MASTER.mp4'

// Add onUnlockRebate to the props
const WinModal = ({ isOpen, onUnlockRebate }) => {
    console.log('WinModal isOpen:', isOpen)
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
            <div
                className="bg-white p-4 rounded mx-auto relative overflow-hidden flex flex-col"
                style={{
                    backgroundImage: `url(${stuckoBg})`,
                    backgroundSize: '100% auto',
                    maxWidth: '340px',
                    minHeight: '500px'
                }}
            >
                {/* Main Content Container - Centered with flex */}
                <div
                    className="relative text-[#0f2951] flex flex-col items-center justify-center flex-grow"
                    style={{ zIndex: 50000 }}
                >
                    {/* Logo and How to Play centered */}
                    <div className="flex flex-col items-center px-4 mt-2">
                        <img
                            src={coronaLogo}
                            alt="Match Game"
                            className="mb-2 w-60 "
                        />
                    </div>

                    {/* Game Rules - Centered */}
                    <div className="p-2 text-[12px] font-semibold text-center flex flex-col justify-center"
                        style={{ flexGrow: .5 }}>
                        <p className="text-xl">You've brought together</p>
                        <p className="text-xl">Malt, Grain, and Pot Still whiskey —</p>
                        <p className="mb-2">the signature that makes Tullamore D.E.W. unmistakably smooth.</p>
                    </div>

                    {/* Video - Added here */}
                    <div className="my-4 w-full flex justify-center">
                        <video
                            autoPlay
                            muted
                            loop
                            className="rounded-lg shadow-md max-w-[320px] h-[150px] sm:h-[200px]"
                        >
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Updated Button - Now triggers onUnlockRebate */}
                    <div className="w-full flex justify-center mt-2">
                        <button
                            onClick={() => {
                                // Call onUnlockRebate to navigate to UnlockRebate component
                                // if (onUnlockRebate) {
                                //     onUnlockRebate()
                                // } else {
                                //     console.error('onUnlockRebate function not provided!')
                                //     // Fallback - you can remove this once it's working
                                //     window.open("https://www.coronausa.com/pages/corona-premier", "_blank")
                                // }

                                window.open("https://your-rebate-page.com", "_blank")
                            }}
                            className="bg-[#0f2951] hover:bg-[#1a3a6b] text-white font-semibold sm:font-bold py-1 sm:py-3 px-6 rounded-full shadow-lg w-auto sm:min-w-[220px] transition-colors text-lg"
                        >
                            Unlock Rebate
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
        </div>
    )
}

export default WinModal