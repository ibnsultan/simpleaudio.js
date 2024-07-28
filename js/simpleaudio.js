class CustomAudioPlayer {
    constructor(audioElement, playerManager) {
        this.audio = audioElement;
        this.playerManager = playerManager;
        this.createPlayer();
        this.attachEvents();
    }

    createPlayer() {
        // Create the player container
        this.playerContainer = document.createElement('div');
        this.playerContainer.classList.add('audio-player');

        // Create the progress circle
        this.progressCircle = document.createElement('div');
        this.progressCircle.classList.add('progress-circle');

        // Create the play/pause button
        this.playPauseBtn = document.createElement('button');
        this.playPauseBtn.classList.add('play');
        this.progressCircle.appendChild(this.playPauseBtn);

        // Append progress circle to the player container
        this.playerContainer.appendChild(this.progressCircle);

        // Hide the original audio element
        this.audio.style.display = 'none';

        // Insert the player container before the original audio element
        this.audio.parentNode.insertBefore(this.playerContainer, this.audio);
    }

    attachEvents() {
        this.playPauseBtn.addEventListener('click', () => {
            if (this.audio.paused) {
                this.playerManager.pauseAll();
                this.audio.play();
                this.playPauseBtn.classList.remove('play');
                this.playPauseBtn.classList.add('pause');
                this.playerManager.setCurrentPlayer(this);
            } else {
                this.audio.pause();
                this.playPauseBtn.classList.remove('pause');
                this.playPauseBtn.classList.add('play');
                this.playerManager.setCurrentPlayer(null);
            }
        });

        this.audio.addEventListener('timeupdate', () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressCircle.style.background = `conic-gradient(#007bff ${progress}%, #ccc ${progress}%)`;
        });

        this.audio.addEventListener('ended', () => {
            this.playPauseBtn.classList.remove('pause');
            this.playPauseBtn.classList.add('play');
            this.playerManager.setCurrentPlayer(null);
        });
    }

    pause() {
        this.audio.pause();
        this.playPauseBtn.classList.remove('pause');
        this.playPauseBtn.classList.add('play');
    }

    static initialize() {
        const playerManager = new PlayerManager();
        document.querySelectorAll('audio').forEach(audioElement => {
            new CustomAudioPlayer(audioElement, playerManager);
        });
    }
}

class PlayerManager {
    constructor() {
        this.currentPlayer = null;
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player;
    }

    pauseAll() {
        if (this.currentPlayer) {
            this.currentPlayer.pause();
            this.currentPlayer = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    CustomAudioPlayer.initialize();
});

function applyAudioPlayerStyles() {
    const styles = `
    .audio-player {
        position: relative;
        display: inline-block;
    }

    .progress-circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: conic-gradient(#007bff 0%, #ccc 0%);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        transition: border-color 0.3s;
    }

    button.play, button.pause {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background-color: #007bff;
        color: #fff;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        outline: none;
    }

    button.play::before {
        content: '►';
    }

    button.pause::before {
        content: '❚❚';
    }

    audio {
        display: none;
    }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

applyAudioPlayerStyles();