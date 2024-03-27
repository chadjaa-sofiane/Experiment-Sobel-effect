import imageSrc from "./imageSrc.js";
import getImageSrc from "./fileLoader.js";
import gray from "./gray.js";
import sobel from "./sobel.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("image-input");
const mouseRadiusInput = document.getElementById("mouse-radius-input");
const inputGroup = document.querySelector(".input-group");

imageInput.addEventListener("change", async (e) => {
  const files = e.currentTarget.files || [];
  const src = await getImageSrc(files[0]);
  image.src = src;
});

const image = new Image();
image.src = imageSrc;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: 0,
  y: 0,
  radius: 100,
};

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

inputGroup.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const currentValue = parseInt(mouseRadiusInput.value, 10) || 0;

  if (action === "increment") {
    mouseRadiusInput.value = Math.min(currentValue + 1, mouseRadiusInput.max);
    mouse.radius = parseInt(mouseRadiusInput.value, 10);
  } else if (action === "decrement") {
    mouseRadiusInput.value = Math.max(currentValue - 1, mouseRadiusInput.min);
    mouse.radius = parseInt(mouseRadiusInput.value, 10);
  }
});

mouseRadiusInput.addEventListener("input", (event) => {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value)) {
    mouse.radius = value;
  }
});

const drawImage = () => {
  ctx.drawImage(
    image,
    canvas.width / 2 - 256,
    canvas.height / 2 - 256,
    512,
    512,
  );

  const imageData = ctx.getImageData(
    canvas.width / 2 - 256,
    canvas.height / 2 - 256,
    512,
    512,
  );

  const grayImageData = gray(imageData);
  const sobelImageData = sobel(grayImageData);
  const imageLeft = canvas.width / 2 - 256;
  const imageTop = canvas.height / 2 - 256;

  ctx.putImageData(sobelImageData, imageLeft, imageTop);

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(sobelImageData, imageLeft, imageTop);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 5;
    ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.clip();

    ctx.clearRect(
      mouse.x - mouse.radius,
      mouse.y - mouse.radius,
      mouse.radius * 2,
      mouse.radius * 2,
    );

    ctx.drawImage(image, imageLeft, imageTop, 512, 512);
    ctx.restore();

    requestAnimationFrame(animate);
  };

  animate();
};

image.addEventListener("load", drawImage);

// not my code, thank you copilot :>

const throttling = (func, wait) => {
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
};

// update the size of the canvas as the window size changes (throttling)

const updateCanvasSize = throttling(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawImage();
}, 150);

window.addEventListener("resize", updateCanvasSize);
