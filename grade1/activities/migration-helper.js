/**
 * Migration Helper for Refactoring Grade 1 Activities
 * 
 * This script helps identify which parts of an activity can be replaced
 * with the new shared code from ActivityBase and activity-shared.css.
 * 
 * To use: Include this script in an activity page and check console for suggestions.
 */

const MigrationHelper = {
  /**
   * Analyze an activity page and provide refactoring suggestions
   */
  analyze() {
    console.group('🔍 Activity Refactoring Analysis');
    
    const suggestions = [];
    const warnings = [];
    
    // Check if using ActivityBase
    if (!window.ActivityBase) {
      warnings.push('⚠️ ActivityBase not loaded - include activity-base.js');
    } else {
      suggestions.push('✓ ActivityBase is available');
    }
    
    // Check if using shared CSS
    const hasSharedCSS = Array.from(document.styleSheets).some(sheet => {
      try {
        return sheet.href && sheet.href.includes('activity-shared.css');
      } catch (e) {
        return false;
      }
    });
    
    if (!hasSharedCSS) {
      warnings.push('⚠️ activity-shared.css not loaded - add to <head>');
    } else {
      suggestions.push('✓ activity-shared.css is loaded');
    }
    
    // Check for duplicate stats modal
    const statsOverlay = document.getElementById('stats-overlay');
    if (statsOverlay) {
      suggestions.push('✓ Stats overlay found - can use ActivityBase.showStats()');
    }
    
    // Check for common elements that could use shared classes
    this.checkForCommonElements(suggestions, warnings);
    
    // Check for duplicate code patterns
    this.checkForDuplicatePatterns(suggestions, warnings);
    
    // Display results
    console.log('\n📋 Suggestions:');
    suggestions.forEach(s => console.log(s));
    
    if (warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      warnings.forEach(w => console.log(w));
    }
    
    console.log('\n💡 Next Steps:');
    console.log('1. Include activity-base.js and activity-shared.css');
    console.log('2. Convert activity object to class extending ActivityBase');
    console.log('3. Replace duplicate code with base class methods');
    console.log('4. Remove inline CSS that exists in activity-shared.css');
    console.log('5. Test thoroughly!');
    
    console.groupEnd();
    
    return { suggestions, warnings };
  },
  
  /**
   * Check for common elements
   */
  checkForCommonElements(suggestions, warnings) {
    const elements = {
      'progress-indicator': 'Progress indicator',
      'hint-banner': 'Hint banner',
      'question-display': 'Question display',
      'choices-container': 'Choices container',
      'feedback-message': 'Feedback message',
      'stats-overlay': 'Stats overlay',
      'btn-play-again': 'Play again button'
    };
    
    for (const [id, name] of Object.entries(elements)) {
      const el = document.getElementById(id) || document.querySelector(`.${id}`);
      if (el) {
        suggestions.push(`✓ ${name} found - ensure using shared CSS classes`);
      }
    }
  },
  
  /**
   * Check for duplicate patterns in inline scripts
   */
  checkForDuplicatePatterns(suggestions, warnings) {
    const scripts = Array.from(document.querySelectorAll('script:not([src])'));
    const scriptContent = scripts.map(s => s.textContent).join('\n');
    
    const patterns = {
      'correctCount': 'Stats tracking - use incrementCorrect()',
      'incorrectCount': 'Stats tracking - use incrementIncorrect()',
      'showStats': 'Stats display - use ActivityBase.showStats()',
      'addEventListener.*languageChanged': 'Language listener - handled by ActivityBase',
      'randomInt': 'Random number - use this.randomInt()',
      'shuffle': 'Array shuffle - use this.shuffle()',
      'escapeHtml': 'HTML escaping - use this.escapeHtml()',
      'Math.floor\\(Math.random': 'Random - use this.randomInt()'
    };
    
    for (const [pattern, suggestion] of Object.entries(patterns)) {
      const regex = new RegExp(pattern);
      if (regex.test(scriptContent)) {
        warnings.push(`⚠️ Found '${pattern}' - ${suggestion}`);
      }
    }
  },
  
  /**
   * Generate a template for the refactored activity
   */
  generateTemplate(activityId, activityName) {
    return `
class ${this.toPascalCase(activityId)} extends ActivityBase {
  constructor() {
    super({
      totalRounds: 8,
      activityId: '${activityId}',
      activityName: '${activityName}',
      autoAdvanceDelay: 1500
    });
    
    // Activity-specific properties
    this.currentAnswer = 0;
    
    // Activity-specific DOM elements
    this.currentRoundEl = null;
    // ... add more DOM elements ...
  }

  init() {
    // Initialize base class (stats, modal, translations)
    super.initBase();
    
    // Get activity-specific DOM elements
    this.currentRoundEl = document.getElementById('current-round');
    // ... get more elements ...
    
    // Set up activity-specific event listeners
    // ...
    
    // Start activity
    this.nextRound();
  }

  nextRound() {
    this.currentRound++;
    
    if (this.currentRound > this.totalRounds) {
      this.showStats(); // Base class method!
      return;
    }
    
    // Generate question
    // ...
    
    // Render UI
    // ...
  }

  selectAnswer(answer) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    
    const correct = answer === this.currentAnswer;
    
    if (correct) {
      this.incrementCorrect(); // Base class method!
    } else {
      this.incrementIncorrect(); // Base class method!
    }
    
    // Show feedback and auto-advance
    this.autoAdvance(() => this.nextRound());
  }

  resetActivity() {
    super.resetActivity(); // Base class reset
    this.nextRound();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const activity = new ${this.toPascalCase(activityId)}();
  activity.init();
});
    `.trim();
  },
  
  /**
   * Convert kebab-case to PascalCase
   */
  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  },
  
  /**
   * Extract current activity stats code for comparison
   */
  extractStatsCode() {
    const scripts = Array.from(document.querySelectorAll('script:not([src])'));
    const scriptContent = scripts.map(s => s.textContent).join('\n');
    
    const statsPatterns = [
      /correctCount.*=.*\d+/g,
      /incorrectCount.*=.*\d+/g,
      /showStats.*\{[\s\S]*?\}/g,
      /updateStatsMessage[\s\S]*?\}/g
    ];
    
    console.group('📊 Current Stats Code');
    statsPatterns.forEach((pattern, i) => {
      const matches = scriptContent.match(pattern);
      if (matches) {
        console.log(`Pattern ${i + 1}:`, matches[0].substring(0, 100) + '...');
      }
    });
    console.log('\n✨ Can be replaced with:');
    console.log('- this.incrementCorrect()');
    console.log('- this.incrementIncorrect()');
    console.log('- this.showStats()');
    console.groupEnd();
  }
};

// Auto-analyze on load if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.addEventListener('load', () => {
    setTimeout(() => MigrationHelper.analyze(), 1000);
  });
}

// Make available globally
window.MigrationHelper = MigrationHelper;

console.log('💡 Migration Helper loaded! Run MigrationHelper.analyze() to get refactoring suggestions.');
