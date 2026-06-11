// src/app/auth/error/page.tsx
import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const isInvalidDomain = params.error === "InvalidDomain" || params.error === "AccessDenied";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-10 text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        {isInvalidDomain ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Only students with a{" "}
              <span className="text-indigo-400 font-semibold">@cse.nits.ac.in</span>{" "}
              email address can participate in this poll.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Please sign in with your official NIT Silchar CSE department Google account.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-3">Sign-in Error</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Something went wrong during sign-in. Please try again.
            </p>
          </>
        )}
        <Link href="/" className="inline-flex items-center gap-2 btn-primary">
          <span>← Back to Login</span>
        </Link>
      </div>
    </main>
  );
}
