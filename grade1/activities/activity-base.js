/**
 * Base Activity Class for Grade 1
 * 
 * Provides common functionality for all Grade 1 activities:
 * - Stats tracking (correct/incorrect counts)
 * - Stats modal display
 * - Translation updates
 * - Common initialization patterns
 * 
 * Usage:
 * 1. Create your activity object extending this base
 * 2. Override init() to add your specific initialization
 * 3. Call super.init() first in your init method
 * 4. Use this.incrementCorrect() and this.incrementIncorrect() to track stats
 * 5. Call this.showStats() when activity completes
 */

class ActivityBase {
  constructor(config = {}) {
    // Game state
    this.totalRounds = config.totalRounds || 8;
    this.currentRound = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.isAnswered = false;
    this.autoAdvanceDelay = config.autoAdvanceDelay || 1500;
    
    // Activity config
    this.activityId = config.activityId || '';
    this.activityName = config.activityName || 'Activity';
    
    // DOM elements (common across all activities)
    this.statsOverlay = null;
    this.statsMessage = null;
    this.statCorrect = null;
    this.statIncorrect = null;
    this.btnPlayAgain = null;
  }

  /**
   * Initialize common DOM elements and event listeners
   * Call this from your activity's init() method
   */
  initBase() {
    // Get common DOM elements
    this.statsOverlay = document.getElementById('stats-overlay');
    this.statsMessage = document.getElementById('stats-message');
    this.statCorrect = document.getElementById('stat-correct');
    this.statIncorrect = document.getElementById('stat-incorrect');
    this.btnPlayAgain = document.getElementById('btn-play-again');

    // Set up common event listeners
    if (this.btnPlayAgain) {
      this.btnPlayAgain.addEventListener('click', () => this.resetActivity());
    }

    if (this.statsOverlay) {
      this.statsOverlay.addEventListener('click', (e) => {
        if (e.target === this.statsOverlay) this.resetActivity();
      });
    }

    // Listen for language changes
    document.addEventListener('languageChanged', () => {
      this.updateTranslations();
    });
  }

  /**
   * Increment correct answer count
   */
  incrementCorrect() {
    this.correctCount++;
  }

  /**
   * Increment incorrect answer count
   */
  incrementIncorrect() {
    this.incorrectCount++;
  }

  /**
   * Show stats modal with results
   */
  showStats() {
    if (!this.statsOverlay) return;

    this.statCorrect.textContent = this.correctCount;
    this.statIncorrect.textContent = this.incorrectCount;
    this.updateStatsMessage();
    this.statsOverlay.classList.add('show');
  }

  /**
   * Hide stats modal
   */
  hideStats() {
    if (this.statsOverlay) {
      this.statsOverlay.classList.remove('show');
    }
  }

  /**
   * Update stats message based on performance
   * Override this method to customize messages
   */
  updateStatsMessage() {
    if (!this.statsMessage || !this.activityId) return;

    const percentage = Math.round((this.correctCount / this.totalRounds) * 100);
    let msgKey;

    if (percentage === 100) {
      msgKey = `section.activities.${this.activityId}.perfect`;
    } else if (percentage >= 80) {
      msgKey = `section.activities.${this.activityId}.great`;
    } else if (percentage >= 60) {
      msgKey = `section.activities.${this.activityId}.good`;
    } else {
      msgKey = `section.activities.${this.activityId}.keepPracticing`;
    }

    // Try to get translation, fallback to generic messages
    let msg = window.i18n?.t(msgKey);
    
    // If translation not found, use generic messages
    if (!msg || msg === msgKey) {
      if (percentage === 100) {
        msg = 'Perfect! You\'re amazing!';
      } else if (percentage >= 80) {
        msg = 'Great job! You\'re really good at this!';
      } else if (percentage >= 60) {
        msg = 'Good work! Keep practicing!';
      } else {
        msg = 'Keep practicing! You\'re improving!';
      }
    }

    this.statsMessage.textContent = msg;
  }

  /**
   * Update translations for dynamic content
   * Override this to add activity-specific translation updates
   */
  updateTranslations() {
    // Update stats message if visible
    if (this.statsOverlay && this.statsOverlay.classList.contains('show')) {
      this.updateStatsMessage();
    }
  }

  /**
   * Reset activity to initial state
   * Override this to add activity-specific reset logic
   */
  resetActivity() {
    this.currentRound = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.hideStats();
    
    // Call activity-specific reset if it exists
    if (typeof this.onReset === 'function') {
      this.onReset();
    }
  }

  /**
   * Get translation text with fallback
   * @param {string} key - Translation key (e.g., 'section.activities.add-three-numbers.title')
   * @param {string} fallback - Fallback text if translation not found
   */
  t(key, fallback = '') {
    const translated = window.i18n?.t(key);
    return (translated && translated !== key) ? translated : fallback;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  /**
   * Disable all buttons in a container
   */
  disableButtons(container) {
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);
  }

  /**
   * Enable all buttons in a container
   */
  enableButtons(container) {
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = false);
  }

  /**
   * Show feedback message
   * @param {HTMLElement} feedbackEl - Feedback element
   * @param {string} message - Message to display
   * @param {boolean} isError - Whether this is an error message
   */
  showFeedback(feedbackEl, message, isError = false) {
    if (!feedbackEl) return;
    
    feedbackEl.textContent = message;
    feedbackEl.classList.add('show');
    
    if (isError) {
      feedbackEl.classList.add('error');
    } else {
      feedbackEl.classList.remove('error');
    }
  }

  /**
   * Hide feedback message
   */
  hideFeedback(feedbackEl) {
    if (!feedbackEl) return;
    
    feedbackEl.classList.remove('show', 'error');
  }

  /**
   * Auto-advance to next round after delay
   */
  autoAdvance(callback, delay = null) {
    const actualDelay = delay !== null ? delay : this.autoAdvanceDelay;
    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
    }, actualDelay);
  }

  /**
   * Initialize the activity
   * Override this in your activity class
   */
  init() {
    this.initBase();
    console.warn('ActivityBase.init() called - override this method in your activity class');
  }
}

// Make it available globally for use in inline scripts
window.ActivityBase = ActivityBase;
