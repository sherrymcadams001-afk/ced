(function () {
    function buildMobileNavFromDesktop() {
        const header = document.querySelector('header');
        const desktopNav = header ? header.querySelector('nav') : null;
        if (!desktopNav) return { mobileMenuBtn: null, mobileNav: null };

        let mobileMenuBtn = document.getElementById('mobileMenuBtn');
        let mobileNav = document.getElementById('mobileNav');

        const desktopLinks = desktopNav.querySelectorAll('ul a');

        // Create button if missing
        if (!mobileMenuBtn) {
            mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.id = 'mobileMenuBtn';
            mobileMenuBtn.setAttribute('aria-label', 'Toggle mobile menu');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-controls', 'mobileNav');
            mobileMenuBtn.className = 'lg:hidden flex flex-col gap-1.5 p-2 touch-target';
            mobileMenuBtn.innerHTML = `
                <span class="w-6 h-0.5 bg-black rounded transition-all" aria-hidden="true"></span>
                <span class="w-6 h-0.5 bg-black rounded transition-all" aria-hidden="true"></span>
                <span class="w-6 h-0.5 bg-black rounded transition-all" aria-hidden="true"></span>
            `;
            desktopNav.appendChild(mobileMenuBtn);
        }

        // Create mobile nav if missing
        if (!mobileNav) {
            mobileNav = document.createElement('nav');
            mobileNav.id = 'mobileNav';
            mobileNav.setAttribute('aria-label', 'Mobile navigation');
            mobileNav.className = 'hidden fixed inset-0 bg-white/98 z-40 pt-20 text-center';

            const list = document.createElement('ul');
            list.className = 'list-none p-8 space-y-6';
            list.setAttribute('role', 'menu');

            desktopLinks.forEach((link) => {
                const li = document.createElement('li');
                li.setAttribute('role', 'none');
                const anchor = document.createElement('a');
                anchor.href = link.href;
                anchor.textContent = link.textContent;
                anchor.className = 'text-xl text-gray-900 font-medium mobile-nav-link touch-target';
                anchor.setAttribute('role', 'menuitem');
                if (link.classList.contains('action-btn') || link.classList.contains('btn-primary')) {
                    anchor.classList.add('text-accent-orange', 'font-semibold');
                }
                li.appendChild(anchor);
                list.appendChild(li);
            });

            mobileNav.appendChild(list);
            // Insert after header to mirror index structure
            header ? header.insertAdjacentElement('afterend', mobileNav) : document.body.prepend(mobileNav);
        }

        return { mobileMenuBtn, mobileNav };
    }

    function initMobileMenu() {
        const { mobileMenuBtn, mobileNav } = buildMobileNavFromDesktop();
        if (!mobileMenuBtn || !mobileNav) return;

        const body = document.body;
        const focusableSelector = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

        function setMenuState(isOpen) {
            if (isOpen) {
                mobileNav.classList.add('active');
                mobileNav.classList.remove('hidden');
                mobileMenuBtn.classList.add('active');
                body.classList.add('overflow-hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                const firstLink = mobileNav.querySelector('a');
                if (firstLink) firstLink.focus();
            } else {
                mobileNav.classList.remove('active');
                mobileNav.classList.add('hidden');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('overflow-hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.focus();
            }
        }

        function toggleMenu(force) {
            const isOpen = force !== undefined ? force : !mobileNav.classList.contains('active');
            setMenuState(isOpen);
        }

        mobileMenuBtn.addEventListener('click', function () {
            toggleMenu();
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Close on Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                toggleMenu(false);
            }
        });

        // Focus trap for accessibility
        mobileNav.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;
            const focusable = Array.from(mobileNav.querySelectorAll(focusableSelector)).filter((el) => !el.hasAttribute('disabled'));
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        // Close on viewport resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && mobileNav.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();
