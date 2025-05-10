import { ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ChefHat className="h-8 w-8 text-primary group-hover:text-accent-foreground transition-colors" />
          <h1 className="text-2xl font-bold text-foreground group-hover:text-accent-foreground transition-colors">
            HowToCook
          </h1>
        </Link>
        {/* Navigation items can be added here if needed */}
      </div>
    </header>
  );
}
