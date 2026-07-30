export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-[150px] font-bold text-green-600/20 leading-none select-none">
          404
        </h1>
        
        {/* Message */}
        <h2 className="text-2xl font-semibold text-foreground mt-[-30px] mb-4">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </a>
          <a
            href="/#departments"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors"
          >
            Browse Departments
          </a>
        </div>
        
        {/* Decorative element */}
        <div className="mt-12 text-6xl opacity-20">
          🌾
        </div>
      </div>
    </div>
  );
}
