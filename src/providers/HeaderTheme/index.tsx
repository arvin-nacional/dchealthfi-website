'use client'

import type { Theme } from '@/providers/Theme/types'

import React, { createContext, useCallback, use, useState } from 'react'

import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  headerTheme?: Theme | null
  setHeaderTheme: (theme: Theme | null) => void
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always default to 'light' theme
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>('light')

  const setHeaderTheme = useCallback((_themeToSet: Theme | null) => {
    // Force 'light' theme regardless of what's passed
    setThemeState('light')
  }, [])

  // Apply the light theme to the document
  React.useEffect(() => {
    if (canUseDOM) {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  return <HeaderThemeContext.Provider value={{ headerTheme, setHeaderTheme }}>{children}</HeaderThemeContext.Provider>
}

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext)
