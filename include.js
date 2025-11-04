// include.js
document.addEventListener("DOMContentLoaded", function() {
    const DESKTOP_MIN_WIDTH = 992;
    let isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;

    // --- Generic function to include HTML content ---
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

    // --- Function to load a script dynamically ---
    const loadScript = (src) => {
        // Remove old script to prevent conflicts
        const oldScript = document.querySelector(`script[src="${src}"]`);
        if (oldScript) {
            oldScript.remove();
        }
        // Add new script
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
    };

    // --- Function to load a stylesheet dynamically ---
    const loadCSS = (href) => {
         // Remove old CSS to prevent conflicts
        const oldLink = document.querySelector(`link[href="${href}"]`);
        if (oldLink) {
            oldLink.remove();
        }
        // Add new CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    // --- Main function to load the correct header ---
    const loadResponsiveHeader = () => {
        if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
            // --- LOAD DESKTOP ---
            console.log('Loading Desktop Header');
            loadCSS('headerd.css');
            includeHTML("header-placeholder", "_headerd.html", () => {
                loadScript('headerd.js');
            });
        } else {
            // --- LOAD MOBILE ---
            console.log('Loading Mobile Header');
            loadCSS('headerm.css');
            includeHTML("header-placeholder", "_headerm.html", () => {
                loadScript('headerm.js');
            });
        }
    };
    
    // --- Load Footer (remains the same) ---
    includeHTML("footer-placeholder", "_footer.html");

    // --- Initial load ---
    loadResponsiveHeader();

    // --- Reload on resize across breakpoint ---
    // This is the simplest and most reliable way to ensure the correct
    // CSS and JS are active without complex cleanup logic.
    window.addEventListener('resize', () => {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
        if (wasDesktop !== isDesktop) {
            window.location.reload();
        }
    });
});