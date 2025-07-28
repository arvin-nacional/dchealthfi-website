'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
type Props = {
  className?: string
  targetNumber?: number
}

const NumberComparisonBlock: React.FC<Props> = ({ className, targetNumber = 50 }) => {
  const [inputNumber, setInputNumber] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [showResult, setShowResult] = useState<boolean>(false)

  const compareNumbers = () => {
    const num = parseFloat(inputNumber)
    
    if (isNaN(num)) {
      setResult('Please enter a valid number')
      setShowResult(true)
      return
    }

    if (num > targetNumber) {
      setResult(`${num} is higher than ${targetNumber}`)
    } else if (num < targetNumber) {
      setResult(`${num} is lower than ${targetNumber}`)
    } else {
      setResult(`${num} is equal to ${targetNumber}`)
    }
    
    setShowResult(true)
  }

  const resetComparison = () => {
    setInputNumber('')
    setResult('')
    setShowResult(false)
  }

  return (
    <div className={className}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Number Comparison</CardTitle>
          <CardDescription>
            Enter a number to compare it with {targetNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="number-input">Your Number</Label>
            <Input
              id="number-input"
              type="number"
              placeholder="Enter a number..."
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && compareNumbers()}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={compareNumbers} 
              disabled={!inputNumber.trim()}
              className="flex-1"
            >
              Compare
            </Button>
            <Button 
              variant="outline" 
              onClick={resetComparison}
              disabled={!showResult}
            >
              Reset
            </Button>
          </div>

          {showResult && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
              <p className="text-center font-medium text-gray-900 dark:text-gray-100">
                {result}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default NumberComparisonBlock
