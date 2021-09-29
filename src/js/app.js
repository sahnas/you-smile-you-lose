/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
import * as faceapi from 'face-api.js';

const listOfVideoIds = [
  '5lL5xRKquPQ',
  'pOeig6_aAtE',
  'KE2yiDiaTwA',
  'aE3hKVtwsJ0',
  'QT13kk8HDDo',
  '7w-6rZ28Yzo',
  'RURKjPcGBNg',
  'cY469FbO96A',
  'F-X4SLhorvw',
  'nykf3FU_JiI',
  'FLwhHN_7LPo',
  'RRwqftGrxf4',
  'l1heD4T8Yco',
  'PVRZV3OZRH4',
  'NhBktFVTjf8',
  'oposLSDXVkY',
  'UqiGMsMUiGI',
  '2riqL4GOfR8',
  '9dtQAIoFCwc',
  'RGSv5Of6EBQ',
  'p7LHIiSC9h0',
  'U1SiveWVIIo',
  'sp_WV91jx8E',
  '2F0pklg1CUY',
  '7merzCPl-Xg',
  'iOPxJRrJgmM',
  'e4nc3uO_eCQ',
  'kxC8AxSjmqQ',
  'W5aEBqSkS_Q',
  'W3GrSMYbkBE',
  'GzgavGowD_A',
  'JBd0ERZhCis',
  'okSM8i2EpI0',
  'bioP_2e_xls',
  'LV6YR48fA0E',
  'o-kOE0Uev74',
  'lnGL4cbxd1c',
  'knlJBy1eHyw',
  'IuysY1BekOE',
  'cx-xD_GOmZg',
  'boDSEeGt8hg',
  'yr_Rpk9HR1g',
  'c4hXcr8vHYg',
  'laELhSkm44o',
  '6cmg75bgkkg',
  'cmy-jzcZp8o',
  'svU3s1GUGak',
  'BEkbQvWsCI8',
  'lYb83GT4ELw',
  'ErbLGWhWaKI',
  'yBLdQ1a4-JI',
  'AXrHbrMrun0',
  'ynslyx0G0Vs',
  'm9mth6MXnso',
  'NpqfUI7DDB4',
  'COmXHjhHqR0',
  'gJMiOanr7nY',
  '815RW7f3k2Y',
  'pVQDqLLskqc',
  'ArX1Zx08enE',
  'Ugi2kZeqzRo',
  'KDZ1nYwfC2k',
  'hgSQg3R9GUA',
  'vrKp5KhDLQE'
];

let isFirstRound = true;
let isUsingCamera = false;
let currentSmileStatus = false;
let score = 0;
let videoSkipped = false;
let statusClass = 'win';
let scoreTitle = 'Score';
let pausedVideo = false;
let countNoFace = 0;

document.getElementById('actualshit').addEventListener('click', (event) => {
  return setupFaceDetection(event);
});
document.getElementById('nextVideo').addEventListener('click', (event) => {
  return showNextVideo(event);
});
document.getElementById('skipVideo').addEventListener('click', (event) => {
  return skipVideo(event);
});
document.getElementById('pauseVideo').addEventListener('click', (event) => {
  return pauseVideo(event);
});

// initiate webcam
const webcam = document.getElementById('webcam');
webcam.addEventListener('play', refreshState);

// initiate youtube player and api
let player;
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/**
 * Launch the whole process following thoses steps
 * - Load models from faceapi
 * - Ask user for the video stream and setup the video
 *
 * @async
 * @param {Object} event event of the click
 */
async function setupFaceDetection(event) {
  event.preventDefault();

  document.getElementById('home').remove();
  document.getElementById('smileStatus').style.display = 'block';

  await loadModels();
  await setupWebcam();
}

/**
 * Load models from faceapi.
 * Host need be replaced by your local ip if you running this in local !
 * @async
 */
async function loadModels() {
  const modelsUrl = 'https://smilelose.socialcase.fr/models';

  // Use this for local development
  // this should be the IP of your HTTPS server (example : 192.168.5.40)
  // const host = "localhost"
  // this should the port where your HTTPS server is served (default : 8080)
  // const port = "8080"
  // modelsUrl = `https://${host}:${port}/models`

  await faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrl);
  await faceapi.nets.faceExpressionNet.loadFromUri(modelsUrl);
}

