import imageSrc from "./imageSrc.js";
import getImageSrc from "./fileLoader.js";
import gray from "./gray.js";
import sobel from "./sobel.js";

const canavs = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('image-input');
const mouseRadiusInput = document.getElementById('mouse-radius-input');

imageInput.addEventListener("change", async (e) => {
    const files = e.currentTarget.files || [];
    const src = await getImageSrc(files[0]);
    image.src = src;
})

const image = new Image();
image.src = imageSrc;
canavs.width = window.innerWidth;
canavs.height = window.innerHeight;

const mouse = {
    x: 0,
    y: 0,
    radius: 100
}

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

mouseRadiusInput.addEventListener("change", (e) => {
    const { value, min, max } = e.target;
    if (value < min) e.target.value = min;
    if (value > max) e.target.value = max;
    mouse.radius = value;
})

const drawImage = () => {
    ctx.drawImage(image, canavs.width / 2 - 256, canavs.height / 2 - 256, 512, 512);
    const imageData = ctx.getImageData(canavs.width / 2 - 256, canavs.height / 2 - 256, 512, 512);
    const grayImageData = gray(imageData);
    const sobelImageData = sobel(grayImageData);
    const imageLeft = canavs.width / 2 - 256;
    const imageTop = canavs.height / 2 - 256;
    ctx.putImageData(sobelImageData, canavs.width / 2 - 256, canavs.height / 2 - 256);

    const animate = () => {
        ctx.clearRect(0, 0, canavs.width, canavs.height);
        ctx.putImageData(sobelImageData, imageLeft, imageTop);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 5;
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.stroke()
        ctx.clip();
        ctx.clearRect(mouse.x - mouse.radius, mouse.y - mouse.radius, mouse.radius * 2, mouse.radius * 2);
        ctx.drawImage(image, imageLeft, imageTop, 512, 512);
        ctx.restore();
        requestAnimationFrame(animate);
    }
    animate();
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
}, 150);

window.addEventListener("resize", updateCanvasSize)