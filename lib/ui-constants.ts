/**
 * UI Constants
 * Centralized constants for consistent spacing, z-index, and layout values
 */

/**
 * Layout dimensions
 */
export const LAYOUT = {
  SIDEBAR_WIDTH: "360px",
  HEADER_HEIGHT: "56px", // h-14
  MAX_CONTENT_WIDTH: "600px",
  MAX_TEMPLATE_GRID_WIDTH: "960px",
} as const;

/**
 * Z-index layering system
 * Use these instead of arbitrary z-index values to prevent conflicts
 */
export const Z_INDEX = {
  NOTCH: 10,
  SIDEBAR: 30,
  TOOLBAR: 30,
  HEADER: 40,
  BLOCK_TOOLBAR: 40,
  OVERLAY: 50,
  DIALOG: 50,
  TOOLTIP: 50,
} as const;

/**
 * Common className combinations
 */
export const COMMON_CLASSES = {
  LOGO: "font-mono text-xl font-semibold cursor-pointer hover:opacity-70 transition-opacity",
} as const;
