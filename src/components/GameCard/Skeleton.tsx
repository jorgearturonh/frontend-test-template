import { motion } from 'framer-motion';
import './Skeleton.css';

interface GameCardSkeletonProps {
  animate?: boolean;
}

export const GameCardSkeleton = ({ animate = false }: GameCardSkeletonProps) => {
  const Wrapper = animate ? motion.div : 'div';

  return (
    <Wrapper
      className="product card animate-pulse"
      data-testid="game-card-skeleton"
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <div className="skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton-genre" /> {/* Genre label */}
        <div className="skeleton-title-price">
          <div className="skeleton-title" /> {/* Title */}
          <div className="skeleton-price" /> {/* Price */}
        </div>
        <div className="skeleton-button" /> {/* Button */}
      </div>
    </Wrapper>
  );
};
