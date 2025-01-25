import { motion } from 'framer-motion';

interface GameCardSkeletonProps {
  animate?: boolean;
}

export const GameCardSkeleton = ({ animate = false }: GameCardSkeletonProps) => {
  const Wrapper = animate ? motion.div : 'div';

  return (
    <Wrapper
      className="ml-product card animate-pulse"
      data-testid="game-card-skeleton"
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-[240px] overflow-hidden rounded-t-2xl bg-neutral-200" />
      <div className="space-y-3 pt-2">
        <div className="h-4 w-16 rounded bg-neutral-200" /> {/* Genre label */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-48 rounded bg-neutral-200" /> {/* Title */}
          <div className="h-6 w-16 rounded bg-neutral-200" /> {/* Price */}
        </div>
        <div className="h-14 w-full rounded bg-neutral-200 pt-1" /> {/* Button */}
      </div>
    </Wrapper>
  );
};
