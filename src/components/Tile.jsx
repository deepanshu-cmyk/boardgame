import { FlaskConical, Layers, Blend } from 'lucide-react'

const Tile = ({ tile, isFlipped, onClick, isMatched }) => {
    const getTileContent = (type) => {
        switch (type) {
            case 'triple-cask':
                return {
                    title: 'Triple Cask',
                    icon: <Layers className="w-12 h-12 text-tullamore-gold mb-2" />,
                    description: 'Aged in three woods',
                    color: 'from-wood-brown to-amber-900'
                }
            case 'triple-distilled':
                return {
                    title: 'Triple Distilled',
                    icon: <FlaskConical className="w-12 h-12 text-tullamore-gold mb-2" />,
                    description: 'Exceptionally smooth',
                    color: 'from-amber-800 to-yellow-900'
                }
            case 'triple-blended':
                return {
                    title: 'Triple Blended',
                    icon: <Blend className="w-12 h-12 text-tullamore-gold mb-2" />,
                    description: 'Perfect harmony',
                    color: 'from-green-900 to-emerald-800'
                }
            default:
                return null
        }
    }

    const content = getTileContent(tile.type)

    return (
        <div
            className="flip-container h-32 md:h-40 cursor-pointer"
            onClick={() => !isFlipped && !isMatched && onClick()}
        >
            <div className={`flipper relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
                {/* Front of Tile - Hidden State */}
                <div className="flip-front tile-front">
                    <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-tullamore-gold mb-1">T.D.</div>
                        <div className="text-xs text-gray-300">Tullamore D.E.W.</div>
                        <div className="absolute bottom-2 text-xs text-gray-400">Tap to reveal</div>
                    </div>
                </div>

                {/* Back of Tile - Revealed State */}
                <div className={`flip-back tile-back bg-gradient-to-br ${content.color}`}>
                    <div className="text-center p-2">
                        {content.icon}
                        <h3 className="font-bold text-lg md:text-xl text-white mb-1">
                            {content.title}
                        </h3>
                        <p className="text-xs text-gray-200">{content.description}</p>
                        {isMatched && (
                            <div className="absolute top-1 right-1 bg-tullamore-gold text-tullamore-dark text-xs px-2 py-1 rounded-full">
                                ✓
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tile