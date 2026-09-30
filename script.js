


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
const catWindow = document.getElementById("cat-window");
const catWindowTitlebar = document.getElementById("cat-window-titlebar");
const catWindowClose = document.getElementById("cat-window-close");
const catWindowResize = document.getElementById("cat-window-resize");
const notepadIcon = document.getElementById("notepad-icon");
const mailIcon = document.getElementById("mail-icon");

let currentDialogue = 0;
let typingInterval;
let waitTimeout;
const clickSound = new Audio("playlist/click.mp3");

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
    playClickSound();
    clearInterval(typingInterval);
    clearTimeout(waitTimeout);

    currentDialogue++;

    if (currentDialogue >= dialogues.length) {
        currentDialogue = 0;
    }

    typeDialogue();

    // Open cat window
    catWindow.style.display = "block";
});

let isDraggingCatWindow = false;
let catWindowDragOffsetX = 0;
let catWindowDragOffsetY = 0;

catWindowTitlebar.addEventListener("pointerdown", (event) => {
    if (event.target === catWindowClose) {
        return;
    }

    const sceneRect = scene.getBoundingClientRect();
    const windowRect = catWindow.getBoundingClientRect();
    catWindow.style.left = `${windowRect.left - sceneRect.left}px`;
    catWindow.style.top = `${windowRect.top - sceneRect.top}px`;
    catWindow.style.right = "auto";
    catWindow.style.bottom = "auto";

    isDraggingCatWindow = true;
    catWindowDragOffsetX = event.clientX - windowRect.left;
    catWindowDragOffsetY = event.clientY - windowRect.top;
    catWindowTitlebar.setPointerCapture(event.pointerId);
});

catWindowTitlebar.addEventListener("pointermove", (event) => {
    if (!isDraggingCatWindow) {
        return;
    }

    const sceneRect = scene.getBoundingClientRect();
    const left = Math.min(
        Math.max(0, event.clientX - sceneRect.left - catWindowDragOffsetX),
        sceneRect.width - catWindow.offsetWidth
    );
    const top = Math.min(
        Math.max(0, event.clientY - sceneRect.top - catWindowDragOffsetY),
        sceneRect.height - catWindow.offsetHeight
    );

    catWindow.style.left = `${left}px`;
    catWindow.style.top = `${top}px`;
});

catWindowTitlebar.addEventListener("pointerup", () => {
    isDraggingCatWindow = false;
});

catWindowTitlebar.addEventListener("pointercancel", () => {
    isDraggingCatWindow = false;
});

function enableWindowResize(windowElement, resizeHandle, minimumWidth, minimumHeight) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    resizeHandle.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        event.stopPropagation();

        isResizing = true;
        startX = event.clientX;
        startY = event.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;
        resizeHandle.setPointerCapture(event.pointerId);
    });

    resizeHandle.addEventListener("pointermove", (event) => {
        if (!isResizing) {
            return;
        }

        const sceneRect = scene.getBoundingClientRect();
        const windowRect = windowElement.getBoundingClientRect();
        const maxWidth = Math.max(minimumWidth, sceneRect.right - windowRect.left);
        const maxHeight = Math.max(minimumHeight, sceneRect.bottom - windowRect.top);
        const width = Math.min(
            Math.max(minimumWidth, startWidth + event.clientX - startX),
            maxWidth
        );
        const height = Math.min(
            Math.max(minimumHeight, startHeight + event.clientY - startY),
            maxHeight
        );

        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
    });

    const stopResizing = () => {
        isResizing = false;
    };
    resizeHandle.addEventListener("pointerup", stopResizing);
    resizeHandle.addEventListener("pointercancel", stopResizing);
}

enableWindowResize(catWindow, catWindowResize, 180, 120);

catWindowClose.addEventListener("click", () => {
    playClickSound();
    catWindow.style.display = "none";
});

