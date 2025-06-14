'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type NavItemType = {
  type?: 'link' | 'dropdown'
  label?: string
  link?: {
    label?: string
    url?: string
  }
  dropdownLinks?: Array<{
    link?: {
      label?: string
    }
  }>
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NavItemType>()
  const rowData = data?.data
  const rowNumber = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''

  let label = 'Row'

  if (rowData) {
    if (rowData.type === 'dropdown' && rowData.label) {
      const count = rowData.dropdownLinks?.length || 0
      label = `Dropdown ${rowNumber}: ${rowData.label} (${count} links)`
    } else if (rowData.type === 'link' && rowData.link?.label) {
      label = `Link ${rowNumber}: ${rowData.link.label}`
    }
  }

  return <div>{label}</div>
}
