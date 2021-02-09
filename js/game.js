function init() {
    preloadImages();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    draw();
}

function loadGame() {
    createCharacter();
    createGallinitasList();
    createPollintosList();
    checkForRunning();
    checkForJumping();
    checkForGallinitas();
    checkForPollintos();
    calculateCloudOffSet();
    listenForKeys();
    calculateGallinitaPosition();
    calculatePollitoPostion();
    calculateBossPosition();
    checkForCollision();
    checkIfHurt();
}

function calculateBossPosition() {
    let updateBossInterval = setInterval(() => {
        adaptBossMovements();
        currentBossIndex++;
    }, 70);
    updateIntervals.push(updateBossInterval);
}

function adaptBossMovements() {
    if (finalBoss_energy == 100) {
        // if boss enery is intact, he is moving around his initial spot
        calculatePatrollingBoss();
    } else if (finalBoss_energy < 100) { // if boss_energy is reduced, he will attack
        BOSS_POSITION_X -= 15;
    } else if (finalBoss_energy < 60) { // if boss_energy is reduced, he will attack
        BOSS_POSITION_X -= 20;
    }

}

function calculatePatrollingBoss() {
    bossPatrollingForward();
    bossPatrollingBackward();
}

function bossPatrollingForward() {
    if (BOSS_POSITION_X > 4100 && !bossTurning) {
        BOSS_POSITION_X -= 10;
    }
    if (BOSS_POSITION_X <= 4100) {
        bossTurning = true;
    }
}


function bossPatrollingBackward() {
    if (BOSS_POSITION_X <= 4300 && bossTurning) {
        BOSS_POSITION_X += 10;
    }
    if (BOSS_POSITION_X >= (4300)) {
        bossTurning = false;
    }
}

function checkForCollision() {
    let updateCollisionInterval = setInterval(() => {
        checkPollitosCollison();
        checkGallinitasCollison();
        checkBottleCollison();
        checkBossBottleCollison();
        checkBossCollision()

    }, 125);
    updateIntervals.push(updateCollisionInterval); // push interval-variable to array to enable clearing of interval if game ends

}

function checkBossCollision() {
    if (checkCollisionCondition(character_x, characterWidth - 60, BOSS_POSITION_X + bg_elements, BOSS_WIDTH - 100, character_y, characterHeight, BOSS_POSITION_Y, BOSS_HEIGHT)) {
        reduceCharacterEnergy();
        bossAttack = true;
    }
}

function reduceCharacterEnergy() {
    character_energy -= COLLISION_ENERGY_LOSS; // reduce energy when hit by enemy
    if (bossAttack) {
        character_energy == 0; // immediate death when character collides with boss
    }
    if (character_energy <= 0) {
        gameOver();
    }
}

function gameOver() {
    isDead = true;
    characterDefeatedAt = new Date().getTime();
    setTimeout(refreshIntervals, 3000);

}

function checkPollitosCollison() {
    for (let i = 0; i < pollitos.length; i++) {
        const pollito = pollitos[i];
        const pollito_x = pollito.position_x + bg_elements;
        if (pollito_x - 40 < character_x && pollito_x + 40 > character_x) {
            if (character_y > 110) {
                if (character_energy >= 0) {
                    character_energy -= 2;
                    isHurt = true;
                } else {
                    character_lost_at = new Date().getTime();
                    game_finished = true;
                }
            }
        }
    }
}

function checkGallinitasCollison() {
    for (let i = 0; i < gallinitas.length; i++) {
        const gallinita = gallinitas[i];
        const gallinita_x = gallinita.position_x + bg_elements;
        if (gallinita_x - 40 < character_x && gallinita_x + 40 > character_x) {
            if (character_y > 110) {
                if (character_energy >= 0) {
                    character_energy -= 2;
                    isHurt = true;
                } else {
                    character_lost_at = new Date().getTime();
                    game_finished = true;
                }
            }
        }
    }
}


function checkBottleCollison() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bottle_X = placedBottles[i] + bg_elements;
        if (bottle_X - 40 < character_x && bottle_X + 40 > character_x) {
            console.log("bottle_x", bottle_X);
            console.log("character_y", character_y);
            if (character_y > 110) {
                placedBottles.splice(i, 1);
                //AUDIO_BOTTLE.play();
                collectedBottles++;
            }
        }
    }
}

