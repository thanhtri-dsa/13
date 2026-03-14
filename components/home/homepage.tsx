'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FeaturesSection } from "@/components/home/features-section"
import { BlogsSection } from "@/components/home/offers-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { WorldMap } from "@/components/home/world-map"
import { DestinationCard } from "@/components/home/destination-card"
import { DestinationSkeleton } from "@/components/home/destination-sketelon"
import { EcoProductsSection } from "@/components/home/eco-products-section"
import { HomeMapSection } from "@/components/home/home-map-section"
import { motion } from 'framer-motion'

interface Destination {
  id: string;
  imageData: string;
  name: string;
  amount: number;
  city: string;
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch destinations
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations')
        if (!response.ok) {
          throw new Error('Failed to fetch destinations')
        }
        const data = await response.json()
        setDestinations(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  return (
    <main className="vn-pattern min-h-screen overflow-x-hidden">
      {/* Premium Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/travel_detsinations.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary font-bold text-sm mb-6 tracking-wider uppercase shadow-lg shadow-secondary/20">
                Eco-Tour Việt Nam • VIP Experience
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-6">
                Hành Trình <br />
                <span className="text-secondary italic">Xanh</span> Cao Cấp
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl font-light leading-relaxed italic">
                &quot;Nâng tầm trải nghiệm du lịch bền vững với những tiêu chuẩn phục vụ VIP, kết nối sâu sắc cùng thiên nhiên và văn hóa Việt.&quot;
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-secondary text-primary font-bold rounded-full shadow-xl shadow-secondary/30 hover:bg-white transition-all flex items-center gap-2"
                >
                  Khám phá ngay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
                >
                  Liên hệ VIP
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Vietnamese Patterns */}
        <div className="absolute bottom-10 right-10 w-64 h-64 opacity-20 pointer-events-none animate-floating">
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary">
             <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
             <path d="M50 10L55 45L90 50L55 55L50 90L45 55L10 50L45 45L50 10Z" fill="currentColor" fillOpacity="0.5" />
           </svg>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-primary/5">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center rounded-full bg-secondary/20 px-6 py-2 text-sm text-primary font-bold mb-4 shadow-sm">
              Tuyển tập VIP
            </div>
            <h2 className="vn-title text-3xl md:text-5xl lg:text-6xl font-bold mb-6 mt-4 max-w-3xl mx-auto">
              Những hành trình <span className="italic text-primary font-serif">đẳng cấp</span> cho bạn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg italic">
              &quot;Khám phá vẻ đẹp Việt Nam qua những góc nhìn bền vững và tôn trọng thiên nhiên với dịch vụ 5 sao.&quot;
            </p>
          </motion.div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[...Array(5)].map((_, index) => (
                <DestinationSkeleton key={index} />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground text-xl">Hiện tại chưa có điểm đến nào phù hợp</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {destinations.slice(0, 5).map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <DestinationCard
                    image={destination.imageData || "/images/lamu.jpg"}
                    title={destination.name}
                    price={destination.amount}
                    location={destination.city}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <HomeMapSection />
      <FeaturesSection />
      <CategoriesSection />
      <EcoProductsSection />
      <BlogsSection />
      <WorldMap />
    </main>
  )
}
