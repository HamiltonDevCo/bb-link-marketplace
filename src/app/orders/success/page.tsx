'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import NavBar from '@/components/NavBar'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Payment received. You'll get an email confirmation shortly. Our team will reach out within 24 hours to kick things off.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 font-mono mb-6 break-all">Ref: {sessionId}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
          >
            Track Your Order
          </Link>
          <Link
            href="/"
            className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Browse More Sites
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <SuccessContent />
      </Suspense>
    </>
  )
}
