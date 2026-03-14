'use client'

import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'

const MapLoader = () => {
  const ContactMap = useMemo(() => dynamic(
    () => import('@/components/ui/ContactMap'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return <ContactMap lat={-1.2921} lng={36.8219} popupText="Nairobi, Kenya" />
}

export default MapLoader
