export default function OfflineBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-stone-800 text-white text-center py-2 px-4 text-xs font-medium shadow-lg">
      <span className="inline-flex items-center gap-2">
        <span className="status-dot" style={{ background: '#F87171' }} />
        You're offline — Some features may not work. Please check your connection.
      </span>
    </div>
  );
}
