import loginImage from "@/assets/login-image.png";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen bg-white">
      {/* Left side: Login Form */}
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
          <GoogleSignInButton />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <LoginForm />
          <Link href="/signup" className="block text-center text-blue-600 hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:block md:w-[35%]">
        <Image
          src={loginImage}
          alt="Login Image"
          className="object-cover w-full h-full"
        />
      </div>
    </main>
  );
}
