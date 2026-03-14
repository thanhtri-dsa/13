'use client'

import React, { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign, Crown, Star, Share2, Heart, CheckCircle2, ShieldCheck, ChevronRight } from "lucide-react"
import { motion } from 'framer-motion'
import { computeDistanceKm, computeLegKgCo2e, normalizeMode, transportModeLabels } from '@/lib/emissions'

interface PackageDestinationProps {
  package: {
    id: string
    name: string
    location: string
    imageUrl: string
    duration: string
    groupSize: string
    price: number
    description: string
    included: { id: string; item: string }[]
    itinerary?: Array<{
      id: string
      order: number
      mode: string
      fromName: string
      toName: string
      distanceKm: number | null
      fromLat: number | null
      fromLng: number | null
      toLat: number | null
      toLng: number | null
      note: string | null
    }>
  }
}

import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Link from 'next/link'
import Image from 'next/image'
import RouteMapLoader from '@/components/ui/RouteMapLoader'
import { vi } from "date-fns/locale"

interface FormErrors {
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  numberOfGuests?: string
  bookingDate?: string
}

export default function PackageDestination({ package: travelPackage }: PackageDestinationProps) {
  const [bookingDate, setBookingDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const [showMapPanel, setShowMapPanel] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLiked, setIsLiked] = useState(false)
  const [travelerCount, setTravelerCount] = useState(1)
  const [showTripSummary, setShowTripSummary] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const itinerarySummary = useMemo(() => {
    const legs = (travelPackage.itinerary ?? []).slice().sort((a, b) => a.order - b.order)
    const computed = legs.map((l) => {
      const mode = normalizeMode(l.mode)
      const distanceKm = computeDistanceKm({
        distanceKm: l.distanceKm,
        fromLat: l.fromLat,
        fromLng: l.fromLng,
        toLat: l.toLat,
        toLng: l.toLng,
      })
      const kgCo2e = distanceKm != null ? computeLegKgCo2e({ mode, distanceKm, travelers: travelerCount }) : null
      return { ...l, mode, distanceKm, kgCo2e }
    })
    const totalDistanceKm = computed.reduce((sum, l) => sum + (l.distanceKm ?? 0), 0)
    const totalKgCo2e = computed.reduce((sum, l) => sum + (l.kgCo2e ?? 0), 0)
    return { legs: computed, totalDistanceKm, totalKgCo2e }
  }, [travelPackage.itinerary, travelerCount])

  const mapPoints = useMemo(() => {
    const pts: Array<{ lat: number; lng: number; label?: string }> = []
    const pushIfValid = (lat: number | null, lng: number | null, label?: string) => {
      if (typeof lat !== 'number' || typeof lng !== 'number') return
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
      const last = pts[pts.length - 1]
      if (last && Math.abs(last.lat - lat) < 0.000001 && Math.abs(last.lng - lng) < 0.000001) return
      pts.push({ lat, lng, label })
    }
    for (const leg of itinerarySummary.legs) {
      pushIfValid(leg.fromLat ?? null, leg.fromLng ?? null, leg.fromName)
      pushIfValid(leg.toLat ?? null, leg.toLng ?? null, leg.toName)
    }
    return pts.length >= 2 ? pts : undefined
  }, [itinerarySummary.legs])

  const emissionsByMode = useMemo(() => {
    const byMode = new Map<string, { km: number; kg: number }>()
    for (const leg of itinerarySummary.legs) {
      const key = leg.mode
      const current = byMode.get(key) ?? { km: 0, kg: 0 }
      byMode.set(key, {
        km: current.km + (leg.distanceKm ?? 0),
        kg: current.kg + (leg.kgCo2e ?? 0),
      })
    }
    return Array.from(byMode.entries()).sort((a, b) => b[1].kg - a[1].kg)
  }, [itinerarySummary.legs])

  const googleTripUrl = useMemo(() => {
    if (itinerarySummary.legs.length === 0) return null
    const originLeg = itinerarySummary.legs[0]
    const destLeg = itinerarySummary.legs[itinerarySummary.legs.length - 1]

    const enc = (v: string) => encodeURIComponent(v)
    const coord = (lat?: number | null, lng?: number | null) =>
      typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : null

    const origin = coord(originLeg.fromLat, originLeg.fromLng) ?? originLeg.fromName
    const destination = coord(destLeg.toLat, destLeg.toLng) ?? destLeg.toName
    const waypoints = itinerarySummary.legs.slice(0, -1).map((l) => coord(l.toLat, l.toLng) ?? l.toName).filter(Boolean)

    const base = `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc(destination)}&travelmode=driving`
    if (waypoints.length === 0) return base
    return `${base}&waypoints=${enc(waypoints.join('|'))}`
  }, [itinerarySummary.legs])

  const getLegTravelMode = (mode: string) => {
    if (mode === 'WALK') return 'walking'
    if (mode === 'BIKE') return 'bicycling'
    if (mode === 'BUS' || mode === 'TRAIN') return 'transit'
    if (mode === 'PLANE' || mode === 'BOAT') return 'transit'
    return 'driving'
  }

  const getLegGoogleUrl = (leg: (typeof itinerarySummary.legs)[number]) => {
    const enc = (v: string) => encodeURIComponent(v)
    const coord = (lat?: number | null, lng?: number | null) =>
      typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : null

    const origin = coord(leg.fromLat, leg.fromLng) ?? leg.fromName
    const destination = coord(leg.toLat, leg.toLng) ?? leg.toName
    const travelmode = getLegTravelMode(leg.mode)
    return `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc(destination)}&travelmode=${enc(travelmode)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Đã copy link')
    } catch {
      toast.error('Không copy được link trên trình duyệt này')
    }
  }

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {}
    
    // First Name validation
    const firstname = formData.get('firstname') as string
    if (!firstname || firstname.trim().length < 2) {
      errors.firstname = 'First name must be at least 2 characters'
    }

    // Last Name validation
    const lastname = formData.get('lastname') as string
    if (!lastname || lastname.trim().length < 2) {
      errors.lastname = 'Last name must be at least 2 characters'
    }

    // Email validation
    const email = formData.get('email') as string
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phone = formData.get('phone') as string
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = 'Please enter a valid phone number (min 10 digits)'
    }

    // Number of guests validation
    const guests = parseInt(formData.get('guests') as string, 10)
    if (isNaN(guests) || guests < 1) {
      errors.numberOfGuests = 'Number of guests must be at least 1'
    }

    // Booking date validation
    if (!bookingDate) {
      errors.bookingDate = 'Please select a booking date'
    } else {
      const today = new Date()
      if (bookingDate < today) {
        errors.bookingDate = 'Booking date cannot be in the past'
      }
    }

    return errors
  }

  const clearForm = () => {
    if (formRef.current) {
      formRef.current.reset()
      setBookingDate(undefined)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const validationErrors = validateForm(formData)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      toast.error('Please correct the errors in the form')
      return
    }

    const bookingData = {
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      numberOfGuests: parseInt(formData.get('guests') as string, 10),
      bookingDate: bookingDate?.toISOString(),
      specialRequests: formData.get('special-requests') as string,
      destinationName: travelPackage.name,
      price: travelPackage.price
    }

    try {
      const response = await fetch('/api/packages/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      toast.success('Booking Successful', {
        description: 'Your package booking has been sent!',
        duration: 5000,
      })
      
      // Clear form after successful submission
      clearForm()
      setErrors({})
      
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Booking Failed', {
        description: 'Unable to process your booking. Please try again.',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero Section Upgrade */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image 
            src={typeof travelPackage.imageUrl === 'string' && travelPackage.imageUrl.trim().length > 0 && travelPackage.imageUrl !== '/images/saigon.jpg' ? travelPackage.imageUrl : "/images/travel_detsinations.jpg"} 
            alt={travelPackage.name} 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#f8fafc]" />
        </motion.div>

        <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/packages">
              <Button variant="ghost" className="text-white hover:bg-white/20 mb-8 backdrop-blur-md border border-white/30 rounded-full px-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
              </Button>
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-secondary text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <Crown size={12} /> Gói Tour VIP
              </span>
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight drop-shadow-2xl">
              {travelPackage.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-white/90">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20">
                <MapPin className="text-secondary h-5 w-5" />
                <span className="font-bold tracking-wide">{travelPackage.location}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full backdrop-blur-md border border-white/30 transition-all ${isLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Info Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Clock, label: "Thời lượng", value: travelPackage.duration, color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Users, label: "Số lượng", value: travelPackage.groupSize, color: "text-green-500", bg: "bg-green-50" },
                { icon: DollarSign, label: "Giá gói", value: `${travelPackage.price.toLocaleString()} VNĐ`, color: "text-yellow-600", bg: "bg-yellow-50" },
                { icon: ShieldCheck, label: "Bảo hiểm", value: "Gói Cao Cấp", color: "text-purple-500", bg: "bg-purple-50" },
              ].map((item, i) => (
                <div key={i} className={`${item.bg} p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500`}>
                  <div className={`${item.color} mb-4 p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                  <p className="font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </motion.div>

            {/* Description Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-14 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 opacity-[0.03] vn-pattern w-64 h-64 rotate-12" />
              <h2 className="text-3xl font-serif font-black mb-8 flex items-center gap-4 text-primary">
                <div className="h-8 w-1.5 bg-secondary rounded-full" />
                Về gói hành trình
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed italic mb-10">
                &quot;{travelPackage.description}&quot;
              </div>

              <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-gray-400">Trải nghiệm bao gồm:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelPackage.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group hover:bg-primary hover:text-white transition-all duration-300">
                    <CheckCircle2 className="text-secondary h-5 w-5 shrink-0 group-hover:text-white" />
                    <span className="font-bold text-sm">{item.item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tour Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-serif font-black flex items-center gap-4 text-primary">
                    <div className="h-8 w-1.5 bg-secondary rounded-full" />
                    Lộ trình hành trình
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2 italic">Bản đồ mô phỏng lộ trình di chuyển của bạn</p>
                </div>
                <div className="flex items-center gap-4">
                  {googleTripUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6 h-10 text-xs font-bold transition-all"
                    >
                      <a href={googleTripUrl} target="_blank" rel="noreferrer">
                        Google Maps
                      </a>
                    </Button>
                  )}
                  {googleTripUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6 h-10 text-xs font-bold transition-all"
                      onClick={() => copyToClipboard(googleTripUrl)}
                    >
                      Copy link
                    </Button>
                  )}
                  <Button 
                    onClick={() => setShowMapPanel(!showMapPanel)}
                    variant="outline"
                    className={`rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-6 h-10 text-xs font-bold transition-all ${showMapPanel ? 'bg-primary text-white' : ''}`}
                  >
                    {showMapPanel ? 'Đóng chỉnh sửa' : 'Chỉnh sửa lộ trình'}
                  </Button>
                  <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Tracking</span>
                  </div>
                </div>
              </div>

              <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative group bg-gray-50">
                <RouteMapLoader 
                  location={travelPackage.location} 
                  name={travelPackage.name} 
                  showPanel={showMapPanel}
                  points={mapPoints}
                />
                <div className="absolute top-4 right-4 z-20 glass-morphism px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider">Tọa độ VIP</span>
                </div>
                
                {!showMapPanel && (
                  <div className="absolute bottom-6 left-6 z-20 glass-morphism p-4 rounded-2xl border border-white/50 max-w-[220px] hidden sm:block">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Mẹo dẫn đường</p>
                    <p className="text-[11px] text-gray-600 leading-tight italic">Kéo thả các điểm để khám phá lộ trình. Nhấn &quot;Chỉnh sửa&quot; để nhập địa chỉ cụ thể.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-[2.5rem] border border-primary/10 bg-primary/5 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Eco Impact</div>
                    <div className="text-xl font-black text-primary">Ước tính khí thải cho lộ trình</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-bold text-gray-600">
                      Số khách: <span className="text-primary">{travelerCount}</span>
                    </div>
                    <Button type="button" variant="outline" className="rounded-full" onClick={() => setShowTripSummary(true)}>
                      Kết thúc chuyến đi
                    </Button>
                  </div>
                </div>

                {itinerarySummary.legs.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    Tour này chưa có lộ trình chi tiết để tính CO2e. Admin có thể thêm các chặng (legs) trong trang quản trị.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itinerarySummary.legs.map((leg) => (
                      <div key={leg.id} className="bg-white rounded-2xl p-4 border border-white/70 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="font-black text-sm text-primary">
                            {transportModeLabels[leg.mode]} • {leg.fromName} → {leg.toName}
                          </div>
                          <div className="text-xs font-bold text-gray-500">
                            {leg.distanceKm != null ? `${leg.distanceKm.toFixed(1)} km` : 'Chưa có quãng đường'} •{' '}
                            {leg.kgCo2e != null ? `${leg.kgCo2e.toFixed(2)} kg CO2e` : 'Chưa tính được CO2e'}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <a
                            className="text-xs font-bold text-primary underline underline-offset-4"
                            href={getLegGoogleUrl(leg)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Xem chặng này trên Google Maps
                          </a>
                          <button
                            type="button"
                            className="text-xs font-bold text-gray-600 underline underline-offset-4"
                            onClick={() => copyToClipboard(getLegGoogleUrl(leg))}
                          >
                            Copy link chặng
                          </button>
                        </div>
                        {leg.note && <div className="mt-2 text-xs text-gray-500 italic">{leg.note}</div>}
                      </div>
                    ))}

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white p-4 border border-white/70">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total Distance</div>
                        <div className="text-2xl font-black text-primary">{itinerarySummary.totalDistanceKm.toFixed(1)} km</div>
                      </div>
                      <div className="rounded-2xl bg-white p-4 border border-white/70">
                        <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total Emissions</div>
                        <div className="text-2xl font-black text-primary">{itinerarySummary.totalKgCo2e.toFixed(2)} kg CO2e</div>
                        <div className="text-[10px] text-gray-500 mt-1">Tính theo số khách hiện tại</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <AlertDialog open={showTripSummary} onOpenChange={setShowTripSummary}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tổng kết chuyến đi</AlertDialogTitle>
                <AlertDialogDescription>
                  Tổng kết CO2e dựa trên lộ trình và số khách hiện tại.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {itinerarySummary.legs.length === 0 ? (
                <div className="text-sm text-muted-foreground">Chưa có lộ trình chi tiết để tổng kết.</div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Số khách</div>
                      <div className="text-lg font-semibold">{travelerCount}</div>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Tổng quãng đường</div>
                      <div className="text-lg font-semibold">{itinerarySummary.totalDistanceKm.toFixed(1)} km</div>
                    </div>
                    <div className="rounded-xl border p-3">
                      <div className="text-xs text-muted-foreground">Tổng CO2e</div>
                      <div className="text-lg font-semibold">{itinerarySummary.totalKgCo2e.toFixed(2)} kg</div>
                    </div>
                  </div>

                  <div className="rounded-xl border p-3">
                    <div className="text-sm font-semibold mb-2">Theo phương tiện</div>
                    <div className="space-y-2">
                      {emissionsByMode.map(([mode, v]) => (
                        <div key={mode} className="flex items-center justify-between text-sm">
                          <div className="font-medium">{transportModeLabels[mode as keyof typeof transportModeLabels] ?? mode}</div>
                          <div className="text-muted-foreground">{v.km.toFixed(1)} km • {v.kg.toFixed(2)} kg CO2e</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>Đóng</AlertDialogCancel>
                <AlertDialogAction onClick={() => setShowTripSummary(false)}>Xong</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32"
            >
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
                
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-serif font-black text-primary mb-2">Đặt Gói Ngay</h3>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Khởi đầu hành trình xanh của bạn</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="firstname">Tên</Label>
                      <Input 
                        id="firstname" 
                        name="firstname" 
                        placeholder="VD: Anh" 
                        className={`rounded-2xl h-14 bg-gray-50 border-none focus:ring-2 focus:ring-secondary ${errors.firstname ? 'ring-2 ring-red-500' : ''}`}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="lastname">Họ</Label>
                      <Input 
                        id="lastname" 
                        name="lastname" 
                        placeholder="VD: Nguyễn" 
                        className={`rounded-2xl h-14 bg-gray-50 border-none focus:ring-2 focus:ring-secondary ${errors.lastname ? 'ring-2 ring-red-500' : ''}`}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="email">Email liên hệ</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="example@gmail.com" 
                      className={`rounded-2xl h-14 bg-gray-50 border-none focus:ring-2 focus:ring-secondary ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="+84 ..." 
                      className={`rounded-2xl h-14 bg-gray-50 border-none focus:ring-2 focus:ring-secondary ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase ml-2 text-gray-400">Ngày khởi hành</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className={`w-full h-14 rounded-2xl bg-gray-50 border-none justify-start text-left font-normal ${
                              errors.bookingDate ? 'ring-2 ring-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4 text-secondary" />
                            {bookingDate ? format(bookingDate, 'dd/MM/yyyy', { locale: vi }) : <span className="text-gray-400">Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl">
                          <CalendarComponent
                            mode="single"
                            selected={bookingDate}
                            onSelect={setBookingDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="guests">Số khách</Label>
                      <Input 
                        id="guests" 
                        name="guests" 
                        type="number" 
                        min="1" 
                        max="50"
                        placeholder="2" 
                        defaultValue={travelerCount}
                        className={`rounded-2xl h-14 bg-gray-50 border-none focus:ring-2 focus:ring-secondary ${errors.numberOfGuests ? 'ring-2 ring-red-500' : ''}`}
                        onChange={(e) => {
                          const n = Number(e.target.value)
                          setTravelerCount(Number.isFinite(n) && n > 0 ? Math.floor(n) : 1)
                        }}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase ml-2 text-gray-400" htmlFor="special-requests">Yêu cầu đặc biệt</Label>
                    <Textarea 
                      id="special-requests" 
                      name="special-requests" 
                      placeholder="Ghi chú thêm cho chúng tôi..." 
                      className="rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-secondary min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-gray-900 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Clock size={20} />
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-3">
                        Xác nhận đặt ngay
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                  
                  <p className="text-[9px] text-center text-gray-400 px-4">
                    Bằng cách nhấn xác nhận, bạn đồng ý với các <Link href="/terms" className="text-secondary underline">điều khoản dịch vụ</Link> của Eco-Tour Việt Nam.
                  </p>
                </form>
              </div>

              {/* Support Badge */}
              <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Thanh toán an toàn</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Hỗ trợ 24/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
