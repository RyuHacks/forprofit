document.addEventListener("DOMContentLoaded", function() {
    const includeHTML = (elementId, filePath, callback) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to load file: ${filePath}. Status: ${response.status}`);
                    return;
                }
                return response.text();
            })
            .then(data => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = data;
                    if (callback) callback();
                }
            })
            .catch(error => console.error('Error including HTML:', error));
    };

    const initializeHeaderScripts = () => {
        const headerEmbed = document.querySelector('.new-header-embed');
        if (!headerEmbed) return;

        const mainNav = headerEmbed.querySelector('.main-navigation');
        const hamburgerBtn = headerEmbed.querySelector('.hamburger-menu');
        const closeBtn = headerEmbed.querySelector('.close-menu');
        const overlay = headerEmbed.querySelector('.menu-overlay');
        
        // --- Main Menu Toggle (Hamburger) ---
        function openMenu() {
            headerEmbed.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            headerEmbed.classList.remove('menu-open');
            document.body.style.overflow = '';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            // Reset submenu state when closing main menu
            mainNav.classList.remove('submenu-is-active');
        }

        hamburgerBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // --- NEW: Horizontal Submenu Slide Logic ---
        const submenuTriggers = mainNav.querySelectorAll('.dropdown > a');
        const backButtons = mainNav.querySelectorAll('.menu-back-btn');

        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(event) {
                // Only activate slide on mobile view
                if (window.innerWidth <= 768) {
                    event.preventDefault();
                    mainNav.classList.add('submenu-is-active');
                }
            });
        });

        backButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                mainNav.classList.remove('submenu-is-active');
            });
        });
        
        // --- Active Class for Current Page ---
        const navLinks = headerEmbed.querySelectorAll('.main-navigation a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkPage = (link.getAttribute('href') || '').split('/').pop();
            link.parentElement.classList.remove('active');
            if (linkPage === currentPage) {
                link.parentElement.classList.add('active');
            }
        });
    };

    // Load header and run its scripts as a callback
    includeHTML("header-placeholder", "_header.html", initializeHeaderScripts);
    // Load footer
    includeHTML("footer-placeholder", "_footer.html");
});