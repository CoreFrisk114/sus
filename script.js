const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let erasing = false;
let brushSize = 5;

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);

document.getElementById('colorPicker').addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
    erasing = false;
});

document.getElementById('sizePicker').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('eraser').addEventListener('click', () => {
    erasing = true;
});

document.getElementById('brush').addEventListener('click', () => {
    erasing = false;
    ctx.strokeStyle = document.getElementById('colorPicker').value;
});

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (erasing) {
        ctx.strokeStyle = '#FFFFFF';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // 清除之前的红色边框
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制红色边框
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();
}

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});
