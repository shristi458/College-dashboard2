/* ======= Pure JS for Dashboard Interactions ======= */

(function(){
  // Elements (adjust IDs/classes if your HTML uses different names)
  const sidebar = document.getElementById('sidebar');           // sidebar container
  const toggleBtn = document.getElementById('toggleSidebar');   // mobile toggle button
  const nav = document.getElementById('nav');                   // nav container with buttons
  const navButtons = nav ? Array.from(nav.querySelectorAll('button')) : [];
  const notifBtn = document.getElementById('notifBtn');         // notification bell (optional)
  const notifMenu = document.getElementById('notifMenu');       // notification dropdown (optional)
  const profileBtn = document.getElementById('profileBtn');     // profile button (optional)
  const profileMenu = document.getElementById('profileMenu');   // profile dropdown (optional)
  const searchInput = document.getElementById('searchInput');   // search input (optional)
  const quickBtns = Array.from(document.querySelectorAll('.btn')); // quick action buttons

  // Helper: safe query
  const safe = el => !!el;

  /* ------------------ Sidebar collapse / remember state ------------------ */
  const SIDEBAR_KEY = 'dashboard_sidebar_collapsed';

  function applySidebarState(collapsed){
    if(!safe(sidebar)) return;
    if(collapsed){
      sidebar.classList.add('collapsed');
      sidebar.setAttribute('aria-expanded','false');
    } else {
      sidebar.classList.remove('collapsed');
      sidebar.setAttribute('aria-expanded','true');
    }
  }

  // Initialize from localStorage
  let collapsed = false;
  try {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    collapsed = stored === 'true';
  } catch(e){ /* ignore */ }
  applySidebarState(collapsed);

  if (safe(toggleBtn)) {
    toggleBtn.addEventListener('click', (e)=>{
      collapsed = !collapsed;
      applySidebarState(collapsed);
      try { localStorage.setItem(SIDEBAR_KEY, collapsed ? 'true' : 'false'); } catch(e){}
    });
  }

  /* ------------------ Nav active switching ------------------ */
  if(navButtons.length){
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Optionally scroll main content or switch sections if your HTML has sections
        const sec = btn.dataset.section;
        if(sec){
          // If you have sections with id = section name, scroll into view
          const target = document.getElementById(sec);
          if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
      // keyboard enter/space support
      btn.addEventListener('keydown', (ev)=>{
        if(ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); btn.click(); }
      });
    });
  }

  /* ------------------ Dropdown helpers ------------------ */
  function createDropdown(button, menu){
    if(!safe(button) || !safe(menu)) return;
    // toggle
    button.addEventListener('click', (e)=>{
      e.stopPropagation();
      const open = menu.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open) menu.style.display = 'block';
      else menu.style.display = 'none';
    });
    // close when clicking outside
    document.addEventListener('click', (e)=>{
      if(!menu.contains(e.target) && !button.contains(e.target)){
        menu.classList.remove('open');
        menu.style.display = 'none';
        button.setAttribute('aria-expanded','false');
      }
    });
    // close on ESC
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        menu.classList.remove('open');
        menu.style.display = 'none';
        button.setAttribute('aria-expanded','false');
      }
    });
  }

  createDropdown(notifBtn, notifMenu);
  createDropdown(profileBtn, profileMenu);

  /* ------------------ Search focus effect (visual) ------------------ */
  if(safe(searchInput)){
    searchInput.addEventListener('focus', ()=> searchInput.classList.add('focused'));
    searchInput.addEventListener('blur', ()=> searchInput.classList.remove('focused'));
    // optional: clear on ESC
    searchInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){ searchInput.value = ''; searchInput.blur(); }
    });
  }

  /* ------------------ Quick buttons ripple/pressed effect (tiny) ------------------ */
  quickBtns.forEach(btn => {
    btn.addEventListener('mousedown', (e)=>{
      btn.classList.add('pressed');
      setTimeout(()=> btn.classList.remove('pressed'), 160);
    });
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        btn.classList.add('pressed');
        setTimeout(()=> btn.classList.remove('pressed'), 160);
      }
    });
  });

  /* ------------------ Accessibility: close open things on resize if needed ------------------ */
  window.addEventListener('resize', ()=>{
    // on small screen, ensure sidebar collapsed default
    if(window.innerWidth <= 900){
      // do not force — keep user pref. (optional)
    }
  });

  /* ------------------ Optional: keyboard nav for menus (arrow keys) ------------------ */
  // Minimal: close all dropdowns with ESC globally
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      [notifMenu, profileMenu].forEach(menu=>{
        if(safe(menu)){ menu.classList.remove('open'); menu.style.display = 'none'; }
      });
      if(safe(notifBtn)) notifBtn.setAttribute('aria-expanded','false');
      if(safe(profileBtn)) profileBtn.setAttribute('aria-expanded','false');
    }
  });

})();