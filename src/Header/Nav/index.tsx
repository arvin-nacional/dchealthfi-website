'use client'

import React, { useState, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

import Link from 'next/link'

// Define the link type used in both single and dropdown links
type LinkType = {
  type?: string
  label?: string
  reference?: {
    relationTo?: string
    value?: string | { id: string; slug?: string }
  }
  url?: string
  newTab?: boolean
}

// Define the types for our updated nav items structure
type NavItemType = {
  type?: 'singleLink' | 'link' | 'dropdown' // Support both old 'link' and new 'singleLink' types
  label?: string
  singleLink?: {
    link?: LinkType
  }
  // Support old data format
  link?: {
    link?: LinkType
  }
  dropdownLinks?: Array<{
    link?: LinkType
  }>
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  // Cast the navItems to our expected structure
  const navItems = (data?.navItems || []) as unknown as NavItemType[]
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Debug: Log the structure of the navItems
  useEffect(() => {
    console.log('Navigation items received from PayloadCMS:', JSON.stringify(navItems, null, 2))
  }, [navItems])

  // Helper function to create a href from the link data
  const getHref = (link?: LinkType) => {
    if (!link) return '#'
    if (link.url) return link.url

    if (link.reference?.relationTo && link.reference?.value) {
      const value = link.reference.value

      // Handle different relationTo types
      if (link.reference.relationTo === 'pages') {
        // For pages, use the slug instead of ID
        if (typeof value === 'object' && value !== null) {
          // If we have the full page object with slug
          if ('slug' in value && typeof value.slug === 'string') {
            return `/${value.slug}`
          }
        }
        // If we don't have the slug directly, we'll fallback to ID
        const id = typeof value === 'string' ? value : value?.id
        return `/pages/${id}`
      } else {
        // For other content types, use the default pattern
        const id = typeof value === 'string' ? value : value?.id
        return `/${link.reference.relationTo}/${id}`
      }
    }

    return '#'
  }

  return (
    <>
      {/* Desktop Nav with NavigationMenu */}
      <div className="max-md:hidden">
        <NavigationMenu>
          <NavigationMenuList className="space-x-4">
            {navItems.map((item, i) => {
              console.log(`Rendering nav item ${i}:`, item)
              if (item.type === 'dropdown' && item.label && item.dropdownLinks?.length) {
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuTrigger className="text-white bg-transparent [&:not(:focus)]:bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent [&[data-state=open]]:bg-transparent [&[data-state=open]]:hover:bg-transparent [&[data-state=open]]:focus:bg-transparent hover:text-white focus:text-white [&[data-state=open]]:text-white">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                        {item.dropdownLinks.map((dropdownItem, j) => (
                          <NavigationMenuLink
                            key={j}
                            asChild
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none hover:bg-slate-100 hover:text-accent-foreground focus:bg-transparent focus:text-accent-foreground"
                          >
                            <Link
                              href={getHref(dropdownItem.link)}
                              target={dropdownItem.link?.newTab ? '_blank' : undefined}
                            >
                              <div className="text-sm font-medium leading-none">
                                {dropdownItem.link?.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              } else if (
                (item.type === 'singleLink' && item.singleLink?.link) ||
                (item.type === 'link' && item.link?.link)
              ) {
                // Get the link data from either format
                const linkData = item.singleLink?.link || item.link?.link
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuLink
                      asChild
                      className="text-white bg-transparent hover:bg-transparent px-4 py-2"
                    >
                      <Link
                        href={getHref(linkData)}
                        target={linkData?.newTab ? '_blank' : undefined}
                      >
                        {linkData?.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              }
              return null
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

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
        <div className="absolute left-0 top-full w-full md:hidden bg-[#1a1a1a] border-b border-blue-900 z-50">
          <nav className="container px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item, i) => {
              if (
                (item.type === 'singleLink' && item.singleLink?.link) ||
                (item.type === 'link' && item.link?.link)
              ) {
                // Get the link data from either format
                const linkData = item.singleLink?.link || item.link?.link
                return (
                  <Link
                    key={`mobile-link-${i}`}
                    href={getHref(linkData)}
                    className="text-white hover:text-[#00a0e4] transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                    target={linkData?.newTab ? '_blank' : undefined}
                  >
                    {linkData?.label}
                  </Link>
                )
              } else if (item.type === 'dropdown' && item.label) {
                return (
                  <div key={`mobile-dropdown-${i}`} className="space-y-2">
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="ml-4 space-y-2">
                      {item.dropdownLinks?.map((dropdownItem, j) => (
                        <Link
                          key={`mobile-dropdown-link-${i}-${j}`}
                          href={getHref(dropdownItem.link)}
                          className="block text-white hover:text-[#00a0e4] transition-colors py-1"
                          onClick={() => setIsMenuOpen(false)}
                          target={dropdownItem.link?.newTab ? '_blank' : undefined}
                        >
                          {dropdownItem.link?.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            })}
          </nav>
        </div>
      )}
    </>
  )
}
