import { useState, useEffect, useRef } from 'react'
import InstructionsModal from './InstructionsModal'
import WinModal from './WinModal'
import ReadySetGo from './ReadySetGo'

// Import background images
import stuccoBg576 from '../assets/stucco_bg-992.png'

// Import logo
import coronaLogo from '../assets/C_logo-360.png'

// Import card images
import P1 from '../assets/P1-240.png'
import P2 from '../assets/P2-240.png'
import P3 from '../assets/P3-240.png'
import P4 from '../assets/P4-240.png'
import P5 from '../assets/P5-240.png'
import P6 from '../assets/P6-240.png'
import P7 from '../assets/P7-240.png'

// Import modal images
import matchgameLogo from '../assets/matchgame-logo.png'
import howToPlay from '../assets/how-to-play.svg'
import coronaLogoIntro from '../assets/corona-logo.png'

const GameBoard = ({ userData }) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const [gameWon, setGameWon] = useState(false)
    const [timer, setTimer] = useState(3)
    const [currentCallerImage, setCurrentCallerImage] = useState(null) // Current image in THE CALLER box
    const [generatedImages, setGeneratedImages] = useState([]) // Array of 3 generated images in order
    const [userSelections, setUserSelections] = useState([])

    const [showReadySetGo, setShowReadySetGo] = useState(false)
    const [boardCards, setBoardCards] = useState([])

    const [gameOver, setGameOver] = useState(false)
    const [gameResult, setGameResult] = useState('')
    const [currentImageIndex, setCurrentImageIndex] = useState(0) // 0, 1, or 2 (which of the 3 images we're on)
    const timerRef = useRef(null)


    // Card types with imported images
    const cardTypes = [
        { id: 'extra', name: 'Corona Extra', image: P1, },
        { id: 'familiar', name: 'Corona Familiar', image: P2 },
        { id: 'premier', name: 'Corona Premier', image: P3 },
        { id: 'light', name: 'Corona Light', image: P4 },
        { id: 'refresca', name: 'Corona Refresca', image: P5 },
        { id: 'hard', name: 'Corona Hard', image: P6 },
        { id: 'seltzer', name: 'Corona Seltzer', image: P7 }
    ]

    // Generate next image from remaining board cards (excluding already selected ones)
    const generateNextCallerImage = (currentBoardCards, currentSelections) => {
        console.log("GameBoard: Generating next caller image from board cards")

        // Get cards that haven't been selected yet
        const availableCards = currentBoardCards.filter(card => {
            const isSelected = currentSelections.some(sel => sel.position === card.position)
            return !isSelected
        })

        if (availableCards.length === 0) {
            console.log("GameBoard: No available cards left")
            return null
        }

        // Pick a random card from available cards
        const randomIndex = Math.floor(Math.random() * availableCards.length)
        const selectedCard = availableCards[randomIndex]

        console.log("GameBoard: Selected card for caller:", selectedCard.name)
        return selectedCard
    }



    const initializeBoard = () => {
        // Ensure three images are generated
        const selectedCards = cardTypes.sort(() => 0.5 - Math.random()).slice(0, 3);
        setBoardCards(selectedCards);
        setGeneratedImages(selectedCards);

        console.log("GameBoard: Initializing board...")

        // Create board with 9 random cards
        const cards = []

        for (let i = 0; i < 9; i++) {
            const randomCard = cardTypes[Math.floor(Math.random() * cardTypes.length)]
            cards.push({
                ...randomCard,
                position: i,
                isSelected: false,
                isMatched: false,
                row: Math.floor(i / 3),
                col: i % 3
            })
        }

        setBoardCards(cards)

        // Reset everything
        setCurrentImageIndex(0)
        setUserSelections([])
        setCurrentCallerImage(null)
        setGeneratedImages([])
        setTimer(3)
        setGameOver(false)
        setGameResult('')
        setGameWon(false)
    }

    useEffect(() => {
        initializeBoard()
    }, [])

    useEffect(() => {
        if (!gameStarted || gameOver || !currentCallerImage) return

        if (timer === 0) {
            // Time ran out - user didn't select the card in time, end game
            endGame('loss', 'Time ran out')
            return
        }

        const t = setTimeout(() => {
            setTimer(prev => prev - 1)
        }, 1000)

        return () => clearTimeout(t)
    }, [timer, gameStarted, gameOver, currentCallerImage])


    const endGame = (result, reason) => {
        console.log("Game ended:", result, "- Reason:", reason)
        console.log("User selections:", userSelections)
        console.log("Generated images:", generatedImages)

        setGameResult(result)
        setGameOver(true)
        setGameStarted(false)

        if (result === 'win') {
            setGameWon(true)
        }
    }

    const handleCardClick = (card) => {
        if (!gameStarted || gameOver || !currentCallerImage) return

        // Check if card is already selected
        if (userSelections.some(sel => sel.position === card.position)) {
            console.log("GameBoard: Card already selected")
            return
        }

        // Check if clicked card matches the current caller image
        if (card.id !== currentCallerImage.id) {
            console.log("GameBoard: Wrong card selected")
            endGame('loss', 'Wrong card selected')
            return
        }

        console.log("GameBoard: Card selected:", card.name)

        // Mark card as matched and update selections
        const selection = { ...card, isMatched: true }
        const updatedSelections = [...userSelections, selection]

        // Update board cards
        setBoardCards(prevCards => prevCards.map(c =>
            c.position === card.position
                ? { ...c, isMatched: true, isSelected: true }
                : c
        ))
        setUserSelections(updatedSelections)

        // Add the current caller image to generatedImages (user just selected it)
        const updatedGeneratedImages = [...generatedImages, currentCallerImage]
        setGeneratedImages(updatedGeneratedImages)

        // If we have 3 selections, check win conditions
        if (updatedSelections.length === 3) {
            checkWinConditions(updatedSelections, updatedGeneratedImages)
            return
        }

        // Generate next image from remaining board cards (only after user selected current one)
        if (currentImageIndex < 3) {
            // Use functional update to get latest state
            setBoardCards(prevCards => {
                const updatedCards = prevCards.map(c =>
                    c.position === card.position
                        ? { ...c, isMatched: true, isSelected: true }
                        : c
                )
                const nextImage = generateNextCallerImage(updatedCards, updatedSelections)
                if (nextImage) {
                    setCurrentImageIndex(prev => prev + 1)
                    setCurrentCallerImage(nextImage) // Show next image
                    setTimer(3) // Reset timer for next image
                } else {
                    endGame('loss', 'No more cards available')
                }
                return updatedCards
            })
        }
    }

    const checkWinConditions = (selections, imagesToCheck) => {
        console.log("GameBoard: Checking win conditions")
        console.log("GameBoard: Selections:", selections.map(s => s.name))
        console.log("GameBoard: Generated images:", imagesToCheck.map(g => g.name))

        // Unique cards
        const ids = selections.map(c => c.id)
        if (new Set(ids).size !== 3) {
            endGame('loss', 'Cards must be unique')
            return
        }

        // Same row
        const row = selections[0].row
        if (!selections.every(c => c.row === row)) {
            endGame('loss', 'Cards must be in same row')
            return
        }

        // Match generated images in order
        // imagesToCheck should have all 3 images
        if (imagesToCheck.length !== 3) {
            console.log("GameBoard: Not enough images - have", imagesToCheck.length, "expected 3")
            endGame('loss', 'Not enough images generated')
            return
        }

        const generatedIds = imagesToCheck.map(g => g.id)
        const selectedIds = ids

        // Check if selections match generated images in order
        const isMatch = selectedIds.every((id, i) => id === generatedIds[i])

        console.log("GameBoard: Generated IDs:", generatedIds)
        console.log("GameBoard: Selected IDs:", selectedIds)
        console.log("GameBoard: Match:", isMatch)

        if (isMatch) {
            endGame('win', 'Perfect match!')
        } else {
            endGame('loss', 'Images do not match')
        }
    }


    const startGame = () => {
        console.log("GameBoard: Starting game")

        // Reset selections
        setUserSelections([])
        setCurrentImageIndex(0)
        setGeneratedImages([]) // Start with empty - will add images as user selects

        // Reset board cards selection state and generate first image
        setBoardCards(prev => {
            const resetCards = prev.map(card => ({
                ...card,
                isSelected: false,
                isMatched: false
            }))

            // Generate first image from board cards (don't add to generatedImages yet)
            const firstImage = generateNextCallerImage(resetCards, [])
            if (firstImage) {
                setCurrentCallerImage(firstImage) // Show first image
                setTimer(10)
            } else {
                console.log("GameBoard: No cards available to start game")
                return resetCards
            }

            return resetCards
        })

        setGameOver(false)
        setGameWon(false)
        setGameStarted(true)
    }


    const resetGame = () => {
        setGameStarted(false)
        setGameWon(false)
        setGameOver(false)
        initializeBoard()
        setShowInstructions(true)
    }

    const handlePlayFromInstructions = () => {
        setShowInstructions(false)
        startGame()
    }

    const handleImageSelect = (image) => {
        if (userSelections.length < 4) {
            setUserSelections((prevSelections) => [...prevSelections, image]);
        }
        if (userSelections.length === 3) {
            // Finish the game when 3 images are selected
            setGameWon(true);
            setGameOver(true);
        }
    }

    const handleImageClick = (image) => {
        handleImageSelect(image);
    }

    // Render the game board based on game status
    const renderGameStatus = () => {
        if (gameOver) {
            return (
                <div className="text-center mt-6">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">
                        {gameResult === 'win' ? '🎉 You Won! 🎉' : '😢 Game Over 😢'}
                    </h2>
                    <p className="text-blue-800 mb-4">
                        {gameResult === 'win'
                            ? 'Congratulations! You won the match!'
                            : 'Try again! You loose the match'}
                    </p>

                    <button
                        onClick={resetGame}
                        className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-6 rounded-full text-base shadow-lg transition-colors"
                    >
                        Play Again
                    </button>
                </div>
            )
        }

        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="relative z-10 w-full max-w-xl">
                {/* Main Card Container */}
                <div
                    className="relative bg-transparent rounded-lg overflow-hidden border border-[#2a5d5d] shadow-2xl backdrop-blur-sm"
                    style={{
                        backgroundImage: `url(${stuccoBg576})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Top Blue Header - Inside Container */}
                    <div className="bg-blue-900 w-full py-3 px-4">
                        <div className="flex justify-between items-center">
                            <div className="w-1/4"></div>
                            <div className="w-1/2 text-center">
                                <div className="relative">
                                    <div className="absolute -top-8 w-full flex justify-center">
                                        <img
                                            src={coronaLogo}
                                            width="120"
                                            height="50"
                                            className="img-fluid"
                                            alt="Corona Logo"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/4 text-right">
                                <button className="p-3">
                                    <svg className="w-8 h-8 text-white opacity-5" viewBox="0 0 448 512">
                                        <path d="M0 64H448v64H0V64zM0 224H448v64H0V224zM448 384v64H0V384H448z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Ready Set Go Animation */}
                    {showReadySetGo && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <ReadySetGo />
                        </div>
                    )}

                    {/* Game Area */}
                    <div className="p-4">
                        {/* Game Board - 3x3 Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {boardCards.map((card, index) => (
                                <button
                                    key={`card-${index}`}
                                    onClick={() => handleCardClick(card)}
                                    className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${card.isMatched
                                        ? 'ring-2 ring-green-500'
                                        : card.isSelected
                                            ? 'ring-2 ring-red-500'
                                            : ''
                                        }`}
                                    disabled={!gameStarted || card.isMatched || gameOver}
                                >
                                    <div className="aspect-square relative">
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {card.isMatched && (
                                            <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">✓</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Footer Caller Section - Inside Container */}
                        <div className="bg-blue-900 text-white p-3 rounded-lg">
                            <div className="flex items-center">
                                <div className="w-2/3 pr-3">
                                    <p className="font-semibold uppercase text-sm mb-1 tracking-wider">
                                        MATCH THIS IMAGE ({currentImageIndex + 1}/3)
                                    </p>

                                    {/* Timer Arrow */}
                                    <div className="relative h-14 mb-1">
                                        <svg className="w-full h-full" viewBox="0 0 236 69">
                                            <path d="M6.478,53.998c-5.277,-0 -6.478,-2.611 -6.478,-7.888l-0,-24.969c-0,-3.692 2.651,-6.185 6.343,-6.281c67.111,-2.031 131.391,0.741 198.453,0.642l0,-7.89c0-6.375 1.925,-10.235 7.264,-2.669l21.29,25.47c2.32,2.897 2.205,6.303 -0.109,8.804l-22.326,26.708c-3.813,5.063 -6.119,3.791 -6.119,-2.547l0,-9.38c-65.442,2.037 -130.863,-1.55 -198.318,-0Z"
                                                fill="#fdc437"
                                            />
                                            <text x="36" y="42" className="text-blue-900 font-bold text-xs">
                                                {timer} seconds to match
                                            </text>
                                            <rect x="7.265" y="19.918" width="22.482" height="29.039" fill="#fbf0d8" />
                                            <text x="12" y="44" className="text-blue-900 font-bold text-xl text-center">
                                                {timer}
                                            </text>
                                        </svg>
                                    </div>


                                </div>

                                {/* Generated Image Box */}
                                <div className="w-1/3">
                                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg ring-2 ring-yellow-400 bg-yellow-300">
                                        {(gameStarted || gameOver) && currentCallerImage ? (
                                            <img
                                                src={currentCallerImage.image}
                                                alt={currentCallerImage.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-blue-900">
                                                <span>Image {currentImageIndex + 1}/3</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Controls and Status */}
                        {renderGameStatus()}

                        {/* Game Stats */}
                        {/* <div className="mt-4 bg-blue-900 bg-opacity-80 text-white p-3 rounded-lg">
                            <div className="flex justify-around">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-yellow-400">{userSelections.length}</div>
                                    <div className="text-xs">Selected</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-yellow-400">{currentImageIndex + 1}/3</div>
                                    <div className="text-xs">Current Image</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-yellow-400">
                                        {timer}
                                    </div>
                                    <div className="text-xs">Seconds Left</div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Instructions Modal */}
            <InstructionsModal
                isOpen={showInstructions}
                onClose={() => {
                    setShowInstructions(false)
                    startGame()
                }}
                onPlay={handlePlayFromInstructions}
                images={{ matchgameLogo, howToPlay, coronaLogoIntro }}
            />

            {/* Win Modal */}
            <WinModal
                isOpen={gameWon && gameResult === 'win'}
                onClose={() => setGameWon(false)}
                onPlayAgain={resetGame}
                userData={userData}
                images={{ coronaLogoIntro }}
            />
        </div>
    )
}

export default GameBoard