"use client";

import React, { ReactNode } from "react";

/**
 * ProtectedRoute — now a thin pass-through wrapper.
 *
 * Authentication is enforced at the edge by src/middleware.ts before any
 * dashboard HTML reaches the client. This component is kept so that existing
 * import sites compile without changes, but it no longer gates access or reads
 * localStorage. Remove it gradually as dashboard pages are refactored.
 */
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;
