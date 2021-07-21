import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const recordBtn = document.getElementById("recordBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

    await ffmpeg.run(
        "-i",
        "recording.webm",
        "-ss",
        "00:00:01",
        "-frames:v",
        "1",
        "thumbnail.jpg"
    );
    console.log(videoFile);

    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumA = document.createElement("a");
    thumA.href = thumbUrl;
    thumA.download = "thumbnail.jpg";
    document.body.appendChild(thumA);
    thumA.click();
}

const handleStopRecord = () => {
    recordBtn.innerText = "Download Record";
    recordBtn.removeEventListener("click", handleStopRecord);
    recordBtn.addEventListener("click", handleDownload);
    recorder.stop();
}
const handleStartRecord = () => {
    recordBtn.innerText = "Stop Record";
    recordBtn.removeEventListener("click", handleStartRecord);
    recordBtn.addEventListener("click", handleStopRecord);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        videoFile = URL.createObjectURL(e.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
}

const init = async () => {
    const constraints = { audio: true, video: false };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.play();
}
init();

recordBtn.addEventListener("click", handleStartRecord);