/**
 * Setup the webcam stream for the user.
 * On success, the stream of the webcam is set to the source of the HTML5 tag.
 * On error, the error is logged and the process continue.
 */
async function setupWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      webcam.srcObject = stream;
    })
    .catch(() => {
      document.getElementById('smileStatus').textContent = 'Loading...';
      isUsingCamera = false;
      onPlayerReady();
    });
}

/**
 * Setup the youtube player using the official API
 */
async function setupYoutubePlayer() {
  const savedIdVideo = extractRandomAvailableVideoId();
  // eslint-disable-next-line no-undef
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: savedIdVideo,
    playerVars: {
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
      origin: 'https://smilelose.socialcase.fr',
      autoplay: 1,
      start: 0,
      ...(savedIdVideo[0] === 'aE3hKVtwsJ0' && { end: 36 }),
      ...(savedIdVideo[0] === '6cmg75bgkkg' && { end: 145 }),
      ...(savedIdVideo[0] === 'W3GrSMYbkBE' && { end: 101 }),
    },
    events: { onStateChange: onPlayerStateChange, onReady: onPlayerReady },
  });
}

function onPlayerReady(event) {
  if (isFirstRound) startFirstRound();
  if (event) {
    event.target.playVideo();
    document.addEventListener('keyup', spaceListener);
  }
}

/**
 * Space press listener
 */
let spaceListener = (e) => {
  if (e.code === 'Space') {
    pauseVideo(e);
  }
};

/**
 * Set an refresh interval where the faceapi will scan the face of the subject
 * and return an object of the most likely expressions.
 * Use this detection data to pick an expression and spread background gifs on divs.
 * @async
 */
async function refreshState() {
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(
        webcam,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }),
      )
      .withFaceExpressions();

    if (!detections.length) {
      countNoFace += 1;
      if (countNoFace > 5) {
        writeNoFace();
      }
      if (countNoFace > 20) {
        writeToSomeone();
      }
    } else {
      countNoFace = 0;
    }

    if (detections && detections[0] && detections[0].expressions) {
      if (!isUsingCamera) {
        launchYoutubePlayer();
        isUsingCamera = true;
      }

      if (isSmiling(detections[0].expressions)) {
        currentSmileStatus = true;
        writeSmile();
      } else {
        writeNoSmile();
      }
    }
  }, 400);
}

function writeToSomeone() {
  document.getElementById('smileStatus').textContent = 'Is anybody here?';
}

function writeNoFace() {
  document.getElementById('smileStatus').textContent = "Don't hide your face!";
}

function writeSmile() {
  document.getElementById('smileStatus').textContent = 'YOU SMILE !';
}

function writeNoSmile() {
  document.getElementById('smileStatus').textContent = 'not smiling';
}

/**
 * Entrypoint. This should be use once.
 */
function startFirstRound() {
  isFirstRound = false;
  currentSmileStatus = false;

  document.getElementById('loading').style.display = 'none';
  document.getElementById('intermission').className = 'fadeOut';
  document.getElementById('skipVideo').style.display = 'block';
  document.getElementById('pauseVideo').style.display = 'block';

  onPlayerReady();
}

async function launchYoutubePlayer() {
  await setupYoutubePlayer();
}

/**
 * Stop the video and show the intermission
 * on video end or skipped
 */
function onVideoEnd() {
  player.stopVideo();
  document.removeEventListener('keyup', spaceListener);
  showIntermission();
}

/**
 * We want to show the intermissions when a video is over.
 * Listening to the event onPlayerStateChange of the youtube api.
 */
function onPlayerStateChange(event) {
  // 0 means the video is over
  if (event.data === 0) {
    onVideoEnd();
  }
}

function toogleToPlay() {
  document.getElementById('pauseVideo').textContent = 'Play';
  player.pauseVideo();
}

function toogleToPause() {
  document.getElementById('pauseVideo').textContent = 'Pause';
  player.playVideo();
}

function pauseVideo(event) {
  event.preventDefault();
  pausedVideo = !pausedVideo;
  pausedVideo ? toogleToPlay() : toogleToPause(); // jshint ignore:line
}

/**
 * Change classes and score text to
 * match with win or lose status
 */
function matchUiWithWinStatus() {
  if (currentSmileStatus) {
    statusClass = 'lose';
    scoreTitle = 'Your score was';
  } else {
    statusClass = 'win';
    scoreTitle = 'Score';
  }

  document.getElementById('resultSmileStatus').className = statusClass;
  document.getElementById('score').className = statusClass;
  document.getElementById('scoreTitle').textContent = scoreTitle;
  document.getElementById('scoreResult').textContent = score;
}

