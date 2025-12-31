/* Shared Activity Base - Pre-K Meadow Math */

/**
 * Base class for all Pre-K activities
 * Provides common functionality: stats tracking, progress indicators, feedback, etc.
 */
class ActivityBase {
  constructor(config = {}) {
    // Configuration
    this.maxRounds = config.maxRounds || 5;
    this.autoAdvanceDelay = config.autoAdvanceDelay || 1500;
    this.activityName = config.activityName || 'activity';
    
    // Game state
    this.round = 1;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isComplete = false;
    
    // DOM elements - will be initialized by child class
    this.progress = null;
    this.feedback = null;
    this.statsOverlay = null;
    this.statsCorrect = null;
    this.statsWrong = null;
    this.statsIcon = null;
    this.statsMessage = null;
    this.btnPlayAgain = null;
  }
  
  /**
   * Initialize common DOM elements
   * Should be called by child class after DOM is ready
   */
  initCommonElements() {
    this.progress = document.getElementById('progress');
    this.feedback = document.getElementById('feedback');
    this.statsOverlay = document.getElementById('stats-overlay');
    this.statsCorrect = document.getElementById('stats-correct');
    this.statsWrong = document.getElementById('stats-wrong');
    this.statsIcon = document.getElementById('stats-icon');
    this.statsMessage = document.getElementById('stats-message');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    
    // Setup event listeners for common elements
    if (this.btnPlayAgain) {
      this.btnPlayAgain.addEventListener('click', () => this.restartActivity());
    }
    
    // Close stats overlay when clicking outside
    if (this.statsOverlay) {
      this.statsOverlay.addEventListener('click', (e) => {
        if (e.target === this.statsOverlay) {
          this.statsOverlay.classList.remove('show');
        }
      });
    }
  }
  
  /**
   * Render progress indicator dots
   */
  renderProgress() {
    if (!this.progress) return;
    
    let html = '';
    for (let i = 1; i <= this.maxRounds; i++) {
      let className = 'progress-dot';
      if (i < this.round) {
        className += ' completed';
      } else if (i === this.round) {
        className += ' current';
      }
      html += `<div class="${className}"></div>`;
    }
    this.progress.innerHTML = html;
  }
  
  /**
   * Show feedback message
   * @param {string} message - Message to display
   * @param {boolean} isError - Whether this is an error message
   * @param {number} duration - How long to show (ms)
   */
  showFeedback(message, isError = false, duration = 2000) {
    if (!this.feedback) return;
    
    this.feedback.textContent = message;
    this.feedback.classList.remove('error');
    if (isError) {
      this.feedback.classList.add('error');
    }
    this.feedback.classList.add('show');
    
    if (duration > 0) {
      setTimeout(() => {
        this.feedback.classList.remove('show');
      }, duration);
    }
  }
  
  /**
   * Hide feedback message
   */
  hideFeedback() {
    if (!this.feedback) return;
    this.feedback.classList.remove('show');
  }
  
  /**
   * Record a correct answer
   * @param {string} message - Optional feedback message
   */
  recordCorrect(message = null) {
    this.correctCount++;
    this.isComplete = true;
    
    if (message) {
      this.showFeedback(message, false, this.autoAdvanceDelay);
    }
    
    // Auto-advance after delay
    setTimeout(() => {
      if (this.round < this.maxRounds) {
        this.nextRound();
      } else {
        this.showStats();
      }
    }, this.autoAdvanceDelay);
  }
  
  /**
   * Record a wrong answer
   * @param {string} message - Optional feedback message
   */
  recordWrong(message = null) {
    this.wrongCount++;
    
    if (message) {
      this.showFeedback(message, true, 2000);
    }
  }
  
  /**
   * Show completion stats modal
   */
  showStats() {
    if (!this.statsOverlay) return;
    
    // Update stats display
    if (this.statsCorrect) {
      this.statsCorrect.textContent = this.correctCount;
    }
    if (this.statsWrong) {
      this.statsWrong.textContent = this.wrongCount;
    }
    
    // Calculate performance and show message
    const percent = this.correctCount / this.maxRounds;
    if (this.statsIcon && this.statsMessage) {
      if (percent >= 0.8) {
        this.statsIcon.textContent = '🌟';
        this.statsMessage.textContent = this.getStatsMessage('excellent');
      } else if (percent >= 0.6) {
        this.statsIcon.textContent = '🎉';
        this.statsMessage.textContent = this.getStatsMessage('good');
      } else {
        this.statsIcon.textContent = '👍';
        this.statsMessage.textContent = this.getStatsMessage('tryAgain');
      }
    }
    
    this.statsOverlay.classList.add('show');
  }
  
  /**
   * Get stats message based on performance level
   * Can be overridden by child classes for custom messages
   */
  getStatsMessage(level) {
    const messages = {
      excellent: 'Amazing! You did great!',
      good: 'Great job!',
      tryAgain: 'Good effort! Try again!'
    };
    return messages[level] || messages.tryAgain;
  }
  
  /**
   * Restart the entire activity
   */
  restartActivity() {
    this.round = 1;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isComplete = false;
    
    if (this.statsOverlay) {
      this.statsOverlay.classList.remove('show');
    }
    
    // Call child class implementation
    this.startRound();
  }
  
  /**
   * Go to next round
   */
  nextRound() {
    this.round++;
    this.isComplete = false;
    this.startRound();
  }
  
  /**
   * Start a round - MUST be implemented by child class
   */
  startRound() {
    throw new Error('startRound() must be implemented by child class');
  }
  
  /**
   * Generate random number between min and max (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Shuffle an array
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  /**
   * Add CSS animation class temporarily
   */
  addTemporaryClass(element, className, duration = 300) {
    if (!element) return;
    
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }
  
  /**
   * Play celebration animation/sound (can be enhanced later)
   */
  celebrate() {
    // Can be implemented for confetti, sounds, etc.
    console.log('🎉 Celebration!');
  }
}

// Export for use in activity files
window.ActivityBase = ActivityBase;
