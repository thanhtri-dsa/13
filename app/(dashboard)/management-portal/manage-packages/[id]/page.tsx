'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { X, Loader2, Trash2 } from 'lucide-react'
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

interface Package {
  id: string
  name: string
  location: string
  imageData?: string
  duration: string
  groupSize: string
  price: number
  description: string
  included: { id: string; item: string; packageId: string }[]
}

interface PackageFormData extends Omit<Package, 'id' | 'price' | 'included'> {
  price: string
  included: string[]
}

const initialFormData: PackageFormData = {
  name: '',
  location: '',
  imageData: '',
  duration: '',
  groupSize: '',
  price: '',
  description: '',
  included: []
}

export default function PackageForm({ params }: { params: { id?: string } }) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<PackageFormData>(initialFormData)
  const [currentIncluded, setCurrentIncluded] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchPackage = useCallback(async (id: string) => {
    setIsFetching(true)
    try {
      const response = await fetch(`/api/packages/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const pkg: Package = await response.json()
      
      setFormData({
        name: pkg.name,
        location: pkg.location,
        imageData: pkg.imageData || '',
        duration: pkg.duration,
        groupSize: pkg.groupSize,
        price: pkg.price.toString(),
        description: pkg.description,
        included: pkg.included.map(item => item.item)
      })
    } catch (error) {
      console.error('Error fetching package:', error)
      toast({
        title: "Error",
        description: "Failed to fetch package details. Please try again.",
        variant: "destructive",
      })
      router.push('/management-portal/manage-packages')
    } finally {
      setIsFetching(false)
    }
  }, [router, toast])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && params.id) {
      setIsEditing(true)
      fetchPackage(params.id)
    }
  }, [params.id, mounted, fetchPackage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/packages${isEditing ? `/${params.id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save package')
      }

      toast({
        title: "Success",
        description: `Package ${isEditing ? 'updated' : 'created'} successfully`,
      })

      router.push('/management-portal/manage-packages')
      router.refresh()
    } catch (error) {
      console.error('Error saving package:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} package`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!params.id) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/packages/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete package')
      }

      toast({
        title: "Success",
        description: "Package deleted successfully",
      })

      router.push('/management-portal/manage-packages')
      router.refresh()
    } catch (error) {
      console.error('Error deleting package:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete package',
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleIncludedKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentIncluded.trim()) {
      e.preventDefault()
      if (!formData.included.includes(currentIncluded.trim())) {
        setFormData(prev => ({
          ...prev,
          included: [...prev.included, currentIncluded.trim()]
        }))
      }
      setCurrentIncluded('')
    }
  }

  const removeIncluded = (itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter(item => item !== itemToRemove)
    }))
  }

  if (!mounted) {
    return null
  }

  if (isFetching) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{isEditing ? 'Edit Package' : 'Create New Package'}</CardTitle>
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupSize">Group Size</Label>
                <Input
                  id="groupSize"
                  name="groupSize"
                  type="text"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="included">What&apos;s Included</Label>
              <Input
                id="included"
                value={currentIncluded}
                onChange={(e) => setCurrentIncluded(e.target.value)}
                onKeyDown={handleIncludedKeyDown}
                placeholder="Press Enter to add items"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.included.map((item, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeIncluded(item)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageData">Image URL</Label>
              <Input
                id="imageData"
                name="imageData"
                value={formData.imageData || ''}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/management-portal/manage-packages')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Package' : 'Create Package'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}