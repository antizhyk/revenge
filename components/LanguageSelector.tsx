'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectLanguage = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    // Here you would typically update the app's language state or trigger a page reload
    console.log(`Змінено мову на ${language.name}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 font-mono text-white hover:text-gray-300 transition-colors"
      >
        <span>{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-800 rounded-md shadow-xl z-20">
          {languages.map((language) => (
            <button
              key={language.code}
              className="block px-4 py-2 text-sm font-mono text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
              onClick={() => selectLanguage(language)}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

