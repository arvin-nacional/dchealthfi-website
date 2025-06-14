'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  // Use any type to accommodate both Header and Footer navItem structures
  const data = useRowLabel<any>()
  
  // Get the label from either structure
  // Footer structure: data.data.link.label
  // Header structure: data.data.singleLink.link.label or data.data.label
  const linkLabel = data?.data?.link?.label || 
                   (data?.data?.singleLink?.link?.label) || 
                   data?.data?.label || 
                   'Row'
  
  const label = linkLabel !== 'Row' 
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${linkLabel}`
    : 'Row'

  return <div>{label}</div>
}
