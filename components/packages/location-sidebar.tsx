import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

// Enhanced package category type with keywords for filtering
interface PackageCategory {
  name: string
  image: string
  keywords: string[]
}

// Expanded package categories with comprehensive keywords
const packageCategories: PackageCategory[] = [
  { 
    name: "All Packages",
    image: "/images/family.svg", 
    keywords: []
  },
  { 
    name: "Beach", 
    image: "/images/msa.jpg", 
    keywords: ["beach", "ocean", "coast", "seaside", "shore", "sand", "sea", "waves", "lake", "riverside", "waterfront", "coastal"]
  },
  { 
    name: "Wildlife", 
    image: "/images/wildbeast.jpg", 
    keywords: ["wildlife", "safari", "park", "animal", "nature reserve", "ecosystem", "habitat", "jungle", "wilderness", "game reserve", "national park"]
  },
  { 
    name: "Desert", 
    image: "/images/dessert.jpeg", 
    keywords: ["desert", "sand dunes", "arid", "semi-arid", "sahara", "wasteland", "dry", "barren", "rocky terrain", "desert adventure"]
  },
  { 
    name: "Forest", 
    image: "/images/forest.jpg", 
    keywords: ["forest", "woodland", "rainforest", "jungle", "plantation", "grove", "timberland", "tree cover", "forest adventure"]
  }
]

interface PackageSidebarProps {
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}

export function PackageSidebar({ 
  onCategorySelect, 
  selectedCategory
}: PackageSidebarProps) {
  return (
    <aside className="w-64 bg-gray-50">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4">
          {packageCategories.map((category) => (
            <div
              key={category.name}
              className="group relative h-40 cursor-pointer overflow-hidden rounded-lg"
              onClick={() => onCategorySelect(category.name === "All Packages" ? null : category.name)}
            >
              <Image
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                width={300}
                height={200}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 w-full p-4">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                <Button
                  variant={selectedCategory === category.name || (category.name === "All Packages" && selectedCategory === null) ? "secondary" : "ghost"}
                  className="mt-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  {selectedCategory === category.name || (category.name === "All Packages" && selectedCategory === null) ? "Selected" : "Explore"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

// Export the keywords for potential reuse in filtering
export const packageCategoryKeywords = packageCategories.flatMap(cat => cat.keywords);

