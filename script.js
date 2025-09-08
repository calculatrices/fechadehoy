const { DateTime } = luxon;

document.addEventListener('DOMContentLoaded', () => {
    const currentTimeElement = document.getElementById('current-time');
    const calendarBody = document.getElementById('calendar')?.querySelector('tbody');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('navList');
    const body = document.body;

    // --- Date and Time ---
    function updateTime() {
        if (currentTimeElement) {
            const now = DateTime.now().setLocale('es');
            const formattedDate = now.toLocaleString(DateTime.DATE_HUGE); // e.g., martes, 19 de octubre de 2021
            const formattedTime = now.toLocaleString(DateTime.TIME_WITH_SECONDS); // e.g., 14:35:05
            currentTimeElement.textContent = `${formattedDate} - ${formattedTime}`;
        }
    }

    // --- Calendar ---
    function generateCalendar() {
        if (!calendarBody) return;

        const now = DateTime.now().setLocale('es');
        const year = now.year;
        const month = now.month;
        const today = now.day;

        const firstDayOfMonth = DateTime.local(year, month, 1);
        const daysInMonth = firstDayOfMonth.daysInMonth;
        // Luxon's weekday: 1 (Mon) to 7 (Sun). We want 0 (Sun) to 6 (Sat) for table indexing.
        // Adjust weekday to start from Sunday (0). +1 because luxon is 1-7 mon-sun
        // Use `localWeekday`. Sunday is 7, so (7 % 7) = 0. Monday is 1, so (1 % 7) = 1 etc.
        const startDayOfWeek = firstDayOfMonth.weekday % 7;

        calendarBody.innerHTML = ''; // Clear previous content

        let date = 1;
        // Create rows (weeks)
        for (let i = 0; i < 6; i++) { // Max 6 rows needed for a month
            const row = document.createElement('tr');
            let weekHasDays = false; // Flag to check if the row contains any dates

            // Create cells (days)
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < startDayOfWeek) {
                    // Empty cells before the first day
                    cell.textContent = '';
                } else if (date <= daysInMonth) {
                    // Fill cells with dates
                    cell.textContent = date;
                    if (date === today) {
                        cell.classList.add('today'); // Highlight today's date
                    }
                     // Add click listener or other interactions if needed
                     cell.addEventListener('click', () => {
                        // Example: Log clicked date
                        // console.log(`Clicked on: ${DateTime.local(year, month, parseInt(cell.textContent)).toISODate()}`);
                        // Remove previous selected class
                        calendarBody.querySelectorAll('.selected').forEach(td => td.classList.remove('selected'));
                        // Add selected class to clicked cell
                        cell.classList.add('selected');
                    });
                    date++;
                    weekHasDays = true; // Mark that this week has days
                } else {
                    // Empty cells after the last day
                    cell.textContent = '';
                }
                row.appendChild(cell);
            }

            // Only append the row if it contains dates or it's the first row (for spacing)
            if (weekHasDays || i === 0) {
                calendarBody.appendChild(row);
            }

             // Stop creating rows if all dates are placed
             if (date > daysInMonth && weekHasDays) {
                 break;
             }
        }
    }

    // --- Dark Mode ---
    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        // Ensure correct icon visibility after applying theme
        updateThemeIcons(isDark);
    }

    function updateThemeIcons(isDark) {
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        if (lightIcon && darkIcon) {
             // Use style.display instead of relying solely on classes for initial load potentially
             lightIcon.style.display = isDark ? 'none' : 'block';
             darkIcon.style.display = isDark ? 'block' : 'none';
        }
    }

    if (darkModeToggle) {
        // Check saved preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        let isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);

        applyTheme(isDarkMode); // Apply initial theme

        darkModeToggle.addEventListener('click', () => {
            isDarkMode = !body.classList.contains('dark-mode'); // Toggle based on current state
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            applyTheme(isDarkMode);
        });
    }


    // --- Mobile Menu ---
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });
    }


    // Initial calls
    updateTime();
    setInterval(updateTime, 1000); // Update time every second
    generateCalendar();

    // Ensure icons are correctly displayed on load based on the initial theme check
    if (darkModeToggle) {
        applyTheme(body.classList.contains('dark-mode'));
    }

});