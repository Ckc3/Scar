
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    const audioElement = document.getElementById('backgroundAudio');
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.querySelector('.theme-toggle');
    const profileImage = document.getElementById('profileImage');

    const bioTexts = [
        "Scarlett.",
        "Lord has lift me up.",
        "Main account: ckc8.",
        "Dis banned.",
        "you don't act like this when i die"
    ];
    
    let currentTextIndex = 0;
    let isTyping = false;
    let currentIndex = 0;
    let audioStarted = false;


    function typeWriter() {
        if (isTyping) return;
        
        isTyping = true;
        typewriterElement.textContent = '';
        currentIndex = 0;
        
        const currentText = bioTexts[currentTextIndex];
        
        function type() {
            if (currentIndex < currentText.length) {
                typewriterElement.textContent += currentText.charAt(currentIndex);
                currentIndex++;
                setTimeout(type, 80);
            } else {
                isTyping = false;
                setTimeout(() => {
                    currentTextIndex = (currentTextIndex + 1) % bioTexts.length;
                    setTimeout(typeWriter, 500);
                }, 3000);
            }
        }
        
        type();
    }


    setTimeout(typeWriter, 1500);


    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });


    themeToggle.addEventListener('click', function() {
        const icon = themeToggle.querySelector('i');
        
        if (icon.classList.contains('fa-moon')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');

        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');

        }
    });


    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {

            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });


    profileImage.addEventListener('click', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    });


    document.addEventListener('click', function() {
        if (!audioStarted) {
            audioElement.play().catch(e => {
                console.log('Audio play failed:', e);
            });
            audioStarted = true;
        }
    });

    audioElement.addEventListener('pause', function() {
        if (audioStarted) {
            audioElement.play().catch(e => {
                console.log('Audio restart failed:', e);
            });
        }
    });


    setTimeout(() => {
        audioElement.play().then(() => {
            audioStarted = true;
        }).catch(e => {
            console.log('Auto-play prevented - click anywhere to start audio');
        });
    }, 2000);


    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });


    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.floating-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });


    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});


const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
