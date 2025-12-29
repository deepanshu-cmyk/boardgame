// WinModal.jsx
const WinModal = ({ isOpen, onPlayAgain, }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-blue-900 bg-opacity-80 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
                <img
                    src="/images/intro/corona-logo.png"
                    alt="Corona"
                    className="w-48 mx-auto mb-4"
                />

                <h2 className="text-blue-900 font-bold text-3xl uppercase mb-4">
                    Congratulations! You Got a Match!
                </h2>

                <p className="text-lg mb-6">
                    You've been entered into the sweepstakes! Play every day to increase your chance of winning.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={onPlayAgain}
                        className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-colors w-full"
                    >
                        Play Again Tomorrow
                    </button>

                    <a
                        href="https://www.coronausa.com/pages/corona-premier"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-colors w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit CoronaUSA.com →
                    </a>
                </div>
            </div>
        </div>
    )
}

export default WinModal