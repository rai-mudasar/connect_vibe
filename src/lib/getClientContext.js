import { headers } from "next/headers";

export function getClientContext() {
  const headersList = headers();

  const ipAddress = 
    headersList.get("x-forwarded-for")?.split(",")[0] || // Standard proxy header
    headersList.get("x-real-ip") ||                      // Alternative proxy header
    "127.0.0.1";                                         // Localhost fallback

  // 2. Get the User-Agent (Browser and OS info)
  const userAgent = headersList.get("user-agent") || "unknown";

  return { ipAddress, userAgent };
}