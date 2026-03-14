"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/packages/package-card";
import { PackageCardSkeleton } from "@/components/packages/packageSkeleton";
import { PackageSidebar } from "@/components/packages/location-sidebar";
import { Package } from "@/types/packages";
import Image from 'next/image';

const CACHE_KEY = "packages_data";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setPackages(data);
            setLoading(false);
            return;
          }
        }

        const response = await fetch("/api/packages");
        if (!response.ok) {
          throw new Error("No packages found, retry refreshing the page");
        }
        const data = await response.json();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        setPackages(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages = selectedCategory
    ? packages.filter((pkg) => {
        const locationMatch = pkg.location.toLowerCase().includes(selectedCategory.toLowerCase());
        const typeMatch = pkg.type && pkg.type.toLowerCase().includes(selectedCategory.toLowerCase());
        return locationMatch || typeMatch;
      })
    : packages;

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPackages = filteredPackages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-green-100">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-red-600">
            Error Loading Packages
          </h2>
          <p className="text-gray-600 text-lg">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6efe5]">
      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden bg-black text-white">
        <div className="h-40">
        <Image
        src="/images/hero_packages.jpg"
        alt="image"
        width={1920}
        height={160}
        className="z-1 absolute left-0 top-0 h-full w-full object-cover"
        priority
      />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">
              Explore Packages
            </h1>
          </div>
        </div>
        <div
          className="relative z-20 h-32 w-full -scale-y-[1] bg-contain bg-repeat-x"
          style={{
            backgroundImage: "url('/images/banner_style.png')",
            filter:
              "invert(92%) sepia(2%) saturate(1017%) hue-rotate(342deg) brightness(106%) contrast(93%)",
          }}
        />
      </div>

     

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-8 md:mb-12 lg:mb-16">
      <div className="inline-flex items-center justify-center mb-4 md:mb-6">
        <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide text-green-800 bg-green-100 px-2 sm:px-3 py-1 rounded-full">
          Explore our top Packages
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
        Our <span className="text-green-600">Featured</span>{" "}
      Packages 
      </h2>
    </div>
        <div className="flex flex-col lg:flex-row">
          {/* Package Sidebar (hidden on small screens) */}
          <div className="hidden lg:block">
            <PackageSidebar
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Package Cards */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <PackageCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {displayedPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedPackages.map((pkg) => (
                      <PackageCard key={pkg.id} package={pkg} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                      No packages found
                    </h3>
                    <p className="text-gray-500">
                      {selectedCategory
                        ? `No packages available for ${selectedCategory}. Try selecting a different category.`
                        : "Check back later for exciting new travel packages."}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <span className="text-lg font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

