import Image from "next/image"

export interface ImageCardProps {
  imageUrl: string
  alt: string
}

export const ImageCard = ({ imageUrl, alt }: ImageCardProps) => {
  return (
    <div className="flex overflow-hidden rounded-xl border-0 bg-muted">
      <Image
        src={imageUrl}
        alt={alt}
        width={400}
        height={300}
        className="h-full w-full object-cover"
      />
    </div>
  )
}






