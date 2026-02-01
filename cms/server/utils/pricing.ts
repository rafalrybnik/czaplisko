import { prisma } from './prisma'

export type SeasonType = 'high' | 'low'

interface PricingInfo {
  pricePerNight: number
  extraBedPrice: number
  minStayNights: number
  seasonType: SeasonType
}

export async function getSeasonType(date: Date): Promise<SeasonType> {
  const seasons = await prisma.seasonRange.findMany()

  for (const season of seasons) {
    const start = new Date(season.startDate)
    const end = new Date(season.endDate)

    // Normalize dates to midnight for comparison
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    if (checkDate >= start && checkDate <= end) {
      return 'high'
    }
  }

  return 'low'
}

export async function getPriceForApartment(
  apartmentId: string,
  seasonType: SeasonType
): Promise<PricingInfo | null> {
  const pricing = await prisma.pricing.findUnique({
    where: {
      apartmentId_seasonType: {
        apartmentId,
        seasonType,
      },
    },
  })

  if (!pricing) return null

  return {
    pricePerNight: Number(pricing.pricePerNight),
    extraBedPrice: Number(pricing.extraBedPrice),
    minStayNights: pricing.minStayNights,
    seasonType,
  }
}

export async function calculateStayPrice(
  apartmentId: string,
  checkIn: Date,
  checkOut: Date,
  extraBeds: number = 0
): Promise<{ totalPrice: number; nights: number; breakdown: Array<{ date: string; price: number; seasonType: SeasonType }> }> {
  const breakdown: Array<{ date: string; price: number; seasonType: SeasonType }> = []
  let totalPrice = 0

  const currentDate = new Date(checkIn)
  currentDate.setHours(0, 0, 0, 0)
  const endDate = new Date(checkOut)
  endDate.setHours(0, 0, 0, 0)

  while (currentDate < endDate) {
    const seasonType = await getSeasonType(currentDate)
    const pricing = await getPriceForApartment(apartmentId, seasonType)

    if (!pricing) {
      throw new Error(`No pricing found for apartment ${apartmentId} in ${seasonType} season`)
    }

    const dayPrice = pricing.pricePerNight + pricing.extraBedPrice * extraBeds

    breakdown.push({
      date: currentDate.toISOString().split('T')[0],
      price: dayPrice,
      seasonType,
    })

    totalPrice += dayPrice
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return {
    totalPrice,
    nights: breakdown.length,
    breakdown,
  }
}
