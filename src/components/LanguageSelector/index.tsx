'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguage, type Locale } from '@/providers/Language'
import { Globe, ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage()

  const handleLanguageSelect = (selectedLocale: Locale) => {
    setLocale(selectedLocale)
    // Refresh the page to update server-side content
    window.location.reload()
  }

  const currentLanguageLabel = locale === 'en' ? 'EN' : '中文'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:text-white hover:bg-white/10 flex items-center gap-2 px-3 py-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguageLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => handleLanguageSelect('en')}
          className={cn('flex items-center gap-2 cursor-pointer', locale === 'en' && 'bg-accent')}
        >
          <Globe className="h-4 w-4" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageSelect('zh')}
          className={cn('flex items-center gap-2 cursor-pointer', locale === 'zh' && 'bg-accent')}
        >
          <Globe className="h-4 w-4" />
          中文 (Chinese)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
