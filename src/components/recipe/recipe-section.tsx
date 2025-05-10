import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RecipeSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  cardContentClassName?: string;
}

export default function RecipeSection({ title, icon: Icon, children, className, cardContentClassName }: RecipeSectionProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl font-semibold flex items-center gap-3 text-primary">
          {Icon && <Icon className="h-6 w-6" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(cardContentClassName, "prose prose-sm md:prose-base max-w-none")}>
        {children}
      </CardContent>
    </Card>
  );
}
