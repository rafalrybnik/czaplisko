import { prisma } from '../../../utils/prisma'

const defaultNavigation = [
  { id: 'default-1', label: 'Start', path: '/', order: 0 },
  { id: 'default-2', label: 'Apartamenty', path: '/apartamenty', order: 1 },
  { id: 'default-3', label: 'Cennik', path: '/cennik', order: 2 },
  { id: 'default-4', label: 'Galeria', path: '/galeria', order: 3 },
  { id: 'default-5', label: 'FAQ', path: '/faq', order: 4 },
  { id: 'default-6', label: 'Kontakt', path: '/kontakt', order: 5 },
]

export default defineEventHandler(async () => {
  try {
    const items = await prisma.navigationItem.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        label: true,
        path: true,
        order: true,
      },
    })

    // Return default navigation if no items in database
    if (items.length === 0) {
      return defaultNavigation
    }

    return items
  } catch (error) {
    // Return default navigation if table doesn't exist or other DB error
    console.error('[navigation] Database error, using fallback:', error)
    return defaultNavigation
  }
})
