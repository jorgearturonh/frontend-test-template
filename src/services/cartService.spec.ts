import { cartService } from './cartService';
import { Game } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key],
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('cartService', () => {
  const mockGame: Game = {
    id: '1',
    name: 'Test Game',
    description: 'Test Description',
    price: 59.99,
    genre: 'Action',
    image: '/test.jpg',
    isNew: true,
  };

  beforeEach(() => {
    localStorage.clear();
    // Clear all listeners before each test
    cartService.subscribe(() => {}).call(null);
  });

  describe('getCart', () => {
    it('should return empty array when cart is empty', () => {
      const cart = cartService.getCart();
      expect(cart).toEqual([]);
    });

    it('should return cart items when they exist', () => {
      localStorage.setItem('game_cart', JSON.stringify([mockGame]));
      const cart = cartService.getCart();
      expect(cart).toEqual([mockGame]);
    });
  });

  describe('addToCart', () => {
    it('should add game to cart', () => {
      cartService.addToCart(mockGame);
      const cart = cartService.getCart();
      expect(cart).toEqual([mockGame]);
    });

    it('should not add duplicate games', () => {
      cartService.addToCart(mockGame);
      cartService.addToCart(mockGame);
      const cart = cartService.getCart();
      expect(cart).toEqual([mockGame]);
    });

    it('should notify listeners when adding item', () => {
      const listener = jest.fn();
      cartService.subscribe(listener);
      cartService.addToCart(mockGame);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('should remove game from cart', () => {
      cartService.addToCart(mockGame);
      cartService.removeFromCart(mockGame.id);
      const cart = cartService.getCart();
      expect(cart).toEqual([]);
    });

    it('should notify listeners when removing item', () => {
      const listener = jest.fn();
      cartService.subscribe(listener);
      cartService.addToCart(mockGame);
      cartService.removeFromCart(mockGame.id);
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      cartService.addToCart(mockGame);
      cartService.clearCart();
      const cart = cartService.getCart();
      expect(cart).toEqual([]);
    });

    it('should notify listeners when clearing cart', () => {
      const listener = jest.fn();
      cartService.subscribe(listener);
      cartService.clearCart();
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('isInCart', () => {
    it('should return true when game is in cart', () => {
      cartService.addToCart(mockGame);
      expect(cartService.isInCart(mockGame.id)).toBe(true);
    });

    it('should return false when game is not in cart', () => {
      expect(cartService.isInCart(mockGame.id)).toBe(false);
    });
  });

  describe('getCartTotal', () => {
    it('should return 0 when cart is empty', () => {
      expect(cartService.getCartTotal()).toBe(0);
    });

    it('should return total price of all items', () => {
      const mockGame2 = { ...mockGame, id: '2', price: 29.99 };
      cartService.addToCart(mockGame);
      cartService.addToCart(mockGame2);
      expect(cartService.getCartTotal()).toBe(89.98);
    });
  });

  describe('getCartCount', () => {
    it('should return 0 when cart is empty', () => {
      expect(cartService.getCartCount()).toBe(0);
    });

    it('should return correct number of items', () => {
      const mockGame2 = { ...mockGame, id: '2' };
      cartService.addToCart(mockGame);
      cartService.addToCart(mockGame2);
      expect(cartService.getCartCount()).toBe(2);
    });
  });

  describe('subscribe', () => {
    it('should add listener and return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = cartService.subscribe(listener);
      cartService.addToCart(mockGame);
      expect(listener).toHaveBeenCalled();

      unsubscribe();
      cartService.addToCart({ ...mockGame, id: '2' });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
