function init() {
    preloadImages().then((image) => {
        console.log(image);
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        draw();
        startButton = document.getElementById("start-button");
        loco = document.getElementById("loco");
    });
}

function startGame() {
    gameStarted = true;
    startButton.classList.add("d-none");
    loco.classList.add("d-none");
    lastKeyPressed = new Date().getTime();
    runGame();
}

/**
 * Funktion zum Ausführen des Spiels
 */
function runGame() {
  AUDIO_BACKGROUND_MUSIC.play();
  AUDIO_CHICKEN.play();
  calculateDrawingDetails();
  createGallinitasList();
  createPollintosList();
  if (!gameFinished) {
    listenForKeys();
    checkForCollision();
    checkForGallinitas();
    checkForPollintos();
  }
}

/**
 * Funktion zum Überprüfen auf Kollisionen
 */
function checkForCollision() {
  setInterval(() => {
    checkBottleCollison();
    checkBossBottleCollison();
    checkBossCollision();
    checkGallinitasCollision();
    checkPollitosCollision();
  }, 125);
}

/**
 * Funktion zur Überprüfung auf Kollisionen mit dem Boss
 */
function checkBossCollision() {
  if (
    checkCollisionCondition(
      character_x,
      characterWidth - 400,
      BOSS_POSITION_X + bg_elements,
      BOSS_WIDTH,
      character_y,
      characterHeight,
      BOSS_POSITION_Y,
      BOSS_HEIGHT
    )
  ) {
    reduceCharacterEnergy();
    bossAttack = true;
  }
}

/**
 * Funktion zur Reduzierung der Energie des Charakters
 */
function reduceCharacterEnergy() {
  character_energy -= lostenergy;
  if (bossAttack) {
    character_energy = 0; // Sofortiger Tod, wenn der Charakter mit dem Boss kollidiert
  }
  if (character_energy <= 0) {
    gameOver();
  }
}

/**
 * Funktion für das Spielende
 */
function gameOver() {
  isDead = true;
  gameFinished = true;
  gameStarted = false;
  characterDefeatedAt = new Date().getTime();
  character_lost_at = new Date().getTime();
}

/**
 * Funktion zur Überprüfung auf Kollisionen
 * @param {Array} items - Die Liste der Elemente, mit denen die Kollision überprüft wird
 * @param {number} collisionThreshold - Die Kollisionsgrenze
 * @param {Function} collisionCallback - Die Funktion, die bei einer Kollision aufgerufen wird
 */
function checkCollision(items, collisionThreshold, collisionCallback) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const item_x = item.position_x + bg_elements;
      if (
        item_x - collisionThreshold < character_x &&
        item_x + collisionThreshold > character_x &&
        character_y > 110
      ) {
        if (character_energy >= 0) {
          collisionCallback();
          isHurt = true;
          console.log(character_energy);
          AUDIO_HURT.play();
        }
      }
    }
  }
  
  /**
   * Funktion zur Überprüfung auf Kollisionen mit den Pollitos
   */
  function checkPollitosCollision() {
    checkCollision(pollitos, 40, reduceCharacterEnergy);
  }
  
  /**
   * Funktion zur Überprüfung auf Kollisionen mit den Gallinitas
   */
  function checkGallinitasCollision() {
    checkCollision(gallinitas, 40, reduceCharacterEnergy);
  }
  

/**
 * Funktion zur Überprüfung auf Kollisionen mit Flaschen
 */
function checkBottleCollison() {
  for (let i = 0; i < placedBottles.length; i++) {
    const bottle_X = placedBottles[i] + bg_elements;
    if (bottle_X - 40 < character_x && bottle_X + 40 > character_x) {
      if (character_y > 110) {
        placedBottles.splice(i, 1);
        AUDIO_BOTTLE.play();
        collectedBottles++;
      }
    }
  }
}

/**
 * Funktion zur Überprüfung auf Kollisionen mit Flaschen und dem Boss
 */
