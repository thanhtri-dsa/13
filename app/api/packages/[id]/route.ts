import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public GET endpoint - /api/packages/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        included: true
      }
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Protected PUT endpoint - /api/packages/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const clerkEnabled =
      !!process.env.CLERK_SECRET_KEY?.trim() &&
      !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
      (process.env.NODE_ENV === 'production' || process.env.FORCE_CLERK_AUTH === 'true')

    let userId: string | null = null
    if (clerkEnabled) {
      const authRes = await auth()
      userId = authRes.userId ?? null
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      userId = 'dev-admin'
    }

    const id = params.id
    const { name, location, imageData, duration, groupSize, price, description, included } = await request.json()

    if (!name || !location || !duration || !groupSize || !price || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingPackage = await prisma.package.findUnique({
      where: { id },
      include: {
        included: true
      }
    })

    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    if (clerkEnabled && existingPackage.authorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // First delete all existing included items
    await prisma.included.deleteMany({
      where: {
        packageId: id
      }
    })

    // Update package with new data
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name,
        location,
        imageData,
        duration: duration.toString(),
        groupSize: groupSize.toString(),
        price: parseFloat(price.toString()),
        description,
        included: {
          create: included.map((item: string) => ({
            item: item
          }))
        }
      },
      include: {
        included: true
      }
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Protected DELETE endpoint - /api/packages/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const clerkEnabled =
      !!process.env.CLERK_SECRET_KEY?.trim() &&
      !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
      (process.env.NODE_ENV === 'production' || process.env.FORCE_CLERK_AUTH === 'true')

    let userId: string | null = null
    if (clerkEnabled) {
      const authRes = await auth()
      userId = authRes.userId ?? null
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      userId = 'dev-admin'
    }

    const id = params.id

    const existingPackage = await prisma.package.findUnique({
      where: { id },
    })

    if (!existingPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    if (clerkEnabled && existingPackage.authorId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the included items first (due to foreign key constraint)
    await prisma.included.deleteMany({
      where: {
        packageId: id
      }
    })

    // Then delete the package
    await prisma.package.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
