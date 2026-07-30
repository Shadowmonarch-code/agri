export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Skeleton */}
      <nav className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
          <div className="hidden md:flex items-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted rounded animate-pulse" />
            <div className="h-9 w-24 bg-primary/20 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="h-5 w-40 bg-green-100 dark:bg-green-900/30 rounded-full animate-pulse" />
              <div className="h-14 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-36 bg-primary rounded-lg animate-pulse" />
                <div className="h-12 w-28 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="h-[400px] bg-gradient-to-br from-green-100 to-emerald-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 w-16 mx-auto bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 mx-auto bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-12">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="h-6 w-48 mx-auto bg-muted rounded animate-pulse" />
                <div className="h-4 w-64 mx-auto bg-muted rounded animate-pulse" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="h-64 bg-card rounded-xl border p-6 space-y-4">
                    <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="space-y-2">
                      {[1, 2].map((line) => (
                        <div key={line} className="h-3 w-full bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                    <div className="pt-4">
                      <div className="h-8 w-full bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