function checkBossBottleCollison() {
  timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
  if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
    bossIsWounded = false; // Der Boss ist immun, wenn er sich noch im verwundeten Zustand befindet
  }
  let collisionTrue = checkCollisionCondition(
    thrownBottleX,
    10,
    BOSS_POSITION_X + bg_elements,
    BOSS_WIDTH,
    thrownBottleY,
    10,
    BOSS_POSITION_Y,
    BOSS_HEIGHT
  );

  if (collisionTrue && !bossIsWounded) {
    AUDIO_CRACK.play();
    hurtBossAnimation();
  }
}

/**
 * Funktion für die Animation der Verletzung des Bosses
 */
function hurtBossAnimation() {
  timeOfBottleCollision = new Date().getTime();
  AUDIO_COCKSCREAM.play();
  reduceBossEnergy();
}

/**
 * Funktion zur Reduzierung der Energie des Bosses
 */
function reduceBossEnergy() {
  if (finalBoss_energy > 0) {
    finalBoss_energy -= COLLISION_ENERGY_LOSS;
    bossIsWounded = true;
  }
  // Starte Level-Finish-Animation, wenn die Bossenergie <= 0 ist
  if (finalBoss_energy <= 0 && bossDefeatedAt == 0) {
    bossDefeatedAt = new Date().getTime();
    bossIsDead = true;
    finishLevel();
  }
}

/**
 * Funktion zur Überprüfung von Kollisionsbedingungen zwischen zwei Elementen
 */
function checkCollisionCondition(
  collider_1_x,
  collider_1_width,
  collider_2_x,
  collider_2_width,
  collider_1_y,
  collider_1_height,
  collider_2_y,
  collider_2_height
) {
  let x_condition =
    collider_1_x - collider_1_width / 2 < collider_2_x + collider_2_width / 2 &&
    collider_1_x + collider_1_width / 2 > collider_2_x - collider_2_width / 2;
  let y_condition =
    collider_1_y + collider_1_height > collider_2_y &&
    collider_1_y < collider_2_y + collider_2_height;
  return x_condition && y_condition;
}

/**
 * Funktion für das Beenden des Levels
 */
function finishLevel() {
  gameFinished = true;
  gameStarted = false;
}

function createChickenList(positions) {
    return positions.map(createChicken);
}

function createGallinitasList() {
    gallinitas = createChickenList([800, 1100, 1700, 2100, 2200, 2700, 3800, 4200, 5100, 5600]);
}

function createPollintosList() {
    pollitos = createChickenList([500, 1000, 1500, 1800, 2500, 2800, 4000, 4800, 5200, 5400]);
}

/**
 * Funktion zur Erstellung eines Hühnchens
 */
function createChicken(position_x) {
  return {
    position_x: position_x,
    position_y: 286,
    scale: 0.26,
    speed: Math.random() * 6 + 4,
    opacity: 1,
  };
}

function checkForRepeatingImages(index, allImages, currentIndex) {
  let newIndex = currentIndex % allImages.length;
  index = newIndex + 1;
  return allImages[newIndex];
}

function checkForGallinitas() {
  setInterval(() => {
    currentGallinita = checkForRepeatingImages(
      gallinitasIndex,
      allGallinitas,
      gallinitasIndex
    );
  }, 80);
}

function checkForPollintos() {
  setInterval(() => {
    currentPollito = checkForRepeatingImages(
      pollitoIndex,
      allPollitos,
      pollitoIndex
    );
  }, 80);
}

/**
 * Funktion zum Hinzufügen eines Hintergrundobjekts
 */
function addBackgroundObject(src, offsetX, offsetY, scale, opacity) {
  if (opacity != undefined) {
    ctx.globalAlpha = opacity;
  }
  let base_image = new Image();
  base_image.src = src;
  if (base_image.complete) {
    ctx.drawImage(
      base_image,
      offsetX + bg_elements,
      offsetY,
      base_image.width * scale,
      base_image.height * scale
    );
  }
}

