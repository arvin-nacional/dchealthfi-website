import type { Block } from 'payload'

export const CategoryBlock: Block = {
  slug: 'categoryBlock',
  interfaceName: 'CategoryBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Section Heading',
      defaultValue: 'File Categories',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      defaultValue:
        'This collection represents our company’s official digital materials crafted to maintain consistency, strengthen our identity, and support your communication needs.',
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Category',
        plural: 'Categories',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Building', value: 'Building' },
            { label: 'Heart', value: 'Heart' },
            { label: 'Shield', value: 'Shield' },
            { label: 'Leaf', value: 'Leaf' },
            { label: 'Zap', value: 'Zap' },
            { label: 'Brain', value: 'Brain' },
            { label: 'Users', value: 'Users' },
            { label: 'FileText', value: 'FileText' },
            { label: 'Download', value: 'Download' },
            { label: 'FileArchive', value: 'FileArchive' },
            { label: 'FolderOpen', value: 'FolderOpen' },
            { label: 'File', value: 'File' },
            { label: 'FilePdf', value: 'FilePdf' },
            { label: 'FileSpreadsheet', value: 'FileSpreadsheet' },
            { label: 'Globe', value: 'Globe' },
          ],
          label: 'Icon',
        },
        {
          name: 'iconColor',
          type: 'select',
          required: true,
          options: [
            { label: 'Red', value: 'red-400' },
            { label: 'Blue', value: 'blue-400' },
            { label: 'Green', value: 'green-400' },
            { label: 'Yellow', value: 'yellow-400' },
            { label: 'Purple', value: 'purple-400' },
            { label: 'Orange', value: 'orange-400' },
            { label: 'Teal', value: 'teal-400' },
            { label: 'Pink', value: 'pink-400' },
          ],
          label: 'Icon Color',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          fields: [
            {
              name: 'type',
              type: 'radio',
              options: [
                {
                  label: 'Page',
                  value: 'page',
                },
                {
                  label: 'Flyer',
                  value: 'flyer',
                },
                {
                  label: 'Custom URL',
                  value: 'custom',
                },
              ],
              defaultValue: 'page',
              admin: {
                layout: 'horizontal',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'page',
              },
            },
            {
              name: 'flyer',
              type: 'relationship',
              relationTo: 'flyers',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'flyer',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Custom URL',
              required: true,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },
  ],
  labels: {
    singular: 'Category Block',
    plural: 'Category Blocks',
  },
}
