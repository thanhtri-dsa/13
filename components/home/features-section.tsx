import { Button } from "@/components/ui/button"
import { Clock, Building2, FileText, Search } from 'lucide-react'
import Image from 'next/image'
import Link from "next/link"
import UserAvatars from '@/components/home/user-avartar'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Decorative Gold Pattern Overlay */}
      <div className="absolute inset-0 vn-pattern-gold opacity-[0.03] pointer-events-none" />
      
      {/* Decorative Lotus */}
      <div className="absolute top-10 -left-20 opacity-10 pointer-events-none rotate-45 scale-150">
        <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
          <path d="M50 0C50 0 55 20 75 20C95 20 100 0 100 0C100 0 80 5 80 25C80 45 100 50 100 50C100 50 80 55 80 75C80 95 100 100 100 100C100 100 80 95 60 95C40 95 20 100 20 100C20 100 40 95 40 75C40 55 20 50 20 50C20 50 40 45 40 25C40 5 20 0 20 0C20 0 45 20 50 0Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-xs text-primary font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Dịch vụ thượng lưu
              </div>
              <h2 className="vn-title text-4xl md:text-5xl font-bold leading-tight mb-6">Chọn gói kỳ nghỉ <br/><span className="text-primary italic font-serif">tuyệt vời nhất</span> cho bạn</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Chúng tôi định nghĩa lại sự sang trọng thông qua các trải nghiệm bền vững. Mỗi hành trình được thiết kế riêng để mang lại sự hài lòng tuyệt đối và gắn kết sâu sắc với thiên nhiên Việt Nam.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: Clock, title: "Hỗ trợ VIP 24/7", desc: "Đội ngũ chuyên gia luôn sẵn sàng" },
                { icon: Building2, title: "Resort 5 Sao", desc: "Tiêu chuẩn quốc tế, hồn cốt Việt" },
                { icon: FileText, title: "Lịch trình riêng", desc: "Thiết kế theo sở thích cá nhân" },
                { icon: Search, title: "Trải nghiệm độc bản", desc: "Những điểm đến ít người biết" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-primary/5 hover:bg-secondary/10 transition-colors group">
                  <div className="flex-shrink-0 rounded-xl bg-white p-3 shadow-sm group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/destinations">
                <Button 
                  className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 h-12 text-base font-bold shadow-xl shadow-primary/20"
                >
                  Đặt hành trình ngay
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  className="rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white px-8 h-12 text-base"
                >
                  Về chúng tôi
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/travel_detsinations.jpg"
                alt="VIP Travel Experience"
                width={600}
                height={500}
                className="object-cover w-full h-[500px]"
              />
            </div>
            {/* Decorative Gold Box */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary/20 rounded-[2rem] -z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full -z-0 blur-xl" />
            
            <div className="absolute top-8 right-8 z-20">
              <UserAvatars />
            </div>

            <div className="absolute -bottom-4 -left-4 z-20 glass-morphism p-6 rounded-2xl max-w-[200px]">
              <p className="text-primary font-bold text-2xl mb-1">500+</p>
              <p className="text-xs text-primary/70 font-medium">Khách hàng hài lòng mỗi tháng</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

