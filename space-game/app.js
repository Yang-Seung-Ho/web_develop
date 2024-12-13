function loadTexture(path) {
<<<<<<< Updated upstream
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
    });
  }
  
  window.onload = async () => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
  
    const heroImg = await loadTexture('assets/player.png');
    const enemyImg = await loadTexture('assets/enemyShip.png');
    const backgroundImg = await loadTexture('assets/starBackground.png');
  
    // 배경 설정
    const pattern = ctx.createPattern(backgroundImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // 플레이어 우주선과 보조 우주선 그리기
    const playerX = canvas.width / 2;
    const playerY = canvas.height - canvas.height / 4;
  
    // 중앙 플레이어
    ctx.drawImage(heroImg, playerX - 45, playerY);
  
    // 왼쪽 보조 우주선 (크기 절반으로 축소)
    ctx.drawImage(heroImg, playerX - 120, playerY+20, heroImg.width / 2, heroImg.height / 2);
  
    // 오른쪽 보조 우주선 (크기 절반으로 축소)
    ctx.drawImage(heroImg, playerX + 80, playerY+20, heroImg.width / 2, heroImg.height / 2);
  
    // 적군 피라미드 배치
    createEnemies2(ctx, canvas, enemyImg);
  };
  
  // 피라미드 형태로 적군 배치
  function createEnemies2(ctx, canvas, enemyImg) {
    const rows = 5; // 피라미드 높이
    for (let row = 0; row < rows; row++) {
      const startX = (canvas.width - (enemyImg.width * (rows - row))) / 2;
      for (let i = 0; i < rows - row; i++) {
        const x = startX + i * enemyImg.width;
        const y = row * enemyImg.height;
        ctx.drawImage(enemyImg, x, y);
      }
    }
  }
  
