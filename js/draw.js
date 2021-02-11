function draw() {
    drawbackground();
    drawFinalBoss2();
    animateGameStartNFinish();
    updateCharacter();
    requestAnimationFrame(draw);
}

function animateGameStartNFinish() {
    if (gameFinished || isDead) {
        drawFinalScreen();
    } else if (gameStarted) {
        drawSideElements();
    }
}

function drawSideElements() {
    drawGallinitas();
    drawPollitos();
    drawBottles();
    drawEnergyBar();
    drawBottleInformation();
    drawThrowBottle();
    drawBossEnergyBar();
}

function drawbackground() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawHills();
    drawShadows();
    drawClouds();
    drawGround();
}

function drawSky() {
    for (let i = -1; i < 3; i++) {
        addBackgroundObject("img/sky.png", i * 1900, 0, 1, 1);
    }
}

function drawHills() {
    for (let i = -1; i < 2; i++) {
        addBackgroundObject("img/bg_2.png", i * 2300, -220, 0.6);
    }
}

function drawShadows() {
    for (let i = -1; i < 2; i++) {
        addBackgroundObject("img/bg_1.png", i * 2304, -200, 0.6);
    }
}

function drawClouds() {
    for (let i = -1; i < 3; i++) {
        addBackgroundObject("img/clouds.png", i * 1920 - cloudOffSet, -40, 0.4, 1);
    }
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

function updateCharacter() {
    let base_image = new Image();
    base_image.src = currentCharacterImg;
    characterHeight = base_image.width * 0.2;
    characterWidth = base_image.height * 0.2;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 10;
    } else {
        // check Falling
        if (character_y < 115) {
            character_y = character_y + 10;
        }
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
    for (let index = 0; index < gallinitas.length; index++) {
        const gallinita = gallinitas[index];
        let base_image = currentGallinita;

        addBackgroundObject(
            base_image,
            gallinita.position_x,
            gallinita.position_y,
            gallinita.scale,
            1
        );
    }
}

function drawPollitos() {
    for (let index = 0; index < pollitos.length; index++) {
        const pollito = pollitos[index];
        let base_image = currentPollito;

        addBackgroundObject(
            base_image,
            pollito.position_x,
            pollito.position_y + 8,
            pollito.scale,
            1
        );
    }
}

function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bootle_x = placedBottles[i];
        addBackgroundObject("img/tabasco.png", bootle_x, 280, 0.2, 1);
    }
}

function drawEnergyBar() {
    let base_image = new Image();
    base_image.src = "img/vidas.png";
    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            15,
            65,
            base_image.width * 0.35,
            base_image.height * 0.35
        );
    }
    ctx.font = "40px Bradley Hand ITC";
    ctx.fillText("x " + character_energy, 65, 105);
}

function drawBottleInformation() {
    let base_image = new Image();
    base_image.src = "img/tabasco.png";
    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            15,
            15,
            base_image.width * 0.15,
            base_image.height * 0.15
        );
    }
    ctx.font = "40px Bradley Hand ITC";
    ctx.fillText("x " + collectedBottles, 65, 55);
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