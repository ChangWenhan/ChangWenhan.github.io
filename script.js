// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll progress bar
const progressBar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
    
    // Show/hide back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (winScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top
const backToTop = document.querySelector('.back-to-top');
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

// Set initial icon based on theme that was already evaluated in <head>
if (html.getAttribute('data-theme') === 'light') {
    themeIcon.textContent = '☀️';
} else {
    themeIcon.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        html.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    }
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.research-card, .pub-item, .timeline-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Add CCF rank colors
document.querySelectorAll('.pub-rank').forEach(rank => {
    if (rank.textContent.includes('CCF-A')) {
        rank.classList.add('ccf-a');
    } else if (rank.textContent.includes('CCF-B')) {
        rank.classList.add('ccf-b');
    } else if (rank.textContent.includes('CCF-C')) {
        rank.classList.add('ccf-c');
    } else if (rank.textContent.includes('EI')) {
        rank.classList.add('ei');
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
    });
});

// Scroll Spy: Highlight active nav link on scroll
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href') === '#' + current) {
            li.classList.add('active');
        }
    });
});

// Typewriter effect for Hero subtitle
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const textToType = subtitle.textContent;
    subtitle.textContent = ''; // clear initially
    subtitle.classList.add('typing'); 
    
    let charIndex = 0;
    const typeWriter = () => {
        if (charIndex < textToType.length) {
            subtitle.textContent += textToType.charAt(charIndex);
            charIndex++;
            // random interval for realistic typing feeling
            const typeDelay = Math.random() * 50 + 50;
            setTimeout(typeWriter, typeDelay);
        } else {
            // keep the cursor blinking a few times, then remove it
            setTimeout(() => {
                subtitle.classList.replace('typing', 'typing-done');
            }, 1500);
        }
    };
    
    // Slight initial delay before typing starts
    setTimeout(typeWriter, 600);
}
