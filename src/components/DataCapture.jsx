import React, { useState, useEffect, useRef } from 'react'
import frame from '../assets/frame.png'
import stuckoBg from '../assets/stucco_bg-992.png'
import top from '../assets/top-sm-logo.png'
import frameBottom from '../assets/frame-bottom.png'

const DataCapture = ({ onNext }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        agreedToRules: false
    })

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        state: '',
        agreedToRules: ''
    })

    const [touched, setTouched] = useState({
        name: false,
        email: false,
        phone: false,
        state: false,
        agreedToRules: false
    })

    const [isButtonDisabled, setIsButtonDisabled] = useState(true)

    // Refs for input fields
    const nameInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const phoneInputRef = useRef(null)
    const stateInputRef = useRef(null)
    const checkboxRef = useRef(null)

    // States list
    const states = [
        { value: '', label: 'Select A State' },
        { value: 'california', label: 'California' },
        { value: 'nevada', label: 'Nevada' },
        { value: 'newyork', label: 'New York' },
        { value: 'texas', label: 'Texas' },
        { value: 'florida', label: 'Florida' },
        { value: 'illinois', label: 'Illinois' }
    ]

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked
        setFormData(prev => ({ ...prev, agreedToRules: isChecked }))

        if (errors.agreedToRules) {
            setErrors(prev => ({ ...prev, agreedToRules: '' }))
        }
    }

    // Mark field as touched
    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field, formData[field])
    }

    // Validate individual field
    const validateField = (field, value) => {
        let error = ''

        switch (field) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name is required'
                } else if (value.length < 2) {
                    error = 'Name must be at least 2 characters'
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'Name can only contain letters and spaces'
                }
                break

            case 'email':
                if (!value.trim()) {
                    error = 'Email is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address'
                }
                break

            case 'phone':
                if (!value.trim()) {
                    error = 'Phone number is required'
                } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
                    error = 'Please enter a valid 10-digit phone number'
                }
                break

            case 'state':
                if (!value) {
                    error = 'Please select your state'
                }
                break

            case 'agreedToRules':
                if (!value) {
                    error = 'You must agree to the rules to continue'
                }
                break
        }

        setErrors(prev => ({ ...prev, [field]: error }))
        return !error
    }

    // Format phone number as user types
    const handlePhoneChange = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, '')

        // Format: (123) 456-7890
        let formatted = digits
        if (digits.length > 3 && digits.length <= 6) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`
        } else if (digits.length > 6) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
        }

        handleInputChange('phone', formatted)
    }

    // Auto-focus next field
    const handleKeyDown = (field, e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            switch (field) {
                case 'name':
                    emailInputRef.current?.focus()
                    break
                case 'email':
                    phoneInputRef.current?.focus()
                    break
                case 'phone':
                    stateInputRef.current?.focus()
                    break
                case 'state':
                    checkboxRef.current?.focus()
                    break
            }
        }
    }

    // Validate all fields
    const validateForm = () => {
        const newErrors = {}
        let isValid = true

        Object.keys(formData).forEach(field => {
            const fieldIsValid = validateField(field, formData[field])
            if (!fieldIsValid) {
                isValid = false
            }
        })

        return isValid
    }

    // Check if form can be submitted
    useEffect(() => {
        const allFieldsFilled = formData.name &&
            formData.email &&
            formData.phone &&
            formData.state &&
            formData.agreedToRules

        if (allFieldsFilled) {
            const formIsValid = validateForm()
            setIsButtonDisabled(!formIsValid)
        } else {
            setIsButtonDisabled(true)
        }
    }, [formData])

    const handleSubmit = (e) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            phone: true,
            state: true,
            agreedToRules: true
        })

        // Validate all fields
        const isValid = validateForm()

        if (isValid) {
            // If valid, proceed to next step
            onNext()
        }
    }

    // Get border color class based on validation
    const getBorderColorClass = (fieldName) => {
        if (touched[fieldName] && errors[fieldName]) {
            return 'border-red-500'
        }
        return 'border-black'
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Main Card Container */}
            <div className="w-full max-w-md relative z-10">
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
                    <div className="pt-12 pb-6 px-6 relative z-10">
                        {/* Logo at Top Inside Frame */}
                        <div className="mb-4 -mt-6">
                            <div className="flex justify-center">
                                <img
                                    src={top}
                                    alt="Jurana Beer Logo"
                                    className="w-48 h-auto"
                                />
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="mb-6 mx-2">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={nameInputRef}
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            onBlur={() => handleBlur('name')}
                                            onKeyDown={(e) => handleKeyDown('name', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('name')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="Name"
                                            tabIndex="1"
                                            autoFocus
                                        />
                                        <label
                                            htmlFor="name"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            Name*
                                        </label>
                                    </div>
                                    {touched.name && errors.name && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={emailInputRef}
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            onKeyDown={(e) => handleKeyDown('email', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('email')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="Email"
                                            tabIndex="2"
                                        />
                                        <label
                                            htmlFor="email"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            Email*
                                        </label>
                                    </div>
                                    {touched.email && errors.email && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={phoneInputRef}
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                            onBlur={() => handleBlur('phone')}
                                            onKeyDown={(e) => handleKeyDown('phone', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('phone')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="Phone Number"
                                            tabIndex="3"
                                        />
                                        <label
                                            htmlFor="phone"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            Phone Number*
                                        </label>
                                    </div>
                                    {touched.phone && errors.phone && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* State Dropdown */}
                                <div>
                                    <div className="relative">
                                        <select
                                            ref={stateInputRef}
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => handleInputChange('state', e.target.value)}
                                            onBlur={() => handleBlur('state')}
                                            onKeyDown={(e) => handleKeyDown('state', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('state')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 appearance-none cursor-pointer peer`}
                                            tabIndex="4"
                                        >
                                            {states.map((state) => (
                                                <option key={state.value} value={state.value}>
                                                    {state.label}
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="state"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] transition-all"
                                        >
                                            State*
                                        </label>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    {touched.state && errors.state && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>
                                    )}
                                </div>

                                {/* Checkbox for Rules Agreement */}
                                <div className="pt-2">
                                    <div className="flex items-start">
                                        <input
                                            ref={checkboxRef}
                                            type="checkbox"
                                            id="agreedToRules"
                                            checked={formData.agreedToRules}
                                            onChange={handleCheckboxChange}
                                            onBlur={() => handleBlur('agreedToRules')}
                                            onKeyDown={(e) => handleKeyDown('agreedToRules', e)}
                                            className={`mt-1 mr-3 ${getBorderColorClass('agreedToRules')} rounded focus:ring-[#FDB715] focus:ring-2 cursor-pointer`}
                                            tabIndex="5"
                                        />
                                        <label
                                            htmlFor="agreedToRules"
                                            className="text-[#0c2042] text-xs cursor-pointer"
                                        >
                                            I have read and agree to the official rules
                                        </label>
                                    </div>
                                    {touched.agreedToRules && errors.agreedToRules && (
                                        <p className="text-red-500 text-xs mt-1 ml-7">{errors.agreedToRules}</p>
                                    )}
                                </div>

                                {/* Continue Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isButtonDisabled}
                                        className={`w-full relative group ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`absolute -inset-1 bg-gradient-to-r from-[#ffcc00] via-[#ff9900] to-[#ffcc00] rounded-lg blur opacity-75 ${!isButtonDisabled && 'group-hover:opacity-100'} transition duration-300`}></div>
                                        <div className={`relative bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-bold text-sm px-6 py-2 rounded-lg uppercase tracking-wider ${!isButtonDisabled && 'hover:scale-105'} transition-transform shadow-lg border-2 border-[#0f2951] w-full`}>
                                            CONTINUE
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Footer Text - Legal */}
                        <div className="text-center text-[#0c2042] text-[6px] px-2">
                            <p className="leading-relaxed">
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

export default DataCapture;