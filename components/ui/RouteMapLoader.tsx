'use client'

import dynamic from 'next/dynamic'
import React, { useMemo, useState, useEffect } from 'react'

type RoutePoint = { lat: number; lng: number; label?: string }

const RouteMapLoader = ({
  location,
  showPanel = false,
  points,
  disableGeolocation = false,
}: {
  location: string
  name: string
  showPanel?: boolean
  points?: RoutePoint[]
  disableGeolocation?: boolean
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (disableGeolocation) return
    if (Array.isArray(points) && points.length >= 2) return
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [disableGeolocation, points]);

  const RouteMap = useMemo(() => dynamic(
    () => import('@/components/ui/RouteMap'),
    { 
      loading: () => (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-2xl">
          <p className="text-gray-500 font-medium">Loading Tour Map...</p>
        </div>
      ),
      ssr: false
    }
  ), [])

  const hasPoints = Array.isArray(points) && points.length >= 2

  // Use user location as start if available, otherwise default to a point near destination
  let startPoint = { lat: -1.2921, lng: 36.8219, label: 'Nairobi' }
  
  if (userLocation) {
    startPoint = { lat: userLocation.lat, lng: userLocation.lng, label: 'Your Location' }
  } else if (location.toLowerCase().includes('hồ chí minh') || location.toLowerCase().includes('việt nam')) {
    // Default to a central point in HCM if user in Vietnam but location fails
    startPoint = { lat: 10.8231, lng: 106.6297, label: 'Quận 12, TP.HCM' }
  }
  
  // Create a mock destination coordinate based on the location name
  // This is just to demonstrate the route feature.
  let destPoint = { lat: -1.2921, lng: 36.8219, label: location }
  
  // Sample destinations in Kenya
  if (location.toLowerCase().includes('mombasa')) destPoint = { lat: -4.0435, lng: 39.6682, label: 'Mombasa' }
  else if (location.toLowerCase().includes('masaai mara')) destPoint = { lat: -1.5271, lng: 35.1925, label: 'Maasai Mara' }
  else if (location.toLowerCase().includes('amboseli')) destPoint = { lat: -2.6521, lng: 37.2625, label: 'Amboseli' }
  else if (location.toLowerCase().includes('nakuru')) destPoint = { lat: -0.3031, lng: 36.0800, label: 'Lake Nakuru' }
  else if (location.toLowerCase().includes('diani')) destPoint = { lat: -4.2800, lng: 39.5800, label: 'Diani Beach' }
  else if (location.toLowerCase().includes('naivasha')) destPoint = { lat: -0.7171, lng: 36.4310, label: 'Lake Naivasha' }
  // Support for Saigon tour
  else if (location.toLowerCase().includes('hồ chí minh')) destPoint = { lat: 10.7719, lng: 106.6983, label: 'Bến Thành, TP.HCM' }
  
  const routePoints = hasPoints ? (points as RoutePoint[]) : [startPoint, destPoint]
  const pointsKey = hasPoints ? routePoints.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join('|') : ''

  return (
    <div className="w-full h-full relative">
      <RouteMap 
        key={`${location}-${hasPoints ? pointsKey : userLocation ? 'with-loc' : 'no-loc'}`} 
        points={routePoints} 
        zoom={hasPoints ? 12 : userLocation ? 12 : 7} 
        showPanel={showPanel} 
      />
    </div>
  )
}

export default RouteMapLoader
