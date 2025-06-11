import type { Block } from 'payload'

// Remove unused imports
// If these might be needed in the future, you can keep them by prefixing with underscore
// import {
//   HeadingFeature as _HeadingFeature,
//   InlineToolbarFeature as _InlineToolbarFeature,
//   lexicalEditor as _lexicalEditor,
// } from '@payloadcms/richtext-lexical'

export const FlyersBlock: Block = {
  slug: 'flyers',
  interfaceName: 'FlyersBlock',
  fields: [
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      hasMany: true,
      label: 'Categories To Show',
      relationTo: 'categories',
    },
    {
      name: 'limitFromProps',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 12,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
      },
      hasMany: true,
      label: 'Selection',
      relationTo: ['flyers'],
    },
  ],
  labels: {
    plural: 'Flyers Blocks',
    singular: 'Flyers Block',
  },
}

export default FlyersBlock
