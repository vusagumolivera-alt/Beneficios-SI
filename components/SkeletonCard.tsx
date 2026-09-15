export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] border border-[#e3ebe6] overflow-hidden">
      <div className="m-2 mb-0 h-[116px] rounded-2xl skeleton-pulse" />
      <div className="px-3.5 pt-3 pb-3.5 space-y-2">
        <div className="h-3.5 w-4/5 skeleton-pulse" />
        <div className="h-3 w-1/2 skeleton-pulse" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 w-1/3 skeleton-pulse" />
          <div className="h-6 w-16 rounded-full skeleton-pulse" />
        </div>
      </div>
    </div>
  )
}
