
const API_URL = 'https://api.lanyard.rest/v1/users/1383899725866205316';

const badgeMap = {
    1: 'Staff',
    2: 'Partner', 
    4: 'Hypesquad',
    8: 'Bug Hunter',
    64: 'Bravery',
    128: 'Brilliance',
    256: 'Balance', 
    512: 'Early Supporter',
    16384: 'Bug Hunter Gold',
    131072: 'Verified Developer',
    262144: 'Early Verified Developer',
    4194304: 'Certified Moderator',
    4398046511104: 'Active Developer'
};

let isLoading = false;

async function fetchDiscordData() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success && data.data) {
            updateProfile(data.data);
        } else {
            showError('Failed to load profile data');
        }
    } catch (error) {
        console.error('Error fetching Discord data:', error);
        showError('Connection error');
    } finally {
        isLoading = false;
    }
}

function updateProfile(userData) {
    const { discord_user, discord_status, activities, listening_to_spotify, spotify } = userData;
    

    if (discord_user.avatar) {
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=256`;
        document.getElementById('avatar').src = avatarUrl;
    }
    

    const usernameText = discord_user.discriminator === '0' 
        ? `@${discord_user.username}` 
        : `${discord_user.username}#${discord_user.discriminator}`;
    document.getElementById('username').textContent = usernameText;
    

    updateStatus(discord_status);
    

    updateCustomStatus(activities);
    

    updateBadges(discord_user.public_flags, discord_user.primary_guild);
    

    updateSpotify(listening_to_spotify, spotify);
}

function updateStatus(status) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    

    statusDot.className = 'status-indicator';
    statusDot.classList.add(status || 'offline');
    
    const statusMessages = {
        'online': 'Online',
        'idle': 'Away',
        'dnd': 'Do Not Disturb',
        'offline': 'Offline'
    };
    
    statusText.textContent = statusMessages[status] || 'Unknown';
}

function updateCustomStatus(activities) {
    const customStatusElement = document.getElementById('custom-status');
    const customStatusCard = document.getElementById('custom-status-card');
    
    if (activities && activities.length > 0) {
        const customActivity = activities.find(activity => activity.type === 4);
        
        if (customActivity && customActivity.state) {
            customStatusElement.textContent = customActivity.state;
            customStatusCard.style.display = 'block';
            return;
        }
    }
    
    customStatusElement.textContent = 'No custom status';
    customStatusCard.style.display = 'block';
}

function updateBadges(publicFlags, primaryGuild) {
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';
    
    let badgeCount = 0;
    

    if (primaryGuild && primaryGuild.tag) {
        const guildBadge = createBadge(primaryGuild.tag, 'guild');
        badgesContainer.appendChild(guildBadge);
        badgeCount++;
    }
    

    if (publicFlags && publicFlags > 0) {
        Object.entries(badgeMap).forEach(([flagValue, badgeName]) => {
            if (publicFlags & parseInt(flagValue)) {
                const badge = createBadge(badgeName);
                badgesContainer.appendChild(badge);
                badgeCount++;
            }
        });
    }
    

    if (badgeCount === 0) {
        const defaultBadge = createBadge('Discord User');
        badgesContainer.appendChild(defaultBadge);
    }
}

function createBadge(text, type = '') {
    const badge = document.createElement('div');
    badge.className = `badge ${type}`;
    badge.textContent = text;
    return badge;
}

function updateSpotify(isListening, spotifyData) {
    const spotifyCard = document.getElementById('spotify-card');
    
    if (isListening && spotifyData) {
        spotifyCard.classList.remove('hidden');
        

        const albumArt = document.getElementById('album-art');
        if (spotifyData.album_art_url) {
            albumArt.src = spotifyData.album_art_url;
            albumArt.alt = `${spotifyData.album} by ${spotifyData.artist}`;
        }
        

        document.getElementById('track-name').textContent = spotifyData.song || 'Unknown Track';
        document.getElementById('artist-name').textContent = spotifyData.artist || 'Unknown Artist';
        
    } else {
        spotifyCard.classList.add('hidden');
    }
}

function showError(message) {
    console.error('Profile Error:', message);
    document.getElementById('status-text').textContent = message;
}


function setLoadingState(isLoading) {
    const elements = ['username', 'status-text', 'custom-status'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (isLoading) {
                element.classList.add('loading');
                element.textContent = 'Loading...';
            } else {
                element.classList.remove('loading');
            }
        }
    });
}


let audio = null;
let hasPlayedAudio = false;

function initAudio() {
    if (!audio) {
        audio = new Audio('song.mp3');
        audio.loop = true;
        audio.volume = 0.5;
    }
}

function playAudio() {
    if (!hasPlayedAudio) {
        initAudio();
        audio.play().catch(error => {
            console.log('Audio play failed:', error);
        });
        hasPlayedAudio = true;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    setLoadingState(true);
    fetchDiscordData();
    

    setInterval(fetchDiscordData, 30000);
    

    document.addEventListener('click', playAudio, { once: true });
});


document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        fetchDiscordData();
    }
});
