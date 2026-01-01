/**
 * Pre-K Activity Components
 * 
 * This file provides Pre-K specific wrappers for the shared ActivityComponents.
 * Pre-K activities can import from here for convenience.
 */

/**
 * PreKComponents - Pre-K specific wrapper with defaults
 */
const PreKComponents = {
  /**
   * Get sidebar HTML with Pre-K as active
   */
  getSidebarHTML(basePath = '../../') {
    return window.ActivityComponents?.getSidebarHTML({
      basePath,
      activeGrade: 'prek'
    }) || '';
  },

  /**
   * Get hamburger menu HTML
   */
  getHamburgerHTML() {
    return window.ActivityComponents?.getHamburgerHTML() || '';
  },

  /**
   * Get stats overlay HTML
   */
  getStatsOverlayHTML(config = {}) {
    return window.ActivityComponents?.getStatsOverlayHTML(config) || '';
  },

  /**
   * Get activity header HTML with Pre-K defaults
   */
  getActivityHeaderHTML(config) {
    return window.ActivityComponents?.getActivityHeaderHTML({
      ...config,
      backPath: config.backPath || '../index.html',
      backToKey: config.backToKey || 'nav.prek'
    }) || '';
  },

  /**
   * Get common CSS links
   */
  getCommonCSSLinks(basePath = '../../css/') {
    return window.ActivityComponents?.getCommonCSSLinks(basePath) || '';
  },

  /**
   * Get common script tags
   */
  getCommonScriptTags(basePath = '../../js/', includeActivityBase = false) {
    return window.ActivityComponents?.getCommonScriptTags(basePath, includeActivityBase) || '';
  }
};

window.PreKComponents = PreKComponents;

console.log('Pre-K ActivityComponents loaded via shared module');
