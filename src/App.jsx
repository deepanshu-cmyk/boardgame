import { useState } from 'react'
import HomePage from './components/HomePage'
import AgeGate from './components/AgeGate'
import DataCapture from './components/DataCapture'
import GameBoard from './components/GameBoard'

function App() {
  const [currentStep, setCurrentStep] = useState('home')
  const [userData, setUserData] = useState(null)

  const steps = {
    'home': <HomePage onNext={() => setCurrentStep('age')} />,
    'age': <AgeGate onNext={() => setCurrentStep('data')} />,
    'data': <DataCapture
      onNext={(data) => {
        setUserData(data)
        setCurrentStep('game')
      }}
    />,
    'game': <GameBoard userData={userData} />
  }

  return (
    <div className="fixed inset-0 bg-[#030f23] overflow-hidden">
      <div className="h-full flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-sm md:max-w-md">
          {steps[currentStep]}
        </div>
      </div>
    </div>
  )
}

export default App