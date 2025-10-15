'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useLanguage, type Locale } from '@/providers/Language'
import { Globe } from 'lucide-react'

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { locale, setLocale } = useLanguage()

  useEffect(() => {
    // Show language selector on first visit
    const hasSelectedLanguage = localStorage.getItem('locale')
    if (!hasSelectedLanguage) {
      setIsOpen(true)
    }
  }, [])

  const handleLanguageSelect = (selectedLocale: Locale) => {
    setLocale(selectedLocale)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating language button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:bg-blue-500 dark:hover:bg-blue-600"
        aria-label="Change language"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium">{locale === 'en' ? 'EN' : '中文'}</span>
      </button>

      {/* Language selection dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {locale === 'en' ? 'Select Language' : '选择语言'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <Button
              onClick={() => handleLanguageSelect('en')}
              variant={locale === 'en' ? 'default' : 'outline'}
              size="lg"
              className="h-16 text-lg"
            >
              <Globe className="mr-3 h-6 w-6" />
              English
            </Button>
            <Button
              onClick={() => handleLanguageSelect('zh')}
              variant={locale === 'zh' ? 'default' : 'outline'}
              size="lg"
              className="h-16 text-lg"
            >
              <Globe className="mr-3 h-6 w-6" />
              中文 (Chinese)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
