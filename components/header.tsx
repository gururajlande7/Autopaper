'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AuthControls } from '@/components/auth/auth-controls';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            alt="AutoPaper"
            className="h-8 w-8 shrink-0 rounded-lg object-contain sm:h-10 sm:w-10"
            height={40}
            priority
            src="/autopaper-logo.png"
            width={40}
          />
          <span className="truncate text-lg font-bold text-primary sm:text-xl">
            AutoPaper
          </span>
        </Link>
        
        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              className="text-foreground hover:text-primary font-medium transition-colors"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/create"
            className={cn(
              buttonVariants(),
              'h-8 rounded-lg bg-primary px-2.5 text-xs text-white hover:bg-primary/90 sm:px-3 sm:text-sm',
            )}
          >
            <span className="sm:hidden">Create</span>
            <span className="hidden sm:inline">Create Paper</span>
          </Link>
          <AuthControls />
          <button
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-primary md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            type="button"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="border-t border-border bg-card/95 px-3 py-3 shadow-sm md:hidden">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navLinks.map((link) => (
              <Link
                className="rounded-xl px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
                href={link.href}
                key={link.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
