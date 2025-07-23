import type { Block } from 'payload'

export const PDFImagesBlock: Block = {
  slug: 'pdfImagesBlock',
  interfaceName: 'PDFImagesBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      admin: {
        description: 'Optional title for the PDF images block',
      },
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description for the PDF images block',
      },
      required: false,
    },
    {
      name: 'images',
      type: 'array',
      label: 'PDF Images',
      admin: {
        description: 'Add images extracted from a PDF file',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          required: false,
        },
      ],
      required: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'bg-white',
      options: [
        {
          label: 'White',
          value: 'bg-white',
        },
        {
          label: 'Light Gray',
          value: 'bg-slate-50',
        },
        {
          label: 'Gray',
          value: 'bg-slate-100',
        },
      ],
    },
    {
      name: 'columnsCount',
      type: 'select',
      label: 'Columns',
      defaultValue: '3',
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
  labels: {
    plural: 'PDF Images Blocks',
    singular: 'PDF Images Block',
  },
}

export default PDFImagesBlock
