import fetch from "node-fetch";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const fullScreenIcon = fullScreen.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsMovementTimeout = null;
let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const playBtnIconChange = () => {
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handlePlayBtn = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIconChange();
}

const handleMuteBtn = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handleVolumeChange = (e) => {
    const { target: { value } } = e;
    volumeValue = value;
    video.volume = value;


}

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}

const handleLoadedMetadata = (e) => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimeline = (e) => {
    const { target: { value } } = e;
    video.currentTime = value;
}

const handleFullScreen = (e) => {
    const fullscreenMode = document.fullscreenElement;
    if (fullscreenMode) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
}

const hideShowing = () => {
    videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideShowing, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideShowing, 3000);
}

const handleSpacebar = (e) => {
    const key = e.code;
    if (key === "Space" && video.paused) {
        video.play();
    } else if (!video.paused && key === "Space") {
        video.pause();
    }
    playBtnIconChange();;
}
const handleVideoClick = () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIconChange();
}

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "post"
    });
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handleVideoClick);
video.addEventListener("ended", handleEnded);
fullScreen.addEventListener("click", handleFullScreen);
timeline.addEventListener("input", handleTimeline);
document.addEventListener("keyup", handleSpacebar);
