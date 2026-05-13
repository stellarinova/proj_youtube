// Utility functions
/**
 * Debounce a function call
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Get unique values from an array of objects by key
 * @param {Array} arr
 * @param {string} key
 * @returns {Array}
 */
function getUniqueValues(arr, key) {
  return [...new Set(arr.map(item => item[key]).filter(Boolean))];
}

/**
 * Create an element with optional attributes and children
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {Array} [children]
 * @returns {HTMLElement}
 */
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });
  return el;
}

/**
 * Escape HTML for safe insertion
 * @param {string} text
 * @returns {string}
 */
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

window.utils = { debounce, getUniqueValues, createElement, escapeHTML };