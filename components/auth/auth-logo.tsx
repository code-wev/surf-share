import Image from "next/image";
import Link from "next/link";

export function AuthLogo() {
  return (
    <Link href="/" className="inline-flex">
      <Image
        src="/logo.png"
        alt="Surfshare"
        width={416}
        height={92}
        priority
        className="h-auto w-52"
      />
    </Link>
  );
}
