/**
 * sidebar.js — Left Sidebar Navigation & Right Sidebar Widgets
 *
 * Left: Navigation links (Home/Feed, Users, Albums, Photos)
 *       Uses onclick to call showSection() in script.js
 * Right: Suggested users, trending photos
 */

/**
 * Render left sidebar navigation.
 * @param {string} activePage - Current page/section identifier
 */
function renderLeftSidebar(activePage = 'home') {
    const container = document.getElementById('sidebar-left');
    if (!container) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const prefix = isSubPage ? '../' : '';

    // On sub-pages (like profile), link back to index with hash
    // On homepage, use JS function showSection()
    const navItems = [
        { id: 'home', icon: 'bi-house-door-fill', label: 'Home' },
        { id: 'users', icon: 'bi-people-fill', label: 'Users' },
        { id: 'albums', icon: 'bi-images', label: 'Albums' },
        { id: 'photos', icon: 'bi-camera-fill', label: 'Photos' },
    ];

    container.innerHTML = `
    <div class="sidebar-nav">
      ${navItems.map(item => {
        if (isSubPage) {
            // On profile/sub-pages, use links back to index.html
            return `
            <a href="${prefix}index.html#${item.id}" class="sidebar-nav-item ${activePage === item.id ? 'active' : ''}">
              <i class="bi ${item.icon}"></i> ${item.label}
            </a>
          `;
        } else {
            // On homepage, use JS onclick
            return `
            <button class="sidebar-nav-item ${activePage === item.id ? 'active' : ''}"
                    data-section="${item.id}" onclick="showSection('${item.id}')">
              <i class="bi ${item.icon}"></i> ${item.label}
            </button>
          `;
        }
    }).join('')}

      <div class="sidebar-divider"></div>
      <div class="sidebar-section-title">Quick Links</div>

      <a href="#" class="sidebar-nav-item">
        <i class="bi bi-bookmark-fill"></i> Saved Posts
      </a>
      <a href="#" class="sidebar-nav-item">
        <i class="bi bi-heart-fill"></i> Liked Posts
      </a>
      <a href="#" class="sidebar-nav-item">
        <i class="bi bi-gear-fill"></i> Settings
      </a>
    </div>

    <div class="footer">
      <span>© 2026 SocialHub</span> · <span>Powered by JSONPlaceholder</span>
    </div>
  `;
}

/**
 * Update active state on sidebar nav items.
 * @param {string} sectionId - The active section
 */
function updateSidebarActive(sectionId) {
    document.querySelectorAll('.sidebar-nav-item[data-section]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === sectionId);
    });
}

/**
 * Render right sidebar with suggested users and trending photos.
 * @param {Array} users - All users array
 * @param {Array} photos - Array of photo objects for trending
 */
function renderRightSidebar(users = [], photos = []) {
    const container = document.getElementById('sidebar-right');
    if (!container) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const prefix = isSubPage ? '../' : '';

    // Pick 5 random users for "Suggested"
    const suggested = [...users].sort(() => 0.5 - Math.random()).slice(0, 5);

    // Pick 9 photos for trending grid
    const trendingPhotos = photos.slice(0, 9);

    container.innerHTML = `
    <!-- Suggested Users -->
    <div class="sidebar-widget">
      <div class="sidebar-widget-title">
        Suggested Users
        <span class="see-all" onclick="${isSubPage ? `window.location.href='${prefix}index.html#users'` : "showSection('users')"}">See All</span>
      </div>
      ${suggested.map(user => `
        <div class="suggested-user">
          <div class="suggested-user-avatar" style="background: ${getGradient(user.id)}">
            ${getInitials(user.name)}
          </div>
          <div class="suggested-user-info">
            <div class="suggested-user-name">${user.name}</div>
            <div class="suggested-user-meta">@${user.username} · ${user.address.city}</div>
          </div>
          <a href="${prefix}pages/profile.html?userId=${user.id}" class="btn-follow">View</a>
        </div>
      `).join('')}
    </div>

    <!-- Trending Photos -->
    ${trendingPhotos.length > 0 ? `
      <div class="sidebar-widget">
        <div class="sidebar-widget-title">
          Trending Photos
        </div>
        <div class="trending-photos">
          ${trendingPhotos.map(p => `
            <div class="trending-photo" onclick="openLightbox('${getPhotoUrl(p.id)}', '${p.title.replace(/'/g, "\\'")}')">
              <img src="${getThumbnailUrl(p.id)}" alt="${p.title}" loading="lazy" />
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Footer info -->
    <div style="font-size:0.72rem; color:var(--text-muted); padding: 0.5rem;">
      Privacy · Terms · About · Developers<br/>
      © 2026 SocialHub
    </div>
  `;
}