function checkBossBottleCollison() {
    timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
    if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) { // boss is immune if still in wounded state
        bossIsWounded = false;
    }
    let collisionTrue = checkCollisionCondition(thrownBottleX, 80, BOSS_POSITION_X + bg_elements, BOSS_WIDTH, thrownBottleY, 65, BOSS_POSITION_Y, BOSS_HEIGHT);
    if (collisionTrue && !bossIsWounded) {
        hurtBossAnimation();
    }

}

function hurtBossAnimation() {
    timeOfBottleCollision = new Date().getTime();
    reduceBossEnergy();
}

function reduceBossEnergy() {
    if (finalBoss_energy > 0) {
        finalBoss_energy -= COLLISION_ENERGY_LOSS;
        bossIsWounded = true;
    }
    // Trigger levelFinish-Animation if boss energy <= 0
    if (finalBoss_energy <= 0 && bossDefeatedAt == 0) {
        bossDefeatedAt = new Date().getTime();
        bossIsDead = true;
        console.log("bossIsDead", bossIsDead)
        console.log("bossDefeatedAt", bossDefeatedAt)
        finishLevel();
    }
}



/**
 * General function to check if collision has happened between two elements according to x- & y-coordinates
 * 
 * @param {number} collider_1_x - x-coordinate of the 1st collision element
 * @param {number} collider_1_width - width of the 1st collision element 
 * @param {number} collider_2_x - x-coordinate of the 2nd collision element
 * @param {number} collider_2_width - width of the 2nd collision element 
 * @param {number} collider_1_y - Y-coordinate of the 1st collision element
 * @param {number} collider_1_height - height of the 1st collision element 
 * @param {number} collider_2_y y-coordinate of the 2nd collision element
 * @param {number} collider_2_height - height of the 2nd collision element 
 */
function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_1_y, collider_1_height, collider_2_y, collider_2_height) {
    // defines range for x-position in which collision is detected
    let x_condition = ((collider_1_x - collider_1_width / 2) < (collider_2_x + collider_2_width / 2) && (collider_1_x + collider_1_width / 2) > (collider_2_x - collider_2_width / 2));
    // defines range for y-position in which collision is detected
    let y_condition = ((collider_1_y + collider_1_height) > collider_2_y) && (collider_1_y < (collider_2_y + collider_2_height));
    return (x_condition && y_condition);
}



function finishLevel() {
    game_finished = true;
    gameStarted = false;
    refreshIntervals();
}

function calculateGallinitaPosition() {
    setInterval(() => {
        for (let i = 0; i < gallinitas.length; i++) {
            const gallinta = gallinitas[i];
            gallinta.position_x = gallinta.position_x - gallinta.speed;
        }
    }, 100);
}

function calculatePollitoPostion() {
    setInterval(() => {
        for (let i = 0; i < pollitos.length; i++) {
            const pollita = pollitos[i];
            pollita.position_x = pollita.position_x - pollita.speed;
        }
    }, 100);
}

function createGallinitasList() {
    gallinitas = [
        createChicken(800),
        createChicken(1100),
        createChicken(2200),
        createChicken(3500),
    ];
}

function createPollintosList() {
    pollitos = [
        createChicken(1500),
        createChicken(1800),
        createChicken(2800),
        createChicken(3700),
    ];
}

function calculateCloudOffSet() {
    setInterval(() => {
        cloudOffSet = cloudOffSet + 0.25;
    }, 50);
}

function draw() {
    drawbackground();
    if (game_finished) {
        drawFinalScreen();
    } else {
        drawGallinitas();
        drawPollitos();
        updateCharacter();
        requestAnimationFrame(draw);
        drawBottles();
        drawEnergyBar();
        drawBottleInformation();
        drawThrowBottle();
        drawBossEnergyBar();
    }
    drawFinalBoss2();
}

function drawBossEnergyBar() {
    let energyBarPathBoss = "img/bossenergy/" + finalBoss_energy + "_.png";
    if (finalBoss_energy <= 0) {
        energyBarPathBoss = 'img/bossenergy/0_.png';
    }
    addBackgroundObject(energyBarPathBoss, BOSS_POSITION_X + 50, 80, 0.35, 1);
}


