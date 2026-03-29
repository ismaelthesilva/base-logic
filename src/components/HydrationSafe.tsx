"use client";

import { useState, useEffect, ReactNode } from "react";

interface HydrationSafeProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export default function HydrationSafe({
  children,
  fallback,
  className,
}: HydrationSafeProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient && fallback) {
    return (
      <div className={className} suppressHydrationWarning={true}>
        {fallback}
      </div>
    );
  }

  if (!isClient) {
    return (
      <div
        className={className}
        suppressHydrationWarning={true}
        style={{ visibility: "hidden" }}
      >
        {children}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
