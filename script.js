const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const betBtn = document.getElementById('betBtn');
const hackBtn = document.getElementById('hackBtn');
const chipsDisplay = document.getElementById('chips');
const betAmountInput = document.getElementById('betAmount');
const multipliers = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500];
let chips = 100;

chipsDisplay.textContent = `Chips: ${chips}`;

const { Engine, Render, Runner, Bodies, World, Events, Body } = Matter;

const engine = Engine.create();
const world = engine.world;
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 600,
        height: 700,
        wireframes: false,
        background: '#AA0000'
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

function drawBoard() {
    const pegSpacing = 40;
    const rows = 9; // Reduced to remove topmost row

    // Add pegs
    for (let row = 1; row <= rows; row++) { // Start from row 1 to skip top row
        for (let col = 0; col <= row; col++) {
            const x = canvas.width / 2 + col * pegSpacing - row * pegSpacing / 2;
            const y = row * pegSpacing + 50;
            World.add(world, Bodies.circle(x, y, 5, { isStatic: true, render: { fillStyle: '#ffffff' } }));
        }
    }

    // Add walls
    World.add(world, [
        Bodies.rectangle(canvas.width / 2, canvas.height + 25, canvas.width, 50, { isStatic: true, render: { visible: false } }), // Bottom
        Bodies.rectangle(-25, canvas.height / 2, 50, canvas.height, { isStatic: true, render: { visible: false } }), // Left
        Bodies.rectangle(canvas.width + 25, canvas.height / 2, 50, canvas.height, { isStatic: true, render: { visible: false } }) // Right
    ]);

    // Add slots and multipliers
    multipliers.forEach((multiplier, index) => {
        const x = index * pegSpacing + 20;
        const y = canvas.height - 50;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px Ubuntu';
        ctx.strokeStyle = '#000'; // Black outline
        ctx.lineWidth = 4;
        ctx.strokeText(`${multiplier}x`, x, y);
        ctx.fillText(`${multiplier}x`, x, y);

        World.add(world, Bodies.rectangle(x, canvas.height - 50, pegSpacing, 10, { isStatic: true, label: `${multiplier}`, render: { visible: false } }));
    });
}

function dropBalls(count) {
    if (chips < count) {
        alert('Not enough chips!');
        return;
    }

    chips -= count;
    chipsDisplay.textContent = `Chips: ${chips}`;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const ball = Bodies.circle(canvas.width / 2, 20, 10, { restitution: 0.5, friction: 100, render: { fillStyle: '#00f' } });
            ball.label = 'ball';
            World.add(world, ball);
        }, i * 100);
    }
}

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
        if (pair.bodyB.label !== 'ball') {
            const winMultiplier = parseFloat(pair.bodyB.label);
            chips += winMultiplier;
            chipsDisplay.textContent = `Chips: ${chips}`;
        }
    });
});

function hackGame() {
    let hackAmount = parseInt(prompt("Enter chips to add:", "100"));
    if (!isNaN(hackAmount) && hackAmount > 0) {
        chips += hackAmount;
        chipsDisplay.textContent = `Chips: ${chips}`;
    } else {
        alert('Invalid amount');
    }
}

betBtn.addEventListener('click', () => {
    const betAmount = parseInt(betAmountInput.value);
    if (!isNaN(betAmount) && betAmount > 0) {
        dropBalls(betAmount);
    } else {
        alert('Invalid bet amount');
    }
});

hackBtn.addEventListener('click', hackGame);

drawBoard();
