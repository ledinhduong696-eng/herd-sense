importScripts("/models/face-api.min.js");

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  const MODEL_URL = "/models";
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

self.onmessage = async (event) => {
  const { type, imageBitmap } = event.data;
  if (type === "INIT") {
    await loadModels();
    self.postMessage({ type: "READY" });
  } else if (type === "DETECT" && imageBitmap) {
    try {
      const detections = await faceapi
        .detectSingleFace(imageBitmap, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections?.expressions) {
        self.postMessage({ type: "RESULT", expressions: detections.expressions });
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }
};
