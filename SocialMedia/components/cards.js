/**
 * cards.js — UI Card Component Factory
 *
 * Generates HTML for social media UI elements:
 *  - User profile cards (users grid)
 *  - Post feed cards (timeline)
 *  - Album cards (albums grid)
 *  - Comment items (modal)
 *  - Photo items (gallery)
 *  - Skeleton loaders
 *
 * API Relationships:
 *  users.id → posts.userId, albums.userId
 *  posts.id → comments.postId
 *  albums.id → photos.albumId
 */

// ---- Helpers ----

/** Get initials from full name (e.g., "Leanne Graham" → "LG") */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Get a unique gradient for visual variety based on ID */
function getGradient(id) {
  const g = [
    'linear-gradient(135deg, #4F46E5, #7C3AED)',
    'linear-gradient(135deg, #10B981, #059669)',
    'linear-gradient(135deg, #EC4899, #F43F5E)',
    'linear-gradient(135deg, #F59E0B, #EF4444)',
    'linear-gradient(135deg, #6366F1, #8B5CF6)',
    'linear-gradient(135deg, #14B8A6, #0EA5E9)',
    'linear-gradient(135deg, #F97316, #FB923C)',
    'linear-gradient(135deg, #8B5CF6, #EC4899)',
    'linear-gradient(135deg, #0EA5E9, #6366F1)',
    'linear-gradient(135deg, #84CC16, #22C55E)',
  ];
  return g[(id - 1) % g.length];
}

/** Convert JSONPlaceholder photo ID to working picsum.photos URL */
function getPhotoUrl(photoId, size = 600) {
  return `https://picsum.photos/seed/${photoId}/${size}/${size}`;
}
function getThumbnailUrl(photoId) {
  return getPhotoUrl(photoId, 150);
}

/** Generate a random "time ago" for social feel */
function getTimeAgo(postId) {
  const times = ['2m ago', '15m ago', '1h ago', '2h ago', '3h ago', '5h ago',
    '8h ago', '12h ago', '1d ago', '2d ago'];
  return times[(postId - 1) % times.length];
}

/** Generate a random like count */
function getLikeCount(postId) {
  return Math.floor((postId * 17 + 43) % 500) + 12;
}

// ---- Cards ----

/**
 * User profile card for the users grid (home page).
 * Links to profile page via userId.
 */
function createUserCard(user, index = 0) {
  return `
    <div class="user-card animate-in" style="animation-delay:${index * 0.06}s"
         onclick="viewProfile(${user.id})">
      <div class="user-card-banner" style="background:${getGradient(user.id)}"></div>
      <div class="user-card-avatar" style="background:${getGradient(user.id)}">
        ${getInitials(user.name)}
      </div>
      <div class="user-card-body">
        <div class="user-card-name">${user.name}</div>
        <div class="user-card-username">@${user.username}</div>
        <div class="user-card-info">
          <div class="user-card-info-item">
            <i class="bi bi-envelope-fill"></i> ${user.email.toLowerCase()}
          </div>
          <div class="user-card-info-item">
            <i class="bi bi-geo-alt-fill"></i> ${user.address.city}
          </div>
          <div class="user-card-info-item">
            <i class="bi bi-building"></i> ${user.company.name}
          </div>
        </div>
        <button class="btn-view-profile" onclick="event.stopPropagation(); viewProfile(${user.id})">
          <i class="bi bi-person-circle"></i> View Profile
        </button>
      </div>
    </div>
  `;
}

/**
 * Post feed card — social media style.
 * Shows author info, post content, like count, and action buttons.
 * Relationship: posts.userId → users.id
 */
