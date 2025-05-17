// The following is a snippet that needs to be updated - adjust based on your actual file structure

// When using MarkdownContent, make sure to pass imageUrls and baseUrl props
<MarkdownContent 
  content={recipeData.procedure.join('\n\n')}
  imageUrls={recipeData.images || []} // Pass all available image URLs here
  baseUrl={recipeData.sourceUrl || ''} // Pass the source URL as base
  className="font-normal text-foreground leading-relaxed"
/>
