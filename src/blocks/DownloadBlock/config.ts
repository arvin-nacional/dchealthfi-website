import type { Block } from 'payload'

export const DownloadBlock: Block = {
  slug: 'downloadBlock',
  interfaceName: 'DownloadBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
    },
    {
      name: 'fileGroups',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'File Group',
        plural: 'File Groups',
      },
      fields: [
        {
          name: 'groupTitle',
          type: 'text',
          required: true,
          label: 'Group Title',
        },
        {
          name: 'downloadableFiles',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'File',
            plural: 'Files',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'File Label',
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'File',
            },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      required: false,
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      label: 'Background Color',
    },
    {
      name: 'layout',
      type: 'select',
      required: false,
      defaultValue: 'list',
      options: [
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
      ],
      label: 'Layout Style',
    },
  ],
  labels: {
    singular: 'Download Block',
    plural: 'Download Blocks',
  },
}
