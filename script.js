import imageSrc from "./imageSrc.js";
const canavs = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = imageSrc;
canavs.width = window.innerWidth;
canavs.height = window.innerHeight;

const drawImage = () => {
    ctx.drawImage(image, canavs.width / 2 - 256, canavs.height / 2 - 256, 512, 512);
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