import React, { useState, useEffect, useRef } from 'react'
import { Calendar } from 'lucide-react'
import frame from '../assets/frame.png'
import stuckoBg from '../assets/stucco_bg-992.png'
import top from '../assets/top-sm-logo.png'
import frameBottom from '../assets/frame-bottom.png'

const AgeGate = ({ onNext }) => {
    const [dob, setDob] = useState({ month: '', day: '', year: '' })
    const [error, setError] = useState('')
    const [isValid, setIsValid] = useState({ month: true, day: true, year: true, age: true })
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
    const [shouldShowRedText, setShouldShowRedText] = useState(false)

    // Refs for input fields
    const monthInputRef = useRef(null)
    const dayInputRef = useRef(null)
    const yearInputRef = useRef(null)

    const handleDateChange = (field, value) => {
        // Only allow numbers
        if (value === '' || /^\d+$/.test(value)) {
            setDob(prev => ({ ...prev, [field]: value }))
            setError('')
            setHasAttemptedSubmit(false)
            setShouldShowRedText(false)

            // Auto-focus logic
            if (field === 'month' && value.length === 2) {
                dayInputRef.current?.focus()
            } else if (field === 'day' && value.length === 2) {
                yearInputRef.current?.focus()
            }
        }
    }

    // Handle backspace/delete to move focus back
    const handleKeyDown = (field, e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if (field === 'day' && dob.day === '') {
                monthInputRef.current?.focus()
                monthInputRef.current?.select()
            } else if (field === 'year' && dob.year === '') {
                dayInputRef.current?.focus()
                dayInputRef.current?.select()
            }
        }
    }

    // Validate inputs as user types
    useEffect(() => {
        const { month, day, year } = dob

        // Only validate if at least one field has value
        if (month || day || year) {
            let isMonthValid = true
            let isDayValid = true
            let isYearValid = true
            let isAgeValid = true

            if (month) {
                const monthNum = parseInt(month)
                isMonthValid = monthNum >= 1 && monthNum <= 12
            }

            if (day) {
                const dayNum = parseInt(day)
                isDayValid = dayNum >= 1 && dayNum <= 31
            }

            if (year) {
                const yearNum = parseInt(year)
                const currentYear = new Date().getFullYear()
                isYearValid = yearNum >= currentYear - 100 && yearNum <= currentYear
            }

            // Only check age if ALL fields are filled AND valid
            if (month && day && year && isMonthValid && isDayValid && isYearValid) {
                const monthNum = parseInt(month)
                const dayNum = parseInt(day)
                const yearNum = parseInt(year)

                const birthDate = new Date(yearNum, monthNum - 1, dayNum)
                // Check if date is valid (handles cases like Feb 30)
                const isDateValid = birthDate.getDate() === dayNum &&
                    birthDate.getMonth() === monthNum - 1 &&
                    birthDate.getFullYear() === yearNum

                if (isDateValid) {
                    const today = new Date()
                    let age = today.getFullYear() - birthDate.getFullYear()
                    const monthDiff = today.getMonth() - birthDate.getMonth()

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--
                    }

                    isAgeValid = age >= 21
                } else {
                    isAgeValid = false
                    if (hasAttemptedSubmit) {
                        setError('Please enter a valid date')
                    }
                }
            }

            setIsValid({
                month: isMonthValid,
                day: isDayValid,
                year: isYearValid,
                age: isAgeValid
            })

            // Enable button only if all fields are filled, valid, and age is 21+
            const allFieldsFilled = month && day && year
            const allFieldsValid = isMonthValid && isDayValid && isYearValid
            setIsButtonDisabled(!(allFieldsFilled && allFieldsValid && isAgeValid))

            // Show red text if any field is invalid and has value
            if ((month && !isMonthValid) || (day && !isDayValid) || (year && !isYearValid) || !isAgeValid) {
                setShouldShowRedText(true)
            } else {
                setShouldShowRedText(false)
            }
        } else {
            setIsButtonDisabled(true)
            setShouldShowRedText(false)
        }
    }, [dob, hasAttemptedSubmit])

    const checkAge = () => {
        setHasAttemptedSubmit(true)
        const { day, month, year } = dob

        if (!day || !month || !year) {
            setError('Please select your full date of birth')
            setIsValid({ month: false, day: false, year: false, age: false })
            setShouldShowRedText(true)
            return
        }

        const monthNum = parseInt(month)
        const dayNum = parseInt(day)
        const yearNum = parseInt(year)

        // Validate month
        if (monthNum < 1 || monthNum > 12) {
            setError('Please enter a valid month (1-12)')
            setIsValid(prev => ({ ...prev, month: false }))
            setShouldShowRedText(true)
            return
        }

        // Validate day
        if (dayNum < 1 || dayNum > 31) {
            setError('Please enter a valid day (1-31)')
            setIsValid(prev => ({ ...prev, day: false }))
            setShouldShowRedText(true)
            return
        }

        // Validate year
        const currentYear = new Date().getFullYear()
        if (yearNum < currentYear - 100 || yearNum > currentYear) {
            setError('Please enter a valid year')
            setIsValid(prev => ({ ...prev, year: false }))
            setShouldShowRedText(true)
            return
        }

        // Check if date is valid (e.g., not Feb 30)
        const birthDate = new Date(yearNum, monthNum - 1, dayNum)
        const isDateValid = birthDate.getDate() === dayNum &&
            birthDate.getMonth() === monthNum - 1 &&
            birthDate.getFullYear() === yearNum

        if (!isDateValid) {
            setError('Please enter a valid date')
            setIsValid({ month: false, day: false, year: false, age: false })
            setShouldShowRedText(true)
            return
        }

        // Check age
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        if (age >= 21) {
            onNext()
        } else {
            setError('You must be 21 years of age or older to access this experience.')
            setIsValid(prev => ({ ...prev, age: false }))
            setShouldShowRedText(true)
        }
    }

    // Get border color class based on validation
    const getBorderColorClass = (fieldName) => {
        if (!dob[fieldName]) return 'border-[#FDB715]' // Default yellow for empty
        if (!isValid[fieldName]) return 'border-red-500' // Red for invalid
        return isValid.age ? 'border-[#FDB715]' : 'border-red-500' // Yellow if valid, red if underage
    }

    // Get text color class based on validation
    const getTextColorClass = () => {
        if (shouldShowRedText && (!isValid.month || !isValid.day || !isValid.year || !isValid.age)) {
            return 'text-red-500'
        }
        return 'text-[#0c2042]'
    }

    // Get specific field text color
    const getFieldTextColor = (fieldName) => {
        if (shouldShowRedText && dob[fieldName] && !isValid[fieldName]) {
            return 'text-red-500'
        }
        if (shouldShowRedText && !isValid.age) {
            return 'text-red-500'
        }
        return 'text-[#0c2042]'
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden ">
            {/* Main Card Container */}
            <div className="w-full max-w-xl relative z-10">
                <div
                    className="relative rounded-lg overflow-hidden shadow-2xl"
                    style={{
                        backgroundImage: `url(${stuckoBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Top Decorative Frame */}
                    <div className="absolute top-0 left-0 right-0">
                        <img
                            src={frame}
                            alt="decorative frame"
                            className="w-full h-auto"
                        />
                    </div>
                    {/* Bottom Decorative Frame */}
                    <div className="absolute bottom-0 left-0 right-0 z-20">
                        <img
                            src={frameBottom}
                            alt="decorative frame bottom"
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="pt-16 pb-8 px-8 relative z-10">
                        {/* Logo at Top Inside Frame */}
                        <div className="mb-6 -mt-8">
                            <div className="flex justify-center">
                                <img
                                    src={top}
                                    alt="Jurana Beer Logo"
                                    className="w-66 h-auto"
                                />
                            </div>
                        </div>

                        {/* Age Verification Message */}
                        <div className="text-center mb-8">
                            <p className="text-[#0c2042] text-[10px] sm:text-[16px]  font-bold mb-4">
                                YOU MUST BE OF LEGAL DRINKING AGE TO ENTER THIS SITE.
                            </p>
                        </div>

                        {/* Date of Birth Input Section */}
                        <div className="mb-4 sm:mb-10">
                            <div className="flex flex-col items-center mb-6">
                                {/* MM DD YYYY Label */}
                                {/* <div className="text-center mb-4">
                                    <label className={`${getTextColorClass()} text-lg font-bold flex items-center justify-center transition-colors duration-200`}>
                                        <Calendar className="w-5 h-5 mr-2" />
                                        MM DD YYYY
                                    </label>
                                </div> */}

                                {/* Input Fields Container */}
                                <div className="flex justify-center space-x-2 mb-2 px-8">
                                    {/* Month Input */}
                                    <div className="text-center">
                                        <input
                                            ref={monthInputRef}
                                            value={dob.month}
                                            onChange={(e) => handleDateChange('month', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown('month', e)}
                                            className={`w-10 sm:w-20 bg-transparent border-b-3 ${getBorderColorClass('month')} text-center text-md sm:text-3xl font-bold ${getTextColorClass()} placeholder-[#0c2042]/50 focus:outline-none  transition-colors duration-200`}
                                            type="text"
                                            id="dob_month"
                                            maxLength="2"
                                            minLength="1"
                                            pattern="[0-9]*"
                                            placeholder="MM"
                                            tabIndex="1"
                                            autoFocus
                                        />
                                        <div className={`mt-2 ${getFieldTextColor('month')} text-[10px] sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200`}>
                                            month
                                        </div>
                                    </div>

                                    {/* Day Input */}
                                    <div className="text-center">
                                        <input
                                            ref={dayInputRef}
                                            value={dob.day}
                                            onChange={(e) => handleDateChange('day', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown('day', e)}
                                            className={`w-10 sm:w-20 bg-transparent border-b-3 ${getBorderColorClass('day')} text-center text-md sm:text-3xl font-bold ${getTextColorClass()} placeholder-[#0c2042]/50 focus:outline-none  transition-colors duration-200`}
                                            type="text"
                                            id="dob_day"
                                            maxLength="2"
                                            minLength="1"
                                            pattern="[0-9]*"
                                            placeholder="DD"
                                            tabIndex="2"
                                        />
                                        <div className={`mt-2 ${getFieldTextColor('day')} text-[10px] sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200`}>
                                            day
                                        </div>
                                    </div>

                                    {/* Year Input */}
                                    <div className="text-center">
                                        <input
                                            ref={yearInputRef}
                                            value={dob.year}
                                            onChange={(e) => handleDateChange('year', e.target.value)}
                                            onKeyDown={(e) => handleKeyDown('year', e)}
                                            className={`w-10 sm:w-24 bg-transparent border-b-3 ${getBorderColorClass('year')} text-center text-md sm:text-3xl font-bold ${getTextColorClass()} placeholder-[#0c2042]/50 focus:outline-none  transition-colors duration-200`}
                                            type="text"
                                            id="dob_year"
                                            maxLength="4"
                                            minLength="4"
                                            pattern="[0-9]*"
                                            placeholder="YYYY"
                                            tabIndex="3"
                                        />
                                        <div className={`mt-2 ${getFieldTextColor('year')} text-[10px] sm:text-sm font-bold uppercase tracking-wider transition-colors duration-200`}>
                                            year
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-center mb-4 animate-pulse">
                                    <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-lg py-2 px-4 inline-block">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Continue Button */}
                            <div className="text-center">
                                <button
                                    onClick={checkAge}
                                    disabled={isButtonDisabled}
                                    className={`relative group inline-block ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <div className={`absolute -inset-1 bg-gradient-to-r from-[#ffcc00] via-[#ff9900] to-[#ffcc00] rounded-lg blur opacity-75 ${!isButtonDisabled && 'group-hover:opacity-100'} transition duration-300`}></div>
                                    <div className={`relative bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-bold text-[10px] sm:text-lg sm:px-10 px-4 py-2 rounded-lg uppercase tracking-wider ${!isButtonDisabled && 'hover:scale-105'} transition-transform shadow-lg border-2 border-[#0f2951]`}>
                                        CONTINUE
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Footer Text - Legal */}
                        <div className="text-center text-[#0c2042] text-[4px] sm:text-[7px]  space-y-3 px-4">
                            <p className="leading-relaxed">
                                Intended for legal drinking age consumers only. This site uses cookies.
                                <br />
                                I agree to the
                                <span className="underline cursor-pointer hover:text-[#2a5d5d] mx-1">terms of use</span>, and the
                                <span className="underline cursor-pointer hover:text-[#2a5d5d] mx-1">privacy policy</span>.
                                <span className="underline cursor-pointer hover:text-[#2a5d5d] mx-1">View Official Rules</span>
                            </p>
                            <p className="text-[4px] sm:text-[7px] leading-relaxed cursor-pointer">
                                This promotion is an example of past client work for demonstration purposes only.
                                It is not active, as entry is possible, and no prices will be awarded.
                                All brand names, logos, and trademarks are used with permission and remain the property of their respective owners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgeGate