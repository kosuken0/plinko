const canvas = document.getElementById('plinkoCanvas');
const ctx = canvas.getContext('2d');
const betBtn = document.getElementById('betBtn');
const hackBtn = document.getElementById('hackBtn');
const chipsDisplay = document.getElementById('chips');
const betAmountInput = document.getElementById('betAmount');
const multipliers = [500, 20, 5, 3, 2, 0, 1, 1, 1, 1, 1, 0, 2, 3, 5, 20, 500];
let chips = 100;

chipsDisplay.textContent = `Chips: ${chips}`;

const { Engine, Render, Runner, Bodies, World, Events } = Matter;

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
  const rows = 10;

  // Add pegs
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      const x = canvas.width / 2 + col * pegSpacing - row * pegSpacing / 2;
      const y = row * pegSpacing + 50;
      World.add(world, Bodies.circle(x, y, 5, { isStatic: true }));
    }
  }

  // Add walls
  World.add(world, [
    Bodies.rectangle(canvas.width / 2, canvas.height + 25, canvas.width, 50, { isStatic: true }), // Bottom
    Bodies.rectangle(-25, canvas.height / 2, 50, canvas.height, { isStatic: true }), // Left
    Bodies.rectangle(canvas.width + 25, canvas.height / 2, 50, canvas.height, { isStatic: true }) // Right
  ]);

  // Add slots and multipliers
  multipliers.forEach((multiplier, index) => {
    const x = index * pegSpacing + 20;
    const y = canvas.height - 30;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    const fontSize = 16;
    ctx.font = `bold ${fontSize}px Ubuntu`;
    ctx.fillText(`${multiplier}x`, x, y);

    World.add(world, Bodies.rectangle(x, canvas.height - 50, pegSpacing, 10, { isStatic: true, label: `${multiplier}` }));
  });
}

function dropBalls(count) {
  if (chips < count) {
    alert('Insufficient chips! You need at least ' + count + ' chips.');
    return;
  }

  chips -= count;
  chipsDisplay.textContent = `Chips: ${chips}`;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const ball = Bodies.circle(canvas.width / 2, 20, 10, { restitution: 0.5 });
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
      // Add sound effect or animation for winning
    }
  });
});

function hackGame() {
  alert('Cheating is not allowed! Play fair!'); // Functionality removed
}

betBtn.addEventListener('click', () => {
  const betAmount = parseInt(betAmountInput.value);
  if (!isNaN(betAmount) && betAmount > 0) {
    if (chips >= betAmount) {
      dropBalls(betAmount);
    } else {
      alert('Insufficient chips! You need at least ' + betAmount + ' chips.');
    }
  } else {
    alert('Invalid bet amount. Please enter a positive whole number.');
  }
});

// Improved error handling for invalid chip input in hackBtn (commented out)
// hackBtn.addEventListener('click', () => {
//   let hackAmount = parseInt(prompt("Enter chips to add:", "100"));
//   if (isNaN(hackAmount) || hackAmount <= 0) {
//     alert('Invalid amount. Please enter a positive whole number.');
//   } else {
//     // Implement logic to add chips (consider security implications in a real game)
//     // chips += hackAmount;
//     // chipsDisplay.textContent = `Chips: ${chips}`;
//     alert('Cheating detected! Chips cannot be added this way.');
//   }
// });

// Optional features:
// - Add sound effects for ball collisions and winnings
// - Implement win/lose conditions and display messages
// - Create a reset button to restart the game

// Example sound effect using the Howler.js library (you'll need to include the library)
// const winningSound = new Howl({ src: ['sounds/win.mp3'] });
// Events.on(engine, 'collisionStart', event => {
//   // ... existing logic ...
//   if (winMultiplier > 1) {
//     winningSound.play();
//   }
// });
