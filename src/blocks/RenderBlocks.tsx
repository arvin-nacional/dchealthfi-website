import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FlyersBlock } from '@/blocks/FlyersBlock/Component'
import { CategoryBlock } from '@/blocks/CategoryBlock/Component'
import { DownloadBlock } from '@/blocks/DownloadBlock/Component'
import { MissionVisionBlock } from '@/blocks/MissionVisionBlock/Component'
import { AdvantagesBlock } from '@/blocks/AdvantagesBlock/Component'
import { AboutBlock } from '@/blocks/AboutBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  flyers: FlyersBlock,
  categoryBlock: CategoryBlock,
  downloadBlock: DownloadBlock,
  missionVisionBlock: MissionVisionBlock,
  advantagesBlock: AdvantagesBlock,
  aboutBlock: AboutBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  searchParams?: Promise<{ [key: string]: string }>
}> = (props) => {
  const { blocks, searchParams } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Special handling for FlyersBlock to pass search params
              if (blockType === 'flyers') {
                return (
                  <div className="" key={index}>
                    {/* @ts-expect-error Expected prop mismatch handled intentionally */}
                    <FlyersBlock {...block} params={searchParams} disableInnerContainer />
                  </div>
                )
              }

              // Standard rendering for other block types
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error Expected prop mismatch handled intentionally */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
