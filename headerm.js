// --- Main Menu Toggle ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;
const mobileDropdownButtons = document.querySelectorAll('[data-mobile-dropdown-button]');

// Check if the main menu button exists
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        // First, toggle the state of the main menu
        const isOpening = !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        body.classList.toggle('no-scroll');
        mobileMenuButton.classList.toggle('open');

        // Logic for when the menu is CLOSING
        if (!isOpening) {
            // First, close all the dropdowns inside
            mobileDropdownButtons.forEach(button => {
                button.classList.remove('open');
                button.nextElementSibling.classList.remove('open');
            });
            
            // NEW & CRITICAL: Instantly reset the menu's scroll to the top
            mobileMenu.scrollTop = 0;
        }
    });
}


// --- Accordion Dropdown Logic (This part remains the same) ---
mobileDropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the content associated with the clicked button
        const dropdownContent = button.nextElementSibling;
        
        // 1. Check if the dropdown we clicked is already open
        const isAlreadyOpen = button.classList.contains('open');

        // 2. Close ALL dropdowns first
        mobileDropdownButtons.forEach(btn => {
            btn.classList.remove('open');
            btn.nextElementSibling.classList.remove('open');
        });

        // 3. If the clicked dropdown was NOT already open, open it.
        if (!isAlreadyOpen) {
            button.classList.add('open');
            dropdownContent.classList.add('open');
        }
    });
});