function drawFinalBoss2() {
    let src = currentBossImage;
    changeBossAnimations();
    addBackgroundObject(src, BOSS_POSITION_X, BOSS_POSITION_Y, 0.25, 1);
}

function changeBossAnimations() {
    let index;
    animateWalkingBoss(index);
    animateAttackingBoss(index);
    animateWoundedBoss(index);
    animateBossDefeat(index);
}

function animateWalkingBoss(index) {
    if (finalBoss_energy <= 100) {
        index = currentBossIndex % bossGraphicsWalkingLeft.length;
        currentBossImage = bossGraphicsWalkingLeft[index];
    }
}

function animateAttackingBoss(index) {
    if (finalBoss_energy <= 80 && finalBoss_energy > 0) {
        index = currentBossIndex % bossGraphicsAttacking.length;
        currentBossImage = bossGraphicsAttacking[index];
    }

}

function animateWoundedBoss(index) {
    if (bossIsWounded) {
        index = currentBossIndex % bossWoundedGraphics.length;
        currentBossImage = bossWoundedGraphics[index];
    }


}

function animateBossDefeat(index) {
    if (bossIsDead == true) {
        let timePassed = new Date().getTime() - bossDefeatedAt;
        BOSS_POSITION_X += timePassed / 18;
        BOSS_POSITION_Y -= timePassed / 14;
        index = currentBossIndex % bossGraphicsDead.length;
        currentBossImage = bossGraphicsDead[index];
        console.log("timePassed", timePassed)
        console.log("BOSS_POSITION_X", BOSS_POSITION_X)
        console.log("BOSS_POSITION_Y", BOSS_POSITION_Y)

    }
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

function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bootle_x = placedBottles[i];
        addBackgroundObject("img/tabasco.png", bootle_x, 280, 0.2, 1);
    }
}