function makeDesktopWindow(title, className, contentClassName, resizable = true) {
    const appWindow = document.createElement("section");
    appWindow.className = `desktop-app-window ${className}`;
    appWindow.setAttribute("aria-label", title);

    const titlebar = document.createElement("div");
    titlebar.className = "desktop-window-titlebar";

    const titleText = document.createElement("span");
    titleText.textContent = title;

    const closeButton = document.createElement("button");
    closeButton.className = "desktop-window-close";
    closeButton.type = "button";
    closeButton.textContent = "X";
    closeButton.setAttribute("aria-label", `Close ${title}`);
    titlebar.append(titleText, closeButton);

    const content = document.createElement("div");
    content.className = `desktop-window-content ${contentClassName}`;
    appWindow.append(titlebar, content);
    if (resizable) {
        const resizeHandle = document.createElement("button");
        resizeHandle.className = "window-resize-handle";
        resizeHandle.type = "button";
        resizeHandle.setAttribute("aria-label", `Resize ${title}`);
        appWindow.append(resizeHandle);
        enableWindowResize(appWindow, resizeHandle, 180, 140);
    }
    scene.append(appWindow);

    closeButton.addEventListener("click", () => {
        playClickSound();
        appWindow.style.display = "none";
    });

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titlebar.addEventListener("pointerdown", (event) => {
        if (event.target === closeButton) {
            return;
        }

        const sceneRect = scene.getBoundingClientRect();
        const windowRect = appWindow.getBoundingClientRect();
        appWindow.style.left = `${windowRect.left - sceneRect.left}px`;
        appWindow.style.top = `${windowRect.top - sceneRect.top}px`;
        appWindow.style.right = "auto";
        appWindow.style.bottom = "auto";

        isDragging = true;
        dragOffsetX = event.clientX - windowRect.left;
        dragOffsetY = event.clientY - windowRect.top;
        titlebar.setPointerCapture(event.pointerId);
    });

    titlebar.addEventListener("pointermove", (event) => {
        if (!isDragging) {
            return;
        }

        const sceneRect = scene.getBoundingClientRect();
        const left = Math.min(
            Math.max(0, event.clientX - sceneRect.left - dragOffsetX),
            sceneRect.width - appWindow.offsetWidth
        );
        const top = Math.min(
            Math.max(0, event.clientY - sceneRect.top - dragOffsetY),
            sceneRect.height - appWindow.offsetHeight
        );
        appWindow.style.left = `${left}px`;
        appWindow.style.top = `${top}px`;
    });

    titlebar.addEventListener("pointerup", () => {
        isDragging = false;
    });

    titlebar.addEventListener("pointercancel", () => {
        isDragging = false;
    });

    appWindow.style.display = "block";
    const sceneRect = scene.getBoundingClientRect();
    appWindow.style.left = `${Math.max(0, (sceneRect.width - appWindow.offsetWidth) / 2)}px`;
    appWindow.style.top = `${Math.max(0, (sceneRect.height - appWindow.offsetHeight) / 2)}px`;

    return { appWindow, content };
}

const folderWindows = new Map();
let activeVideo;

document.querySelectorAll(".desktop-icon[data-folder]").forEach((folderIcon) => {
    folderIcon.addEventListener("click", () => {
        playClickSound();
        const folderName = folderIcon.dataset.folder;

        if (folderName === "i want to") {
            music.pause();
            document.getElementById("play-pause").textContent = "▶";
            activeVideo?.pause();

            const videoWindow = makeDesktopWindow(
                folderName,
                "folder-app-window video-app-window",
                "video-window-content",
                false
            );
            const video = document.createElement("video");
            activeVideo = video;
            video.className = "video-source";
            video.volume = 0.2;
            video.src = "assets/i%20want%20to%20be%20your%20favorite%20boy.mp4";
            video.autoplay = true;
            video.playsInline = true;
            const pixelCanvas = document.createElement("canvas");
            pixelCanvas.className = "video-pixel-canvas";
            pixelCanvas.setAttribute("aria-label", "Playing video");
            const canvasContext = pixelCanvas.getContext("2d");
            videoWindow.content.append(video, pixelCanvas);

            video.addEventListener("loadedmetadata", () => {
                pixelCanvas.width = Math.max(1, Math.round(video.videoWidth / 3.5));
                pixelCanvas.height = Math.max(1, Math.round(video.videoHeight / 3.5));
                canvasContext.imageSmoothingEnabled = false;
            });

            let animationFrame;
            const drawPixelatedFrame = () => {
                if (video.paused || video.ended) {
                    return;
                }

                if (video.videoWidth && video.videoHeight) {
                    const cropX = Math.round(video.videoWidth * 0.1);

                    canvasContext.drawImage(
                        video,
                        cropX,
                        0,
                        video.videoWidth - cropX * 2,
                        video.videoHeight,
                        0,
                        0,
                        pixelCanvas.width,
                        pixelCanvas.height
                    );
                }

                animationFrame = requestAnimationFrame(drawPixelatedFrame);
            };
            video.addEventListener("play", drawPixelatedFrame);
            videoWindow.appWindow.querySelector(".desktop-window-close").addEventListener("click", () => {
                video.pause();
                cancelAnimationFrame(animationFrame);
                if (activeVideo === video) {
                    activeVideo = null;
                }
            });
            video.play().catch(() => { });
            return;
        }

        let folderWindow = folderWindows.get(folderName);

        if (!folderWindow) {
            if (folderName === "readMe.txt") {
                folderWindow = makeDesktopWindow(
                    folderName,
                    "folder-app-window readme-app-window",
                    "readme-window-content"
                );

                const readmeContent = document.createElement("div");

                readmeContent.className = "readme-textarea";

                readmeContent.textContent = `Hello my name is Long 

This website is literally a simple webpage for fun and to help me understand how html/css/js work.

I intent on to improve this more and more but for now it has a draw pad and a music player that it !`;
                folderWindow.content.append(readmeContent);
            }
            folderWindows.set(folderName, folderWindow);
        } else {
            folderWindow.appWindow.style.display = "block";
        }
    });
});

