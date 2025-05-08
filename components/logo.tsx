import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  withText?: boolean
  isLink?: boolean
}

export function Logo({ className, size = "md", withText = true, isLink = true }: LogoProps) {
  const sizes = {
    sm: 40,
    md: 60,
    lg: 100,
  }

  const imageSize = sizes[size]

  const content = (
    <>
      <div className="relative overflow-hidden rounded-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Apr%201%2C%202025%2C%2005_14_06%20AM-Jsi3fp5WhwwqBkTJTUh5EDcRJxPBGd.png"
          alt="Narcoguard Logo"
          width={imageSize}
          height={imageSize}
          className="object-cover"
          priority
        />
      </div>
      {withText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-3xl",
          )}
        >
          Narcoguard
        </span>
      )}
    </>
  )

  if (isLink) {
    return (
      <Link href="/" className={cn("flex items-center gap-2", className)}>
        {content}
      </Link>
    )
  }

  return <div className={cn("flex items-center gap-2", className)}>{content}</div>
}
