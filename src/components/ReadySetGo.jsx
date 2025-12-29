// ReadySetGo.jsx
const ReadySetGo = () => {
    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl">
                <svg className="w-full" viewBox="0 0 198 88">
                    {/* Ready Text */}
                    <text x="20" y="40" className="text-red-600 font-bold text-4xl" fill="#b6252b">
                        READY
                    </text>
                    <text x="80" y="40" className="text-red-600 font-bold text-4xl" fill="#b6252b">
                        SET
                    </text>
                    <text x="130" y="40" className="text-red-600 font-bold text-4xl" fill="#b6252b">
                        GO
                    </text>
                </svg>
            </div>
        </div>
    )
}

export default ReadySetGo