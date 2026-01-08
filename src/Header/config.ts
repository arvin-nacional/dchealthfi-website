import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'singleLink',
          options: [
            {
              label: 'Single Link',
              value: 'singleLink',
            },
            {
              label: 'Dropdown Menu',
              value: 'dropdown',
            },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            width: '50%',
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'singleLink',
          type: 'group',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'singleLink',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
        {
          name: 'dropdownLinks',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
            initCollapsed: true,
          },
          maxRows: 12,
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
