'use client'

import * as React from "react"
import Link from "next/link"
import { Leaf, Menu, ChevronRight, Phone, Mail, Search, User, Globe, Crown, X, Star, ArrowUpRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [isDestinationsOpen, setIsDestinationsOpen] = React.useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSearch(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const promotions = [
    "🌟 Ưu đãi 20% cho tour khám phá Tây Bắc",
    "🍃 Trải nghiệm du lịch bền vững tại Hội An",
    "💎 Thành viên VIP được giảm thêm 10% tất cả dịch vụ",
    "🌍 Khám phá thế giới cùng Eco-Tour Việt Nam"
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] w-full transition-all duration-500">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[3px] bg-secondary z-[10000]"
        style={{ scaleX, originX: 0 }}
      />

      {/* Top Bar Ticker */}
      <div className={`hidden md:block bg-primary text-white/80 border-b border-white/5 transition-all duration-700 overflow-hidden ${isScrolled ? 'h-7 opacity-90' : 'h-10 opacity-100'}`}>
        <div className="container mx-auto px-4 h-full flex justify-between items-center text-[10px] font-bold tracking-[0.1em] uppercase">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-4 overflow-hidden w-[300px] relative">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap flex gap-8"
              >
                {promotions.map((promo, idx) => (
                  <span key={idx} className="text-secondary">{promo}</span>
                ))}
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-4 border-r border-white/10 pr-6">
              <a href="tel:+84123456789" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Phone size={isScrolled ? 8 : 10} className="text-secondary" />
                <span className={isScrolled ? 'text-[9px]' : ''}>+84 123 456 789</span>
              </a>
              <a href="mailto:info@ecotour.vn" className="flex items-center gap-2 hover:text-secondary transition-colors">
                <Mail size={isScrolled ? 8 : 10} className="text-secondary" />
                <span className={isScrolled ? 'text-[9px]' : ''}>info@ecotour.vn</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer hover:text-secondary transition-colors group">
                <Globe size={isScrolled ? 8 : 10} className="text-secondary group-hover:rotate-180 transition-transform duration-700" />
                <span className={isScrolled ? 'text-[9px]' : ''}>Tiếng Việt</span>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-2 cursor-pointer bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 text-primary rounded-full font-black shadow-[0_0_15px_rgba(255,184,0,0.3)] ${isScrolled ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-[9px]'}`}
              >
                <Crown size={isScrolled ? 8 : 10} />
                <span>THÀNH VIÊN VIP</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <header className={`w-full transition-all duration-700 relative ${isScrolled ? 'bg-primary/95 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] py-2 md:py-3' : 'bg-transparent py-4 md:py-8'}`}>
        {/* Subtle Vietnamese Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none vn-pattern rotate-180 overflow-hidden" />
        
        <nav className="container mx-auto px-4 relative z-[101]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative p-2.5 md:p-3 bg-white/5 rounded-2xl group-hover:bg-secondary/20 transition-all duration-700 border border-white/10 group-hover:border-secondary/40">
                <Leaf className="h-7 w-7 md:h-8 md:w-8 text-secondary group-hover:rotate-[20deg] transition-transform duration-700" />
                <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-secondary font-serif tracking-tighter leading-none">
                  ECO-TOUR
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-bold text-secondary tracking-[0.4em] uppercase leading-none">
                    Việt Nam
                  </span>
                  <div className="h-[1px] w-5 bg-secondary/40" />
                  <Star size={10} className="text-secondary fill-secondary animate-pulse" />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-3">
                <Link href="/" className="px-6 py-3 text-white/90 hover:text-secondary transition-all font-bold text-[12px] uppercase tracking-[0.2em] relative group">
                  Trang chủ
                  <span className="absolute bottom-0 left-6 right-6 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>

                <div 
                  className="relative"
                  onMouseEnter={() => setIsDestinationsOpen(true)}
                  onMouseLeave={() => setIsDestinationsOpen(false)}
                >
                  <button className={`flex items-center gap-3 px-6 py-3 transition-all font-bold text-[12px] uppercase tracking-[0.2em] rounded-2xl ${isDestinationsOpen ? 'bg-white/10 text-secondary' : 'text-white/90 hover:text-white hover:bg-white/5'}`}>
                    Điểm đến
                    <ChevronRight size={16} className={`transition-transform duration-500 ${isDestinationsOpen ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDestinationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-8 z-[120]"
                      >
                        <div className="flex w-[950px] bg-white text-gray-900 shadow-[0_50px_120px_rgba(0,0,0,0.6)] rounded-[3.5rem] overflow-hidden border border-white/20 min-h-[480px]">
                          {/* Left Panel */}
                          <div className="w-1/3 bg-primary p-12 text-white relative overflow-hidden flex flex-col justify-end">
                            <div className="absolute inset-0 opacity-20 vn-pattern scale-150" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                            <div className="relative z-10">
                              <Leaf className="h-12 w-12 text-secondary mb-8" />
                              <h3 className="text-4xl font-serif font-bold mb-6 leading-tight">Hành trình<br/>Di sản</h3>
                              <p className="text-base text-white/60 mb-10 leading-relaxed">Gói ghém tinh hoa văn hóa và vẻ đẹp thiên nhiên Việt Nam vào từng trải nghiệm.</p>
                              <Link href="/destinations">
                                <Button className="w-full bg-secondary text-primary font-black text-[11px] uppercase py-5 rounded-2xl hover:bg-white hover:scale-105 transition-all duration-500 shadow-2xl">
                                  Xem tất cả điểm đến
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="w-2/3 grid grid-cols-3 gap-12 p-14 bg-white relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="space-y-8 relative">
                              <h4 className="text-[11px] font-black text-primary/40 uppercase tracking-[0.4em] border-b border-primary/10 pb-4 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                Châu Phi
                              </h4>
                              <ul className="space-y-4">
                                {['Botswana', 'Kenya', 'Namibia', 'Tanzania', 'South Africa'].map(item => (
                                  <li key={item}>
                                    <Link href={`/destinations?country=${item.toLowerCase()}`} className="text-[14px] font-bold text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-between group/link">
                                      <span className="group-hover/link:translate-x-2 transition-transform">{item}</span>
                                      <ChevronRight size={14} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all text-secondary" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-8 relative">
                              <h4 className="text-[11px] font-black text-primary/40 uppercase tracking-[0.4em] border-b border-primary/10 pb-4 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                Châu Á
                              </h4>
                              <ul className="space-y-4">
                                {['Indonesia', 'Sri Lanka', 'Singapore', 'Việt Nam'].map(item => (
                                  <li key={item}>
                                    <Link href={`/destinations?country=${item.toLowerCase()}`} className="text-[14px] font-bold text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-between group/link">
                                      <span className="flex items-center gap-3 group-hover/link:translate-x-2 transition-transform">
                                        {item}
                                        {item === 'Việt Nam' && (
                                          <span className="text-[9px] bg-accent text-white px-2 py-0.5 rounded-full font-black animate-bounce">
                                            HOT
                                          </span>
                                        )}
                                      </span>
                                      <ChevronRight size={14} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all text-secondary" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-8 relative">
                              <h4 className="text-[11px] font-black text-primary/40 uppercase tracking-[0.4em] border-b border-primary/10 pb-4 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                Trung Đông
                              </h4>
                              <ul className="space-y-4">
                                {['Jordan', 'UAE'].map(item => (
                                  <li key={item}>
                                    <Link href={`/destinations?country=${item.toLowerCase()}`} className="text-[14px] font-bold text-gray-400 hover:text-primary transition-all duration-300 flex items-center justify-between group/link">
                                      <span className="group-hover/link:translate-x-2 transition-transform">{item}</span>
                                      <ChevronRight size={14} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all text-secondary" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {['Gói du lịch', 'Tin tức', 'Liên hệ'].map((item) => (
                  <Link key={item} href={`/${item === 'Gói du lịch' ? 'packages' : item === 'Tin tức' ? 'blogs' : 'contact'}`} className="px-6 py-3 text-white/90 hover:text-secondary transition-all font-bold text-[12px] uppercase tracking-[0.2em] relative group">
                    {item}
                    <span className="absolute bottom-0 left-6 right-6 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowSearch(true)} className="hidden md:flex p-3.5 text-white/80 hover:text-secondary hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/20">
                <Search size={20} />
              </button>
              <button className="hidden md:flex p-3.5 text-white/80 hover:text-secondary hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/20">
                <User size={20} />
              </button>
              <div className="h-10 w-[1px] bg-white/10 mx-2 hidden md:block" />
              <Link href="/packages">
                <Button className="hidden md:flex bg-secondary text-primary font-black px-10 py-7 rounded-2xl hover:bg-white hover:text-primary transition-all duration-500 text-[11px] uppercase tracking-[0.2em] border-none group shadow-2xl hover:scale-105 active:scale-95">
                  Đặt Tour Ngay
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-500" />
                </Button>
              </Link>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 p-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-white/10">
                    <Menu className="h-7 w-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 border-l-white/10 w-full sm:w-[420px] bg-primary text-white [&>button]:hidden">
                  <MobileNav onClose={() => setIsOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10001] bg-primary/95 backdrop-blur-2xl p-4 md:p-20">
            <button onClick={() => setShowSearch(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <div className="max-w-4xl mx-auto pt-20">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary h-8 w-8" />
                <input autoFocus type="text" placeholder="Bạn muốn đi đâu hôm nay?" className="w-full bg-white/5 border-b-2 border-secondary/30 focus:border-secondary py-8 pl-20 pr-8 text-3xl md:text-5xl font-serif text-white placeholder:text-white/20 outline-none transition-all" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileNav = ({ onClose }: { onClose: () => void }) => {
  const navItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Điểm đến', href: '/destinations' },
    { label: 'Gói du lịch', href: '/packages' },
    { label: 'Tin tức', href: '/blogs' },
    { label: 'Liên hệ', href: '/contact' },
  ]

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-5 pt-[calc(env(safe-area-inset-top)+16px)] pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-2xl border border-white/10">
              <Leaf className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-black font-serif tracking-tight">ECO-TOUR</span>
              <span className="text-[10px] font-bold tracking-[0.35em] text-secondary uppercase">Việt Nam</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center justify-between rounded-2xl px-4 py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <span className="text-base font-black tracking-wide">{item.label}</span>
            <ChevronRight size={18} className="text-secondary" />
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-white/10">
          <a href="tel:+84123456789" className="flex items-center justify-between rounded-2xl px-4 py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <span className="text-sm font-bold text-white/80">+84 123 456 789</span>
            <Phone size={18} className="text-secondary" />
          </a>
          <a href="mailto:info@ecotour.vn" className="mt-2 flex items-center justify-between rounded-2xl px-4 py-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <span className="text-sm font-bold text-white/80">info@ecotour.vn</span>
            <Mail size={18} className="text-secondary" />
          </a>
        </div>
      </div>

      <div className="px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+18px)] border-t border-white/10 bg-primary/95 backdrop-blur-xl">
        <Link href="/packages" onClick={onClose} className="block">
          <Button className="w-full bg-secondary text-primary font-black h-14 rounded-2xl uppercase tracking-[0.18em] text-[11px] shadow-2xl">
            Đặt Tour Ngay
            <ArrowUpRight size={18} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
