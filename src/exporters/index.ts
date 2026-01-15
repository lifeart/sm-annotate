/**
 * Exporters and Parsers for sm-annotate annotations
 *
 * Available formats:
 * - OpenRV: Export/Import .rv (GTO text format) and .gto (binary format) for use with OpenRV media player
 *
 * Powered by gto-js library for robust GTO parsing with support for:
 * - Text (.rv) and binary (.gto) formats
 * - Gzip compression (async only)
 * - Proper lexer/tokenizer with error handling
 */

// OpenRV Exporter
export {
  exportToOpenRV,
  exportToOpenRVBinary,
  downloadAsOpenRV,
  downloadAsOpenRVBinary,
  hexToRGBA,
  type OpenRVExportOptions,
} from './openrv';

// OpenRV Parser/Importer
export {
  parseOpenRV,
  parseOpenRVAsync,
  parseOpenRVFile,
  rgbaToHex,
  type ParsedOpenRVResult,
  type OpenRVParseOptions,
} from './openrv-parser';