/**
 * Funktion für die Tastatureingabe-Ereignislistener
 */
function listenForKeys() {
  startupMobileListeners();
  document.addEventListener("keydown", (e) => {
    const k = e.key;

    if (k == "ArrowRight") {
      moveright();
    }

    if (k == "ArrowLeft") {
      moveleft();
    }

    if (k == "d" && collectedBottles > 0 && !directionLeft) {
      throwbottle();
    }

    if (e.code == "Space") {
      jump();
    }
  });
  document.addEventListener("keyup", (e) => {
    const k = e.key;
    if (k == "ArrowRight") {
      stopmoveright();
    }

    if (k == "ArrowLeft") {
      stopmoveleft();
    }
    if (e.code == "Space" && !isDead) {
      stopjump();
    }
    if (k == "d") {
      stopthrowbottle();
    }
  });
}

/**
 * Funktion für die Bewegung nach rechts
 */
function moveright() {
  isMovingRight = true;
  lastKeyPressed = 0;
}

/**
 * Funktion für das Stoppen der Bewegung nach rechts
 */
function stopmoveright() {
  isMovingRight = false;
  lastKeyPressed = new Date().getTime();
}

/**
 * Funktion für die Bewegung nach links
 */
function moveleft() {
  isMovingLeft = true;
  lastKeyPressed = 0;
}

/**
 * Funktion für das Stoppen der Bewegung nach links
 */
function stopmoveleft() {
  isMovingLeft = false;
  lastKeyPressed = new Date().getTime();
}

/**
 * Funktion zum Werfen einer Flasche
 */
function throwbottle() {
  let timePassed = new Date().getTime() - bottleThrowTime;
  lastKeyPressed = new Date().getTime();
  if (timePassed > 1000) {
    AUDIO_THROW.play();
    collectedBottles--;
    lastKeyPressed = 0;
    bottleThrowTime = new Date().getTime();
  }
}

/**
 * Funktion zum Stoppen des Flaschenwurfs
 */
function stopthrowbottle() {
  lastKeyPressed = new Date().getTime();
}

/**
 * Funktion zum Springen
 */
function jump() {
  AUDIO_JUMP.play();
  let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
  if (timePassedSinceJump > JUMP_TIME * 2 && !isHurt) {
    isJumping = true;
    lastJumpStarted = new Date().getTime();
    lastKeyPressed = 0;
  }
}

/**
 * Funktion zum Stoppen des Springens
 */
function stopjump() {
  lastKeyPressed = new Date().getTime();
  if (isMovingRight || isMovingLeft) {
    lastKeyPressed = 0;
  }
}

function toggleSoundAndMusic() {
    AUDIO_RUNNING.muted = !AUDIO_RUNNING.muted;
    AUDIO_JUMP.muted = !AUDIO_JUMP.muted;
    AUDIO_BOTTLE.muted = !AUDIO_BOTTLE.muted;
    AUDIO_THROW.muted = !AUDIO_THROW.muted;
    AUDIO_GLASS.muted = !AUDIO_GLASS.muted;
    AUDIO_CHICKEN.muted = !AUDIO_CHICKEN.muted;
    AUDIO_CRACK.muted = !AUDIO_CRACK.muted;
    AUDIO_HURT.muted = !AUDIO_HURT.muted;
    AUDIO_WIN.muted = !AUDIO_WIN.muted;
    AUDIO_LOOSE.muted = !AUDIO_LOOSE.muted;
    AUDIO_COCKSCREAM.muted = !AUDIO_COCKSCREAM.muted;
    AUDIO_BACKGROUND_MUSIC.muted = !AUDIO_BACKGROUND_MUSIC.muted;

    setTimeout(function() {
        soundIsOn = !soundIsOn;
        soundIsOff = !soundIsOff;
    }, 100);
}

function turnSoundAndMusicOff() {
    document.addEventListener("keydown", (e) => {
        if (e.key == "m") {
            toggleSoundAndMusic();
        }
    });
}
