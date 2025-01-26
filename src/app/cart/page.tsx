'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types';
import { cartService } from '@/services/cartService';
import { CheckoutModal } from '@/components/CheckoutModal/CheckoutModal';

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 text-neutral-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-24 w-24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>
      <h2 className="mb-4 text-2xl font-bold text-neutral-900">Your cart is empty</h2>
      <p className="mb-8 text-neutral-600">Looks like you haven't added any games yet.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-[#585660] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a4852]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Browse Games
      </Link>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(cartService.getCart());
      setTotal(cartService.getCartTotal());
    };

    const unsubscribe = cartService.subscribe(updateCart);
    updateCart();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRemoveItem = (gameId: string) => {
    cartService.removeFromCart(gameId);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Catalog
          </Link>
        </div>

        <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <p className="mb-8">{cartItems.length} items</p>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="mb-4 flex items-start gap-4 rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-neutral-600">{item.genre}</p>
                          <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${item.price}</span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-neutral-400 hover:text-neutral-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Order Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="mt-6 w-full rounded-lg bg-[#585660] py-3 font-medium text-white transition-colors hover:bg-[#4a4852]"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        total={total}
      />
    </main>
  );
}
