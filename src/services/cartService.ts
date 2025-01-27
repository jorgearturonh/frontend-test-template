import { Game } from '@/types';

const CART_STORAGE_KEY = 'game_cart';

const listeners = new Set<() => void>();

export const cartService = {
  getCart(): Game[] {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  },

  addToCart(game: Game): void {
    const cart = this.getCart();
    if (!cart.some(item => item.id === game.id)) {
      cart.push(game);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.notifyListeners();
    }
  },

  removeFromCart(gameId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.id !== gameId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    this.notifyListeners();
  },

  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    this.notifyListeners();
  },

  isInCart(gameId: string): boolean {
    const cart = this.getCart();
    return cart.some(item => item.id === gameId);
  },

  getCartTotal(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.price, 0);
  },

  getCartCount(): number {
    return this.getCart().length;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notifyListeners() {
    listeners.forEach(listener => listener());
  },
};