=======
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image at ${path}`));
  });
}

class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false;
    this.type = "";
    this.width = 0;
    this.height = 0;
    this.img = undefined;
  }
  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 99;
    this.height = 75;
    this.type = "Hero";
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
    this.leftCompanion = null;
    this.rightCompanion = null;
  }
  move() {
    this.x += this.speed.x;
    this.y += this.speed.y;

    if (this.leftCompanion) {
      this.leftCompanion.x = this.x - 80;
      this.leftCompanion.y = this.y + 20;
    }
    if (this.rightCompanion) {
      this.rightCompanion.x = this.x + 120;
      this.rightCompanion.y = this.y + 20;
    }
  }
  addCompanions(leftImg, rightImg) {
    this.leftCompanion = new Companion(this.x - 80, this.y + 20, leftImg);
    this.rightCompanion = new Companion(this.x + 120, this.y + 20, rightImg);
    gameObjects.push(this.leftCompanion);
    gameObjects.push(this.rightCompanion);
  }
  fire() {
    if (this.canFire()) {
      gameObjects.push(new Laser(this.x + 45, this.y - 10));
      this.cooldown = 500;
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id);
        }
      }, 100);
    }
  }
  canFire() {
    return this.cooldown === 0;
  }
  decrementLife() {
    this.life--;
    if (this.life <= 0) {
      this.dead = true;
    }
  }
  incrementPoints() {
    this.points += 100;
  }
}

class Companion extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.width = 50;
    this.height = 37.5;
    this.type = "Companion";
    this.img = img;
    this.startAutoFire();
  }
  startAutoFire() {
    this.fireInterval = setInterval(() => {
      if (!this.dead) {
        gameObjects.push(new Laser(this.x + this.width / 2 - 4.5, this.y - 10));
      }
    }, 1000);
  }
  stopAutoFire() {
    clearInterval(this.fireInterval);
  }
}

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 9;
    this.height = 33;
    this.type = "Laser";
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15;
      } else {
        this.dead = true;
        clearInterval(id);
      }
    }, 100);
  }
}

class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    this.speed = 1;
    this.exploding = false;
  }
  move() {
    if (!this.exploding) {
      this.y += this.speed;
    }
  }
  explode() {
    this.exploding = true;
    this.img = explosionImg;
    setTimeout(() => {
      this.dead = true;
    }, 500);
  }
}
class Boss extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 150;
    this.height = 100;
    this.type = "Boss";
    this.life = 20; // 보스 생명력
    this.speed = 1;
    this.exploding = false;
  }

  move() {
    if (!this.exploding) {
      this.y += this.speed;
      if (this.y > canvas.height - 300 || this.y < 0) {
        this.speed *= -1; // 위아래 움직임
      }
    }
  }

  explode() {
    this.exploding = true;
    this.img = explosionImg;
    setTimeout(() => {
      this.dead = true;
      console.log("Boss exploded and marked as dead."); // 디버깅용
    }, 1000);
  }

  decrementLife() {
    this.life--;
    console.log(`Boss life: ${this.life}`); // 디버깅용
    if (this.life <= 0) {
      this.explode();
    }
  }
}


class Shield extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 50;
    this.height = 50;
    this.type = "Shield";
    this.img = shieldImg;
  }
}

class Meteor extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 50;
    this.height = 50;
    this.type = "Meteor";
    this.img = meteorImg;
    this.speed = -5; // 위로 이동
  }

  move() {
    this.y += this.speed;
    if (this.y < 0) { // 화면 위로 사라지면 제거
      this.dead = true;
    }
  }
}



const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let stage = 1;
let shieldActive = false;
let chargeLevel = 0;
let bossImg, shieldImg, meteorImg;
let heroImg, enemyImg, laserImg, backgroundImg, explosionImg, lifeImg;
let gameObjects = [];
let hero;
let gameLoopId;

const Messages = {
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_WIN: "GAME_END_WIN",
  GAME_END_LOSS: "GAME_END_LOSS",
};

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}
function createShield(x, y) {
  const shield = new Shield(x, y);
  gameObjects.push(shield);
}

function activateShield() {
  shieldActive = true;
  console.log("Shield activated!"); // 디버깅용
  setTimeout(() => {
    shieldActive = false;
    console.log("Shield deactivated!"); // 디버깅용
  }, 5000); // 5초 지속
}


function useMeteorSpecial() {
  for (let i = 0; i < 5; i++) {
    const meteor = new Meteor(Math.random() * (canvas.width - 50), canvas.height); // 아래에서 생성
    meteor.img = meteorImg;
    gameObjects.push(meteor);
    console.log("Meteor added:", meteor); // 디버깅용
  }
}



function chargeAttack() {
  if (chargeLevel < 3) {
    chargeLevel++;
    console.log(`Charge level: ${chargeLevel}`); // 디버깅용
  }

  if (chargeLevel >= 3) {
    // 자동 메테오 공격
    useMeteorSpecial();
    chargeLevel = 0; // 차지 초기화
  }
}

// 차지 자동 증가 설정
setInterval(() => {
  if (chargeLevel < 3) {
    chargeAttack(); // 3초마다 차지 증가
  }
}, 3000);



function createBoss() {
  const boss = new Boss(canvas.width / 2 - 75, 50); // 화면 안쪽으로 위치 조정
  boss.img = bossImg;
  gameObjects.push(boss);
  console.log("Boss added to gameObjects:", boss); // 디버깅용
}


function drawChargeLevel() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "yellow";
  ctx.textAlign = "left";
  ctx.fillText(`Charge: ${chargeLevel}/3`, 10, canvas.height - 80);
}

function setupKeyboardInput() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        hero.speed.y = -5;
        break;
      case "ArrowDown":
        hero.speed.y = 5;
        break;
      case "ArrowLeft":
        hero.speed.x = -5;
        break;
      case "ArrowRight":
        hero.speed.x = 5;
        break;
      case " ":
        if (hero.canFire()) {
          hero.fire();
        }
        break;
      case "C": // 차지 공격
        chargeAttack();
        break;
        
      case "S": // 실드 활성화
        if (!shieldActive) {
          activateShield();
        }
        break;
      case "M": // 메테오 스킬
        console.log('123');
        useMeteorSpecial();
        break;
      case "Enter":
        resetGame();
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
        hero.speed.y = 0;
        break;
      case "ArrowLeft":
      case "ArrowRight":
        hero.speed.x = 0;
        break;
    }
  });
}

function createHero() {
  hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
  hero.img = heroImg;
  hero.addCompanions(heroImg, heroImg);
  gameObjects.push(hero);
}

function createEnemies() {
  const rows = 5;
  for (let row = 0; row < rows; row++) {
    const startX = (canvas.width - (enemyImg.width * (rows - row))) / 2;
    for (let i = 0; i < rows - row; i++) {
      const x = startX + i * enemyImg.width;
      const y = row * enemyImg.height;
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}

function drawGameObjects() {
  gameObjects.forEach((go) => {
    if (!go.dead) {
      go.draw(ctx);
    }
  });

  // 실드 활성화 시 시각적 표시
  if (shieldActive) {
    ctx.beginPath();
    ctx.arc(hero.x + hero.width / 2, hero.y + hero.height / 2, 80, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
  }
}


function drawLife() {
  const START_POS = canvas.width - 180;
  for (let i = 0; i < hero.life; i++) {
    ctx.drawImage(lifeImg, START_POS + (45 * (i + 1)), canvas.height - 37);
  }
}

function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  ctx.fillText("Points: " + hero.points, 10, canvas.height - 20);
}
function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy");
  const lasers = gameObjects.filter((go) => go.type === "Laser");
  const shields = gameObjects.filter((go) => go.type === "Shield");
  const boss = gameObjects.find((go) => go.type === "Boss");
  const meteors = gameObjects.filter((go) => go.type === "Meteor");

  // 메테오와 적, 보스의 충돌 처리
  meteors.forEach((meteor) => {
    enemies.forEach((enemy) => {
      if (intersectRect(meteor.rectFromGameObject(), enemy.rectFromGameObject())) {
        meteor.dead = true;
        enemy.explode();
        hero.incrementPoints();
      }
    });

    if (boss && intersectRect(meteor.rectFromGameObject(), boss.rectFromGameObject())) {
      meteor.dead = true;
      boss.decrementLife();
    }
  });

  // 레이저와 적, 보스의 충돌 처리
  lasers.forEach((laser) => {
    enemies.forEach((enemy) => {
      if (!enemy.exploding && intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
        laser.dead = true;
        enemy.explode();
        hero.incrementPoints();
      }
    });

    if (boss && intersectRect(laser.rectFromGameObject(), boss.rectFromGameObject())) {
      laser.dead = true;
      boss.decrementLife();
    }
  });

  // 보스 사망 처리
  if (boss && boss.dead) {
    console.log("Boss is dead. Ending game."); // 디버깅 메시지
    endGame(true); // 승리 처리
  }

  // 히어로와 실드 충돌 처리
  shields.forEach((shield) => {
    if (intersectRect(hero.rectFromGameObject(), shield.rectFromGameObject())) {
      shield.dead = true;
      activateShield();
    }
  });

  // 히어로와 적의 충돌 처리
  enemies.forEach((enemy) => {
    if (!shieldActive && intersectRect(hero.rectFromGameObject(), enemy.rectFromGameObject())) {
      enemy.dead = true;
      hero.decrementLife();
      if (isHeroDead()) {
        endGame(false); // 패배 처리
      }
    }
  });

  // 메테오와 히어로의 충돌 처리 (플레이어는 피해를 받지 않음)
  meteors.forEach((meteor) => {
    if (intersectRect(meteor.rectFromGameObject(), hero.rectFromGameObject())) {
      meteor.dead = true; // 메테오 제거
    }
  });

  // 업데이트 후 죽은 객체 필터링
  gameObjects = gameObjects.filter((go) => !go.dead);

  // 이동 로직 업데이트
  gameObjects.forEach((go) => {
    if (go.type === "Hero" || go.type === "Enemy" || go.type === "Boss" || go.type === "Meteor") {
      go.move();
    }
  });

  // 적이 모두 제거된 경우 스테이지 이동 또는 보스 생성
  if (isEnemiesDead() && !boss) {
    if (stage < 3) {
      stage++;
      console.log(`Stage: ${stage}`); // 디버깅 메시지
      createEnemies(); // 다음 스테이지 적 생성
    } else if (stage === 3 && !gameObjects.find((go) => go.type === "Boss")) {
      createBoss(); // 보스 생성
    }
  }
}


function isHeroDead() {
  return hero.life <= 0;
}

function isEnemiesDead() {
  return gameObjects.filter((go) => go.type === "Enemy" && !go.dead && !go.exploding).length === 0;
}

function initGameLoop() {
  gameLoopId = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리기
    ctx.fillStyle = ctx.createPattern(backgroundImg, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // HUD 그리기
    drawPoints();
    drawLife();
    drawChargeLevel();

    // 게임 객체 업데이트 및 그리기
    updateGameObjects();
    drawGameObjects();
  }, 1000 / 60);
}


function resetGame() {
  clearInterval(gameLoopId);
  gameObjects.forEach((go) => {
    if (go.type === "Companion") {
      go.stopAutoFire();
    }
  });
  gameObjects = [];
  hero = null;
  initGame();
}

function endGame(win) {
  clearInterval(gameLoopId);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = win ? "green" : "red";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      win
        ? "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew"
        : "You died !!! Press [Enter] to start a new game Captain Pew Pew",
      canvas.width / 2,
      canvas.height / 2
    );
  }, 200);
}


async function initGame() {
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  backgroundImg = await loadTexture("assets/starBackground.png");
  explosionImg = await loadTexture("assets/laserGreenShot.png");
  lifeImg = await loadTexture("assets/life.png");
  bossImg = await loadTexture("assets/enemyUFO.png");
  shieldImg = await loadTexture("assets/shield.png");
  meteorImg = await loadTexture("assets/meteorBig.png");

  createHero();
  createEnemies();
  setupKeyboardInput();
  initGameLoop();
}

initGame().catch((err) => console.error(err));
>>>>>>> Stashed changes
