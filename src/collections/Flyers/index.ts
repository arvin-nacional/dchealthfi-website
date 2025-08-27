import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateFlyers, revalidateDelete } from './hooks/revalidateFlyers'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Flyers: CollectionConfig<'flyers'> = {
  slug: 'flyers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // Default population settings when a flyer is referenced
  defaultPopulate: {
    title: true,
    slug: true,
    category: true,
    flyerImage: true,
    downloadableFiles: true,
  },
  hooks: {
    afterChange: [revalidateFlyers],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
  },
  admin: {
    defaultColumns: ['title', 'category', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'flyers',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'flyers',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'flyerImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Flyer Image',
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Description',
              required: true,
            },
            {
              name: 'pdfFile',
              type: 'upload',
              relationTo: 'media',
              label: 'PDF File',
              admin: {
                description: 'Upload a PDF file for download',
              },
            },
            {
              name: 'pdfImages',
              type: 'array',
              label: 'PDF Images',
              admin: {
                description:
                  'Add images extracted from the PDF file to display in the Product Info tab',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Image',
                },
              ],
            },
            {
              name: 'pdfImagesColumnsCount',
              type: 'select',
              label: 'PDF Images Columns',
              defaultValue: '3',
              admin: {
                description: 'Number of columns for displaying PDF images',
              },
              options: [
                {
                  label: '1 Column',
                  value: '1',
                },
                {
                  label: '2 Columns',
                  value: '2',
                },
                {
                  label: '3 Columns',
                  value: '3',
                },
                {
                  label: '4 Columns',
                  value: '4',
                },
              ],
            },
          ],
          label: 'Product Info',
        },
        {
          fields: [
            {
              name: 'productVideos',
              type: 'array',
              label: 'Product Videos',
              admin: {
                description: 'Upload videos showcasing the product',
              },
              fields: [
                {
                  name: 'video',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Video File',
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Video Label',
                  admin: {
                    description:
                      'A descriptive label for this video (e.g., "Product Demo", "Installation Guide")',
                  },
                },
              ],
            },
          ],
          label: 'Product Video',
        },
        {
          fields: [
            {
              name: 'testimonialVideo',
              type: 'upload',
              relationTo: 'media',
              label: 'Testimonial Video',
              admin: {
                description: 'Upload a testimonial video for the product',
              },
            },
          ],
          label: 'Testimonial Video',
        },
        {
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'downloadableFiles',
              type: 'array',
              label: 'Downloadable Files',
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
          label: 'Product Testimonials',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
}
