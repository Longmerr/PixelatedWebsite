


const dialogues = [
    "Hello friend!!",
    "Look around. There is no fish here. Only me.",
    "Try clicking on me!",
    "Perhaps you will find something interesting here.",
    "I HAVENT SLEPT FOR 24 HOURS!",
    "Give me freedom!!",
    "Live Laugh Love",
    "Viva la vida",
    "Meow fisherman.",
    "I am a cat, not a boat.",
];

const dialogue = document.getElementById("dialogue");
const dialogueText = document.getElementById("dialogue-text");
const character = document.querySelector(".character-hitbox");

let currentDialogue = 0;
let typingInterval;
let waitTimeout;

const typingSpeed = 40;
const waitTime = 5000;

function typeDialogue() {
    clearInterval(typingInterval);
    clearTimeout(waitTimeout);

    const text = dialogues[currentDialogue];
    let currentCharacter = 0;

    dialogue.style.display = "block";
    dialogueText.textContent = "";

    typingInterval = setInterval(() => {
        dialogueText.textContent += text[currentCharacter];
        currentCharacter++;

        if (currentCharacter >= text.length) {
            clearInterval(typingInterval);

            waitTimeout = setTimeout(() => {
                currentDialogue++;

                if (currentDialogue >= dialogues.length) {
                    dialogue.style.display = "none";
                    return;
                }

                typeDialogue();

            }, waitTime);
        }
    }, typingSpeed);
}

function startDialogue() {
    currentDialogue = 0;
    typeDialogue();
}

function randomDialogue() {
    currentDialogue = Math.floor(Math.random() * dialogues.length);
    typeDialogue();
}



// Click character to get new dialogue
character.addEventListener("click", () => {
    clearInterval(typingInterval);
    clearTimeout(waitTimeout);

    currentDialogue++;

    if (currentDialogue >= dialogues.length) {
        currentDialogue = 0;
    }

    typeDialogue();
});

// music
const songs = [
    {
        name: "Stray Nights",
        artist: "Tom Frane",
        file: "playlist/Stray_Nights.mp3"
    },
    {
        name: "Vết Thương",
        artist: "Fishy",
        file: "playlist/Vet_Thuong.mp3"
    },
    {
        name: "Tủm Mủn",
        artist: "Cam",
        file: "playlist/Tun_Mun.mp3"
    }
];



let currentSong = 0;

const music = document.getElementById("bg-music");
const songTitle = document.getElementById("current-song");
const artistName = document.getElementById("artist-name");
const volumeSlider = document.getElementById("volume-slider");

music.volume = 1;

volumeSlider.addEventListener("input", () => {
    music.volume = volumeSlider.value;
});

function loadSong(index) {
    music.src = songs[index].file;

    songTitle.textContent = songs[index].name;
    artistName.textContent = "By " + songs[index].artist;
}


// Start screen
const startScreen = document.getElementById("start-screen");
const scene = document.querySelector(".scene");

function playRandomSong() {
    currentSong = Math.floor(Math.random() * songs.length);

    loadSong(currentSong);
    music.play();
}

startScreen.addEventListener("click", () => {
    scene.classList.add("started");
    startScreen.classList.add("hidden");

    playRandomSong();
    startDialogue();
});

// Previous song
document.getElementById("prev-song").addEventListener("click", () => {
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    music.play();
});

// Next song 
document.getElementById("next-song").addEventListener("click", () => {
    currentSong++;
    if (currentSong >= songs.length) {
        currentSong = 0;
    }
    loadSong(currentSong);
    music.play();
});

//pause song
document.getElementById("play-pause").addEventListener("click", () => {
    if (music.paused) {
        music.play();
        document.getElementById("play-pause").textContent = "| |";
    } else {
        music.pause();
        document.getElementById("play-pause").textContent = "▶";
    }
});

// boombox button
const player = document.getElementById("music-player");
const volumePlayer = document.getElementById("volume-player");
const boombox = document.getElementById("boombox-button");

boombox.addEventListener("click", () => {
    if (player.style.display === "block") {
        player.style.display = "none";
        volumePlayer.style.display = "none";
    } else {
        player.style.display = "block";
        volumePlayer.style.display = "flex";
    }
});