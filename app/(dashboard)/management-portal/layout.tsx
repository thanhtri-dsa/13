"use client"

import React from 'react'
import Sidebar from '@/components/eco-tourism/sidebar'

interface LayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 p-2 sm:p-4 md:p-6 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout