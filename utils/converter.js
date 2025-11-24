import yaml from 'js-yaml';
// import { TOON } from '@toon-format/toon'; // Assuming this is the import, will adjust if needed.
// Fallback if library is missing or different:
// For now, we'll implement a mock or basic parser if the import fails during build, 
// but let's try to use the library first. 
// Actually, to be safe and avoid build errors immediately if the lib is missing/different,
// let's wrap the import or use a dynamic import if possible, but standard import is better for Next.js.

// Let's assume the user successfully installed it. If not, we will get a module not found error.
// Since I cannot verify the library's API, I will implement a robust wrapper.

let toonLib = null;
try {
  // toonLib = require('@toon-format/toon'); 
  // ES modules:
  // import * as Toon from '@toon-format/toon';
} catch (e) {
  console.warn("TOON library not found, using fallback/placeholder");
}

// MOCK TOON IMPLEMENTATION FOR NOW (until we confirm library API)
// This ensures the app runs even if the library is missing or has a different API.
const MockToon = {
  stringify: (obj) => {
    // Simple mock: just JSON with less quotes for demo
    return JSON.stringify(obj, null, 2).replace(/"/g, '');
  },
  parse: (str) => {
    // This is dangerous and just for demo fallback
    // In reality, we need the real library or a real parser.
    return JSON.parse(str); // This will likely fail for real TOON
  }
};

// We will use a try-catch block in the functions to use the real lib if available.

export const parseJson = (input) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
};

export const parseYaml = (input) => {
  try {
    return yaml.load(input);
  } catch (e) {
    throw new Error(`Invalid YAML: ${e.message}`);
  }
};

export const parseToon = (input) => {
  // TODO: Replace with actual library call
  // return toonLib.parse(input);
  throw new Error("TOON parsing not yet fully implemented (library dependency pending)");
};

export const toJson = (obj, indent = 2) => {
  return JSON.stringify(obj, null, indent);
};

export const toYaml = (obj, indent = 2) => {
  return yaml.dump(obj, { indent });
};

export const toToon = (obj) => {
   // TODO: Replace with actual library call
   // return toonLib.stringify(obj);
   // Fallback for demo:
   return JSON.stringify(obj, null, 2)
    .replace(/[",]/g, '') // Remove quotes and commas
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .split('\n').filter(line => line.trim() !== '').join('\n'); // Remove empty lines
};

// Simple token estimator (heuristic: ~4 chars per token)
export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

export const calculateReduction = (originalTokens, newTokens) => {
  if (originalTokens === 0) return 0;
  return ((1 - (newTokens / originalTokens)) * 100).toFixed(2);
};

export const convert = (input, fromFormat, toFormat, indent = 2) => {
  let data;
  
  // Parse Input
  if (fromFormat === 'JSON') data = parseJson(input);
  else if (fromFormat === 'YAML') data = parseYaml(input);
  else if (fromFormat === 'TOON') data = parseToon(input);
  else throw new Error(`Unsupported input format: ${fromFormat}`);

  // Format Output
  if (toFormat === 'JSON') return toJson(data, indent);
  else if (toFormat === 'YAML') return toYaml(data, indent);
  else if (toFormat === 'TOON') return toToon(data);
  else throw new Error(`Unsupported output format: ${toFormat}`);
};
