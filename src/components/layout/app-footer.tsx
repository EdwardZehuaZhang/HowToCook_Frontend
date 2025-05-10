export default function AppFooter() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} HowToCook. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with passion for food lovers.</p>
      </div>
    </footer>
  );
}
