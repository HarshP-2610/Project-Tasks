/**
 * script.js — Homepage Logic
 *
 * Features:
 *  1. Fetches all users, posts, comments, albums, and photos in parallel
 *  2. Supports section switching: Feed, Users, Albums, Photos
 *  3. Populates left sidebar (navigation) and right sidebar (suggested users, trending photos)
 *  4. Handles search (filters by section context)
 *  5. Comments modal and photo lightbox
 *
 * API Relationships:
 *  - users.id = posts.userId   → Each post belongs to a user
 *  - posts.id = comments.postId → Each post has comments
 *  - users.id = albums.userId  → Each user has albums
 *  - albums.id = photos.albumId → Each album has photos
 */

const API_BASE = 'https://jsonplaceholder.typicode.com';

// ---- State ----
let allUsers = [];
let allPosts = [];
let allComments = [];
let allAlbums = [];
let allPhotos = [];
let usersMap = {};       // userId → user object for fast lookup
let currentSection = 'home'; // 'home' | 'users' | 'albums' | 'photos'

// ---- DOM ----
const loadingOverlay = document.getElementById('loadingOverlay');
const feedContent = document.getElementById('feedContent');
const pageHeader = document.getElementById('pageHeader');

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar({
        showSearch: true,
        onSearch: handleSearch,
    });

    renderLeftSidebar('home');
    loadAllData();
});

// ============================================================
// Load All Data
// ============================================================
async function loadAllData() {
    try {
        showLoading(true);

        // Show skeletons while loading
        feedContent.innerHTML = createPostSkeleton().repeat(5);

        // Fetch everything in parallel
        const [usersRes, postsRes, commentsRes, albumsRes, photosRes] = await Promise.all([
            fetch(`${API_BASE}/users`),
            fetch(`${API_BASE}/posts`),
            fetch(`${API_BASE}/comments`),
            fetch(`${API_BASE}/albums`),
            fetch(`${API_BASE}/photos?_limit=100`),
        ]);

        allUsers = await usersRes.json();
        allPosts = await postsRes.json();
        allComments = await commentsRes.json();
        allAlbums = await albumsRes.json();
        allPhotos = await photosRes.json();

        // Build user lookup map
        usersMap = {};
        allUsers.forEach(u => { usersMap[u.id] = u; });

        // Render right sidebar
        renderRightSidebar(allUsers, allPhotos);

        // Check if URL has a hash section to show (e.g., from sidebar link on profile page)
        const hash = window.location.hash.replace('#', '');
        if (['users', 'albums', 'photos'].includes(hash)) {
            showSection(hash);
        } else {
            showSection('home');
        }

    } catch (error) {
        console.error('Error loading data:', error);
        feedContent.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-exclamation-triangle"></i>
        <p>Failed to load. Please refresh the page.</p>
      </div>
    `;
    } finally {
        showLoading(false);
    }
}

// ============================================================
// Section Switching
// ============================================================
/**
 * Switch the main content area between different sections.
 * Called by sidebar navigation buttons.
 * @param {string} section - 'home', 'users', 'albums', or 'photos'
 */
function showSection(section) {
    currentSection = section;
    updateSidebarActive(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (section) {
        case 'home':
            pageHeader.innerHTML = `
        <h1 class="page-title">📰 Feed</h1>
        <p class="page-subtitle">Latest posts from everyone in the community</p>
      `;
            renderFeed(allPosts);
            break;

        case 'users':
            pageHeader.innerHTML = `
        <h1 class="page-title">👥 Users</h1>
        <p class="page-subtitle">Discover ${allUsers.length} amazing people in the community</p>
      `;
            renderUsersGrid(allUsers);
            break;

        case 'albums':
            pageHeader.innerHTML = `
        <h1 class="page-title">📷 Albums</h1>
        <p class="page-subtitle">${allAlbums.length} albums from the community</p>
      `;
            renderAlbumsGrid();
            break;

        case 'photos':
            pageHeader.innerHTML = `
        <h1 class="page-title">🖼️ Photos</h1>
        <p class="page-subtitle">Browse the photo gallery</p>
      `;
            renderPhotosGallery();
            break;
    }
}

// ============================================================
// Render: Feed (Posts)
// ============================================================
function renderFeed(posts) {
    if (posts.length === 0) {
        feedContent.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-file-text"></i>
        <p>No posts found.</p>
      </div>
    `;
        return;
    }

    feedContent.innerHTML = posts.map(post => {
        const user = usersMap[post.userId];
        const commentCount = allComments.filter(c => c.postId === post.id).length;
        return createPostCard(post, commentCount, user);
    }).join('');
}

