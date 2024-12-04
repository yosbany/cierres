export function formatTagInput(input: string): string {
  // Remove any existing colons to prevent double formatting
  const cleanInput = input.replace(/:/g, '').trim();
  
  // Split by spaces to separate tag name and value
  const parts = cleanInput.split(/\s+/);
  
  if (parts.length === 0) return '';
  
  // First part is always the tag name
  const tagName = parts[0];
  
  // If there are more parts, join them as the value
  const tagValue = parts.slice(1).join(' ').trim();
  
  // Return formatted tag
  return tagValue ? `${tagName}: ${tagValue}` : tagName;
}

export function parseTag(tag: string): { name: string; value?: string } {
  const [name, value] = tag.split(':').map(part => part.trim());
  return { name, value };
}

export function formatTagDisplay(tag: string): string {
  const { name, value } = parseTag(tag);
  return value ? `${name}: ${value}` : name;
}