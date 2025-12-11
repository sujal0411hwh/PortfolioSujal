/* =========================================
   1. GLOBAL VARIABLES & SETUP
   ========================================= */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particlesArray;

// Audio Elements
const clickSound = document.getElementById('click-sound');
const typeSound = document.getElementById('type-sound');
const music = document.getElementById('rickroll-music');
const musicBtn = document.getElementById('music-toggle');

// Initialize Canvas Size
if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/* =========================================
   2. CUSTOM CURSOR LOGIC
   ========================================= */
const cursorDot = document.getElementById('cursor-dot');

// Only activate custom cursor on non-touch devices
if (window.matchMedia("(hover: hover)").matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Move the arrow instantly
        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }
    });
}

/* =========================================
   3. NEURAL NETWORK BACKGROUND (Canvas)
   ========================================= */
if (canvas && ctx) {
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 0.5; // Random size
            this.speedX = Math.random() * 1 - 0.5; // Random horizontal speed
            this.speedY = Math.random() * 1 - 0.5; // Random vertical speed
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            // Particle Color (Blue-ish)
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-blue');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        // Number of particles based on screen size
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particlesArray.push(new Particle(x, y));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                // Draw line if close enough
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(0, 243, 255, ${opacityValue * 0.15})`; // Low opacity lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Start Animation
    initParticles();
    animateParticles();
}

/* =========================================
   4. TYPING EFFECT (Hero Section)
   ========================================= */
const textElement = document.getElementById('typewriter');
const phrases = ['AI Solutions.', 'Secure Web Apps.', 'Automation Systems.'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        // Play faint typing sound randomly (if user has interacted)
        if (Math.random() > 0.6) playTypeSound();
    }

    let typeSpeed = isDeleting ? 100 : 150;

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing phrase, pause before deleting
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing on load
document.addEventListener('DOMContentLoaded', typeEffect);


// /* =========================================
//    5. SOUND & MUSIC MANAGER
//    ========================================= */
// let userInteracted = false;

// // Enable audio context on first click
// document.addEventListener('click', () => {
//     userInteracted = true;
// }, { once: true });

// function playClickSound() {
//     if (clickSound && userInteracted) {
//         clickSound.currentTime = 0;
//         clickSound.volume = 0.4;
//         clickSound.play().catch(() => {});
//     }
// }

// function playTypeSound() {
//     if (typeSound && userInteracted) {
//         typeSound.currentTime = 0;
//         typeSound.volume = 0.1; // Very quiet
//         typeSound.play().catch(() => {});
//     }
// }

// // Global Click Sound Listener
// document.querySelectorAll('a, button').forEach(el => {
//     el.addEventListener('click', playClickSound);
// });

// /* =========================================
//    RICK ROLL LOGIC (FIXED)
//    ========================================= */
// const banner = document.getElementById('rickroll-banner');
// const closePrankBtn = document.getElementById('close-prank-btn');
// let isMusicPlaying = false;

// // 1. Play Music & Show Banner
// musicBtn.addEventListener('click', () => {
//     if (!isMusicPlaying) {
//         music.volume = 1.0;
//         music.play().then(() => {
//             musicBtn.classList.add('playing');
//             // Show Banner
//             banner.classList.add('active');
//             isMusicPlaying = true;
//         }).catch(err => {
//             console.error(err); // Check console if it fails
//             showNotification('Audio Error: Check file name!', 'error');
//         });
//     } else {
//         stopPrank();
//     }
// });

// // 2. Stop Music & Hide Banner
// function stopPrank() {
//     music.pause();
//     music.currentTime = 0;
//     musicBtn.classList.remove('playing');
//     banner.classList.remove('active');
//     isMusicPlaying = false;
//     showNotification('Prank stopped.', 'success');
// }

// // 3. Attach Click Event to the "Forgive Me" Button
// if (closePrankBtn) {
//     closePrankBtn.addEventListener('click', stopPrank);
// }

// // Function to Stop the Prank (called by the 'Forgive Me' button)
// function stopPrank() {
//     music.pause();
//     music.currentTime = 0; // Reset song
//     musicBtn.classList.remove('playing');
//     banner.classList.remove('active'); // Hide Banner
//     isMusicPlaying = false;
//     showNotification('You are forgiven... for now.', 'success');
// }


/* =========================================
   6. THEME TOGGLE (Dark/Light)
   ========================================= */
const toggleBtn = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = toggleBtn.querySelector('i');

toggleBtn.addEventListener('click', () => {
    if (html.getAttribute('data-theme') === 'dark') {
        html.setAttribute('data-theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        // Update particles color via CSS variable reload (optional, but particles check CSS)
    } else {
        html.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});


/* =========================================
   7. SCROLL PROGRESS & ANIMATIONS
   ========================================= */
const scrollProgress = document.getElementById('scroll-progress');
const faders = document.querySelectorAll('.fade-in');

// Intersection Observer for Fade-in animations
const appearOptions = { threshold: 0.2 };
const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

// Scroll Progress Bar Logic
window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});


/* =========================================
   8. CONTACT FORM (Real Direct Email)
   ========================================= */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        // Show loading state
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(async (response) => {
            if (response.status === 200) {
                showNotification('Message sent successfully! 🚀', 'success');
                contactForm.reset(); // Clear the form
            } else {
                showNotification('Something went wrong.', 'error');
            }
        })
        .catch(error => {
            showNotification('Error sending message.', 'error');
            console.error(error);
        })
        .finally(() => {
            // Reset button
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}

/* =========================================
   9. NOTIFICATION SYSTEM
   ========================================= */
function showNotification(message, type) {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.classList.add('notification');
    
    // Color coding based on type
    if (type === 'success') notif.style.borderLeftColor = '#00f3ff'; // Blue
    else if (type === 'error') notif.style.borderLeftColor = '#ff0055'; // Red
    else notif.style.borderLeftColor = '#bc13fe'; // Purple
    
    notif.innerText = message;
    
    container.appendChild(notif);
    
    // Play subtle notification sound
    playClickSound();
    
    // Remove after 3 seconds
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

/* =========================================
   3D TILT EFFECT FOR CARDS
   ========================================= */
const cards = document.querySelectorAll('.project-card, .skill-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse position inside card
        const y = e.clientY - rect.top;
        
        // Calculate rotation (max 15 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Tilt Up/Down
        const rotateY = ((x - centerX) / centerX) * 10;  // Tilt Left/Right

        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    // Reset when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
    });
});



/* =========================================
   HACKER TERMINAL LOGIC
   ========================================= */
const terminalModal = document.getElementById('terminal-modal');
const terminalTrigger = document.getElementById('terminal-trigger');
const terminalInput = document.getElementById('terminal-input');
const historyDiv = document.getElementById('history');
const terminalBody = document.getElementById('terminal-body');

// 1. Open Terminal
if (terminalTrigger) {
    terminalTrigger.addEventListener('click', () => {
        terminalModal.classList.add('open');
        terminalInput.focus();
    });
}

// 2. Close Terminal Function
function closeTerminal() {
    terminalModal.classList.remove('open');
}

// Close on clicking outside
window.addEventListener('click', (e) => {
    if (e.target === terminalModal) closeTerminal();
});

// 3. Command Logic
if (terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            
            // Add input to history
            const inputLine = `<div class="input-line"><span class="prompt">sujal@admin:~$</span> <span>${this.value}</span></div>`;
            historyDiv.innerHTML += inputLine;
            
            // Process Command
            let output = '';
            
            switch(command) {
                case 'help':
                    output = `
                        <div style="color: #ccc; margin: 10px 0;">
                            Available Commands:<br>
                            <span style="color: #bc13fe">about</span>    - Who is Sujal?<br>
                            <span style="color: #bc13fe">projects</span> - List deployed modules<br>
                            <span style="color: #bc13fe">skills</span>   - System capabilities<br>
                            <span style="color: #bc13fe">contact</span>  - Initialize communication<br>
                            <span style="color: #bc13fe">rickroll</span> - Do not run this...<br>
                            <span style="color: #bc13fe">clear</span>    - Clear terminal<br>
                        </div>`;
                    break;
                    
                case 'about':
                    output = `AI Engineer & Web Developer. Currently studying at C.K. Pithawalla College. CGPA: 8.2.`;
                    break;
                    
                case 'whoami':
                    output = `root_user_sujal`;
                    break;

                case 'projects':
                    output = `
                        1. SujalNotes Platform (Secure PDF Streaming)<br>
                        2. AI CCTV Surveillance (YOLOv8)<br>
                        3. CKPCET Chatbot (NLP/Flask)<br>
                        <a href="#projects" style="color: #00f3ff">View GUI Version</a>`;
                    break;
                    
                case 'skills':
                    output = `Python, Flask, React, YOLOv8, OpenCV, SQL, MongoDB...`;
                    break;

                case 'rickroll':
                    output = `⚠️ SYSTEM CRITICAL: EXECUTING PRANK SEQUENCE...`;
                    // Trigger the existing music button click
                    document.getElementById('music-toggle').click();
                    closeTerminal(); // Hide terminal so they see the banner
                    break;
                    
                case 'contact':
                    output = `Opening mail client...`;
                    setTimeout(() => {
                        window.location.href = "mailto:vachhanisujal4@gmail.com";
                    }, 1000);
                    break;
                    
                case 'clear':
                    historyDiv.innerHTML = '';
                    this.value = '';
                    return; // Exit function so we don't print empty output
                    
                default:
                    output = `<span style="color: #ff5f56">Command not found: ${command}. Type 'help' for list.</span>`;
            }
            
            // Append Output
            if (output) {
                historyDiv.innerHTML += `<div style="margin-bottom: 10px;">${output}</div>`;
            }
            
            // Clear Input & Scroll to bottom
            this.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}