function loadTexture(path) {
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
    this.leftCompanion = null;
    this.rightCompanion = null;
  }
  move() {
    this.x += this.speed.x;
    this.y += this.speed.y;

    // 보조 우주선 이동
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
      gameObjects.push(new Laser(this.x + 45, this.y - 10)); // Hero 레이저
      this.cooldown = 500; // 쿨다운 500ms
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
}

class Companion extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.width = 50; // 보조선 크기
    this.height = 37.5;
    this.type = "Companion";
    this.img = img;
    this.startAutoFire();
  }
  startAutoFire() {
    setInterval(() => {
      if (!this.dead) {
        gameObjects.push(new Laser(this.x + this.width / 2 - 4.5, this.y - 10));
      }
    }, 1000); // 1초마다 레이저 발사
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
        this.y -= 15; // 레이저 위로 이동
      } else {
        this.dead = true; // 화면 상단에 도달하면 제거
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
    this.img = explosionImg; // 폭발 이미지로 변경
    setTimeout(() => {
      this.dead = true; // 폭발 후 제거
    }, 500); // 폭발 효과 유지 시간
  }
}

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let heroImg, enemyImg, laserImg, backgroundImg, explosionImg;
let gameObjects = [];
let hero;

function createHero() {
  hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
  hero.img = heroImg;
  hero.addCompanions(heroImg, heroImg); // 좌우 보조 우주선 추가
  gameObjects.push(hero);
}

function createEnemies() {
  const rows = 5; // 피라미드 높이
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

function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));
}

function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy");
  const lasers = gameObjects.filter((go) => go.type === "Laser");

  lasers.forEach((laser) => {
    enemies.forEach((enemy) => {
      if (!enemy.exploding && intersectRect(laser.rectFromGameObject(), enemy.rectFromGameObject())) {
        laser.dead = true;
        enemy.explode(); // 폭발 처리
      }
    });
  });

  gameObjects = gameObjects.filter((go) => !go.dead);
  gameObjects.forEach((go) => {
    if (go.type === "Hero" || go.type === "Enemy") {
      go.move();
    }
  });
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
      case " ":
        if (hero.canFire()) {
          hero.fire();
        }
        break;
    }
  });
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

async function initGame() {
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  backgroundImg = await loadTexture("assets/starBackground.png");
  explosionImg = await loadTexture("assets/laserGreenShot.png");

  createHero();
  createEnemies();

  setupKeyboardInput();

  setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 그리기
    ctx.fillStyle = ctx.createPattern(backgroundImg, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateGameObjects();
    drawGameObjects(ctx);
  }, 1000 / 60); // 60fps
}

initGame().catch((err) => console.error(err));
