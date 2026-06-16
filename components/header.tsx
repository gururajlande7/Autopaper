'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { AuthControls } from '@/components/auth/auth-controls';

export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2">
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
          <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">Home</Link>
          <Link href="/about" className="text-foreground hover:text-primary font-medium transition-colors">About Us</Link>
          <Link href="/contact" className="text-foreground hover:text-primary font-medium transition-colors">Contact Us</Link>
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
        </div>
      </div>
    </nav>
  );
}