function drawPollitos() {
    for (let index = 0; index < pollitos.length; index++) {
        const pollito = pollitos[index];
        let base_image = currentPollito;

        addBackgroundObject(
            base_image,
            pollito.position_x,
            pollito.position_y,
            pollito.scale,
            1
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

function getFromCache(src) {
    if (!cache[src]) {
        let base_image = new Image();
        base_image.src = src;
        cache[src] = base_image;
    }

    return cache[src];
}

function drawFinalScreen() {
    ctx.fillStyle = "blue";
    ctx.font = "80px Bradley Hand ITC";
    let msg = "YOU WON!";
    if (character_lost_at > 0) {
        msg = "YOU LOST!";
        refreshIntervals();
    }
    ctx.fillText(msg, 250, 175);
}

function createChicken(position_x) {
    return {
        position_x: position_x,
        position_y: 280,
        scale: 0.26,
        speed: Math.random() * 6,
        opacity: 1,
    };
}

/**
 * This function checks for the current image of the chicken.
 */
function checkForGallinitas() {
    setInterval(() => {
        let index = gallinitasIndex % allGallinitas.length;
        currentGallinita = allGallinitas[index];
        gallinitasIndex = gallinitasIndex + 1;
    }, 80);
}

function checkForPollintos() {
    setInterval(() => {
        let index = pollitoIndex % allPollitos.length;
        currentPollito = allPollitos[index];
        pollitoIndex = pollitoIndex + 1;
    }, 80);
}

function createCharacter() {
    setInterval(() => {
        if (directionRight && !isMovingRight && !isMovingLeft && !isJumping) {
            let index = characterGraphicIndex % characterStandRight.length; //
            currentCharacterImg = characterStandRight[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }
        if (directionLeft && !isMovingRight && !isMovingLeft && !isJumping) {
            let index = characterGraphicIndex % characterStandLeft.length; //
            currentCharacterImg = characterStandLeft[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }
    }, 125);
}

function checkIfHurt() {
    let index;

    setInterval(function() {
        if (isHurt && directionRight) {
            if (index == 2) {
                isHurt = false;
                index = 0;
                characterHurtGraphicIndex = 0;
            }
            index = characterHurtGraphicIndex % characterHurtRight.length;
            currentCharacterImg = characterHurtRight[index];
            characterHurtGraphicIndex = characterHurtGraphicIndex + 1;
        }

        if (isHurt && directionLeft) {
            if (index == 2) {
                isHurt = false;
                index = 0;
                characterHurtGraphicIndex = 0;
            }
            index = characterHurtGraphicIndex % characterHurtLeft.length;
            currentCharacterImg = characterHurtLeft[index];
            characterHurtGraphicIndex = characterHurtGraphicIndex + 1;
        }
    }, 80);
}

function checkForJumping() {
    let index;
    setInterval(() => {
        if (isJumping && directionRight) {
            if (index == 8) {
                isJumping = false;
                index = 0;
                characterJumpIndex = 0;
            }
            index = characterJumpIndex % characterJumpRight.length;
            currentCharacterImg = characterJumpRight[index];
            characterJumpIndex = characterJumpIndex + 1;
        }

        if (isJumping && directionLeft) {
            if (index == 8) {
                isJumping = false;
                index = 0;
                characterJumpIndex = 0;
            }
            index = characterJumpIndex % characterJumpLeft.length;
            currentCharacterImg = characterJumpLeft[index];
            characterJumpIndex = characterJumpIndex + 1;
        }
    }, 80);
}

function checkForRunning() {
    setInterval(() => {
        if (isMovingRight) {
            directionRight = true;
            directionLeft = false;
            //AUDIO_RUNNING.play();
            let index = characterGraphicIndex % characterGraphicsRight.length; //
            currentCharacterImg = characterGraphicsRight[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }

        // is Moving Left

        if (isMovingLeft) {
            directionRight = false;
            directionLeft = true;
            // AUDIO_RUNNING.play();
            let index = characterGraphicIndex % characterGraphicsLeft.length;
            currentCharacterImg = characterGraphicsLeft[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }

        if (!isMovingLeft && !isMovingRight) {
            //AUDIO_RUNNING.pause();
        }
    }, 125);
    console.log("character_x", character_x);
}

function updateCharacter() {
    let base_image = new Image();
    base_image.src = currentCharacterImg;

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
            base_image.width * 0.2,
            base_image.height * 0.2
        );
    }
}

function drawbackground() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSky();
    drawHills();
    drawShadows();
    drawClouds();
    drawGround();
}

function drawShadows() {
    for (let i = -1; i < 12; i++) {
        addBackgroundObject("img/bg_1.png", i * 2304, -200, 0.6);
    }
}

function drawHills() {
    for (let i = -1; i < 12; i++) {
        addBackgroundObject("img/bg_2.png", i * 2300, -220, 0.6);
    }
}

function drawClouds() {
    for (let i = -1; i < 12; i++) {
        addBackgroundObject("img/clouds.png", i * 1920 - cloudOffSet, -40, 0.4, 1);
    }
}

function drawSky() {
    for (let i = -1; i < 10; i++) {
        addBackgroundObject("img/sky.png", i * 1900, 0, 1, 1);
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

    for (let i = -1; i < 10; i++) {
        addBackgroundObject("img/bg.png", i * 2300, -220, 0.6);
    }
}

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

function listenForKeys() {
    document.addEventListener("keydown", (e) => {
        const k = e.key;
        if (k == "ArrowRight") {
            isMovingRight = true;
        }

        if (k == "ArrowLeft") {
            isMovingLeft = true;
        }

        if (k == "d" && collectedBottles > 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                //AUDIO_THROW.play();
                collectedBottles--;
                bottleThrowTime = new Date().getTime();
            }
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == "Space" && timePassedSinceJump > JUMP_TIME * 2) {
            //AUDIO_JUMP.play();
            isJumping = true;
            lastJumpStarted = new Date().getTime();
        }
    });
    document.addEventListener("keyup", (e) => {
        const k = e.key;
        if (k == "ArrowRight") {
            isMovingRight = false;
        }

        if (k == "ArrowLeft") {
            isMovingLeft = false;
        }
    });
}

function refreshIntervals() {
    updateIntervals.forEach((interval) => {
        clearInterval(interval)
    });
    updateIntervals = [];
}