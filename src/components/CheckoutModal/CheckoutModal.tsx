import { useState } from 'react';
import { Game } from '@/types';
import { cartService } from '@/services/cartService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Game[];
  total: number;
}

type PaymentMethod = 'stripe' | 'mercadopago';

export function CheckoutModal({ isOpen, onClose, cartItems, total }: CheckoutModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onClose();
    router.push('/success');
    cartService.clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-neutral-700">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedPayment('stripe')}
              className={`flex items-center justify-center rounded-lg border p-4 transition-colors ${
                selectedPayment === 'stripe'
                  ? 'border-[#585660] bg-neutral-50'
                  : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Image src="/stripe.png" alt="Stripe" width={80} height={40} />
            </button>
            <button
              onClick={() => setSelectedPayment('mercadopago')}
              className={`flex items-center justify-center rounded-lg border p-4 transition-colors ${
                selectedPayment === 'mercadopago'
                  ? 'border-[#585660] bg-neutral-50'
                  : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <Image src="/mercado-pago.png" alt="Mercado Pago" width={120} height={40} />
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6 max-h-48 overflow-y-auto">
          <h3 className="mb-3 text-sm font-medium text-neutral-700">Order Summary</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-neutral-500">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mb-6 border-t border-neutral-200 pt-4">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full rounded-lg bg-[#585660] py-3 font-medium text-white transition-colors hover:bg-[#4a4852] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            `Pay with ${selectedPayment === 'stripe' ? 'Stripe' : 'Mercado Pago'}`
          )}
        </button>
      </div>
    </div>
  );
}
