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
            src="https://media.discordapp.net/attachments/1193183717548638301/1292820769419825222/Black_Gold_White_Luxury_Royal_Crown_Logo_1_2.png?ex=670520aa&is=6703cf2a&hm=835f06d7996d18321a60577412281862a4ad49d71c7c197ab0fe0832046a7daf&=&format=webp&quality=lossless" // Replace with your logo URL
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
