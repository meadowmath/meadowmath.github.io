/**
 * Shared HTML Components for Grade 1 Activities
 * 
 * This file provides functions to generate common HTML components
 * used across all Grade 1 activities, reducing code duplication.
 */

const Grade1Components = {
  /**
   * Get the sidebar navigation HTML
   * @param {string} basePath - Base path for links (e.g., '../../' from activity pages)
   * @returns {string} Sidebar HTML string
   */
  getSidebarHTML(basePath = '../../') {
    return `
    <aside class="sidebar">
      <a href="${basePath}index.html" class="sidebar-logo">
        <span class="sidebar-logo-text" data-i18n="siteName">Meadow Math</span>
      </a>

      <nav class="sidebar-nav" aria-label="Main navigation">
        <a href="${basePath}index.html" class="nav-item">
          <span class="nav-item-icon">🏠</span>
          <span class="nav-item-text" data-i18n="nav.home">Home</span>
        </a>
        <a href="${basePath}prek/index.html" class="nav-item">
          <span class="nav-item-icon">🪺</span>
          <span class="nav-item-text" data-i18n="nav.prek">Pre-K</span>
        </a>
        <a href="${basePath}kindergarten/index.html" class="nav-item">
          <span class="nav-item-icon">🌱</span>
          <span class="nav-item-text" data-i18n="nav.kindergarten">Kinder</span>
        </a>
        <a href="${basePath}grade1/index.html" class="nav-item active">
          <span class="nav-item-icon">📐</span>
          <span class="nav-item-text" data-i18n="nav.grade1">Grade 1</span>
        </a>
        <a href="${basePath}grade2/index.html" class="nav-item">
          <span class="nav-item-icon">➕</span>
          <span class="nav-item-text" data-i18n="nav.grade2">Grade 2</span>
        </a>
        <a href="${basePath}grade3/index.html" class="nav-item">
          <span class="nav-item-icon">➖</span>
          <span class="nav-item-text" data-i18n="nav.grade3">Grade 3</span>
        </a>
        <a href="${basePath}grade4/index.html" class="nav-item">
          <span class="nav-item-icon">✖️</span>
          <span class="nav-item-text" data-i18n="nav.grade4">Grade 4</span>
        </a>
        <a href="${basePath}grade5/index.html" class="nav-item">
          <span class="nav-item-icon">➗</span>
          <span class="nav-item-text" data-i18n="nav.grade5">Grade 5</span>
        </a>
      </nav>

      <div class="language-switcher">
        <span class="language-label" data-i18n="language">Language</span>
        <div class="language-buttons">
          <button class="lang-btn active" data-lang="en" aria-label="English">🇺🇸</button>
          <button class="lang-btn" data-lang="vi" aria-label="Tiếng Việt">🇻🇳</button>
        </div>
      </div>
    </aside>
    `;
  },

  /**
   * Get the hamburger menu HTML
   * @returns {string} Hamburger menu HTML string
   */
  getHamburgerHTML() {
    return `
    <button class="hamburger" aria-label="Toggle navigation menu">
      <div class="hamburger-icon">
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </div>
    </button>

    <div class="sidebar-backdrop"></div>
    `;
  },

  /**
   * Get the stats overlay modal HTML
   * @param {Object} config - Configuration object
   * @param {string} config.icon - Emoji icon for the modal (default: 🎉)
   * @returns {string} Stats overlay HTML string
   */
  getStatsOverlayHTML(config = {}) {
    const icon = config.icon || '🎉';
    
    return `
    <div class="stats-overlay" id="stats-overlay">
      <div class="stats-modal">
        <div class="stats-icon">${icon}</div>
        <h2 class="stats-title" data-i18n="stats.title">Activity Complete!</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value correct" id="stat-correct">0</div>
            <div class="stat-label" data-i18n="stats.correct">Correct</div>
          </div>
          <div class="stat-item">
            <div class="stat-value incorrect" id="stat-incorrect">0</div>
            <div class="stat-label" data-i18n="stats.incorrect">Incorrect</div>
          </div>
        </div>
        <p class="stats-message" id="stats-message">Great job!</p>
        <div class="stats-actions">
          <button class="btn-activity btn-primary" id="btn-play-again" data-i18n="buttons.playAgain">Play Again</button>
        </div>
      </div>
    </div>
    `;
  },

  /**
   * Get the activity header HTML
   * @param {Object} config - Configuration object
   * @param {string} config.activityId - Activity ID for i18n (e.g., 'add-three-numbers')
   * @param {string} config.icon - Emoji icon for the activity
   * @param {string} config.title - Default title (fallback if i18n not loaded)
   * @param {string} config.description - Default description
   * @param {string} config.backPath - Path to grade1 index (default: '../index.html')
   * @returns {string} Activity header HTML string
   */
  getActivityHeaderHTML(config) {
    const {
      activityId,
      icon = '📐',
      title = 'Activity',
      description = '',
      backPath = '../index.html'
    } = config;

    return `
    <header class="activity-header">
      <a href="${backPath}" class="back-link">
        <span data-i18n="activity.backTo">← Back to</span> 
        <span data-i18n="nav.grade1">Grade 1</span>
      </a>
      <h1 class="activity-title">
        <span class="activity-title-icon">${icon}</span>
        <span data-i18n="section.activities.${activityId}.title">${title}</span>
      </h1>
      <p class="activity-instruction" data-i18n="section.activities.${activityId}.description">${description}</p>
    </header>
    `;
  },

  /**
   * Get common CSS link tags
   * @param {string} basePath - Base path for CSS files (e.g., '../../css/')
   * @returns {string} CSS link tags HTML string
   */
  getCommonCSSLinks(basePath = '../../css/') {
    return `
  <link rel="stylesheet" href="${basePath}reset.css">
  <link rel="stylesheet" href="${basePath}variables.css">
  <link rel="stylesheet" href="${basePath}global.css">
  <link rel="stylesheet" href="${basePath}animations.css">
  <link rel="stylesheet" href="${basePath}sidebar.css">
  <link rel="stylesheet" href="${basePath}navigation.css">
    `.trim();
  },

  /**
   * Get common JavaScript script tags
   * @param {string} basePath - Base path for JS files (e.g., '../../js/')
   * @returns {string} Script tags HTML string
   */
  getCommonScriptTags(basePath = '../../js/') {
    return `
  <script src="${basePath}utils.js"></script>
  <script src="${basePath}storage.js"></script>
  <script src="${basePath}animations.js"></script>
  <script src="${basePath}i18n.js"></script>
  <script src="${basePath}navigation.js"></script>
    `.trim();
  },

  /**
   * Inject sidebar into container
   * Used for dynamically loading sidebar into existing pages
   * @param {string} containerId - ID of container element
   * @param {string} basePath - Base path for links
   */
  injectSidebar(containerId = 'sidebar-container', basePath = '../../') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.getSidebarHTML(basePath);
    }
  },

  /**
   * Inject hamburger menu into container
   * @param {string} containerId - ID of container element
   */
  injectHamburger(containerId = 'hamburger-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.getHamburgerHTML();
    }
  },

  /**
   * Inject stats overlay into container
   * @param {string} containerId - ID of container element
   * @param {Object} config - Configuration object
   */
  injectStatsOverlay(containerId = 'stats-container', config = {}) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.getStatsOverlayHTML(config);
    }
  }
};

// Make it available globally
window.Grade1Components = Grade1Components;
