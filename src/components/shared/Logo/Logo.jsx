import Link from 'next/link';
import Image from 'next/image';

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex transition-all duration-300"
    >
      <div className="relative flex items-center justify-center">

        {/* Bigger Logo Image - No Animation */}
        <Image
          src="/logo.svg"
          alt="Logo"
          width={200}   // Increase size here
          height={100}   // Keep ratio correct
          priority
          className="object-contain w-[100px] h-[50px] md:w-[200px] md:h-[100px]"
        />

      </div>
    </Link>
  );
};

export default Logo;