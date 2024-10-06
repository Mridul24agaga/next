import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import Image from "next/image"; // Import the Image component

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/">
          <Image
            src="https://media.discordapp.net/attachments/1172973820156592330/1276599067895664700/1_1.png?ex=66ca1d07&is=66c8cb87&hm=82e7369ef2470760bf2cc8453ecf36085cf75f149da543446c209cc74e563f33&=&format=webp&quality=lossless" // Replace with your logo URL
            alt="Memories Lived Logo"
            width={150} // Adjust the width
            height={50} // Adjust the height
            priority // Optional: for optimized loading
          />
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
