import yaml from 'js-yaml';
import { decode, encode } from '@toon-format/toon';

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

export const parseToon = (input, options = {}) => {
  try {
    // Extract decode options
    const decodeOptions = {
      indent: options.indent || 2,
      strict: options.strict !== undefined ? options.strict : true,
      expandPaths: options.expandPaths || 'off'
    };
    return decode(input, decodeOptions);
  } catch (e) {
    throw new Error(`Invalid TOON: ${e.message}`);
  }
};

export const toJson = (obj, indent = 2) => {
  return JSON.stringify(obj, null, indent);
};

export const toYaml = (obj, indent = 2) => {
  return yaml.dump(obj, { indent });
};

export const toToon = (obj, options = {}) => {
  try {
    // Extract encode options
    const encodeOptions = {
      indent: options.indent || 2,
      delimiter: options.delimiter || ',',
      keyFolding: options.keyFolding || 'off',
      flattenDepth: options.flattenDepth !== undefined ? options.flattenDepth : Infinity
    };
    return encode(obj, encodeOptions);
  } catch (e) {
    throw new Error(`TOON Serialization Error: ${e.message}`);
  }
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

export const convert = (input, fromFormat, toFormat, options = {}) => {
  let data;

  // Parse Input
  if (fromFormat === 'JSON') data = parseJson(input);
  else if (fromFormat === 'YAML') data = parseYaml(input);
  else if (fromFormat === 'TOON') {
    try {
      data = parseToon(input, options);
    } catch (e) {
      // Fallback logic removed as we want to rely on the library's error or success
      throw e;
    }
  }
  else throw new Error(`Unsupported input format: ${fromFormat}`);

  // Format Output
  if (toFormat === 'JSON') return toJson(data, options.indent);
  else if (toFormat === 'YAML') return toYaml(data, options.indent);
  else if (toFormat === 'TOON') return toToon(data, options);
  else throw new Error(`Unsupported output format: ${toFormat}`);
};
