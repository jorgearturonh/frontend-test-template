import Image from 'next/image';
import { Game } from '@/types';
import { cartService } from '@/services/cartService';
import './GameCard.css';
const MAX_LENGTH = 24;

interface GameCardProps {
  game: Game;
  onCartUpdate?: () => void;
}

export const GameCard = ({ game, onCartUpdate }: GameCardProps) => {
  const isInCart = cartService.isInCart(game.id);
  const exceedsMaxLength = game.name.length > MAX_LENGTH;

  const handleCartAction = () => {
    if (isInCart) {
      cartService.removeFromCart(game.id);
    } else {
      cartService.addToCart(game);
    }
    onCartUpdate?.();
  };

  return (
    <div data-testid="game-card" className="card product">
      <div className="image-container">
        <Image src={game.image} alt={game.name} fill={true} className="object-cover" priority />
        {game.isNew && <span className="new-span">New</span>}
      </div>

      <p className="genre-text">{game.genre}</p>
      <div className="flex items-center justify-between pb-3">
        <div className="group relative">
          <h2 className="game-name">
            {exceedsMaxLength ? `${game.name.slice(0, MAX_LENGTH)}...` : game.name}
          </h2>
          {exceedsMaxLength && <div className="game-name-hover">{game.name}</div>}
        </div>
        <span className="game-price">${game.price}</span>
      </div>
      <button onClick={handleCartAction} className="cart-button">
        {isInCart ? 'REMOVE' : 'ADD TO CART'}
      </button>
    </div>
  );
};
