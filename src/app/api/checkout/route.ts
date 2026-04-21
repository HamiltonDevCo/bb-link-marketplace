import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { siteSlug, type, clientName, clientEmail, targetUrl, anchorText, contentNotes, dofollow } = body

  if (!siteSlug || !type || !clientName || !clientEmail || !targetUrl || !anchorText) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const site = await prisma.site.findUnique({ where: { slug: siteSlug, active: true } })
  if (!site) {
    return NextResponse.json({ error: 'Site not found' }, { status: 404 })
  }

  const price = type === 'GUEST_POST' ? site.priceGuest : site.priceLink
  const label = type === 'GUEST_POST' ? 'Guest Post' : 'Link Insertion'

  const metadata = {
    siteId: site.id,
    siteSlug,
    type,
    clientName,
    clientEmail,
    targetUrl,
    anchorText,
    contentNotes: contentNotes || '',
    dofollow: String(dofollow ?? true),
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: clientEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: price,
          product_data: {
            name: `${label} — ${site.name}`,
            description: `Target: ${targetUrl} | Anchor: ${anchorText}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${siteSlug}`,
  })

  return NextResponse.json({ url: session.url })
}
