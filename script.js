import imageSrc from "./imageSrc.js";
const canavs = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = imageSrc;
canavs.width = window.innerWidth;
canavs.height = window.innerHeight;

const gray = (data) => {
    // we could do it like this
    // for (let i = 0; i < data.length; i += 4) {
    //     const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    //     data[i] = gray;
    //     data[i + 1] = gray;
    //     data[i + 2] = gray;
    // }

    // but this to show you how to detect the x and y of the pixel
    for (let y = 0; y < data.height; y++) {
        for (let x = 0; x < data.width; x++) {
            const i = (y * data.width + x) * 4;
            const gray = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
            data.data[i] = gray;
            data.data[i + 1] = gray;
            data.data[i + 2] = gray;
        }
    }
}

const drawImage = () => {
    ctx.drawImage(image, canavs.width / 2 - 256, canavs.height / 2 - 256, 512, 512);
    const imageData = ctx.getImageData(canavs.width / 2 - 256, canavs.height / 2 - 256, 512, 512);
    gray(imageData);
    ctx.putImageData(imageData, canavs.width / 2 - 256, canavs.height / 2 - 256);
}

image.addEventListener("load", drawImage)

// not my code, thank you copilot :>
const throtling = (func, wait) => {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = () => {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


// update the size of the canavs as the window size changes (throttling)
const updateCanvasSize = throtling(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawImage();
}, 1000);

window.addEventListener("resize", updateCanvasSize)