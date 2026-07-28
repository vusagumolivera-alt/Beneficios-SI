export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ede8] flex flex-col overflow-hidden">
      <div className="h-16 bg-gradient-to-br from-[#c8e0d2] to-[#d4e8da] shrink-0" />
      <div className="flex justify-center -mt-8 px-4 relative z-10 shrink-0">
        <div className="w-16 h-16 rounded-full border-4 border-white shadow-md skeleton-pulse" />
      </div>
      <div className="px-4 pt-2 pb-3 flex flex-col items-center gap-2 flex-1">
        <div className="skeleton-pulse h-4 w-3/4 mt-1" />
        <div className="skeleton-pulse h-3 w-1/2" />
        <div className="skeleton-pulse h-3 w-2/3 mt-1" />
        <div className="skeleton-pulse h-5 w-20 rounded-full mt-1" />
        <div className="skeleton-pulse h-3 w-1/2 mt-1" />
      </div>
      <div className="border-t border-[#e8f2ec] h-10 skeleton-pulse rounded-none" />
    </div>
  )
}
