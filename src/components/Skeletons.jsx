export function SkeletonCard({ className = '' }) {
  return (
    <div className="glass-card p-6">
      <div className={`skeleton h-4 w-3/4 mb-4 ${className}`} />
      <div className="skeleton h-3 w-full mb-2" />
      <div className="skeleton h-3 w-5/6 mb-2" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  );
}

export function SkeletonImage({ className = '' }) {
  return (
    <div className={`skeleton aspect-video w-full rounded-xl ${className}`} />
  );
}

export function SkeletonReport() {
  return (
    <div className="space-y-4 page-transition">
      <div className="glass-card p-6">
        <div className="skeleton h-6 w-1/2 mb-4" />
        <div className="flex gap-3 mb-4">
          <div className="skeleton h-7 w-20 rounded-full" />
          <div className="skeleton h-7 w-20 rounded-full" />
        </div>
        <div className="skeleton h-3 w-full mb-2" />
        <div className="skeleton h-3 w-4/5 mb-2" />
        <div className="skeleton h-3 w-3/5" />
      </div>
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-1/3 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonWeather() {
  return (
    <div className="space-y-4">
      <div className="glass-card p-6">
        <div className="skeleton h-6 w-2/5 mb-4" />
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="skeleton h-4 w-2/3 mx-auto mb-3" />
            <div className="skeleton h-8 w-8 rounded-full mx-auto mb-3" />
            <div className="skeleton h-3 w-full mb-1" />
            <div className="skeleton h-3 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonNews() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <div className="skeleton h-40 w-full rounded-b-none" />
          <div className="p-4">
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-3 w-5/6 mb-2" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
