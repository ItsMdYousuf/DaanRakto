"use client";
import { Button } from "@/components/ui/button";
import { Droplets, Menu, Moon, Sun, UserCircle, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar visibility and background blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Change background opacity after 20px
      setScrolled(currentScrollY > 20);

      // Hide/Show on scroll logic
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Donors", href: "/donors" },
    { name: "Blood Requests", href: "/blood-request" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        !isVisible ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-b bg-white/80 shadow-sm backdrop-blur-md dark:bg-slate-950/80"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          {/* <div className="scale-75 md:scale-100">
            <LogoAnimation />
          </div> */}
          <span className="hidden text-xl font-bold tracking-tight text-red-600 lg:block">
            LIFEBLOOD
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-red-500 ${
                pathname === link.href
                  ? "text-red-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-red-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Auth (Useful for real app) */}
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <UserCircle className="h-5 w-5" />
              Login
            </Button>
          </Link>

          {/* Urgent CTA Button */}
          <Link href="/donate-now">
            <Button className="animate-pulse bg-red-600 font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-700">
              <Droplets className="mr-2 h-4 w-4" />
              Donate Now
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="ml-2 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer / Menu */}
      <div
        className={`fixed inset-0 top-16 z-40 h-screen w-full bg-white transition-transform duration-300 dark:bg-slate-950 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-4 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xl font-semibold ${
                pathname === link.href
                  ? "text-red-600"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200 dark:border-slate-800" />
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <UserCircle className="h-6 w-6" /> Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
