import signupImage from "@/assets/signup-image.png.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen bg-white">
      {/* Left side: Sign Up Form */}
      <div className="flex flex-col justify-center w-full max-w-[20rem] p-5 md:w-[50%] space-y-8 mx-auto">
        {/* Company Logo */}
        <div className="text-center">
          <Image
            src="https://media.discordapp.net/attachments/1172973820156592330/1276599067895664700/1_1.png?ex=66ca1d07&is=66c8cb87&hm=82e7369ef2470760bf2cc8453ecf36085cf75f149da543446c209cc74e563f33&=&format=webp&quality=lossless" // Replace with your logo URL
            alt="Company Logo"
            width={250} // Adjust width as needed
            height={50} // Adjust height as needed
            className="mx-auto"
          />
        </div>
        <div className="space-y-5">
          <SignUpForm />
          <Link href="/login" className="block text-center text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block md:w-[35%]">
        <Image
          src={signupImage}
          alt="Sign Up Image"
          className="object-cover w-full h-full"
        />
      </div>
    </main>
  );
}
