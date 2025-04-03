import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Shield, Lock, Key, Eye, RefreshCw } from "lucide-react";
import ThemeToggler from "@/components/ThemeToggler";

export default function Home() {
  return (
    <div className="text-gray-100 flex min-h-screen flex-col bg-gradient-to-r from-[#0f172a]  to-[#334155]">
      <header className="sticky top-0 z-50 w-full backdrop-blur-3xl">
        <div className="px-4 md:px-6 flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-gray-100" />
              <span className="font-bold text-gray-100">SecureVault</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 w-full">
            <nav className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium text-gray-100 h-9 rounded-md px-3 hover:text-violet-300"
              >
                Sign In
              </Link>
              {/* <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link> */}
            </nav>

            {/* <ThemeToggler /> */}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2 font-bold text-3xl sm:text-4xl md:text-8xl  tracking-tighter text-center sm:text-left">
                  <h1 className="sm:p-2 bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">
                    Secure Your Digital Life with
                  </h1>
                  <Link href="/signup">
                    <span className="my-1 inline-block bg-gradient-to-r from-indigo-600  to-purple-600 bg-no-repeat bg-bottom px-4 py-1 text-white rounded">
                      SecureVault
                    </span>
                  </Link>
                </div>
                {/* <div className="flex flex-col items-center justify-center md:justify-start gap-2 min-[400px]:flex-row">
                  <Link
                    className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all"
                    href="/signup"
                  >
                    Get Started
                  </Link>
                </div> */}
              </div>
              <div className="flex items-center justify-center w-full">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      title: "Secure Storage",
                      icon: Lock,
                      desc: "AES-256 encryption keeps your passwords safe.",
                    },
                    {
                      title: "Strong Passkeys",
                      icon: Key,
                      desc: "Generate strong passwords instantly.",
                    },
                    {
                      title: "Easy Access",
                      icon: Eye,
                      desc: "Access your passwords anytime, anywhere.",
                    },
                    {
                      title: "Auto-Sync",
                      icon: RefreshCw,
                      desc: "Sync changes seamlessly across devices.",
                    },
                  ].map(({ title, icon: Icon, desc }, index) => (
                    <Card
                      key={index}
                      className="sm:min-h-48 w-full bg-black/30 backdrop-blur-sm border-0 text-gray-100"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex flex-col items-center justify-start gap-2">
                          <Icon className="h-5 w-5 inline-block mr-1" />
                          {title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 text-center">
                          {desc}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Why Choose SecureVault? */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl bg-gradient-to-tl from-sky-600 via-zinc-300 to-cyan-900 bg-clip-text text-transparent">
                Why Choose SecureVault?
              </h2>
              <p className="text-gray-400 max-w-[85%] leading-normal sm:leading-7">
                Our password manager combines security with simplicity to give
                you peace of mind.
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-8">
              {[
                {
                  title: "End-to-End Encryption",
                  desc: "Your data is encrypted before it leaves your device, ensuring only you can access it.",
                },
                {
                  title: "Cross-Platform",
                  desc: "Access your passwords on desktop, mobile, and tablet with seamless synchronization.",
                },
                {
                  title: "Password Health",
                  desc: "Identify weak, reused, or compromised passwords to improve security.",
                },
              ].map(({ title, desc }, index) => (
                <Card
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border-0 text-gray-100"
                >
                  <CardHeader>
                    <CardTitle>{title} </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 text-gray-400 flex items-center justify-center w-full mx-auto">
          <p className="text-center text-sm leading-loose">
            © 2025 SecureVault. All rights reserved.
          </p>
          {/* <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>
            <Link href="/contact" className="underline underline-offset-4">
              Contact
            </Link>
          </div> */}
      </footer>
    </div>
  );
}
