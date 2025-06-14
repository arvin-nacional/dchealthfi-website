import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

// import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  // Type assertion to any to avoid type errors due to API structure differences
  const footerData: any = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-[#1a1a1a] dark:bg-card text-white px-12">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          {/* <ThemeSelector /> */}
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map((item: any, i: number) => {
              // Handle both Footer and Header navItem structures
              // Each item could be from Footer format (direct link property) or Header format (singleLink.link)
              const linkData = item.link ? item.link : 
                             (item.singleLink && item.singleLink.link) ? item.singleLink.link : null;
              
              return linkData ? <CMSLink className="text-white" key={i} {...linkData} /> : null;
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
