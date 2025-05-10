import Image from 'next/image';
import RecipeSection from '@/components/recipe/recipe-section';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Utensils, CookingPot, ListChecks, Percent, Info, Flame, ListOrdered, Calculator, CheckCircle, ExternalLink, Clock, Users } from 'lucide-react';

// Placeholder data - In a real app, this would come from an API/AI flow
const recipeData = {
  title: "Delicious Spaghetti Carbonara",
  imageUrl: "https://picsum.photos/1200/800",
  imageAiHint: "pasta carbonara",
  description: "A classic Italian pasta dish made with eggs, cheese, pancetta, and black pepper. Simple yet incredibly flavorful, perfect for a weeknight dinner or a special occasion.",
  difficulty: "Medium",
  prepTime: "15 minutes",
  cookTime: "20 minutes",
  servings: 4,
  materials: [
    { name: "Spaghetti", quantity: "400g" },
    { name: "Pancetta or Guanciale", quantity: "150g", note: "cubed" },
    { name: "Large Eggs", quantity: "3", note: "plus 1 yolk" },
    { name: "Pecorino Romano Cheese", quantity: "50g", note: "grated, plus extra for serving" },
    { name: "Parmesan Cheese", quantity: "25g", note: "grated" },
    { name: "Black Pepper", quantity: "to taste", note: "freshly ground" },
    { name: "Salt", quantity: "to taste" },
  ],
  tools: [
    "Large pot for pasta",
    "Large skillet or frying pan",
    "Whisk",
    "Cheese grater",
    "Tongs",
  ],
  procedure: [
    "Cook the spaghetti in a large pot of boiling salted water until al dente. Reserve about 1 cup of pasta water before draining.",
    "While the pasta cooks, heat the cubed pancetta in a large skillet over medium heat until crispy. Remove from heat and set aside. Do not discard the rendered fat.",
    "In a bowl, whisk together the eggs, egg yolk, grated Pecorino Romano, and Parmesan cheese. Season with a generous amount of freshly ground black pepper.",
    "Drain the pasta and immediately add it to the skillet with the pancetta and rendered fat. Toss to combine.",
    "Working quickly, pour the egg and cheese mixture over the hot pasta, stirring vigorously. If the sauce is too thick, add a little reserved pasta water until it reaches a creamy consistency. Be careful not to scramble the eggs; the heat from the pasta should cook them gently.",
    "Serve immediately, garnished with extra grated cheese and black pepper.",
  ],
  calculations: [
    { label: "Calories per serving", value: "~600 kcal", icon: Flame },
    { label: "Protein", value: "~30g", icon: Percent },
    { label: "Fat", value: "~30g", icon: Percent },
    { label: "Carbohydrates", value: "~50g", icon: Percent },
  ],
  extraInfo: {
    title: "Chef's Tips",
    content: "For an authentic Carbonara, avoid using cream. The creaminess comes from the emulsification of egg yolks, cheese, and pasta water. Use high-quality ingredients for the best flavor. Guanciale (cured pork jowl) is traditional, but pancetta is a good substitute."
  }
};

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section with Image and Title */}
      <section className="relative rounded-lg overflow-hidden shadow-2xl">
        <Image
          src={recipeData.imageUrl}
          alt={recipeData.title}
          width={1200}
          height={600}
          className="w-full h-auto object-cover aspect-[2/1] md:aspect-[3/1]"
          data-ai-hint={recipeData.imageAiHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {recipeData.title}
          </h1>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm backdrop-blur-sm bg-white/20 text-white border-white/30">
              <Clock className="mr-1.5 h-4 w-4" /> {recipeData.prepTime} Prep
            </Badge>
            <Badge variant="secondary" className="text-sm backdrop-blur-sm bg-white/20 text-white border-white/30">
              <CookingPot className="mr-1.5 h-4 w-4" /> {recipeData.cookTime} Cook
            </Badge>
            <Badge variant="secondary" className="text-sm backdrop-blur-sm bg-white/20 text-white border-white/30">
              <Users className="mr-1.5 h-4 w-4" /> Serves {recipeData.servings}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column / Main column on smaller screens */}
        <div className="lg:col-span-2 space-y-8">
          <RecipeSection title="Description" icon={Info}>
            <p className="text-lg leading-relaxed">{recipeData.description}</p>
          </RecipeSection>

          <RecipeSection title="Ingredients" icon={ListChecks} cardContentClassName="p-0">
            <ul className="divide-y divide-border">
              {recipeData.materials.map((item, index) => (
                <li key={index} className="p-4 flex justify-between items-center hover:bg-accent/50 transition-colors">
                  <div>
                    <span className="font-medium text-foreground">{item.name}</span>
                    {item.note && <span className="text-xs text-muted-foreground ml-2">({item.note})</span>}
                  </div>
                  <span className="text-muted-foreground">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </RecipeSection>

          <RecipeSection title="Tools Needed" icon={Utensils} cardContentClassName="p-0">
            <ul className="divide-y divide-border">
              {recipeData.tools.map((tool, index) => (
                <li key={index} className="p-4 flex items-center gap-2 hover:bg-accent/50 transition-colors">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{tool}</span>
                </li>
              ))}
            </ul>
          </RecipeSection>
        </div>

        {/* Right column / Sidebar on larger screens */}
        <aside className="space-y-8 lg:sticky lg:top-24 self-start">
          <RecipeSection title="Difficulty" icon={Flame}>
            <Badge variant="outline" className="text-lg border-primary text-primary py-1 px-3">
              {recipeData.difficulty}
            </Badge>
          </RecipeSection>

          <RecipeSection title="Nutrition Info (approx.)" icon={Calculator}>
            <ul className="space-y-3">
              {recipeData.calculations.map((calc, index) => (
                <li key={index} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    {calc.icon && <calc.icon className="h-4 w-4" />}
                    {calc.label}
                  </span>
                  <span className="font-medium text-foreground">{calc.value}</span>
                </li>
              ))}
            </ul>
          </RecipeSection>
           <Alert className="bg-primary/5 border-primary/20 text-primary">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-semibold">Ready to Cook?</AlertTitle>
            <AlertDescription>
              Gather your ingredients and let's get started!
            </AlertDescription>
           </Alert>
        </aside>
      </div>

      <Separator className="my-12" />

      {/* Procedure Section */}
      <RecipeSection title="Procedure" icon={ListOrdered}>
        <ol className="list-decimal space-y-6 pl-6 marker:font-bold marker:text-primary">
          {recipeData.procedure.map((step, index) => (
            <li key={index} className="text-base leading-relaxed text-foreground pl-2">
              {step}
            </li>
          ))}
        </ol>
      </RecipeSection>

      {/* Extra Information Section */}
      {recipeData.extraInfo && (
        <>
          <Separator className="my-12" />
          <RecipeSection title={recipeData.extraInfo.title} icon={Info}>
            <p className="text-base leading-relaxed">{recipeData.extraInfo.content}</p>
            <Button variant="link" className="mt-4 p-0 h-auto text-primary hover:text-primary/80">
              Learn more cooking tips <ExternalLink className="ml-1.5 h-4 w-4" />
            </Button>
          </RecipeSection>
        </>
      )}
    </div>
  );
}
