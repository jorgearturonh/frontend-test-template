'use client';

import { Suspense } from 'react';
import { useGetGames } from '@/hooks/useGetGames';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameCard, GameCardSkeleton } from '@/components/GameCard';
import { Dropdown } from '@/components/Dropdown';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const genre = searchParams.get('genre') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  const {
    games,
    filters,
    isLoading,
    isLoadingMore,
    loadMore,
    isReachingEnd,
    currentPage,
    error,
    retry,
  } = useGetGames({
    genre,
    page,
  });

  // Add error state UI
  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="text-xl font-semibold text-neutral-900">
              {error.message || 'Something went wrong'}
            </div>
            <button
              onClick={retry}
              className="rounded-lg border border-neutral-300 px-8 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleGenreChange = (newGenre: string) => {
    router.push(newGenre ? `?genre=${newGenre}` : '/');
  };

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (currentPage + 1).toString());
    router.push(`?${params.toString()}`, { scroll: false });
    loadMore();
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="">
          <h1 className="text-2xl font-bold uppercase text-gray-medium md:normal-case">
            Top Sellers
          </h1>
        </div>
        <div className="flex flex-col items-center gap-4 px-4 py-12 md:flex-row">
          <div className="w-full md:ml-auto md:w-auto">
            <Dropdown
              value={genre || ''}
              onChange={handleGenreChange}
              options={filters}
              label="Genre"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto grid grid-cols-1 justify-items-center gap-14 py-12 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Show 6 skeleton cards during initial loading without animation
            Array.from({ length: 6 }).map((_, index) => (
              <GameCardSkeleton key={`loading-${index}`} animate={false} />
            ))
          ) : (
            <>
              {games.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onCartUpdate={() => {
                    router.refresh();
                  }}
                />
              ))}

              {/* Loading More Skeletons with animation */}
              {isLoadingMore &&
                Array.from({ length: 3 }).map((_, index) => (
                  <GameCardSkeleton key={`loading-more-${index}`} animate={true} />
                ))}
            </>
          )}
        </div>

        {/* See More button */}
        {!isReachingEnd && !isLoadingMore && (
          <button
            onClick={handleLoadMore}
            className="w-[137px] rounded-lg bg-[#585660] py-3 font-medium uppercase text-white transition-colors"
          >
            See More
          </button>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
