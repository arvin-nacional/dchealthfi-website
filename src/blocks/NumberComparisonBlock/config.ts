import type { Block } from 'payload'

export const NumberComparisonBlock: Block = {
  slug: 'numberComparison',
  interfaceName: 'NumberComparisonBlock',
  fields: [
    {
      name: 'targetNumber',
      type: 'number',
      label: 'Target Number',
      defaultValue: 50,
      required: true,
      admin: {
        description: 'The number that users will compare their input against',
      },
    },
  ],
}
