import { PostsGrid } from "./posts-grid";

// "Latest articles": section header plus the filterable post list.
export function LatestArticles({ category = "All" }: { category?: string }) {
  return (
    <div className="bg-secondary-background">
      <div className="container">
        <div className="border-subtle-stroke border-x">
          <header className="grid grid-cols-12 pt-40 pb-20 max-xl:pt-30 max-xl:pb-16 max-lg:pt-25 max-lg:pb-15 justify-items-start !pb-12 lg:grid-cols-24">
            <div className="max-w-[20em] text-pretty text-heading-responsive-sm text-start col-[2/-2] mix-blend-multiply dark:mix-blend-screen">
              <h2 className="text-pretty inline">
                {"Latest articles"}
              </h2>
              {" "}
            </div>
          </header>
          <svg width="100%" height="1" className="text-subtle-stroke max-lg:hidden">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeLinecap="round" />
          </svg>
          <svg width="100%" height="1" className="text-subtle-stroke lg:hidden">
            <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>
          <PostsGrid initialCategory={category} />
        </div>
      </div>
    </div>
  );
}
