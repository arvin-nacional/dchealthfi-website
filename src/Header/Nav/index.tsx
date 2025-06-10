'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Nav */}
      <nav className="max-md:hidden md:flex space-x-8 items-center ">
        {navItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" className="!text-white" />
        ))}
      </nav>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-white"
        aria-label="Open Menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full md:hidden bg-[#0c2252] border-b border-blue-900 z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map(({ link }, i) => (
              <span key={i} onClick={() => setIsMenuOpen(false)} className="block">
                <CMSLink
                  {...link}
                  appearance="link"
                  className="text-white hover:text-[#00a0e4] transition-colors py-2 !text-white"
                />
              </span>
            ))}
            {/* <Link
              href="/search"
              className="text-white hover:text-[#00a0e4] transition-colors py-2 !text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link> */}
          </nav>
        </div>
      )}
    </>
  )
}
