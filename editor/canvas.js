/////////////////////////////// CanVas Paint /////////////////////////////////////

// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = 800;
canvas.width = window.innerWidth / 1.02;

ctx.lineWidth = 2;
ctx.strokeStyle = 'white';
let color = document.getElementById("color");
let size = document.getElementById("size");

size.value = ctx.lineWidth;
color.value = ctx.strokeStyle;

ctx.fillStyle = '#2D333B';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function changeColor() {
    ctx.strokeStyle = color.value;
}

function changeSizeMouse() {
    ctx.lineWidth = size.value;
}

function changeType(type) {
    if (type) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
    } else {
        ctx.lineWidth = 100;
        ctx.strokeStyle = "#2D333B";
    }

    color.value = ctx.strokeStyle;
    size.value = ctx.lineWidth;
}

function clearCanvas() {
    ctx.fillStyle = '#2D333B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeSizeCanvas(b) {
    let canvasOld = canvas.toDataURL("image/png");
    let imgOld = new Image();
    imgOld.src = canvasOld;

    imgOld.onload = function() {
        if (b) {
            console.log(canvas.height);
            canvas.height = canvas.height + 200;
            ctx.drawImage(imgOld, 0, 0);
            ctx.fillStyle = '#2D333B';
            ctx.fillRect(0, imgOld.height, canvas.width, canvas.height);
            ctx.lineWidth = size.value;
            ctx.strokeStyle = color.value;
        } else {
            if (canvas.height > 200) {
                canvas.height = canvas.height - 200;
                ctx.drawImage(imgOld, 0, 0);
                ctx.lineWidth = size.value;
                ctx.strokeStyle = color.value;
            }
        }
    }
}

//////////////////// load img to canvas

function uploadImg() {
    let loadLink = document.createElement("input");
    loadLink.type = "file";
    loadLink.style.display = "none";
    document.body.appendChild(loadLink);

    loadLink.click();

    loadLink.onchange = function() {
        let dataImg = new Image();
        dataImg.src = URL.createObjectURL(loadLink.files[0]);
        dataImg.onload = function() {
            canvas.width = dataImg.width;
            canvas.height = dataImg.height;
            ctx.drawImage(dataImg, 0, 0);
            ctx.lineWidth = size.value;
            ctx.strokeStyle = color.value;
        }
        document.getElementById("nameImg").innerHTML = loadLink.files[0].name;
    };

    loadLink.remove();
}

function saveCanvas() {
    let downloadLink = document.createElement("a");



    downloadLink.download = document.getElementById("nameImg").textContent;

    downloadLink.innerHTML = "Download File";
    downloadLink.href = canvas.toDataURL("image/png", 1);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    downloadLink.remove();
}