"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new auth/login page
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirectTo') || '';
    const newUrl = redirectTo ? `/auth/login?redirectTo=${redirectTo}` : '/auth/login';
    router.replace(newUrl);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
}
