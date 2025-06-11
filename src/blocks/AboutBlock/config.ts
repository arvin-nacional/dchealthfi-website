import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'aboutBlock',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About Block',
    plural: 'About Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Section Heading',
      defaultValue: 'Wellness | Wealth | Futuristic',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
      defaultValue:
        "A People-Helping Business With a legacy of blessings while helping those around you improve their health and reduce burdens, you also secure their family's financial future.",
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Image',
        plural: 'Images',
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
  ],
}
