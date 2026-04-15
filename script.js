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

// ============ Particle Animation System ============
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseTimeout;

// Particle class
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.baseOpacity = this.opacity;
        
        // Color variations (purple-blue spectrum)
        const hue = 240 + Math.random() * 40; // 240-280 (blue to purple)
        const saturation = 70 + Math.random() * 30;
        const lightness = 60 + Math.random() * 20;
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, `;
    }
    
    update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (isMouseMoving && distance < maxDistance) {
            // Particles attracted to mouse
            const force = (maxDistance - distance) / maxDistance;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
            this.size = this.baseSize + force * 2;
            this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
        } else {
            this.size += (this.baseSize - this.size) * 0.1;
            this.opacity += (this.baseOpacity - this.opacity) * 0.1;
        }
        
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // Keep particles in bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
    }
}

// Initialize canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Create particles
function createParticles() {
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Draw connections between nearby particles
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check for light theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Draw background particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Only draw connections in dark mode for better performance
    if (!isLight) {
        drawConnections();
    }

    requestAnimationFrame(animate);
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Handle resize
window.addEventListener('resize', () => {
    initCanvas();
    createParticles();
});

// Initialize
initCanvas();
createParticles();
animate();

// ============ News Timeline Interaction ============
const newsScroll = document.querySelector('.hero-news-scroll');
const newsItems = document.querySelectorAll('.hero-news-item');

if (newsItems.length > 0) {
    // 默认选中第一条news
    newsItems[0].classList.add('selected');

    // 点击选中
    newsItems.forEach((item) => {
        item.addEventListener('click', () => {
            // 移除之前的选中状态
            newsItems.forEach(i => i.classList.remove('selected'));
            // 添加新的选中状态
            item.classList.add('selected');
        });
    });

    // 平滑滚动
    if (newsScroll) {
        newsScroll.addEventListener('wheel', (e) => {
            e.preventDefault();
            newsScroll.scrollTop += e.deltaY * 0.5;
        }, { passive: false });

        // 移动端触摸支持
        let touchStartY = 0;
        newsScroll.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        newsScroll.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            newsScroll.scrollTop += deltaY * 0.8;
            touchStartY = touchY;
        }, { passive: true });
    }
}
