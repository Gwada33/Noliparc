'use client'
import Image from 'next/image'
import content from '@/data/texts.json'

export default function Loading() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <Image
          alt='image-noliparc'
          src={content.header['image-noli']}
          className='image-noli'
          width={1269}
          height={906}
          priority
        />
        <div className="loading-text">{}%</div>
      </div>
    </div>
  )
}
