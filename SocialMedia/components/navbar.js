/**
 * navbar.js — Top Navigation Bar Component
 *
 * Renders a fixed top navbar with:
 *  - Brand logo
 *  - Search bar (with callback)
 *  - Action buttons (notifications, messages)
 *  - User avatar link
 */

/**
 * Render the navbar.
 * @param {Object} options
 * @param {boolean} options.showSearch - Show search input
 * @param {Function} options.onSearch - Search input callback
 */
function renderNavbar({ showSearch = true, onSearch = null } = {}) {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  const isSubPage = window.location.pathname.includes('/pages/');
  const homeHref = isSubPage ? '../index.html' : 'index.html';

  container.innerHTML = `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="navbar-brand" href="${homeHref}">
          <span class="navbar-brand-icon"><i class="bi bi-people-fill"></i></span>
          SocialHub
        </a>

        ${showSearch ? `
          <div class="navbar-search">
            <i class="bi bi-search"></i>
            <input type="text" id="navSearchInput" placeholder="Search users, posts..." />
          </div>
        ` : ''}

        <div class="navbar-actions">
          <a href="${homeHref}" class="navbar-action-btn" title="Home">
            <i class="bi bi-house-door-fill"></i>
          </a>
          <button class="navbar-action-btn" title="Notifications">
            <i class="bi bi-bell"></i>
            <span class="badge-dot"></span>
          </button>
          <button class="navbar-action-btn" title="Messages">
            <i class="bi bi-chat-dots"></i>
          </button>
          <div class="navbar-avatar" id="navAvatar" title="Profile">
            <i class="bi bi-person-fill" style="font-size:1rem"></i>
          </div>
        </div>
      </div>
    </nav>
  `;

  // Attach search handler
  if (showSearch && onSearch) {
    const input = document.getElementById('navSearchInput');
    if (input) {
      let debounceTimer;
      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => onSearch(e.target.value), 200);
      });
    }
  }
}
