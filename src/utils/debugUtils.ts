import { RecipeData } from '@/types/recipeTypes';

/**
 * Debug utility to trace recipe data transformation through the frontend pipeline
 */
export function traceRecipeData(data: any, stage: string): void {
  console.group(`🔍 Recipe Trace - ${stage}`);
  
  if (!data) {
    console.log('Data is null or undefined');
    console.groupEnd();
    return;
  }
  
  // Basic info
  console.log(`Name: ${data.name || 'unnamed'}`);
  console.log(`ID: ${data._id || 'no ID'}`);
  
  // Check array fields
  const fields = ['materials', 'calculations', 'procedure', 'extraInfo'];
  fields.forEach(field => {
    const fieldData = data[field];
    
    console.group(`${field}:`);
    
    if (!fieldData) {
      console.log(`undefined or null`);
    } else if (!Array.isArray(fieldData)) {
      console.log(`not an array (${typeof fieldData})`);
    } else {
      console.log(`Array with ${fieldData.length} items`);
      
      if (fieldData.length > 0) {
        const sample = fieldData[0];
        console.log(`First item type: ${typeof sample}`);
        
        if (typeof sample === 'object' && sample !== null) {
          console.log(`Keys: ${Object.keys(sample).join(', ')}`);
          
          if ('text' in sample) {
            console.log(`Sample text: ${sample.text.substring(0, 40)}${sample.text.length > 40 ? '...' : ''}`);
          }
          
          if ('level' in sample) {
            console.log(`Sample level: ${sample.level} (${typeof sample.level})`);
          }
        } else if (typeof sample === 'string') {
          console.log(`Sample value: ${sample.substring(0, 40)}${sample.length > 40 ? '...' : ''}`);
        }
      }
    }
    
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Extended version of JSON.stringify that handles circular references
 */
export function safeStringify(obj: any, indent: number = 2): string {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    },
    indent
  );
}
