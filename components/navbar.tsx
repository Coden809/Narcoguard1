"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Download, Menu, X, Heart } from "lucide-react"
import DownloadModal from "@/components/download-modal"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { AccessibilityMenu } from "./accessibility-menu"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/hero-network", label: "Hero Network" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" className="mr-6" isLink={false} />
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                    pathname === link.href ? "text-primary" : "text-foreground/80 hover:text-primary hover:bg-muted"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-2">
              <AccessibilityMenu />
              <ThemeToggle />
              <Button variant="outline" asChild className="text-red-500 border-red-500 hover:bg-red-500/10">
                <Link href="/donate">
                  <Heart className="mr-2 h-4 w-4" />
                  Donate
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsDownloadModalOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-bold">Narcoguard</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === link.href ? "bg-muted text-primary" : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-6 flex items-center justify-center space-x-4">
                    <AccessibilityMenu />
                    <ThemeToggle />
                  </div>

                  <div className="mt-auto pt-6 space-y-4">
                    <Button className="w-full" variant="outline" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/donate">
                        <Heart className="mr-2 h-4 w-4 text-red-500" />
                        Donate
                      </Link>
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setIsDownloadModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button className="w-full" asChild onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </>
  )
}
