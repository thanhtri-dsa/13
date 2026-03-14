import Image from 'next/image';
import { Package } from '@/types/packages';
import { ArrowRight, MapPin, CalendarDays,Tag } from 'lucide-react'
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const fallbackImage = "/images/travel_detsinations.jpg"
  const src =
    typeof pkg.imageData === 'string' && pkg.imageData.trim().length > 0 && pkg.imageData !== '/images/saigon.jpg'
      ? pkg.imageData
      : fallbackImage

  return (
    <div className="group h-full flex flex-col bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-transparent hover:border-green-200">
      <div className="relative pt-[66.66%] w-full overflow-hidden">
        <Image
          src={src}
          alt={pkg.name}
          fill
          className="absolute inset-0 object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <h2 className="text-lg md:text-xl font-bold mb-2 capitalize text-gray-800 line-clamp-2 min-h-[2.5rem]">
          {pkg.name}
        </h2>
        <div className="flex-grow space-y-2">
          <p className="text-gray-600 text-sm md:text-base capitalize flex items-center">
            <span className="mr-2"><MapPin /></span>
            {pkg.location}
          </p>
          <p className="text-gray-600 text-sm md:text-base  flex items-center">
            <span className="mr-2"><CalendarDays /></span>
            {pkg.duration}
          </p>
          {pkg.type && (
            <p className="text-gray-600 text-sm md:text-base capitalize flex items-center">
              <span className="mr-2"> <Tag /></span>
              Type: {pkg.type}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-700 font-semibold text-base md:text-lg">
            Kes. {pkg.price.toLocaleString()}
          </p>
          <Link href={`/packages/${pkg.id}`} className="group">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white transition-all 
              duration-300 text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 flex items-center"
            >
              <span className="mr-1 sm:mr-2 whitespace-nowrap">View Details</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Recommended Wrapper Component for Grid Layout
export function PackageCardGrid({ packages }: { packages: Package[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
