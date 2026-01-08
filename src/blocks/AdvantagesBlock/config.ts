import type { Block } from 'payload'

export const AdvantagesBlock: Block = {
  slug: 'advantagesBlock',
  interfaceName: 'AdvantagesBlock',
  labels: {
    singular: 'Advantages Block',
    plural: 'Advantages Blocks',
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
      defaultValue: 'bg-slate-100',
      label: 'Background Color',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: false,
      localized: true,
      defaultValue: 'Our Advantages',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      localized: true,
      defaultValue:
        'What sets us apart goes beyond our services. From expert-driven solutions and personalized support to a commitment to innovation and quality, our advantages are designed to help your business grow with confidence.',
    },
    {
      name: 'advantages',
      type: 'array',
      label: 'Advantages',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Award', value: 'award' },
            { label: 'Shield', value: 'shield' },
            { label: 'Lightbulb', value: 'lightbulb' },
            { label: 'Users', value: 'users' },
            { label: 'Clock', value: 'clock' },
            { label: 'Chart', value: 'chart' },
          ],
          defaultValue: 'award',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
      defaultValue: [
        {
          icon: 'award',
          title: 'Brand Credibility',
          description:
            'With over 40 years of trusted brand heritage, we provide entrepreneurs with unparalleled market recognition and consumer trust to accelerate business growth.',
        },
        {
          icon: 'shield',
          title: 'Market Demand',
          description:
            'Thriving in the expansive health products industry – where demand continues to surge and opportunities abound.',
        },
        {
          icon: 'lightbulb',
          title: 'Profit Model ZERO+',
          description:
            'Transform everyday spending into wealth creation, eliminating financial strain for consumers. Entrepreneurs enjoy higher customer retention and sustainable, long-term income streams.',
        },
        {
          icon: 'users',
          title: 'Future Trend',
          description:
            'Pioneering blockchain integration to future-proof your business. We empower entrepreneurs to capitalize on next-generation opportunities.',
        },
      ],
    },
  ],
}
