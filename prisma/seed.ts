import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SITES = [
  { slug: 'bourbon-voyage', domain: 'bourbonvoyage.com', name: 'Bourbon Voyage', niche: 'Food & Drink / Spirits', description: 'Bourbon travel guides, distillery reviews, and Kentucky whiskey culture.', ga4Id: 'G-R6Q19R3QDC', gtmId: 'GTM-W2WMP27T', priceGuest: 4500, priceLink: 2500 },
  { slug: 'go-to-bourbon', domain: 'gotobourbon.com', name: 'Go To Bourbon', niche: 'Food & Drink / Spirits', description: 'Your go-to resource for bourbon recommendations, reviews, and cocktail recipes.', ga4Id: 'G-CBDNJZVJ95', gtmId: 'GTM-KJX7C3ZM', priceGuest: 4500, priceLink: 2500 },
  { slug: 'bourbon-city-bistro', domain: 'bourboncitybistro.com', name: 'Bourbon City Bistro', niche: 'Food & Drink / Dining', description: 'Food, cocktails, and dining culture rooted in bourbon country.', ga4Id: 'G-XWG0JV0690', gtmId: 'GTM-PM2FV67N', priceGuest: 4500, priceLink: 2500 },
  { slug: 'seo-nose', domain: 'seonose.com', name: 'SEO Nose', niche: 'Marketing / SEO', description: 'Practical SEO tips, tools, and strategies for digital marketers.', ga4Id: 'G-TTY7P9G0Y2', gtmId: 'GTM-ML89MST3', priceGuest: 5000, priceLink: 3000 },
  { slug: 'want-this-content', domain: 'wantthiscontent.com', name: 'Want This Content', niche: 'Marketing / Content', description: 'Content marketing strategy, copywriting tips, and content creation resources.', ga4Id: 'G-BXC9TXPG8D', gtmId: 'GTM-W3DFXFL8', priceGuest: 5000, priceLink: 3000 },
  { slug: 'more-localer', domain: 'morelocaler.com', name: 'More Localer', niche: 'Marketing / Local SEO', description: 'Local SEO, maps optimization, and hyper-local marketing strategies.', ga4Id: 'G-RMFLMF8WN2', gtmId: 'GTM-N8T48TPR', priceGuest: 4500, priceLink: 2500 },
  { slug: 'home-automation-hq', domain: 'homeautomationsystemhq.com', name: 'Home Automation HQ', niche: 'Technology / Smart Home', description: 'Smart home guides, automation reviews, and DIY home tech tutorials.', ga4Id: 'G-4GZDJ5D8BS', gtmId: 'GTM-WHMZ5W8D', priceGuest: 5000, priceLink: 3000 },
  { slug: 'grid-griller', domain: 'gridgriller.com', name: 'Grid Griller', niche: 'Food & Drink / BBQ', description: 'Grilling tips, BBQ recipes, and outdoor cooking culture.', ga4Id: 'G-5MQWGWNZS1', gtmId: 'GTM-KDDX2K3M', priceGuest: 4500, priceLink: 2500 },
  { slug: 'fly-by-antiques', domain: 'flybyantiques.com', name: 'Fly By Antiques', niche: 'Lifestyle / Antiques & Collectibles', description: 'Antique hunting guides, collectible reviews, and vintage marketplace tips.', ga4Id: 'G-18SBX0ES26', gtmId: 'GTM-MH6H2DX3', priceGuest: 4000, priceLink: 2000 },
  { slug: 'financial-admin-pros', domain: 'financialadminpros.com', name: 'Financial Admin Pros', niche: 'Finance / Business', description: 'Financial administration, bookkeeping tips, and small business finance guides.', ga4Id: 'G-8VYRQ163X6', gtmId: 'GTM-KR4CQHQ7', priceGuest: 5500, priceLink: 3500 },
  { slug: 'entertainment-catalyst', domain: 'entertainmentcatalyst.com', name: 'Entertainment Catalyst', niche: 'Entertainment / Media', description: 'Entertainment industry insights, media reviews, and pop culture commentary.', ga4Id: 'G-YJKFZBK6KD', gtmId: 'GTM-MB5K7CSS', priceGuest: 4500, priceLink: 2500 },
  { slug: 'festiventure', domain: 'festiventure.com', name: 'Festiventure', niche: 'Travel / Events & Festivals', description: 'Festival guides, event planning tips, and travel adventures.', ga4Id: 'G-LEB6PG7Q4C', gtmId: 'GTM-KDGWD6QQ', priceGuest: 4500, priceLink: 2500 },
  { slug: 'buy-the-joke', domain: 'buythejoke.com', name: 'Buy The Joke', niche: 'Entertainment / Comedy', description: 'Comedy writing, humor culture, and the business of being funny.', ga4Id: 'G-GHXK4X445X', gtmId: 'GTM-NRN4KRKC', priceGuest: 4000, priceLink: 2000 },
  { slug: 'eye-moolah', domain: 'eyemoolah.com', name: 'Eye Moolah', niche: 'Finance / Personal Finance', description: 'Money mindset, investing basics, and personal finance for regular people.', ga4Id: 'G-KK9KXXL602', gtmId: 'GTM-TCZ543JP', priceGuest: 5500, priceLink: 3500 },
  { slug: 'this-job-now', domain: 'thisjobnow.com', name: 'This Job Now', niche: 'Career / Jobs', description: 'Job search strategies, career advice, and workplace culture guides.', ga4Id: 'G-YYLMCWX2KS', gtmId: 'GTM-N6GZV2RB', priceGuest: 5000, priceLink: 3000 },
  { slug: 'retail-freak', domain: 'retailfreak.com', name: 'Retail Freak', niche: 'Business / Retail & E-Commerce', description: 'Retail strategy, e-commerce tips, and consumer trend analysis.', ga4Id: 'G-1287987C8D', gtmId: 'GTM-K62BZQKN', priceGuest: 5000, priceLink: 3000 },
  { slug: 'automate-tv', domain: 'automatetv.com', name: 'Automate TV', niche: 'Technology / Automation & SaaS', description: 'Business automation tools, SaaS reviews, and workflow optimization guides.', ga4Id: 'G-MNNQVT8KH1', gtmId: 'GTM-PXDZ2MX4', priceGuest: 5500, priceLink: 3500 },
  { slug: 'aox-outdoors', domain: 'aoxoutdoors.com', name: 'AOX Outdoors', niche: 'Lifestyle / Outdoors & Adventure', description: 'Outdoor gear reviews, adventure travel, and nature exploration guides.', ga4Id: 'G-QDRM0PWG9E', gtmId: 'GTM-TMPPPKBM', priceGuest: 4500, priceLink: 2500 },
  { slug: 'rock-tenders', domain: 'rocktenders.com', name: 'Rock Tenders', niche: 'Music / Rock & Metal', description: 'Rock music news, album reviews, and live show coverage.', ga4Id: 'G-B51VZFBC4T', gtmId: 'GTM-PMBPH6GB', priceGuest: 4000, priceLink: 2000 },
  { slug: 'gotta-cab', domain: 'gottacab.com', name: 'Gotta Cab', niche: 'Transportation / Rideshare', description: 'Rideshare tips, taxi industry insights, and urban transportation guides.', ga4Id: 'G-E2BLVVR5T7', gtmId: 'GTM-54D33NR3', priceGuest: 4000, priceLink: 2000 },
  { slug: 'back-at-me', domain: 'backatme.com', name: 'Back At Me', niche: 'Marketing / Social Media', description: 'Social media strategy, influencer marketing, and personal brand building.', ga4Id: 'G-C3W122ZHTZ', gtmId: 'GTM-TLHW5CF7', priceGuest: 5000, priceLink: 3000 },
  { slug: 'buy-4-wife', domain: 'buy4wife.com', name: 'Buy 4 Wife', niche: 'Lifestyle / Gifts & Shopping', description: 'Gift guides, product reviews, and shopping advice for every occasion.', ga4Id: 'G-LHTFCPQGPL', gtmId: 'GTM-K7DWZFHF', priceGuest: 4000, priceLink: 2000 },
  { slug: 'can-buy-one', domain: 'canbuyone.com', name: 'Can Buy One', niche: 'Lifestyle / Consumer Advice', description: 'Product comparisons, buying guides, and consumer reviews for smart shoppers.', ga4Id: 'G-HBD4KGEL96', gtmId: 'GTM-57H9DXX3', priceGuest: 4000, priceLink: 2000 },
]

async function main() {
  for (const site of SITES) {
    await prisma.site.upsert({
      where: { slug: site.slug },
      update: site,
      create: site,
    })
    console.log(`✓ ${site.name}`)
  }
  console.log(`\nSeeded ${SITES.length} sites`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
