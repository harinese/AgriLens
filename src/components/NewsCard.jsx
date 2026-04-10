export default function NewsCard({ article }) {
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card glass-card-hover overflow-hidden no-underline text-inherit block group"
    >
      <div className="relative h-40 bg-gradient-to-br from-forest-100 to-stone-100 overflow-hidden">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-forest-300" stroke="currentColor" strokeWidth="1">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.8 0 3.5-.5 5-1.3" strokeLinecap="round"/>
              <path d="M12 6c-2 2-3 5-2 8M14 4c1 3 1 6 0 9M8.5 7c3-1 6-.5 8 1" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {article.source?.name && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-stone-700 text-[10px] px-2 py-1 rounded-full font-medium">
            {article.source.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-800 text-sm mb-2 line-clamp-2 group-hover:text-forest-700 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-2 mb-2">
          {article.description}
        </p>
        <p className="text-[11px] text-stone-400">
          {formatDate(article.publishedAt)}
        </p>
      </div>
    </a>
  );
}