// ============================================================
// Render: Users Grid
// ============================================================
function renderUsersGrid(users) {
    if (users.length === 0) {
        feedContent.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-people"></i>
        <p>No users found.</p>
      </div>
    `;
        return;
    }

    feedContent.innerHTML = `
    <div class="users-grid">
      ${users.map((user, i) => createUserCard(user, i)).join('')}
    </div>
  `;
}

// ============================================================
// Render: Albums Grid
// ============================================================
async function renderAlbumsGrid() {
    // Show skeleton loaders
    feedContent.innerHTML = `
    <div class="albums-grid">
      ${Array(10).fill('<div class="skeleton" style="height:200px;border-radius:var(--radius-md)"></div>').join('')}
    </div>
  `;

    // Fetch preview photos for each album
    const albumsToShow = allAlbums.slice(0, 20); // Show first 20 albums
    const photoPromises = albumsToShow.map(album =>
        fetch(`${API_BASE}/photos?albumId=${album.id}&_limit=4`)
            .then(r => r.json())
            .then(photos => ({ album, photos }))
    );

    const albumData = await Promise.all(photoPromises);

    feedContent.innerHTML = `
    <div class="albums-grid">
      ${albumData.map(({ album, photos }) => {
        const user = usersMap[album.userId];
        return createAlbumCard(album, photos);
    }).join('')}
    </div>
  `;
}

// ============================================================
// Render: Photos Gallery
// ============================================================
function renderPhotosGallery() {
    feedContent.innerHTML = `
    <div class="photo-gallery">
      ${allPhotos.map(createPhotoItem).join('')}
    </div>
  `;
}

// ============================================================
// Album Gallery (when clicking an album card)
// ============================================================
async function openAlbumGallery(albumId, albumTitle) {
    feedContent.innerHTML = `
    <div class="gallery-header">
      <div>
        <div class="gallery-title"><i class="bi bi-images" style="color:var(--primary)"></i> ${albumTitle}</div>
        <div class="gallery-count" id="photoCount">Loading photos...</div>
      </div>
      <button class="btn-back-gallery" onclick="showSection('albums')">
        <i class="bi bi-arrow-left"></i> Back to Albums
      </button>
    </div>
    <div class="photo-gallery" id="photoGallery">
      <div class="section-spinner" style="grid-column:1/-1"><div class="spinner"></div></div>
    </div>
  `;

    try {
        const response = await fetch(`${API_BASE}/photos?albumId=${albumId}`);
        const photos = await response.json();

        document.getElementById('photoCount').textContent = `${photos.length} photos`;
        document.getElementById('photoGallery').innerHTML = photos.map(createPhotoItem).join('');
    } catch {
        document.getElementById('photoGallery').innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="bi bi-exclamation-triangle"></i><p>Failed to load photos.</p>
      </div>
    `;
    }
}

// ============================================================
// Search
// ============================================================
function handleSearch(query) {
    const q = query.trim().toLowerCase();

    if (!q) {
        showSection(currentSection);
        return;
    }

    // Search across posts and users
    const filteredPosts = allPosts.filter(post => {
        const user = usersMap[post.userId];
        return (
            post.title.toLowerCase().includes(q) ||
            post.body.toLowerCase().includes(q) ||
            user.name.toLowerCase().includes(q) ||
            user.username.toLowerCase().includes(q)
        );
    });

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
    );

    pageHeader.innerHTML = `
    <h1 class="page-title">🔍 Search Results</h1>
    <p class="page-subtitle">${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} and ${filteredPosts.length} post${filteredPosts.length !== 1 ? 's' : ''} matching "${query.trim()}"</p>
  `;

    let html = '';

    // Show matching users first
    if (filteredUsers.length > 0) {
        html += `
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.75rem;color:var(--text-secondary)">
        <i class="bi bi-people-fill" style="color:var(--primary)"></i> Users
      </h3>
      <div class="users-grid" style="margin-bottom:1.5rem">
        ${filteredUsers.map((u, i) => createUserCard(u, i)).join('')}
      </div>
    `;
    }

    // Then show matching posts
    if (filteredPosts.length > 0) {
        html += `
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.75rem;color:var(--text-secondary)">
        <i class="bi bi-file-text-fill" style="color:var(--primary)"></i> Posts
      </h3>
      ${filteredPosts.map(post => {
            const user = usersMap[post.userId];
            const commentCount = allComments.filter(c => c.postId === post.id).length;
            return createPostCard(post, commentCount, user);
        }).join('')}
    `;
    }

    if (!html) {
        html = `<div class="empty-state"><i class="bi bi-search"></i><p>No results found.</p></div>`;
    }

    feedContent.innerHTML = html;
}

// ============================================================
// Navigation
// ============================================================
function viewProfile(userId) {
    window.location.href = `pages/profile.html?userId=${userId}`;
}

// ============================================================
// Comments Modal
// ============================================================
async function openComments(postId, postTitle) {
    const overlay = document.getElementById('commentsModal');
    const title = document.getElementById('commentsModalTitle');
    const body = document.getElementById('commentsModalBody');

    title.innerHTML = `<i class="bi bi-chat-dots"></i> ${postTitle}`;
    body.innerHTML = `<div class="section-spinner"><div class="spinner"></div></div>`;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
        const response = await fetch(`${API_BASE}/comments?postId=${postId}`);
        const comments = await response.json();

        if (comments.length === 0) {
            body.innerHTML = `<div class="empty-state"><i class="bi bi-chat"></i><p>No comments.</p></div>`;
            return;
        }
        body.innerHTML = `<div style="padding:0.5rem 0">${comments.map(createCommentItem).join('')}</div>`;
    } catch {
        body.innerHTML = `<div class="empty-state"><i class="bi bi-exclamation-triangle"></i><p>Failed to load.</p></div>`;
    }
}

function closeCommentsModal() {
    document.getElementById('commentsModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('commentsModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'commentsModal') closeCommentsModal();
});

// ============================================================
// Lightbox
// ============================================================
function openLightbox(url, title) {
    document.getElementById('lightboxImg').src = url;
    document.getElementById('lightboxImg').alt = title;
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightboxOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// Loading
// ============================================================
function showLoading(show) {
    if (loadingOverlay) loadingOverlay.style.display = show ? 'flex' : 'none';
}
