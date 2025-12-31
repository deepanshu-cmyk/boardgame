import React, { useState, useEffect, useRef } from 'react'
import frame from '../assets/frame.png'
import stuckoBg from '../assets/stucco_bg-992.png'
import top from '../assets/top-sm-logo.png'
import frameBottom from '../assets/frame-bottom.png'

const UnlockRebate = ({ onNext }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zipCode: '',
        agreedToRules: false
    })

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zipCode: '',
        agreedToRules: ''
    })

    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        zipCode: false,
        agreedToRules: false
    })

    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Refs for input fields
    const firstNameInputRef = useRef(null)
    const lastNameInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const phoneInputRef = useRef(null)
    const zipCodeInputRef = useRef(null)
    const checkboxRef = useRef(null)

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
            case 'firstName':
                if (!value.trim()) {
                    error = 'First name is required'
                } else if (value.length < 2) {
                    error = 'First name must be at least 2 characters'
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'First name can only contain letters and spaces'
                }
                break

            case 'lastName':
                if (!value.trim()) {
                    error = 'Last name is required'
                } else if (value.length < 2) {
                    error = 'Last name must be at least 2 characters'
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'Last name can only contain letters and spaces'
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

            case 'zipCode':
                if (!value.trim()) {
                    error = 'Zip code is required'
                } else if (!/^\d{5}(-\d{4})?$/.test(value.trim())) {
                    error = 'Please enter a valid 5 or 9-digit zip code'
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

    // Format zip code (allow 5-digit or 9-digit format)
    const handleZipCodeChange = (value) => {
        // Remove all non-digits except hyphen
        const cleanValue = value.replace(/[^\d-]/g, '')

        // Format: 12345 or 12345-6789
        let formatted = cleanValue
        if (cleanValue.length > 5 && !cleanValue.includes('-')) {
            formatted = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 9)}`
        }

        handleInputChange('zipCode', formatted)
    }

    // Auto-focus next field
    const handleKeyDown = (field, e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            switch (field) {
                case 'firstName':
                    lastNameInputRef.current?.focus()
                    break
                case 'lastName':
                    emailInputRef.current?.focus()
                    break
                case 'email':
                    phoneInputRef.current?.focus()
                    break
                case 'phone':
                    zipCodeInputRef.current?.focus()
                    break
                case 'zipCode':
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
        const allFieldsFilled = formData.firstName &&
            formData.lastName &&
            formData.email &&
            formData.phone &&
            formData.zipCode &&
            formData.agreedToRules

        if (allFieldsFilled) {
            const formIsValid = validateForm()
            setIsButtonDisabled(!formIsValid)
        } else {
            setIsButtonDisabled(true)
        }
    }, [formData])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            zipCode: true,
            agreedToRules: true
        })

        // Validate all fields
        const isValid = validateForm()

        if (isValid) {
            setIsSubmitting(true)
            console.log('Form submitted with data:', formData)

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Show success message
            setSubmitSuccess(true)

            // Wait for 2 seconds to show success message, then redirect
            setTimeout(() => {
                // According to brief: "Direct to Text Rebates page" and "redirect them to third party rebate page"
                window.open("https://your-rebate-page.com", "_blank")

                // If you want to navigate to next page in the app instead of opening new tab
                // if (onNext) onNext()
            }, 2000)
        }
    }

    // Get border color class based on validation
    const getBorderColorClass = (fieldName) => {
        if (touched[fieldName] && errors[fieldName]) {
            return 'border-red-500'
        }
        return 'border-black'
    }

    // If form was successfully submitted, show success message
    if (submitSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
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
                        <div className="pt-12 pb-6 px-6 relative z-10 min-h-[400px] flex flex-col">
                            {/* Logo at Top Inside Frame */}
                            <div className="mb-4 -mt-6">
                                <div className="flex justify-center">
                                    <img
                                        src={top}
                                        alt="Tullamore D.E.W. Logo"
                                        className="w-48 sm:w-80 h-auto"
                                    />
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="flex-grow flex flex-col items-center justify-center text-center py-8">
                                <div className="mb-6">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-[#0c2042] mb-2">Success!</h2>
                                    <p className="text-[#0c2042]">
                                        Your information has been submitted successfully.
                                    </p>
                                    <p className="text-[#0c2042] mt-2">
                                        Redirecting you to the rebate page...
                                    </p>
                                </div>

                                {/* Loading Animation */}
                                <div className="mt-6">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0c2042] border-r-transparent"></div>
                                </div>
                            </div>

                            {/* Footer Text - Legal */}
                            <div className="text-center text-[#0c2042] text-[6px] px-2 mt-4">
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
                                    alt="Tullamore D.E.W. Logo"
                                    className="w-48 sm:w-80 h-auto"
                                />
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="mb-6 mx-2">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* First Name Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={firstNameInputRef}
                                            type="text"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            onBlur={() => handleBlur('firstName')}
                                            onKeyDown={(e) => handleKeyDown('firstName', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('firstName')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="First Name"
                                            tabIndex="1"
                                            autoFocus
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="firstName"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            First Name*
                                        </label>
                                    </div>
                                    {touched.firstName && errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={lastNameInputRef}
                                            type="text"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            onBlur={() => handleBlur('lastName')}
                                            onKeyDown={(e) => handleKeyDown('lastName', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('lastName')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="Last Name"
                                            tabIndex="2"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="lastName"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            Last Name*
                                        </label>
                                    </div>
                                    {touched.lastName && errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>
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
                                            tabIndex="3"
                                            disabled={isSubmitting}
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
                                            tabIndex="4"
                                            disabled={isSubmitting}
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

                                {/* Zip Code Input */}
                                <div>
                                    <div className="relative">
                                        <input
                                            ref={zipCodeInputRef}
                                            type="text"
                                            id="zipCode"
                                            value={formData.zipCode}
                                            onChange={(e) => handleZipCodeChange(e.target.value)}
                                            onBlur={() => handleBlur('zipCode')}
                                            onKeyDown={(e) => handleKeyDown('zipCode', e)}
                                            className={`w-full bg-white/90 border-2 ${getBorderColorClass('zipCode')} rounded px-3 py-2.5 text-sm text-[#0c2042] font-medium focus:outline-none focus:border-[#FDB715] transition-colors duration-200 peer placeholder-transparent`}
                                            placeholder="Zip Code"
                                            tabIndex="5"
                                            maxLength="10"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="zipCode"
                                            className="absolute left-3 -top-2.5 bg-white/90 px-1 text-xs font-bold text-[#0c2042] peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:font-normal transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#0c2042]"
                                        >
                                            Zip Code*
                                        </label>
                                    </div>
                                    {touched.zipCode && errors.zipCode && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.zipCode}</p>
                                    )}
                                </div>

                                {/* Checkbox for Rules Agreement */}
                                <div className="">
                                    <div className="flex items-start">
                                        <input
                                            ref={checkboxRef}
                                            type="checkbox"
                                            id="agreedToRules"
                                            checked={formData.agreedToRules}
                                            onChange={handleCheckboxChange}
                                            onBlur={() => handleBlur('agreedToRules')}
                                            onKeyDown={(e) => handleKeyDown('agreedToRules', e)}
                                            className={`mt-1 mr-3 ${getBorderColorClass('agreedToRules')} rounded focus:ring-[#FDB715] focus:ring-2 cursor-pointer ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                            tabIndex="6"
                                            disabled={isSubmitting}
                                        />
                                        <label
                                            htmlFor="agreedToRules"
                                            className={`text-[#0c2042] text-xs ${isSubmitting ? 'opacity-50' : 'cursor-pointer'}`}
                                        >
                                            I have read and agree to the official rules
                                        </label>
                                    </div>
                                    {touched.agreedToRules && errors.agreedToRules && (
                                        <p className="text-red-500 text-xs mt-1 ml-7">{errors.agreedToRules}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="">
                                    <button
                                        type="submit"
                                        disabled={isButtonDisabled || isSubmitting}
                                        className={`w-full relative group ${isButtonDisabled || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`absolute -inset-1 bg-gradient-to-r from-[#ffcc00] via-[#ff9900] to-[#ffcc00] rounded-lg blur opacity-75 ${!isButtonDisabled && !isSubmitting && 'group-hover:opacity-100'} transition duration-300`}></div>
                                        <div className={`relative bg-gradient-to-r from-[#ffcc00] to-[#ff9900] text-black font-bold text-sm px-6 py-2 rounded-lg uppercase tracking-wider ${!isButtonDisabled && !isSubmitting && 'hover:scale-105'} transition-transform shadow-lg border-2 border-[#0f2951] w-full flex items-center justify-center`}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className="inline-block h-4 w-4  mr-2"></div>
                                                    PROCESSING...
                                                </>
                                            ) : (
                                                'SUBMIT'
                                            )}
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

export default UnlockRebate