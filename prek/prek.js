/* Pre-K Activities Page JavaScript - Meadow Math */

/**
 * Pre-K page controller
 * Loads activity data from JSON and renders the levels with tabs
 */
const PreKPage = {
  // Data storage
  data: null,
  currentLang: 'en',
  
  // DOM elements
  container: null,
  
  /**
   * Initialize the Pre-K page
   */
  async init() {
    this.container = document.getElementById('levels-container');
    
    if (!this.container) {
      console.error('Levels container not found');
      return;
    }
    
    // Wait for i18n to be ready
    await this.waitForI18n();
    
    // Get current language
    this.currentLang = window.i18n?.currentLang || 'en';
    
    // Load data and render
    await this.loadData();
    
    // Listen for language changes
    this.setupLanguageListener();
  },
  
  /**
   * Wait for i18n system to be initialized
   */
  waitForI18n() {
    return new Promise((resolve) => {
      if (window.i18n && window.i18n.translations[window.i18n.currentLang]) {
        resolve();
      } else {
        // Poll for i18n readiness
        const checkInterval = setInterval(() => {
          if (window.i18n && window.i18n.translations[window.i18n.currentLang]) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        
        // Timeout after 3 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 3000);
      }
    });
  },
  
  /**
   * Load activity data from JSON
   */
  async loadData() {
    try {
      // Determine base path for data
      const basePath = this.getBasePath();
      const response = await fetch(`${basePath}/data/prek.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status}`);
      }
      
      this.data = await response.json();
      this.render();
    } catch (error) {
      console.error('Error loading Pre-K data:', error);
      this.renderError();
    }
  },
  
  /**
   * Get base path for data files
   */
  getBasePath() {
    const path = window.location.pathname;
    
    // Check if we're in file:// protocol
    if (window.location.protocol === 'file:') {
      return '..';
    }
    
    // For HTTP, return empty for root-relative paths
    return '..';
  },
  
  /**
   * Get translated text for an activity or resource
   */
  getTranslation(type, id, field) {
    const i18nKey = `section.${type}.${id}.${field}`;
    const translated = window.i18n?.t(i18nKey);
    
    // If translation found and it's not the key itself, use it
    if (translated && translated !== i18nKey) {
      return translated;
    }
    
    // Fallback to data from JSON
    return null;
  },
  
  /**
   * Get level translation
   */
  getLevelTranslation(levelId, field) {
    const i18nKey = `section.levels.level${levelId.replace('level-', '')}.${field}`;
    const translated = window.i18n?.t(i18nKey);
    
    if (translated && translated !== i18nKey) {
      return translated;
    }
    
    return null;
  },
  
  /**
   * Render all levels
   */
  render() {
    if (!this.data || !this.data.levels) {
      this.renderError();
      return;
    }
    
    const html = this.data.levels.map(level => this.renderLevel(level)).join('');
    this.container.innerHTML = html;
    
    // Set up tab functionality
    this.setupTabs();
  },
  
  /**
   * Render a single level section
   */
  renderLevel(level) {
    const levelNumber = level.number;
    const levelClass = `level-${levelNumber}`;
    
    // Get translated title and goal
    const title = this.getLevelTranslation(level.id, 'title') || level.title;
    const goal = this.getLevelTranslation(level.id, 'goal') || level.goal;
    
    // Get tab translations
    const activitiesTab = window.i18n?.t('tabs.exercises') || 'Activities';
    const learnMoreTab = window.i18n?.t('tabs.learnMore') || 'Learn More';
    
    return `
      <section class="level-section ${levelClass}" data-level="${levelNumber}">
        <header class="level-header">
          <span class="level-badge ${levelClass}">Level ${levelNumber}</span>
          <h2 class="level-title">${this.escapeHtml(title)}</h2>
          <p class="level-goal">${this.escapeHtml(goal)}</p>
        </header>
        
        <div class="tabs-container">
          <div class="tabs-list" role="tablist">
            <button 
              class="tab-button active" 
              role="tab" 
              aria-selected="true"
              data-tab="activities-${levelNumber}"
              id="tab-activities-${levelNumber}"
              aria-controls="panel-activities-${levelNumber}"
            >
              ${this.escapeHtml(activitiesTab)}
            </button>
            <button 
              class="tab-button" 
              role="tab" 
              aria-selected="false"
              data-tab="learn-more-${levelNumber}"
              id="tab-learn-more-${levelNumber}"
              aria-controls="panel-learn-more-${levelNumber}"
            >
              ${this.escapeHtml(learnMoreTab)}
            </button>
          </div>
          
          <div 
            class="tab-panel active" 
            role="tabpanel" 
            id="panel-activities-${levelNumber}"
            aria-labelledby="tab-activities-${levelNumber}"
          >
            <div class="activities-grid">
              ${level.activities.map(activity => this.renderActivityCard(activity)).join('')}
            </div>
          </div>
          
          <div 
            class="tab-panel" 
            role="tabpanel" 
            id="panel-learn-more-${levelNumber}"
            aria-labelledby="tab-learn-more-${levelNumber}"
          >
            <div class="learn-more-grid">
              ${level.learnMore.map(resource => this.renderResourceCard(resource)).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  },
  
  /**
   * Render an activity card
   */
  renderActivityCard(activity) {
    // Get translated title and description
    const title = this.getTranslation('activities', activity.id, 'title') || activity.title;
    const description = this.getTranslation('activities', activity.id, 'description') || activity.description;
    
    return `
      <a href="${this.escapeHtml(activity.path)}" class="activity-card" data-activity="${activity.id}">
        <div class="activity-icon">${activity.icon}</div>
        <h3 class="activity-title">${this.escapeHtml(title)}</h3>
        <p class="activity-description">${this.escapeHtml(description)}</p>
      </a>
    `;
  },
  
  /**
   * Render a resource card (Learn More) - Pre-K: text only, no links
   */
  renderResourceCard(resource) {
    // Create a simple ID from the title for i18n lookup
    const resourceId = this.generateResourceId(resource.title);
    
    // Get translated title and description
    const title = this.getTranslation('learnMore', resourceId, 'title') || resource.title;
    const description = this.getTranslation('learnMore', resourceId, 'description') || resource.description;
    
    // Pre-K: Render as text-only card (no link)
    return `
      <div class="resource-card resource-card-text">
        <div class="resource-header">
          <span class="resource-icon">${resource.icon}</span>
          <h3 class="resource-title">${this.escapeHtml(title)}</h3>
        </div>
        <p class="resource-description">${this.escapeHtml(description)}</p>
      </div>
    `;
  },
  
  /**
   * Generate a resource ID from title for i18n
   */
  generateResourceId(title) {
    // Match common patterns for Numberblocks
    if (title.includes('Numberblocks')) {
      if (title.includes('1–5') || title.includes('1-5')) return 'numberblocks-1-5';
      if (title.includes('Ep 20') || title.includes('Ten')) return 'numberblocks-ten';
      if (title.includes('Ep 35') || title.includes('Zero')) return 'numberblocks-zero';
      if (title.includes('Ep 10') || title.includes('How to Count')) return 'numberblocks-how-to-count';
      if (title.includes('Ep 11') || title.includes('Stampolines')) return 'numberblocks-stampolines';
      if (title.includes('Ep 94') || title.includes("What's My Number")) return 'numberblocks-whats-my-number';
      if (title.includes('Ep 12') || title.includes('Whole of Me')) return 'numberblocks-whole-of-me';
      if (title.includes('Ep 15') || title.includes('Hide and Seek')) return 'numberblocks-hide-seek';
      if (title.includes('Ep 34') || title.includes('Fruit Salad')) return 'numberblocks-fruit-salad';
      if (title.includes('Ep 2:') || title.includes('Another One')) return 'numberblocks-another-one';
      if (title.includes('Ep 14') || title.includes('Holes')) return 'numberblocks-holes';
      if (title.includes('Ep 32') || title.includes('Blockzilla')) return 'numberblocks-blockzilla';
    }
    
    // Default: convert to kebab-case
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
  
  /**
   * Set up tab switching functionality
   */
  setupTabs() {
    const tabButtons = this.container.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabId = button.dataset.tab;
        const tabsContainer = button.closest('.tabs-container');
        
        // Update button states
        tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        // Update panel visibility
        tabsContainer.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
        });
        
        const targetPanel = tabsContainer.querySelector(`#panel-${tabId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  },
  
  /**
   * Set up language change listener
   */
  setupLanguageListener() {
    // Listen for language button clicks
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Re-render after language change
        setTimeout(() => {
          this.currentLang = window.i18n?.currentLang || 'en';
          this.render();
        }, 100);
      });
    });
  },
  
  /**
   * Render error state
   */
  renderError() {
    this.container.innerHTML = `
      <div class="error-state">
        <h3>Oops! Something went wrong</h3>
        <p>We couldn't load the activities. Please try refreshing the page.</p>
      </div>
    `;
  },
  
  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  PreKPage.init();
});
