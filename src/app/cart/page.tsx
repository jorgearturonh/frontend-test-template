'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types';
import { cartService } from '@/services/cartService';
import { CheckoutModal } from '@/components/CheckoutModal/CheckoutModal';
import { motion } from 'framer-motion';

const EmptyCart = () => {
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
      <p className="mb-8 text-neutral-600">Looks like you haven&apos;t added any games yet.</p>
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
};

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-[#585660]"></div>
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateCart = () => {
      setCartItems(cartService.getCart());
      setTotal(cartService.getCartTotal());
      setIsLoading(false);
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
            className="text-ag flex items-center gap-2 text-stroke-primary hover:text-neutral-900"
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

        <h1 className="mb-2 text-xl font-bold md:text-2xl">Your Cart</h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <p className="mb-12 text-xs font-normal text-stroke-primary md:text-xl">
              {cartItems.length} items
            </p>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-7">
              <div className="lg:col-span-4">
                {cartItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      marginBottom: 0,
                      padding: 0,
                      transition: { duration: 0.3 },
                    }}
                    className="relative mb-8 flex flex-col border-b border-solid p-4 md:mb-4 md:flex-row md:gap-4"
                  >
                    {/* Image and Remove Button Row */}
                    <div className="flex w-full gap-4 md:w-[256px]">
                      <div className="relative h-[200px] w-full md:h-[156px]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 256px"
                        />
                        {item.isNew && (
                          <span className="absolute left-4 top-4 rounded bg-stone-100 px-4 py-1.5 text-sm font-medium text-neutral-900 shadow-sm">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex-shrink-0 md:hidden">
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

                    {/* Content Column */}
                    <div className="mt-4 flex-grow space-y-2 md:mt-0">
                      <p className="text-ag font-bold uppercase text-neutral-600">{item.genre}</p>
                      <h3 className="text-xs font-bold text-stroke-primary">{item.name}</h3>
                      <p className="text-ag text-neutral-500">{item.description}</p>
                      <div className="flex justify-end">
                        <span className="text-xs font-bold">${item.price}</span>
                      </div>
                    </div>

                    {/* Desktop Remove Button */}
                    <div className="hidden flex-shrink-0 md:block">
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
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-3">
                <div className="card rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                  <p className="text-lg font-normal text-stroke-primary">
                    {cartItems.length} items
                  </p>
                  <div className="space-y-2 pt-8">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between pb-2 text-sm">
                        <span className="text-lg font-normal text-stroke-primary">{item.name}</span>
                        <span className="text-lg font-normal text-stroke-primary">
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span className="text-xs font-bold">Order Total</span>
                      <span className="text-xs font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="text-ag bg-cta-fill-primary mt-6 w-full rounded-lg py-3 text-white transition-colors hover:bg-[#4a4852]"
                >
                  Checkout
                </button>
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
};

export default CartPage;
