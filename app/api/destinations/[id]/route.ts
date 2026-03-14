import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Public GET endpoint - /api/destinations/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const destination = await prisma.destination.findUnique({
      where: { id },
    })

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    return NextResponse.json(destination)
  } catch (error) {
    console.error('Error fetching destination:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Protected PUT endpoint - /api/destinations/[id]
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id
    const { name, country, city, amount, tags, imageData, description, daysNights, tourType } = await request.json()

    if (!name || !country || !city || !amount || !description || !daysNights || !tourType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    })

    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        name,
        country,
        city,
        amount: parseFloat(amount),
        tags,
        imageData,
        description,
        daysNights: parseInt(daysNights),
        tourType,
      },
    })

    return NextResponse.json(updatedDestination)
  } catch (error) {
    console.error('Error updating destination:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Protected DELETE endpoint - /api/destinations/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id

    const existingDestination = await prisma.destination.findUnique({
      where: { id },
    })

    if (!existingDestination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 })
    }

    await prisma.destination.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Destination deleted successfully' })
  } catch (error) {
    console.error('Error deleting destination:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

