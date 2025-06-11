import React from 'react'
import {
  Heart,
  Shield,
  Leaf,
  Zap,
  Brain,
  Users,
  FileText,
  Download,
  FileArchive,
  FolderOpen,
  File,
  FileIcon,
  FileSpreadsheet,
  Globe,
  Building2,
} from 'lucide-react'

import { CategoryBlock as CategoryBlockType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Card, CardContent } from '@/components/ui/card'

export const CategoryBlock: React.FC<CategoryBlockType> = ({
  heading,
  description,
  categories,
}) => {
  const getIcon = (icon: string, colorClass: string) => {
    // Map of color classes to avoid dynamic class names that Tailwind might purge
    const colorClassMap: Record<string, string> = {
      'red-400': 'text-red-700',
      'blue-400': 'text-blue-400',
      'green-400': 'text-green-400',
      'yellow-400': 'text-yellow-400',
      'purple-400': 'text-purple-400',
      'orange-400': 'text-orange-400',
      'teal-400': 'text-teal-400',
      'pink-400': 'text-pink-400',
    }

    const iconProps = {
      className: `w-12 h-12 ${colorClassMap[colorClass] || 'text-blue-400'} mx-auto mb-4`,
    }

    switch (icon) {
      case 'Building':
        return <Building2 {...iconProps} />
      case 'Heart':
        return <Heart {...iconProps} />
      case 'Shield':
        return <Shield {...iconProps} />
      case 'Leaf':
        return <Leaf {...iconProps} />
      case 'Zap':
        return <Zap {...iconProps} />
      case 'Brain':
        return <Brain {...iconProps} />
      case 'Users':
        return <Users {...iconProps} />
      case 'FileText':
        return <FileText {...iconProps} />
      case 'Download':
        return <Download {...iconProps} />
      case 'FileArchive':
        return <FileArchive {...iconProps} />
      case 'FolderOpen':
        return <FolderOpen {...iconProps} />
      case 'File':
        return <File {...iconProps} />
      case 'FilePdf':
        return <FileIcon {...iconProps} />
      case 'FileSpreadsheet':
        return <FileSpreadsheet {...iconProps} />
      case 'Globe':
        return <Globe {...iconProps} />
      default:
        return <FileText {...iconProps} />
    }
  }

  /**
   * Build link object compatible with CMSLink component
   * @param link The link data from PayloadCMS
   */
  const buildLink = (
    link: unknown,
  ): {
    type: 'reference' | 'custom'
    reference?: { relationTo: 'pages'; value: string }
    url?: string
    newTab?: boolean
  } | null => {
    if (!link) return null

    // Type assertion to safely access link properties
    const typedLink = link as {
      type?: string
      newTab?: boolean
      page?: string
      flyer?: { slug: string }
      url?: string
    }

    const linkProps = {
      newTab: typedLink.newTab,
    }

    if (typedLink.type === 'page' && typedLink.page) {
      return {
        type: 'reference' as const,
        reference: {
          relationTo: 'pages' as const,
          value: typedLink.page,
        },
        ...linkProps,
      }
    } else if (typedLink.type === 'flyer' && typedLink.flyer) {
      // For flyers, just use a custom URL to avoid typing issues
      return {
        type: 'custom' as const,
        url: `/flyers/${typedLink.flyer.slug}`,
        ...linkProps,
      }
    } else if (typedLink.type === 'custom') {
      return {
        type: 'custom' as const,
        url: typedLink.url,
        ...linkProps,
      }
    }

    return null
  }

  return (
    <div className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        <div className="w-20 h-1 bg-red-700 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="container grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(categories || []).map((category, i: number) => {
          const linkProps = buildLink(category.link)

          return (
            <Card
              key={i}
              className="bg-white border-red-100 hover:shadow-lg transition-all duration-300"
            >
              {linkProps ? (
                <CMSLink {...linkProps} appearance="inline">
                  <CardContent className="p-6 text-center">
                    {getIcon(category.icon, category.iconColor)}
                    <h3 className="font-semibold mb-2 text-gray-800">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </CMSLink>
              ) : (
                <CardContent className="p-6 text-center">
                  {getIcon(category.icon, category.iconColor)}
                  <h3 className="font-semibold mb-2 text-gray-800">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
