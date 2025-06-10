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

export const CategoryBlock: React.FC<CategoryBlockType> = ({ heading, categories }) => {
  const getIcon = (icon: string, colorClass: string) => {
    // Map of color classes to avoid dynamic class names that Tailwind might purge
    const colorClassMap: Record<string, string> = {
      'red-400': 'text-red-400',
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

  const buildLink = (link: any): any => {
    if (!link) return null

    const linkProps = {
      newTab: link.newTab,
    }

    if (link.type === 'page' && link.page) {
      return {
        type: 'reference' as const,
        reference: {
          relationTo: 'pages' as const,
          value: link.page,
        },
        ...linkProps,
      }
    } else if (link.type === 'flyer' && link.flyer) {
      // For flyers, just use a custom URL to avoid typing issues
      return {
        type: 'custom' as const,
        url: `/flyers/${link.flyer.slug}`,
        ...linkProps,
      }
    } else if (link.type === 'custom') {
      return {
        type: 'custom' as const,
        url: link.url,
        ...linkProps,
      }
    }

    return null
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">{heading}</h2>
      <div className="container grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(categories || []).map((category, i: number) => {
          const linkProps = buildLink(category.link)

          return (
            <Card
              key={i}
              className="bg-slate-800 border-slate-700 transition-transform hover:-translate-y-1 cursor-pointer"
            >
              {linkProps ? (
                <CMSLink {...linkProps} appearance="inline">
                  <CardContent className="p-6 text-center">
                    {getIcon(category.icon, category.iconColor)}
                    <h3 className="font-semibold mb-2 text-white">{category.title}</h3>
                    <p className="text-sm text-slate-300">{category.description}</p>
                  </CardContent>
                </CMSLink>
              ) : (
                <CardContent className="p-6 text-center">
                  {getIcon(category.icon, category.iconColor)}
                  <h3 className="font-semibold mb-2 text-white">{category.title}</h3>
                  <p className="text-sm text-slate-300">{category.description}</p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
