const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.8;
const keys = {};
let player = { x:50, y:300, width:50, height:50, dx:0, dy:0, speed:5, jumping:false, color:'red' };

const platforms = [
  { x:0, y:400, width:800, height:50 },
  { x:200, y:300, width:120, height:20 },
  { x:400, y:200, width:150, height:20 },
  { x:650, y:350, width:100, height:20 }
];

const coins = [
  { x:220, y:260, width:20, height:20, collected:false },
  { x:420, y:160, width:20, height:20, collected:false },
];

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function update() {
  if(keys['ArrowLeft']) player.dx = -player.speed;
  else if(keys['ArrowRight']) player.dx = player.speed;
  else player.dx = 0;

  if(keys['Space'] && !player.jumping){
    player.dy = -15;
    player.jumping = true;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Platform collision
  player.jumping = true;
  for(let p of platforms){
    if(player.x < p.x + p.width &&
       player.x + player.width > p.x &&
       player.y < p.y + p.height &&
       player.y + player.height > p.y){
      if(player.dy > 0){
        player.y = p.y - player.height;
        player.dy = 0;
        player.jumping = false;
      } else if(player.dy < 0){
        player.y = p.y + p.height;
        player.dy = 0;
      }
    }
  }

  // Coin collection
  for(let c of coins){
    if(!c.collected &&
       player.x < c.x + c.width &&
       player.x + player.width > c.x &&
       player.y < c.y + c.height &&
       player.y + player.height > c.y){
      c.collected = true;
    }
  }

  if(player.y + player.height > canvas.height){
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.jumping = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw platforms
  ctx.fillStyle = 'green';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Draw coins
  ctx.fillStyle = 'gold';
  coins.forEach(c => {
    if(!c.collected) ctx.fillRect(c.x, c.y, c.width, c.height);
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

