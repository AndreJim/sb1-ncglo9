import React, { useState, useEffect, useCallback } from 'react'
import { Percent, Calculator, ArrowRight, RefreshCw } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type CalculationType = 'percentOfNumber' | 'numberIsWhatPercent' | 'percentChange'

const PercentageCalculator: React.FC = () => {
  const { t, language } = useLanguage()
  const [calculationType, setCalculationType] = useState<CalculationType>('percentOfNumber')
  const [number1, setNumber1] = useState<string>('')
  const [number2, setNumber2] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [chartData, setChartData] = useState<any>(null)

  const getChartData = useCallback((type: CalculationType, num1: number, num2: number) => {
    switch (type) {
      case 'percentOfNumber':
        const calculatedResult = (num1 / 100) * num2
        return {
          labels: [t('calculatedPart'), t('remaining')],
          datasets: [{
            data: [calculatedResult, num2 - calculatedResult],
            backgroundColor: ['#4CAF50', '#FFA000'],
          }]
        }
      case 'numberIsWhatPercent':
        return {
          labels: [t('part'), t('remaining')],
          datasets: [{
            data: [num1, num2 - num1],
            backgroundColor: ['#2196F3', '#FF5722'],
          }]
        }
      case 'percentChange':
        return {
          labels: [t('original'), t('change')],
          datasets: [{
            data: [num1, Math.abs(num2 - num1)],
            backgroundColor: ['#9C27B0', '#E91E63'],
          }]
        }
    }
  }, [t])

  const calculate = useCallback(() => {
    const num1 = parseFloat(number1)
    const num2 = parseFloat(number2)

    if (isNaN(num1) || isNaN(num2)) {
      setResult(t('enterValidNumbers'))
      setChartData(null)
      return
    }

    let calculatedResult: number

    switch (calculationType) {
      case 'percentOfNumber':
        calculatedResult = (num1 / 100) * num2
        setResult(t('resultPercentOfNumber').replace('{0}', num1.toString()).replace('{1}', num2.toString()).replace('{2}', calculatedResult.toFixed(2)))
        break
      case 'numberIsWhatPercent':
        calculatedResult = (num1 / num2) * 100
        setResult(t('resultNumberIsWhatPercent').replace('{0}', num1.toString()).replace('{1}', calculatedResult.toFixed(2)).replace('{2}', num2.toString()))
        break
      case 'percentChange':
        calculatedResult = ((num2 - num1) / num1) * 100
        setResult(t('resultPercentChange').replace('{0}', num1.toString()).replace('{1}', num2.toString()).replace('{2}', calculatedResult.toFixed(2)))
        break
    }

    setChartData(getChartData(calculationType, num1, num2))
  }, [calculationType, number1, number2, t, getChartData])

  const clearCalculator = () => {
    setNumber1('')
    setNumber2('')
    setResult('')
    setChartData(null)
  }

  const renderExample = () => {
    switch (calculationType) {
      case 'percentOfNumber':
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('examplePercentOfNumber')}
          </p>
        )
      case 'numberIsWhatPercent':
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('exampleNumberIsWhatPercent')}
          </p>
        )
      case 'percentChange':
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {t('examplePercentChange')}
          </p>
        )
    }
  }

  // Update chart when language changes
  useEffect(() => {
    if (chartData) {
      const num1 = parseFloat(number1)
      const num2 = parseFloat(number2)
      setChartData(getChartData(calculationType, num1, num2))
    }
  }, [language, getChartData, calculationType, number1, number2])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(var(--color-text-base))',
          font: {
            size: 14
          }
        },
      },
      tooltip: {
        bodyColor: 'rgb(var(--color-text-base))',
        backgroundColor: 'rgb(var(--color-bg-base))',
        titleColor: 'rgb(var(--color-text-base))',
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16
        }
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="calculationType" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
          {t('calculationType')}
        </label>
        <select
          id="calculationType"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={calculationType}
          onChange={(e) => setCalculationType(e.target.value as CalculationType)}
        >
          <option value="percentOfNumber">{t('percentOfNumber')}</option>
          <option value="numberIsWhatPercent">{t('numberIsWhatPercent')}</option>
          <option value="percentChange">{t('percentChange')}</option>
        </select>
        {renderExample()}
      </div>
      <div className="mb-4">
        <label htmlFor="number1" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
          {calculationType === 'percentOfNumber' ? t('percentage') : t('firstNumber')}
        </label>
        <input
          type="number"
          id="number1"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={number1}
          onChange={(e) => setNumber1(e.target.value)}
          placeholder={t('enterNumber')}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="number2" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
          {calculationType === 'percentOfNumber' ? t('number') : t('secondNumber')}
        </label>
        <input
          type="number"
          id="number2"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={number2}
          onChange={(e) => setNumber2(e.target.value)}
          placeholder={t('enterNumber')}
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={calculate}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Calculator className="mr-2" size={20} />
          {t('calculate')}
        </button>
        <button
          onClick={clearCalculator}
          className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <RefreshCw className="mr-2" size={20} />
          {t('clear')}
        </button>
      </div>
      {result && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{result}</p>
        </div>
      )}
      {chartData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{t('visualRepresentation')}</h3>
          <div className="w-full max-w-xs mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PercentageCalculator