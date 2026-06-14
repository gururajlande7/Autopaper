'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            alt="AutoPaper"
            className="h-10 w-10 rounded-lg object-contain"
            height={40}
            priority
            src="/autopaper-logo.png"
            width={40}
          />
          <span className="text-xl font-bold text-primary">AutoPaper</span>
        </Link>
        
        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">Home</Link>
          <Link href="/about" className="text-foreground hover:text-primary font-medium transition-colors">About Us</Link>
          <Link href="/contact" className="text-foreground hover:text-primary font-medium transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center">
          <Link
            href="/create"
            className={cn(
              buttonVariants(),
              'bg-primary text-white hover:bg-primary/90',
            )}
          >
            Create Paper
          </Link>
        </div>
      </div>
    </nav>
  );
}
