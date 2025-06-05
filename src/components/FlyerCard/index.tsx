import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, ImageIcon, Video } from 'lucide-react'
import { Media } from '@/components/Media'
import { Flyer } from '@/payload-types'
import RichText from '../RichText'

// interface Asset {
//   id: string
//   label: string
//   url: string
//   type: 'image' | 'video' | 'pdf' | 'document'
//   thumbnail?: string
// }

interface FlyerCardProps {
  flyer: Flyer
}

const FlyerCard: React.FC<FlyerCardProps> = ({ flyer }) => {
  return (
    <Link key={flyer.id} href={`/flyer/${flyer.id}`}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer bg-slate-800 border-slate-700 hover:border-slate-600">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            {flyer.flyerImage ? (
              <Media
                resource={flyer.flyerImage}
                imgClassName="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                alt={flyer.title}
                size="33vw"
              />
            ) : (
              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-blue-600 text-white border-0">
              {typeof flyer.category === 'string' ? flyer.category : flyer.category.title}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">{flyer.title}</h3>
          {flyer.description && (
            <RichText
              className="mb-6 text-sm line-clamp-3 text-gray-300"
              data={flyer.description}
              enableGutter={false}
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <Download className="w-4 h-4" />
              {flyer.downloadableFiles?.length ?? 0}
              <p className="ml-[2px]">assets</p>
            </div>

            <div className="flex items-center gap-1">
              {flyer.downloadableFiles?.map((file) => {
                if (typeof file.file === 'string') {
                  const extension = file.file.split('.').pop()
                  switch (extension) {
                    case 'pdf':
                      return <FileText key={file.id} className="w-4 h-4" aria-hidden />
                    case 'mp4':
                      return <Video key={file.id} className="w-4 h-4" aria-hidden />
                    default:
                      return <ImageIcon key={file.id} className="w-4 h-4" aria-hidden />
                  }
                }
                return null
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default FlyerCard
