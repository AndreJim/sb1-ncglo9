import React from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import PercentageCalculator from './components/PercentageCalculator'
import ThemeToggle from './components/ThemeToggle'
import LanguageSelector from './components/LanguageSelector'
import { useLanguage } from './contexts/LanguageContext'

function AppContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{t('appTitle')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{t('appSubtitle')}</p>
      </header>
      <div className="w-full max-w-2xl flex justify-end space-x-4 mb-4">
        <ThemeToggle />
        <LanguageSelector />
      </div>
      <main className="w-full max-w-2xl">
        <PercentageCalculator />
      </main>
      <footer className="mt-8 text-center text-gray-600 dark:text-gray-400">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App