/**
 * Showing the screen beetwen videos.
 * Result is defined by various global variable updated by the models.
 */
function showIntermission() {
  let smileStatusText = 'Face detection was not ready.';

  if (isUsingCamera) {
    if (videoSkipped) {
      videoSkipped = false;
      // player will not lose if he skips the video
      currentSmileStatus = false;
      smileStatusText = 'You skipped the video ! It will not count !';
      matchUiWithWinStatus();
    } else if (currentSmileStatus) {
      smileStatusText = 'You SMILED during the video !';
      matchUiWithWinStatus();
      score = 0;
    } else {
      smileStatusText = "You didn't smile during the video !";
      score += 1;
      matchUiWithWinStatus();
    }
  }

  document.getElementById('resultSmileStatus').textContent = smileStatusText;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('skipVideo').style.display = 'none';
  document.getElementById('pauseVideo').style.display = 'none';
  document.getElementById('nextVideo').style.display = 'inline-block';
  document.getElementById('result').style.display = 'block';
  document.getElementById('intermission').className = 'fadeIn';
}

/**
 * Showing the next video to the user.
 * This should be only trigger but the click on next video.
 */
function showNextVideo(event) {
  event.preventDefault();

  document.getElementById('loading').style.display = 'block';
  document.getElementById('result').style.display = 'none';

  if (listOfVideoIds.length) {
    const nextVideoId = extractRandomAvailableVideoId();
    player.loadVideoById({
      videoId: nextVideoId,
      startSeconds: 0,
      ...(nextVideoId[0] === 'aE3hKVtwsJ0' && { endSeconds: 36 }),
      ...(nextVideoId[0] === '6cmg75bgkkg' && { endSeconds: 145 }),
      ...(nextVideoId[0] === 'W3GrSMYbkBE' && { endSeconds: 101 }),
    });
    document.addEventListener('keyup', spaceListener);

    setTimeout(() => {
      currentSmileStatus = false;
      document.getElementById('intermission').className = 'fadeOut';
      document.getElementById('skipVideo').style.display = 'block';
      document.getElementById('pauseVideo').style.display = 'block';
    }, 1000);
  } else {
    showCredit();
  }
}

/**
 * When we click on the skip button, mark the video as skipped
 * and trigger video end function
 */
function skipVideo(event) {
  event.preventDefault();
  videoSkipped = true;
  onVideoEnd();
}

/**
 * Show the end screen
 *
 */
function showCredit() {
  document.removeEventListener('keyup', spaceListener);
  document.getElementById('theater').remove();
  stopCamera();

  document.getElementById('credit').style.display = 'flex';
  document.getElementById('credit').className = 'fadeIn';
}

function stopCamera() {
  // A video's MediaStream object is available through its srcObject attribute
  const mediaStream = webcam.srcObject;

  // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
  const tracks = mediaStream.getTracks();

  // Tracks are returned as an array, so if you know you only have one, you can stop it with:
  tracks[0].stop();

  // Security stop all tracks
  tracks.forEach((track) => {
    return track.stop();
  });

  // Set mediaStream to null
  webcam.srcObject = null;
}

/**
 * Get a video id randomly in the pool of videos.
 * We use splice here to delete the chosen video from the pool.
 */
function extractRandomAvailableVideoId() {
  const randomNumber = Math.floor(Math.random() * listOfVideoIds.length);
  const randomVideoId = listOfVideoIds.splice(randomNumber, 1);

  return randomVideoId[0];
}

/**
 * Determine if the user is smiling or not by getting the most likely current expression
 * using the facepi detection object. Build an array to iterate on each possibility and
 * pick the most likely.
 * @param {Object} expressions object of expressions
 * @return {Boolean}
 */
function isSmiling(expressions) {
  // filtering false positive
  const maxValue = Math.max(
    ...Object.values(expressions).filter((value) => {
      return value <= 1;
    }),
  );

  const expressionsKeys = Object.keys(expressions);
  const mostLikely = expressionsKeys.filter((expression) => {
    return expressions[expression] === maxValue;
  });

  if (mostLikely[0] && mostLikely[0] === 'happy') {
    return true;
  }

  return false;
}
