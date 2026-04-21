export type SiteRecord = {
  id: string;
  slug: string;
  domain: string;
  name: string;
  niche: string;
  description: string;
  dr: number;
  da: number;
  priceGuest: number;
  priceLink: number;
  turnaround: number;
  dofollow: boolean;
  maxLinks: number;
  active: boolean;
};

export type OrderRecord = {
  id: string;
  siteId: string;
  type: 'GUEST_POST' | 'LINK_INSERT';
  status: 'PAID' | 'IN_PROGRESS' | 'REVIEW' | 'PUBLISHED' | 'CANCELLED';
  amountPaid: number;
  clientEmail: string;
  clientName: string;
  targetUrl: string;
  anchorText: string;
  contentNotes?: string;
  publishedUrl?: string;
  createdAt: string;
  site: SiteRecord;
};
