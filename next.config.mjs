/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent the app from being embedded in an iframe (clickjacking defence)
  { key: "X-Frame-Options", value: "DENY" },

  // Stop browsers from MIME-sniffing responses away from the declared type
  { key: "X-Content-Type-Options", value: "nosniff" },

  // Referrer policy — send origin only on same-origin, stripped cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

  // HSTS — force HTTPS for 2 years, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },

  // Restrict access to sensitive browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
