'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Country {
  name: string
  image: string
  slug: string
}

const countries: Country[] = [
  { name: "Kenya", image: "/images/Nairobi.jpg", slug: "kenya" },
  { name: "Tanzania", image: "/images/tz.png", slug: "tanzania" },
  { name: "UAE", image: "/images/uae.jpg", slug: "uae" },
  { name: "South Africa", image: "/images/south-africa.jpg", slug: "south-africa" },
  { name: "Namibia", image: "/images/dessert.jpeg", slug: "namibia" },
  { name: "Botswana", image: "/images/botswana.jpg", slug: "botswana" },
  { name: "Sri Lanka", image: "/images/sirilanka.jpg", slug: "sri-lanka" },
  { name: "Singapore", image: "/images/singapore.jpg", slug: "singapore" },
 
]

export function CountrySidebar() {
  const pathname = usePathname()
  const currentCountry = pathname.split('/').pop()

  return (
    <aside className="w-64 bg-gray-50 rounded-lg shadow-sm">
      <div className="space-y-4 p-4">
        {countries
          .filter(country => country.slug !== currentCountry)
          .slice(0, 5)
          .map((country) => (
            <Link
              key={country.name}
              href={`/destinations/${country.slug}`}
              className="block group"
            >
              <div className="relative h-40 cursor-pointer overflow-hidden rounded-lg">
                <Image
                  src={country.image}
                  alt={country.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  width={300}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 w-full p-4">
                  <h3 className="text-lg font-semibold text-white">{country.name}</h3>
                  <div className="mt-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 rounded-md px-2 text-sm flex items-center">
                    Explore Destinations
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </aside>
  )
}