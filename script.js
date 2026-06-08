const URL = "model/";

let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 400;
    const flip = true;

    webcam = new tmPose.Webcam(size, size, flip);

    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);

    const canvas = webcam.canvas;

    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(canvas);

    labelContainer = document.getElementById("prediction");
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {

    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);

    const prediction = await model.predict(posenetOutput);

    let highest = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    labelContainer.innerHTML =
        `Prediction: ${highest.className} (${(highest.probability * 100).toFixed(2)}%)`;
}