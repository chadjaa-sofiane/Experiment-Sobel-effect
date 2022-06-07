const canavs = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canavs.width = window.innerWidth;
canavs.height = window.innerHeight;

ctx.fillStyle = '#FFF';
ctx.fillRect(100, 100, 500, 500);
// ctx.fill()