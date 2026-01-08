import type { Block } from 'payload'

export const TitleBlock: Block = {
  slug: 'titleBlock',
  interfaceName: 'TitleBlock',
  labels: {
    singular: 'Title Block',
    plural: 'Title Blocks',
  },
  fields: [
    {
      name: 'backgroundColor',
      type: 'select',
      required: true,
      options: [
        { label: 'Light Gray (bg-slate-50)', value: 'bg-slate-50' },
        { label: 'Medium Gray (bg-slate-100)', value: 'bg-slate-100' },
      ],
      defaultValue: 'bg-slate-50',
      label: 'Background Color',
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon/Image',
      required: false,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      localized: true,
    },
  ],
}
