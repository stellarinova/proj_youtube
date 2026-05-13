// Search and filter logic for YouTube Article Library
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const channelSelect = document.getElementById('channel-filter');
  const topicSelect = document.getElementById('topic-filter');
  const resultsContainer = document.getElementById('results');

  let articles = []; // will hold article objects from JSON
  let channels = new Set(['']);
  let topics = new Set(['']);

  // Fetch articles metadata
  fetch('data/articles.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load articles');
      return response.json();
    })
    .then(data => {
      articles = data;
      // collect unique channels and topics
      articles.forEach(article => {
        if (article.channel) channels.add(article.channel);
        if (article.topics && Array.isArray(article.topics)) {
          article.topics.forEach(t => topics.add(t));
        }
      });
      // populate dropdowns
      populateSelect(channelSelect, channels, "All Channels");
      populateSelect(topicSelect, topics, "All Topics");
      // initial render
      renderResults(articles);
    })
    .catch(err => {
      console.error(err);
      resultsContainer.innerHTML = '<p>Error loading articles. Please try again later.</p>';
    });

  function populateSelect(select, set, placeholderText) {
    // clear existing options except first placeholder
    select.innerHTML = `<option value="">${placeholderText}</option>`;
    // sort and add
    const sorted = [...set].filter(v => v).sort();
    sorted.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function renderResults(filteredArticles) {
    if (filteredArticles.length === 0) {
      resultsContainer.innerHTML = '<p>No articles match your criteria.</p>';
      return;
    }
    resultsContainer.innerHTML = ''; // clear
    filteredArticles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article-card';

      const titleLink = document.createElement('a');
      titleLink.href = article.url;
      titleLink.textContent = article.title;
      const titleEl = document.createElement('h2');
      titleEl.appendChild(titleLink);

      const metaBits = [];
      if (article.channel) metaBits.push(`Channel: ${article.channel}`);
      if (article.date) metaBits.push(`Date: ${article.date}`);
      const metaEl = document.createElement('p');
      metaEl.className = 'meta';
      metaEl.textContent = metaBits.join(' • ');
      const snippetEl = document.createElement('div');
      snippetEl.className = 'snippet';
      // use snippet or generate from content
      const snippetText = article.snippet || '';
      snippetEl.innerHTML = `<p>${snippetText}</p>`;

      card.appendChild(titleEl);
      card.appendChild(metaEl);
      card.appendChild(snippetEl);
      resultsContainer.appendChild(card);
    });
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const channel = channelSelect.value;
    const topic = topicSelect.value;

    const filtered = articles.filter(article => {
      // channel filter
      if (channel && article.channel !== channel) return false;
      // topic filter
      if (topic && (!article.topics || !article.topics.includes(topic))) return false;
      // text search
      if (query) {
        const searchable = [
          article.title,
          article.snippet,
          article.channel,
          article.topics ? article.topics.join(' ') : ''
        ].join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      return true;
    });
    renderResults(filtered);
  }

  // debounce input to avoid excessive filtering
  const debouncedSearch = debounce(applyFilters, 150);
  searchInput.addEventListener('input', debouncedSearch);
  channelSelect.addEventListener('change', applyFilters);
  topicSelect.addEventListener('change', applyFilters);
});

// simple debounce helper
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}