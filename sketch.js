let video;
let handpose, facemesh;
let handPredictions = [];
let facePredictions = [];
let handShape = ""; // "paper", "scissors", "rock"
let idx = null;

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 啟動 handpose
  handpose = ml5.handpose(video, () => {});
  handpose.on('predict', results => {
    handPredictions = results;
    if (handPredictions.length > 0) {
      handShape = detectHandShape(handPredictions[0]);
      // 根據手勢決定要畫的臉部特徵點
      if (handShape === "paper") idx = 94;
      else if (handShape === "scissors") idx = 151;
      else if (handShape === "rock") idx = 123;
      else idx = null;
    }
  });

  // 啟動 facemesh
  facemesh = ml5.facemesh(video, () => {});
  facemesh.on('predict', results => {
    facePredictions = results;
  });
}

function draw() {
  image(video, 0, 0, width, height);

  // 只要有臉部特徵點且idx有設定
  if (facePredictions.length > 0 && idx !== null) {
    const keypoints = facePredictions[0].scaledMesh;
    if (keypoints[idx]) {
      const [x, y] = keypoints[idx];
      noFill();
      stroke(255, 0, 0);
      strokeWeight(4);
      ellipse(x, y, 50, 50);
    }
  }
}

// 偵測手勢（簡單判斷，僅供參考）
function detectHandShape(prediction) {
  const landmarks = prediction.landmarks;
  // 取得各指尖座標
  const tips = [8, 12, 16, 20].map(i => landmarks[i][1]); // y座標
  const palm = landmarks[0][1]; // 手腕y座標

  // 布：所有指尖都比手腕高
  if (tips.every(y => y < palm)) return "paper";
  // 剪刀：食指與中指比手腕高，無名指與小指比手腕低
  if (tips[0] < palm && tips[1] < palm && tips[2] > palm && tips[3] > palm) return "scissors";
  // 石頭：所有指尖都比手腕低
  if (tips.every(y => y > palm)) return "rock";
  return "";
}