let notepadWindow;
let notepadCanvas;

notepadIcon.addEventListener("click", () => {
    playClickSound();
    if (!notepadWindow) {
        notepadWindow = makeDesktopWindow("Draw", "notepad-app-window", "notepad-content");

        const toolbar = document.createElement("div");
        toolbar.className = "notepad-toolbar";
        const clearButton = document.createElement("button");
        clearButton.className = "notepad-clear";
        clearButton.type = "button";
        clearButton.textContent = "Clear";

        notepadCanvas = document.createElement("canvas");
        notepadCanvas.className = "notepad-canvas";
        notepadCanvas.width = 900;
        notepadCanvas.height = 560;
        notepadCanvas.setAttribute("aria-label", "Blank drawing canvas");

        toolbar.append(clearButton);
        notepadWindow.content.append(toolbar, notepadCanvas);

        const drawingContext = notepadCanvas.getContext("2d");
        drawingContext.strokeStyle = "#222";
        drawingContext.lineWidth = 6;
        drawingContext.lineCap = "round";
        let isDrawing = false;

        notepadCanvas.addEventListener("pointerdown", (event) => {
            const canvasRect = notepadCanvas.getBoundingClientRect();
            const scaleX = notepadCanvas.width / canvasRect.width;
            const scaleY = notepadCanvas.height / canvasRect.height;
            drawingContext.beginPath();
            drawingContext.moveTo(
                (event.clientX - canvasRect.left) * scaleX,
                (event.clientY - canvasRect.top) * scaleY
            );
            isDrawing = true;
            notepadCanvas.setPointerCapture(event.pointerId);
        });

        notepadCanvas.addEventListener("pointermove", (event) => {
            if (!isDrawing) {
                return;
            }

            const canvasRect = notepadCanvas.getBoundingClientRect();
            drawingContext.lineTo(
                (event.clientX - canvasRect.left) * (notepadCanvas.width / canvasRect.width),
                (event.clientY - canvasRect.top) * (notepadCanvas.height / canvasRect.height)
            );
            drawingContext.stroke();
        });

        const stopDrawing = () => {
            isDrawing = false;
        };
        notepadCanvas.addEventListener("pointerup", stopDrawing);
        notepadCanvas.addEventListener("pointercancel", stopDrawing);

        clearButton.addEventListener("click", () => {
            drawingContext.clearRect(0, 0, notepadCanvas.width, notepadCanvas.height);
        });
    } else {
        notepadWindow.appWindow.style.display = "block";
    }
});

let mailWindow;

