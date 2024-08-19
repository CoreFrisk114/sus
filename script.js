const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor');
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
    cursor.style.width = `${brushSize}px`;
    cursor.style.height = `${brushSize}px`;
});

document.getElementById('eraser').addEventListener('click', () => {
    erasing = true;
});

function startPosition(e) {
    painting = true;
    draw(e);
    cursor.style.display = 'block';
}

function endPosition() {
    painting = false;
    ctx.beginPath();
    cursor.style.display = 'none';
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

    cursor.style.left = `${x - brushSize / 2}px`;
    cursor.style.top = `${y - brushSize / 2}px`;
}

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});
