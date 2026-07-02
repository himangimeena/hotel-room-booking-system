/* ================================================
   js/admin-sidebar.js
   Injects the admin sidebar + mobile topbar into
   every admin page. Include AFTER api.js and
   BEFORE your page-specific script.

   Usage in HTML:
     <body>
       <div id="admin-shell-mount"></div>
       <main class="admin-main">
         ...page content...
       </main>
     </body>
   ================================================ */

const SIDEBAR_LINKS = [
  { href: 'admin-dashboard.html',  icon: '▣', label: 'Dashboard' },
  { href: 'admin-rooms.html',      icon: '🛏', label: 'Room Management' },
  { href: 'admin-bookings.html',   icon: '📋', label: 'Bookings' },
  { href: 'admin-customers.html',  icon: '👥', label: 'Customers' },
  { href: 'admin-revenue.html',    icon: '💰', label: 'Revenue' },
  { href: 'admin-reports.html',    icon: '📊', label: 'Reports' },
  { href: 'admin-settings.html',   icon: '⚙', label: 'Settings' },
];

function renderAdminShell() {
  // Figure out which page we're on so we can highlight it
  const currentPage = window.location.pathname.split('/').pop() || 'admin-dashboard.html';

  const linksHTML = SIDEBAR_LINKS.map(link => `
    <a href="${link.href}" class="sidebar-link ${link.href === currentPage ? 'active' : ''}">
      <span class="icon">${link.icon}</span>
      <span>${link.label}</span>
    </a>
  `).join('');

  const shellHTML = `
    <!-- Mobile topbar -->
    <div class="admin-topbar">
      <span class="brand-name">AZURE HAVEN</span>
      <button class="admin-hamburger" onclick="toggleAdminSidebar()" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Dark overlay behind mobile drawer -->
    <div class="admin-overlay" id="admin-overlay" onclick="toggleAdminSidebar()"></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar mobile-drawer" id="admin-sidebar">
      <div class="sidebar-brand">
        <div class="brand-name">AZURE HAVEN</div>
        <div class="brand-role">ADMINISTRATOR</div>
      </div>

      <nav class="sidebar-nav">
        ${linksHTML}
      </nav>

      <div class="sidebar-footer">
        <a href="#" class="sidebar-link" onclick="logout()">
          <span class="icon">🚪</span>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  `;

  document.getElementById('admin-shell-mount').outerHTML = shellHTML;
}

function toggleAdminSidebar() {
  document.getElementById('admin-sidebar').classList.toggle('open');
  document.getElementById('admin-overlay').classList.toggle('open');
}

// Render immediately when this script loads
renderAdminShell();