// MAILLLLLLLLLLLLLLLLLLLLLLLL
mailIcon.addEventListener("click", () => {
    playClickSound();

    if (!mailWindow) {
        mailWindow = makeDesktopWindow("Sent me a message!", "mail-app-window", "mail-content");

        const form = document.createElement("form");
        form.className = "mail-form";

        const messageField = document.createElement("label");
        messageField.className = "mail-field mail-message-field";
        messageField.textContent = "Message";

        const messageInput = document.createElement("textarea");
        messageInput.name = "message";
        messageInput.required = true;
        messageInput.rows = 5;
        messageField.append(messageInput);

        const formFooter = document.createElement("div");
        formFooter.className = "mail-form-footer";

        const status = document.createElement("p");
        status.className = "mail-status";
        status.setAttribute("role", "status");

        const sendButton = document.createElement("button");
        sendButton.className = "mail-send-button";
        sendButton.type = "submit";
        sendButton.textContent = "Send message";

        formFooter.append(status, sendButton);
        form.append(messageField, formFooter);
        mailWindow.content.append(form);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const message = messageInput.value.trim();

            if (!message) {
                status.textContent = "Message cannot be empty.";
                return;
            }

            sendButton.disabled = true;
            status.textContent = "Sending...";

            try {
                const response = await fetch("http://localhost:3000/api/mail", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to send message.");
                }

                status.textContent = result.message || "Message sent.";
                messageInput.value = "";

            } catch (error) {
                status.textContent = "An error occurred while sending the message.";
            } finally {
                sendButton.disabled = false;
                status.textContent = status.textContent || "Message sent.";
            }
        });
    } else {
        mailWindow.appWindow.style.display = "block";
    }
});

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => { });
}

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

    volumeSlider.value = 0.05;
    music.volume = 0.05;

    playRandomSong();
    startDialogue();
});

// Previous song
document.getElementById("prev-song").addEventListener("click", () => {
    playClickSound();
    currentSong--;

    if (currentSong < 0) {
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    music.play();
});

// Next song 
document.getElementById("next-song").addEventListener("click", () => {
    playClickSound();
    currentSong++;
    if (currentSong >= songs.length) {
        currentSong = 0;
    }
    loadSong(currentSong);
    music.play();
});

//pause song
document.getElementById("play-pause").addEventListener("click", () => {
    playClickSound();
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
const musicContainer = document.querySelector(".music-container");
const musicTitle = document.querySelector(".music-title");
enableWindowResize(player, document.getElementById("music-player-resize"), 180, 140);
enableWindowResize(volumePlayer, document.getElementById("volume-player-resize"), 60, 100);

let isDraggingMusicWindow = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

musicTitle.addEventListener("pointerdown", (event) => {
    isDraggingMusicWindow = true;
    const containerRect = musicContainer.getBoundingClientRect();

    dragOffsetX = event.clientX - containerRect.left;
    dragOffsetY = event.clientY - containerRect.top;
    musicTitle.setPointerCapture(event.pointerId);
});

musicTitle.addEventListener("pointermove", (event) => {
    if (!isDraggingMusicWindow) {
        return;
    }

    const sceneRect = scene.getBoundingClientRect();
    const containerWidth = musicContainer.offsetWidth;
    const containerHeight = musicContainer.offsetHeight;
    const left = Math.min(
        Math.max(0, event.clientX - sceneRect.left - dragOffsetX),
        sceneRect.width - containerWidth
    );
    const top = Math.min(
        Math.max(0, event.clientY - sceneRect.top - dragOffsetY),
        sceneRect.height - containerHeight
    );

    musicContainer.style.left = `${left}px`;
    musicContainer.style.top = `${top}px`;
    musicContainer.style.right = "auto";
    musicContainer.style.bottom = "auto";
});

musicTitle.addEventListener("pointerup", () => {
    isDraggingMusicWindow = false;
});

musicTitle.addEventListener("pointercancel", () => {
    isDraggingMusicWindow = false;
});

boombox.addEventListener("click", () => {
    playClickSound();

    if (player.style.display === "block") {
        // Close music container
        player.style.display = "none";
        volumePlayer.style.display = "none";

        // Show arrow again
        boombox.classList.remove("cue-dismissed");

    } else {
        // Open music container
        player.style.display = "block";
        volumePlayer.style.display = "flex";

        // Hide arrow
        boombox.classList.add("cue-dismissed");

        player.classList.remove("popup");
        volumePlayer.classList.remove("popup");

        void player.offsetWidth;

        player.classList.add("popup");
        volumePlayer.classList.add("popup");
    }
});