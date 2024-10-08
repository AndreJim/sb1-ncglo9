import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr')}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  )
}

export default LanguageSelector