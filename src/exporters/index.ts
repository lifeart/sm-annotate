/**
 * Exporters and Parsers for sm-annotate annotations
 *
 * Available formats:
 * - OpenRV: Export/Import .rv (GTO text format) for use with OpenRV media player
 */

// OpenRV Exporter
export {
  exportToOpenRV,
  downloadAsOpenRV,
  hexToRGBA,
  type OpenRVExportOptions,
} from './openrv';

// OpenRV Parser/Importer
export {
  parseOpenRV,
  parseOpenRVFile,
  rgbaToHex,
  type ParsedOpenRVResult,
} from './openrv-parser';
