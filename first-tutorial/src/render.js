const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');

const {
  desktopCapturer,
  remote
} = require('electron');
const {
  Menu,
  dialog
} = remote //allows us to build native menus directly in our front-end code

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  })

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      }
    })
  )

  videoOptionsMenu.popup()
}

let mediaRecorder; //instance to capture footage
const recordedChunks = []

//change the video source window to record
async function selectSource(source) {
  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      }
    }
  }

  //Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  //Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play()

  //Create the media recorder
  const options = {
    mimeType: 'video/webm; codecs=vp9'
  };
  mediaRecorder = new MediaRecorder(stream, options);

  //register event handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop
}

function handleDataAvailable(e) {
  console.log('video data available')
  recordedChunks.push(e.data)
}

const {
  writeFile
} = require('fs');

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    /* type: 'video/webm; codecs= vp9', */
    type: 'video/mp4; codecs= H.264 '
  })

  const buffer = Buffer.from(await blob.arrayBuffer());

  const {
    filePath
  } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  })

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully'))
  }
}

videoSelectBtn.addEventListener('click', () => {
  getVideoSources();
})


startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.innerText = 'Recording';
};


stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.innerText = 'Start';
};
