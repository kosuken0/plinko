const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const betBtn = document.getElementById('betBtn');
const hackBtn = document.getElementById('hackBtn');
const chipsDisplay = document.getElementById('chips');
const multipliers = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500];
let chips = 100;

chipsDisplay.textContent = `Chips: ${chips}`;

function drawBoard() {
    // Draw the Plinko board
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pegSpacing = 40;
    const rows = 10;
    const cols = 17;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= row; col++) {
            const x = canvas.width / 2 + col * pegSpacing - row * pegSpacing / 2;
            const y = row * pegSpacing + 50;
            drawCircle(x, y, 5, '#fff');
        }
    }

    // Draw multipliers
    multipliers.forEach((multiplier, index) => {
        const x = index * pegSpacing + 20;
        const y = canvas.height - 30;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px Ubuntu';
        ctx.fillText(`${multiplier}x`, x, y);
    });
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function dropBall() {
    if (chips <= 0) {
        alert('No more chips!');
        return;
    }

    chips--;
    chipsDisplay.textContent = `Chips: ${chips}`;
    let x = canvas.width / 2;
    let y = 20;
    const gravity = 2;
    const ballRadius = 10;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard();
        drawCircle(x, y, ballRadius, '#00f');

        if (y < canvas.height - 50) {
            y += gravity;
            x += (Math.random() - 0.5) * 4;
            requestAnimationFrame(animate);
        } else {
            let slot = Math.floor(x / (canvas.width / multipliers.length));
            slot = Math.max(0, Math.min(slot, multipliers.length - 1));
            let winMultiplier = multipliers[slot];
            let winAmount = 1 * winMultiplier;
            chips += winAmount;
            chipsDisplay.textContent = `Chips: ${chips}`;
        }
    }

    animate();
}

function hackGame() {
    let hackAmount = parseInt(prompt("Enter chips to add:", "100"));
    if (!isNaN(hackAmount) && hackAmount > 0) {
        chips += hackAmount;
        chipsDisplay.textContent = `Chips: ${chips}`;
    } else {
        alert('Invalid amount');
    }
}

betBtn.addEventListener('click', dropBall);
hackBtn.addEventListener('click', hackGame);
drawBoard();

