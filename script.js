
document.addEventListener('DOMContentLoaded', function() {
    const bioLines = [
        "Hello im scarlett",
        "Site dev", 
        "Owner of multi.net"
    ];
    
    const bioContainer = document.querySelector('.bio-container');
    let currentLineElement = document.getElementById('bio-line-1');
    
    
    const clickAudio = new Audio('song.mp3');
    clickAudio.loop = true;
    let audioPlaying = false;
    

    document.addEventListener('click', function() {
        if (!audioPlaying) {
            clickAudio.play().catch(error => {
                console.log('Audio play failed:', error);
            });
            audioPlaying = true;
        }
    });
    
    function typeWriter(element, text, speed = 80) {
        return new Promise((resolve) => {
            let i = 0;
            element.textContent = '';
            element.classList.add('active');
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.add('typing-complete');
                    setTimeout(resolve, 1500); 
                    
                }
            }
            
            type();
        });
    }
    
    function deleteText(element, speed = 50) {
        return new Promise((resolve) => {
            element.classList.remove('typing-complete');
            let text = element.textContent;
            let i = text.length;
            
            function deleteChar() {
                if (i > 0) {
                    element.textContent = text.substring(0, i - 1);
                    i--;
                    setTimeout(deleteChar, speed);
                } else {
                    element.classList.remove('active');
                    setTimeout(resolve, 300);
                }
            }
            
            deleteChar();
        });
    }
    
    async function startTypewriter() {

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let lineIndex = 0;
        
        while (true) {
            await typeWriter(currentLineElement, bioLines[lineIndex], 80);
            await deleteText(currentLineElement, 50);
            
            lineIndex = (lineIndex + 1) % bioLines.length;
            

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    startTypewriter();
    

    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