function createPostCard(post, commentCount, user) {
  const likes = getLikeCount(post.id);
  const time = getTimeAgo(post.id);

  return `
    <div class="post-card animate-in">
      <div class="post-card-header">
        <div class="post-avatar" style="background:${getGradient(user.id)};cursor:pointer"
             onclick="viewProfile(${user.id})">${getInitials(user.name)}</div>
        <div class="post-author-info">
          <div class="post-author-name" onclick="viewProfile(${user.id})">${user.name}</div>
          <div class="post-author-meta">
            <span>@${user.username}</span>
            <span>·</span>
            <span>${time}</span>
          </div>
        </div>
        <button class="post-more-btn"><i class="bi bi-three-dots"></i></button>
      </div>

      <div class="post-card-body">
        <div class="post-title">${post.title}</div>
        <div class="post-body">${post.body}</div>
      </div>

      <div class="post-card-stats">
        <div class="post-likes-display">
          <i class="bi bi-heart-fill"></i>
          <span>${likes} likes</span>
        </div>
        <span>${commentCount} comments</span>
      </div>

      <div class="post-card-actions">
        <button class="post-action-btn" onclick="toggleLike(this)">
          <i class="bi bi-heart"></i> Like
        </button>
        <button class="post-action-btn" onclick="openComments(${post.id}, '${post.title.replace(/'/g, "\\'")}')">
          <i class="bi bi-chat-dots"></i> Comment
          <span class="comment-badge">${commentCount}</span>
        </button>
        <button class="post-action-btn">
          <i class="bi bi-share"></i> Share
        </button>
        <button class="post-action-btn">
          <i class="bi bi-bookmark"></i> Save
        </button>
      </div>
    </div>
  `;
}

/**
 * Album card with photo preview grid.
 * Relationship: albums.id → photos.albumId
 */
function createAlbumCard(album, previewPhotos = []) {
  const previews = previewPhotos.slice(0, 4).map(p =>
    `<img src="${getThumbnailUrl(p.id)}" alt="${p.title}" loading="lazy" />`
  ).join('');

  const fillers = Array(Math.max(0, 4 - previewPhotos.length)).fill(
    `<div style="background:var(--bg-input);width:100%;height:100%"></div>`
  ).join('');

  return `
    <div class="album-card animate-in" onclick="openAlbumGallery(${album.id}, '${album.title.replace(/'/g, "\\'")}')">
      <div class="album-card-preview">${previews}${fillers}</div>
      <div class="album-card-body">
        <div class="album-card-title">${album.title}</div>
        <div class="album-card-count">
          <i class="bi bi-images me-1"></i>
          ${previewPhotos.length > 0 ? `${previewPhotos.length} photos` : 'Loading...'}
        </div>
      </div>
    </div>
  `;
}

/** Comment list item for modal */
function createCommentItem(comment) {
  return `
    <div class="comment-item">
      <div class="comment-avatar" style="background:${getGradient(comment.id)}">
        ${getInitials(comment.name)}
      </div>
      <div class="comment-content">
        <div class="comment-name">${comment.name}</div>
        <div class="comment-email">${comment.email}</div>
        <div class="comment-body">${comment.body}</div>
      </div>
    </div>
  `;
}

/** Photo gallery item with hover overlay */
function createPhotoItem(photo) {
  return `
    <div class="photo-item" onclick="openLightbox('${getPhotoUrl(photo.id)}', '${photo.title.replace(/'/g, "\\'")}')">
      <img src="${getThumbnailUrl(photo.id)}" alt="${photo.title}" loading="lazy" />
      <div class="photo-item-overlay">
        <div class="photo-item-title">${photo.title}</div>
      </div>
    </div>
  `;
}

/** Post card skeleton for loading state */
function createPostSkeleton() {
  return `
    <div class="skeleton-card">
      <div style="display:flex;gap:0.75rem;margin-bottom:1rem">
        <div class="skeleton skeleton-avatar"></div>
        <div style="flex:1">
          <div class="skeleton skeleton-text w-50"></div>
          <div class="skeleton skeleton-text w-75" style="height:10px"></div>
        </div>
      </div>
      <div class="skeleton skeleton-text w-75"></div>
      <div class="skeleton skeleton-text w-100"></div>
      <div class="skeleton skeleton-text w-50"></div>
    </div>
  `;
}

/** Like toggle interaction */
function toggleLike(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('liked')) {
    icon.className = 'bi bi-heart-fill';
    btn.innerHTML = '<i class="bi bi-heart-fill"></i> Liked';
    btn.classList.add('liked');
  } else {
    icon.className = 'bi bi-heart';
    btn.innerHTML = '<i class="bi bi-heart"></i> Like';
  }
}
