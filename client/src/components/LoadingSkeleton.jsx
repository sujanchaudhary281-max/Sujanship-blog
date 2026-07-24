import React from 'react'

const Skel = ({ className = '' }) => <div className={`skeleton rounded ${className}`} />

export default function LoadingSkeleton() {
  return (
    <div className="flex-1 bg-canvas-soft min-h-screen">
      {/* Hero placeholder */}
      <div className="text-center" style={{ padding: '96px 24px 64px' }}>
        <Skel className="h-3 w-48 mx-auto mb-6 rounded-full" />
        <Skel className="h-12 w-3/4 max-w-[32rem] mx-auto mb-5" />
        <Skel className="h-5 w-full max-w-[28rem] mx-auto mb-3" />
        <Skel className="h-5 w-full max-w-[24rem] mx-auto mb-10" />
        <div className="flex gap-3 justify-center">
          <Skel className="h-12 w-40 rounded-full" />
          <Skel className="h-12 w-36 rounded-full" />
        </div>
      </div>

      {/* Cards placeholder */}
      <div className="max-w-[1200px] mx-auto px-6 pb-16">
        <Skel className="h-6 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-[8px] bg-canvas shadow-level-1 overflow-hidden">
              <Skel className="h-44 w-full rounded-none" />
              <div className="p-6 space-y-2">
                <Skel className="h-3 w-16" />
                <Skel className="h-4 w-full" />
                <Skel className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
