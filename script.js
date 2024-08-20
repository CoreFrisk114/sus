import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH1F3Eok4EquGc9nsBTmYAEwQ5Q1WUleE",
  authDomain: "suus-36a06.firebaseapp.com",
  projectId: "suus-36a06",
  storageBucket: "suus-36a06.appspot.com",
  messagingSenderId: "958013274025",
  appId: "1:958013274025:web:c312fdfb523067168936b8",
  measurementId: "G-2E3EP15ZQL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let erasing = false;
let brushSize = 5;

async function loadCanvas() {
    const docRef = doc(db, "canvas", "current");
    onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data().data;
            const img = new Image();
            img.src = data;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    });
}

setInterval(async () => {
    const data = canvas.toDataURL();
    const docRef = doc(db, "canvas", "current");
    await setDoc(docRef, { data });
}, 3000);

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
}

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

loadCanvas();
