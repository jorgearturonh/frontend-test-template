import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative flex h-48 items-center justify-center bg-[#404040]">
      <Link href="/" className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/apply-digital.svg"
          alt="Apply Digital Logo"
          width={200}
          height={50}
          className="object-contain brightness-0 invert"
          style={{ width: 'auto', height: 'auto' }}
        />
      </Link>
    </footer>
  );
}
