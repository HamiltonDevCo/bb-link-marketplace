import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sites = await prisma.site.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(sites)
}
