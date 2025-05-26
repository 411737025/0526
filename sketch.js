let video;
let facemesh;
let predictions = [];
let handShape = "paper"; // "paper", "scissors", "rock"

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  // 模型載入完成
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    let idx = null;

    // 根據手部形狀決定要畫哪個點
    if (handShape === "paper") {
      idx = 94;
    } else if (handShape === "scissors") {
      idx = 151;
    } else if (handShape === "rock") {
      idx = 123;
    }

    if (idx !== null && keypoints[idx]) {
      const [x, y] = keypoints[idx];
      noFill();
      stroke(255, 0, 0);
      strokeWeight(4);
      ellipse(x, y, 50, 50);
    }
  }
}
