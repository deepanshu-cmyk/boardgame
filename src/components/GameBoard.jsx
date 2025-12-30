import { useState, useEffect, useRef } from 'react'
import InstructionsModal from './InstructionsModal'
import LooseModal from './LooseModal'
import WinModal from './WinModal'
import ReadySetGo from './ReadySetGo'

// Import background images
import stuccoBg576 from '../assets/stucco_bg-992.png'
import coronaLogoIntro from '../assets/TULLAMORE_DEW_BRAND_GUIDELINES_LOGO_VERTICAL_COPPER_GREEN.png'

// Import logo
import coronaLogo from '../assets/C_logo-360.png'

// Import card images
import P1 from '../assets/TripleCaskCopy.png'
import P2 from '../assets/TripleDistilledCopy.png'
import P3 from '../assets/TripleBlendedCopy.png'
import P4 from '../assets/P4-240.png'
import P5 from '../assets/P5-240.png'
import P6 from '../assets/P6-240.png'
import P7 from '../assets/P7-240.png'

// Import modal images
import matchgameLogo from '../assets/matchgame-logo.png'
import howToPlay from '../assets/how-to-play.svg'

const GameBoard = ({ userData }) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [showInstructions, setShowInstructions] = useState(true)
    const [gameWon, setGameWon] = useState(false)
    const [currentCallerImage, setCurrentCallerImage] = useState(null)
    const [generatedImages, setGeneratedImages] = useState([])
    const [userSelections, setUserSelections] = useState([])
    const [showReadySetGo, setShowReadySetGo] = useState(false)
    const [boardCards, setBoardCards] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [gameResult, setGameResult] = useState('')
    const [flippedCards, setFlippedCards] = useState([]) // Track flipped cards by position

    // Card types with imported images - only P1, P2, P3
    const cardTypes = [
        { id: 'p1', name: 'Corona Extra', image: P1 },
        { id: 'p2', name: 'Corona Familiar', image: P2 },
        { id: 'p3', name: 'Corona Premier', image: P3 }
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
        console.log("GameBoard: Initializing board...")

        // Create board with 3 each of P1, P2, P3 randomly placed
        const cards = []
        const cardCounts = { p1: 0, p2: 0, p3: 0 }
        const maxPerType = 3

        for (let i = 0; i < 9; i++) {
            let randomCard
            let attempts = 0
            do {
                randomCard = cardTypes[Math.floor(Math.random() * cardTypes.length)]
                attempts++
                // Prevent infinite loop, but allow up to maxPerType of each
            } while (cardCounts[randomCard.id] >= maxPerType && attempts < 50)

            cardCounts[randomCard.id]++

            cards.push({
                ...randomCard,
                position: i,
                isSelected: false,
                isMatched: false,
                row: Math.floor(i / 3),
                col: i % 3,
                isFlipped: false
            })
        }

        setBoardCards(cards)
        setFlippedCards([])

        // Reset everything
        setUserSelections([])
        setCurrentCallerImage(null)
        setGeneratedImages([])
        setGameOver(false)
        setGameResult('')
        setGameWon(false)
    }

    useEffect(() => {
        initializeBoard()
    }, [])

    // Handle card flip
    const handleCardFlip = (position) => {
        if (!gameStarted || gameOver || userSelections.length >= 3) return

        // Check if card is already flipped
        if (flippedCards.includes(position)) {
            return
        }

        // Flip the card
        setFlippedCards(prev => [...prev, position])

        // Update board card flip state
        setBoardCards(prevCards => prevCards.map(card =>
            card.position === position ? { ...card, isFlipped: true } : card
        ))
    }

    const handleCardClick = (card) => {
        if (!gameStarted || gameOver) return

        // First, flip the card if it's not already flipped
        if (!flippedCards.includes(card.position)) {
            handleCardFlip(card.position)
        }

        // Check if card is already selected
        if (userSelections.some(sel => sel.position === card.position)) {
            console.log("GameBoard: Card already selected")
            return
        }

        console.log("GameBoard: Card selected:", card.name)

        // Mark card as selected
        const selection = { ...card, isSelected: true }
        const updatedSelections = [...userSelections, selection]

        // Update board cards
        setBoardCards(prevCards => prevCards.map(c =>
            c.position === card.position
                ? { ...c, isSelected: true }
                : c
        ))
        setUserSelections(updatedSelections)

        // If we have 3 selections, check win/lose conditions
        if (updatedSelections.length === 3) {
            checkWinLoseConditions(updatedSelections)
            return
        }
    }

    const checkWinLoseConditions = (selections) => {
        console.log("GameBoard: Checking win/lose conditions")
        console.log("GameBoard: Selections:", selections.map(s => s.name))

        // Get selected card IDs in order
        const selectedIds = selections.map(c => c.id)
        console.log("Selected IDs in order:", selectedIds)

        // Win condition: P1, P2, P3 in sequence
        if (selectedIds[0] === 'p1' && selectedIds[1] === 'p2' && selectedIds[2] === 'p3') {
            endGame('win', 'Perfect sequence: P1, P2, P3!')
            return
        }

        // Lose condition: 2 cards same, 1 different
        const idCounts = {}
        selectedIds.forEach(id => {
            idCounts[id] = (idCounts[id] || 0) + 1
        })
        const counts = Object.values(idCounts)
        const hasTwoSame = counts.includes(2)
        const hasOneDifferent = counts.length === 2

        if (hasTwoSame && hasOneDifferent) {
            endGame('loss', 'Two cards same, one different - you lose!')
            return
        }

        // If neither win nor lose condition met, maybe continue or default to loss
        // For now, let's default to loss if all card are same condition
        endGame('loss', 'All Cards have Unique!')
    }

    const endGame = (result, reason) => {
        console.log("Game ended:", result, "- Reason:", reason)
        console.log("User selections:", userSelections)
        console.log("Generated images:", generatedImages)

        // Add 2 second delay before showing modal
        setTimeout(() => {
            setGameResult(result)
            setGameOver(true)
            setGameStarted(false)

            if (result === 'win') {
                setGameWon(true)
            }
        }, 2000)
    }

    const startGame = () => {
        console.log("GameBoard: Starting game")

        // Reset selections and flipped cards
        setUserSelections([])
        setFlippedCards([])
        setGeneratedImages([])

        // Reset board cards selection state
        setBoardCards(prev => prev.map(card => ({
            ...card,
            isSelected: false,
            isMatched: false,
            isFlipped: false
        })))

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

    // CSS styles for flip animation
    const flipCardStyles = `
        .flip-card {
            perspective: 1000px;
            width: 100%;
            height: 100%;
        }
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
        }
        
        .flip-card.flipped .flip-card-inner {
            transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        
        .flip-card-front {
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .flip-card-back {
            transform: rotateY(180deg);
        }
        
        .flip-card-back img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    `

    return (
        <>
            <style>{flipCardStyles}</style>
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
                                {boardCards.map((card) => (
                                    <button
                                        key={`card-${card.position}`}
                                        onClick={() => handleCardClick(card)}
                                        className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${flippedCards.includes(card.position) ? 'flipped' : ''} flip-card`}
                                        disabled={!gameStarted || card.isSelected || gameOver || userSelections.length >= 3}
                                    >
                                        <div className="flip-card-inner aspect-square">
                                            {/* Front of card - Corona Logo */}
                                            <div className="flip-card-front bg-transparent">
                                                <div className="w-full h-full flex items-center justify-center p-2">
                                                    <img
                                                        src={coronaLogoIntro}
                                                        alt="Corona Logo"
                                                        className="w-full h-full object-contain opacity-90"
                                                    />
                                                </div>
                                            </div>

                                            {/* Back of card - Actual Card Image */}
                                            <div className="flip-card-back ">
                                                <div className="w-full h-full flex items-center justify-center p-2 relative bg-black">
                                                    {/* <img
                                                        src={coronaLogoIntro}
                                                        alt="Corona Logo Background"
                                                        className="w-full h-full object-contain opacity-50 absolute inset-0"
                                                    /> */}
                                                    <img
                                                        src={card.image}
                                                        alt={card.name}
                                                        className="w-full h-full object-cover relative z-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Selection Counter */}
                            <div className="mt-4 text-center text-[#0f2951] font-semibold">
                                <p className="text-sm">Flipped: {userSelections.length}/3</p>
                                {userSelections.length === 3 && !gameOver && (
                                    <p className="text-[#0f2951] text-sm mt-1">Checking your selections...</p>
                                )}
                            </div>
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

                {/* Lose Modal */}
                <LooseModal
                    isOpen={gameOver && gameResult === 'loss'}
                    onClose={() => setGameOver(false)}
                />
            </div>
        </>
    )
}

export default GameBoard;