import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from 'next/link';

interface DestinationCardProps {
  image: string
  title: string
  price: number
  location: string
}

export function DestinationCard({ image, title, price }: DestinationCardProps) {
  return (
    <div className="vn-card-vip group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-secondary/20">
      <div className="relative h-[320px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* VIP Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-secondary text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Premium
          </div>
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 fill-secondary" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        
        <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-secondary transition-colors line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div>
            <p className="text-[10px] text-white/70 uppercase tracking-widest mb-1">Giá từ</p>
            <p className="text-lg font-bold text-secondary">
              {price.toLocaleString('vi-VN')} <span className="text-xs font-normal text-white/80">VNĐ</span>
            </p>
          </div>
          <Link href="/destinations">
            <Button className="bg-secondary text-primary hover:bg-white hover:text-primary font-bold rounded-full h-9 px-5 text-xs shadow-lg shadow-secondary/10 transition-all active:scale-95">
              Chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

