'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import LanguageSelector from './LanguageSelector'
import AuthButtons from './AuthButtons'
import { RegisterModal } from './RegisterModal'
import { LoginModal } from './LoginModal'

type ModalType = 'register' | 'login' | null;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>(null)

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);


// hello world
console.log("hello world")
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-300">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Revenge Group Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about-section')} className="font-mono hover:text-white transition-colors">
                ПРО ПІДРОЗДІЛ
              </button>
              <button onClick={() => scrollToSection('our-works')} className="font-mono hover:text-white transition-colors">
                НАША РОБОТА
              </button>
              <button onClick={() => scrollToSection('subscription')} className="font-mono hover:text-white transition-colors">
                ПІДТРИМКА
              </button>
              <LanguageSelector />
              <AuthButtons openModal={openModal}/>
            </nav>
            <Button 
              variant="outline"
              className="md:hidden relative z-[51]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-black fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center"
            >
              <nav className="flex flex-col items-center space-y-4">
                <Link href="/" className="flex items-center space-x-4 mb-8">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/logo.png"
                      alt="Revenge Group Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xl font-mono tracking-wider text-white">REVENGE GROUP</span>
                </Link>
                <button onClick={() => scrollToSection('about-section')} className="font-mono hover:text-white transition-colors">
                  ПРО ПІДРОЗДІЛ
                </button>
                <button onClick={() => scrollToSection('our-works')} className="font-mono hover:text-white transition-colors">
                  НАША РОБОТА
                </button>
                <button onClick={() => scrollToSection('subscription')} className="font-mono hover:text-white transition-colors">
                  ПІДТРИМКА
                </button>
                <LanguageSelector />
                <AuthButtons openModal={openModal}/>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-16">
        {children}
      </main>

      <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center mb-8">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="Revenge Group Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="font-mono text-sm text-gray-400 mb-4 text-center">БІЛЬШЕ ПРО НАС</p>
          <div className="flex justify-center items-center space-x-6">
            <a href="https://t.me/revengegroup" target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-white transition-colors">
              TELEGRAM
            </a>
            <a href="https://www.instagram.com/revengegroup" target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-white transition-colors">
              INSTAGRAM
            </a>
          </div>
          <div className="mt-8 text-center">
            <p className="font-mono text-xs">
              &copy; 2024 REVENGE GROUP // УСІ ПРАВА ЗАХИЩЕНІ
            </p>
          </div>
        </div>
      </footer>
      <RegisterModal 
        isOpen={modalType === 'register'}
        onOpenChange={(open) => open ? openModal('register') : closeModal()}
      />
      <LoginModal 
        isOpen={modalType === 'login'}
        onOpenChange={(open) => open ? openModal('login') : closeModal()}
      />
    </div>
  )
}