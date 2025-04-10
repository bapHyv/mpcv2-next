import { headers } from "next/headers";

// Helper function to extract the client IP address from headers
export default function getClientIp(): string | null {
  const FALLBACK_IP_ADDRESS = "0.0.0.0"; // Fallback for local or unable to determine
  const requestHeaders = headers();

  // Standard headers for client IP
  // x-forwarded-for can be a comma-separated list (client, proxy1, proxy2)
  // The first IP is usually the client's.
  const xForwardedFor = requestHeaders.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || FALLBACK_IP_ADDRESS;
  }

  // Check x-real-ip header (less common but used by some proxies)
  const xRealIp = requestHeaders.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  // Direct connection IP (might be the proxy IP in production, but useful for local)
  // Note: `requestHeaders.get('remote-addr')` isn't standard,
  // Getting the direct socket address is harder in Server Components directly.
  // Let's rely on x-forwarded-for primarily.

  // If no standard headers are found, return null or a fallback
  // Returning null signifies we couldn't determine the IP reliably for geo-lookup
  // console.warn("Could not determine client IP from headers.");
  return null; // Or FALLBACK_IP_ADDRESS if you prefer to always attempt a lookup
}
