'use client'

import React, { useState } from 'react'
import { Button } from '@/components/bookingBtn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Destination } from '@/utils/destinationData'
import { ArrowLeft, MapPin, Calendar, Clock, BarChart2 } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { useBookingValidation } from '../../hooks/useBookingValidation'
import { formatBookingData } from '../../utils/bookingUtils'

import Image from 'next/image'

interface DestinationDetailProps {
  destination: Destination
  onClose: () => void
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, onClose }) => {
  const [bookingDate, setBookingDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const { errors, validateForm } = useBookingValidation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const validatedData = validateForm(formData, bookingDate)
    
    if (!validatedData) {
      setIsLoading(false)
      return
    }

    const bookingData = formatBookingData(validatedData, destination.name, destination.price)

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking')
      }

      toast.success('Booking Successful', {
        description: 'Your adventure booking as been sent !',
        duration: 5000,
        action: {
          label: 'More Destinations',
          onClick: () => window.location.href = '/destinations/africa'
        }
      })
      onClose()
      
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button onClick={onClose} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Destinations
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 sm:h-96">
            <Image 
              src={destination.imageUrl} 
              alt={destination.name} 
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              {...(destination.imageUrl.startsWith('data:') ? { unoptimized: true } : {})}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{destination.name}</h1>
              <p className="text-lg sm:text-xl text-white flex items-center">
                <MapPin className="mr-2 h-5 w-5" /> {destination.location}
              </p>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{destination.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Best Time</p>
                  <p className="font-semibold">{destination.bestTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <BarChart2 className="h-6 w-6 mr-2 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-semibold">{destination.difficulty}</p>
                </div>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About this Adventure</h2>
                <p className="text-gray-700 mb-8">{destination.description}</p>
                
                <h3 className="text-xl font-bold mb-4">What&apos;s Included:</h3>
                <ul className="list-disc pl-5 mb-8">
                  {destination.included.map((item) => (
                    <li key={item.id} className="text-gray-700 mb-2">{item.item}</li>
                  ))}
                </ul>
              </div>
              
              {/* Booking Section */}
              <div>
                <div className="bg-gray-100 p-6 rounded-lg mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Price</h3>
                    <p className="text-3xl font-bold text-green-600">KES {destination.price}</p>
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-2xl font-bold mb-4">Book Your Adventure</h3>
                  
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Enter your full name" 
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="Enter your phone number"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label>Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className={`w-full justify-start text-left font-normal ${errors.bookingDate ? "border-red-500" : ""}`}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {bookingDate ? format(bookingDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={bookingDate}
                          onSelect={setBookingDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.bookingDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.bookingDate}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input 
                      id="guests" 
                      name="guests" 
                      type="number" 
                      min="1" 
                      placeholder="Enter number of guests"
                      className={errors.guests ? "border-red-500" : ""}
                    />
                    {errors.guests && (
                      <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="special-requests">Special Requests</Label>
                    <Textarea 
                      id="special-requests" 
                      name="special-requests" 
                      placeholder="Any special requests or requirements?" 
                    />
                  </div>

                  <Button 
                    variant="gooeyLeft"
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-800 hover:text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Book Now'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}