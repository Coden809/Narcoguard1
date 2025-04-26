export const getEnvVariable = (key: string, fallback?: string): string => {
  if (typeof window !== "undefined") {
    // We're on the client side, use only public variables
    return (process.env[`NEXT_PUBLIC_${key}`] as string) || fallback || ""
  }
  // We're on the server side
  return (process.env[key] as string) || fallback || ""
}

export const HIPAA_SECRET_KEY = getEnvVariable("HIPAA_SECRET_KEY", "fallback-secret-key-for-development")
