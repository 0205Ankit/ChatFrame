import AppLogo from "@/components/app-logo";
import AuthButton from "@/components/auth-button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export async function SignIn() {
  return (
    <>
      <div className="max-w-6/12 fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-10">
        <Image
          src="/appScreenshotMobile.png"
          alt="App screenshot"
          width={250}
          height={400}
          className="aspect-auto h-[400px] w-[250px] rounded-xl max-sm:hidden 2xl:h-[500px] 2xl:w-[300px]"
        />
        <div className="flex min-h-full w-[250px] flex-col items-center justify-between gap-3 tracking-tighter 2xl:w-[300px]">
          <AppLogo className="my-3 text-xl" />
          <div className="flex w-full flex-col items-center">
            <h5 className="text-4xl font-semibold">Welcome Back</h5>
            <span className=" mb-5 mt-1 text-center text-xs text-slate-500">
              By proceeding, you agree to our terms for creating a ChatFrame
              account.
            </span>
            <AuthButton provider="google" className="mb-3 w-full" />
            <AuthButton provider="github" className="w-full" />
          </div>
          <div className="w-full">
            <Separator />
            <div className="my-5 flex w-full justify-between text-xs text-slate-500 transition-all">
              <Link href="/about" className="hover:border-b">
                About us
              </Link>
              <Link href="/privacy" className="hover:border-b">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed -bottom-[200px] -left-[220px] h-[500px] w-[500px] rounded-full bg-primary max-sm:-bottom-[260px]"></div>
      <div className="fixed -right-[200px] -top-[200px] h-[400px] w-[400px] rounded-full bg-primary 2xl:-right-[150px]"></div>
    </>
  );
}
