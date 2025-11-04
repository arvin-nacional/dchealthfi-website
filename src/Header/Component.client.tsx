'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { cn } from '@/utilities/ui'
import { useLanguage } from '@/providers/Language'
import { useTranslation } from '@/lib/translations'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { LanguageSelector } from '@/components/LanguageSelector'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const { locale } = useLanguage()
  const { t } = useTranslation(locale)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 1) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Initial check
    handleScroll()

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className={cn(
        'z-20 sticky top-0 px-12 max-sm:px-6 transition-colors duration-300',
        scrolled ? 'bg-[#1a1a1a] shadow-md' : 'max-md:bg-[#1a1a1a] bg-transparent',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div
        className={cn(
          'container flex justify-between items-center transition-all duration-300',
          scrolled ? 'py-3' : 'py-6',
        )}
      >
        <Link href="/">
          <Logo
            loading="eager"
            priority="high"
            className={cn(
              'dark:invert-0 transition-all duration-300',
              scrolled ? 'scale-75 transform origin-left' : '',
            )}
          />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}
