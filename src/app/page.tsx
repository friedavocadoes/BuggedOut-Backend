"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <h1 className="text-5xl font-bold">c</h1>
        <p className="mt-4 text-lg">asd</p>
        <Button
          className="mt-6 bg-white text-indigo-600"
          onClick={() => router.push("/login")}
        >
          Get Started
        </Button>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-8">
        <h2 className="text-3xl font-semibold text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">a</h3>
            <p className="text-gray-600 mt-2">te</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">b</h3>
            <p className="text-gray-600 mt-2">fl</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold">s</h3>
            <p className="text-gray-600 mt-2">poi</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-8 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-semibold">Ready to Hunt Bugs?</h2>
        <p className="mt-4">Join the challenge now and prove your skills!</p>
        <Button
          className="mt-6 bg-white text-indigo-600"
          onClick={() => router.push("/login")}
        >
          Join Now
        </Button>
      </section>
    </div>
  );
}
