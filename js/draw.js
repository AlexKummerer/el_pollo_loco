/**
 * Hauptfunktion zum Zeichnen des Spiels
 */
function draw() {
    drawBackground();
    animateGame();
    requestAnimationFrame(draw);
}

/**
 * Funktion zur Animation des Spiels
 */
function animateGame() {
    if (gameFinished || isDead) {
        drawFinalScreen();
    } else if (gameStarted) {
        drawSideElements();
        updateCharacter();
        drawFinalBoss2()
    }
}

/**
 * Funktion zum Zeichnen von Hintergrund und Elementen an den Seiten
 */
function drawSideElements() {
    drawGallinitas();
    drawPollitos();
    drawBottles();
    drawEnergyBar();
    drawBottleInformation();
    drawThrowBottle();
    drawBossEnergyBar();
}

/**
 * Funktion zum Zeichnen des Hintergrunds
 */
function drawBackground() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawHills();
    drawShadows();
    drawClouds();
    drawGround();
}

function drawSky() {
    [-1, 0, 1, 2].forEach(i => {
        addBackgroundObject("img/sky.png", i * 1900, 0, 1, 1);
    });
}

function drawHills() {
    [-1, 0, 1].forEach(i => {
        addBackgroundObject("img/bg_2.png", i * 2300, -220, 0.6);
    });
}

function drawShadows() {
    [-1, 0, 1].forEach(i => {
        addBackgroundObject("img/bg_1.png", i * 2304, -200, 0.6);
    });
}

function drawClouds() {
    [-1, 0, 1, 2].forEach(i => {
        addBackgroundObject("img/clouds.png", i * 1920 - cloudOffSet, -40, 0.4, 1);
    });
}

function drawGround() {
    if (isMovingRight) {
        bg_elements = bg_elements - GAME_SPEED;
    }

    if (isMovingLeft && bg_elements < 250) {
        bg_elements = bg_elements + GAME_SPEED;
    }
    // Draw Ground
    ctx.fillRect(0, 330, canvas.width, canvas.height);

    for (let i = -1; i < 3; i++) {
        addBackgroundObject("img/bg.png", i * 2300, -220, 0.6);
    }
}

/**
 * Funktion zum Zeichnen des Charakters
 */
function updateCharacter() {
    let base_image = new Image();
    base_image.src = currentCharacterImg;
    characterHeight = base_image.width * 0.2;
    characterWidth = base_image.height * 0.2;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y -= 10;
    } else if (character_y < 115) {
        character_y += 10;
    }

    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            character_x,
            character_y,
            characterHeight,
            characterWidth
        );
    }
}


function drawGallinitas() {
    gallinitas.forEach(gallinita => {
        addBackgroundObject(
            currentGallinita,
            gallinita.position_x,
            gallinita.position_y,
            gallinita.scale,
            1
        );
    });
}

function drawPollitos() {
    pollitos.forEach(pollito => {
        addBackgroundObject(
            currentPollito,
            pollito.position_x,
            pollito.position_y + 8,
            pollito.scale,
            1
        );
    });
}



function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bootle_x = placedBottles[i];
        addBackgroundObject("img/tabasco.png", bootle_x, 280, 0.2, 1);
    }
}

function drawEnergyBar() {
    drawImageWithText("img/vidas.png", 15, 65, 0.35, character_energy, 65, 105);
}

function drawBottleInformation() {
    drawImageWithText("img/tabasco.png", 15, 15, 0.15, collectedBottles, 65, 55);
}

function drawImageWithText(imageSrc, imageX, imageY, imageScale, textValue, textX, textY) {
    let base_image = new Image();
    base_image.src = imageSrc; 

    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            imageX,
            imageY,
            base_image.width * imageScale,
            base_image.height * imageScale
        );
        ctx.font = "40px Bradley Hand ITC";
        ctx.fillText("x " + textValue, textX, textY);
    };

    console.log(base_image.src, textValue, textX, textY);
}

function drawThrowBottle() {
    if (bottleThrowTime) {
        let timePassed = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassed / 300);
        thrownBottleX = 220 + timePassed * 0.8;
        thrownBottleY = 260 - (timePassed * 0.4 - gravity);
        let base_image = new Image();
        base_image.src = "img/tabasco.png";
        if (base_image.complete) {
            ctx.drawImage(
                base_image,
                thrownBottleX,
                thrownBottleY,
                base_image.width * 0.2,
                base_image.height * 0.2
            );
        }
    }
}

function drawBossEnergyBar() {
    let energyBarPathBoss = "img/bossenergy/" + finalBoss_energy + "_.png";
    if (finalBoss_energy <= 0) {
        energyBarPathBoss = "img/bossenergy/0_.png";
    }
    addBackgroundObject(energyBarPathBoss, BOSS_POSITION_X + 50, 80, 0.35, 1);
}

function drawFinalBoss2() {
    let src = currentBossImage;

    addBackgroundObject(src, BOSS_POSITION_X, BOSS_POSITION_Y, 0.25, 1);
}