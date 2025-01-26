import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 text-green-500">
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-neutral-900">Payment Successful!</h1>
          <p className="mb-8 text-neutral-600">Thank you for your purchase.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#585660] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a4852]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
