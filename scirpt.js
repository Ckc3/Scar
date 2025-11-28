
const DISCORD_USER_ID = '1383899725866205316';
const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

class BioSite {
    constructor() {
        this.snowTrail = [];
        this.maxSnowflakes = 20;
        this.bioTexts = [
            'Owner of 2004',
            'c#, PY, JS, WEB DEV',
            'Only me'
        ];
        this.currentBioIndex = 0;
        this.isTyping = false;
        this.isDeleting = false;
        this.init();
    }
    
    init() {

        const video = document.getElementById('bgVideo');
        if (video) {
            video.volume = 0.5; 
            video.muted = false; 
            
            const playVideo = () => {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            };
            

            playVideo();
            

            document.addEventListener('click', () => {
                playVideo();
            }, { once: true });
            
            document.addEventListener('touchstart', () => {
                playVideo();
            }, { once: true });
        }
        

        this.initSnowTrail();
        

        this.initTypewriter();
        

        this.fetchSpotifyData();
        setInterval(() => this.fetchSpotifyData(), 10000); 
        
       
        const profileImage = document.querySelector('.profile-image');
        if (profileImage) {
            profileImage.addEventListener('click', () => {
                profileImage.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    profileImage.style.transform = 'scale(1)';
                }, 150);
            });
        }
    }
    
    initSnowTrail() {
        const trailContainer = document.getElementById('snowTrail');
        let lastX = 0;
        let lastY = 0;
        
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            

            if (Math.abs(x - lastX) > 5 || Math.abs(y - lastY) > 5) {
                this.createSnowflake(x, y, trailContainer);
                lastX = x;
                lastY = y;
            }
        });
    }
    
    createSnowflake(x, y, container) {

        const snowflakes = container.querySelectorAll('.snowflake');
        if (snowflakes.length > this.maxSnowflakes) {
            snowflakes[0].remove();
        }
        
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = x + 'px';
        snowflake.style.top = y + 'px';
        

        const size = Math.random() * 3 + 2;
        snowflake.style.width = size + 'px';
        snowflake.style.height = size + 'px';
        

        const duration = Math.random() * 1 + 1.5;
        snowflake.style.animationDuration = duration + 's';
        
        container.appendChild(snowflake);
        

        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, duration * 1000);
    }
    
    initTypewriter() {
        const bioTextElement = document.getElementById('bioText');
        if (!bioTextElement) return;
        
        let currentText = '';
        let charIndex = 0;
        
        const type = () => {
            if (this.isDeleting) {

                currentText = this.bioTexts[this.currentBioIndex].substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    this.isDeleting = false;
                    this.currentBioIndex = (this.currentBioIndex + 1) % this.bioTexts.length;
                    setTimeout(type, 500);
                    return;
                }
            } else {

                currentText = this.bioTexts[this.currentBioIndex].substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === this.bioTexts[this.currentBioIndex].length) {

                    setTimeout(() => {
                        this.isDeleting = true;
                        type();
                    }, 2000);
                    return;
                }
            }
            
            bioTextElement.textContent = currentText;
            setTimeout(type, this.isDeleting ? 50 : 100);
        };
        
        type();
    }
    
    async fetchSpotifyData() {
        try {
            const response = await fetch(LANYARD_API);
            const data = await response.json();
            
            if (data.success && data.data.spotify) {
                const spotify = data.data.spotify;
                const widget = document.getElementById('spotifyWidget');
                const cover = document.getElementById('spotifyCover');
                const song = document.getElementById('spotifySong');
                const artist = document.getElementById('spotifyArtist');
                const album = document.getElementById('spotifyAlbum');
                
                if (widget && cover && song && artist && album) {
                    cover.src = spotify.album_art_url;
                    song.textContent = spotify.song;
                    artist.textContent = spotify.artist;
                    album.textContent = spotify.album;
                    widget.style.display = 'block';
                }
            } else {
                const widget = document.getElementById('spotifyWidget');
                if (widget) {
                    widget.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error fetching Spotify data:', error);
            const widget = document.getElementById('spotifyWidget');
            if (widget) {
                widget.style.display = 'none';
            }
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new BioSite();
});
