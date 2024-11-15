function loadTexture(path) {
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
  