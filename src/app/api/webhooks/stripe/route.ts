import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!

    const order = await prisma.order.create({
      data: {
        siteId: meta.siteId,
        type: meta.type as 'GUEST_POST' | 'LINK_INSERT',
        status: 'PAID',
        stripeSessionId: session.id,
        amountPaid: session.amount_total!,
        clientEmail: meta.clientEmail.toLowerCase(),
        clientName: meta.clientName,
        targetUrl: meta.targetUrl,
        anchorText: meta.anchorText,
        contentNotes: meta.contentNotes || null,
        dofollow: meta.dofollow === 'true',
      },
      include: { site: true },
    })

    // Trigger n8n fulfillment workflow
    if (process.env.N8N_FULFILLMENT_WEBHOOK) {
      await fetch(process.env.N8N_FULFILLMENT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          type: order.type,
          siteName: order.site.name,
          siteDomain: order.site.domain,
          clientName: order.clientName,
          clientEmail: order.clientEmail,
          targetUrl: order.targetUrl,
          anchorText: order.anchorText,
          contentNotes: order.contentNotes,
          dofollow: order.dofollow,
          amountPaid: order.amountPaid,
        }),
      }).catch(console.error)
    }
  }

  return NextResponse.json({ received: true })
}
