function init() {
    preloadImages();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    draw();
}

function startGame() {
    gameStarted = true;
    document.getElementById("start-button").classList.add("d-none");
    document.getElementById("loco").classList.add("d-none");
    lastKeyPressed = new Date().getTime();
    runGame();
}

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

function checkForCollision() {
    setInterval(() => {
        checkBottleCollison();
        checkBossBottleCollison();
        checkBossCollision();
        checkGallinitasCollison();
        checkPollitosCollison();
    }, 125);
}

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

function reduceCharacterEnergy() {
    // reduce energy when hit by enemy

    character_energy -= lostenergy;

    if (bossAttack) {
        character_energy = 0; // immediate death when character collides with boss
    }
    if (character_energy <= 0) {
        gameOver();
    }
}

function gameOver() {
    isDead = true;
    gameFinished = true;
    gameStarted = false;
    characterDefeatedAt = new Date().getTime();
    character_lost_at = new Date().getTime();
}

function checkPollitosCollison() {
    for (let i = 0; i < pollitos.length; i++) {
        const pollito = pollitos[i];
        const pollito_x = pollito.position_x + bg_elements;
        if (pollito_x - 40 < character_x && pollito_x + 40 > character_x) {
            if (character_y > 110) {
                if (character_energy >= 0) {
                    reduceCharacterEnergy();
                    isHurt = true;
                    AUDIO_HURT.play();
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
                    reduceCharacterEnergy();
                    isHurt = true;
                    console.log(character_energy);
                    AUDIO_HURT.play();
                }
            }
        }
    }
}

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

function checkBossBottleCollison() {
    timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
    if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
        // boss is immune if still in wounded state
        bossIsWounded = false;
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

function hurtBossAnimation() {
    timeOfBottleCollision = new Date().getTime();
    AUDIO_COCKSCREAM.play();
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
    // defines range for x-position in which collision is detected
    let x_condition =
        collider_1_x - collider_1_width / 2 < collider_2_x + collider_2_width / 2 &&
        collider_1_x + collider_1_width / 2 > collider_2_x - collider_2_width / 2;
    // defines range for y-position in which collision is detected
    let y_condition =
        collider_1_y + collider_1_height > collider_2_y &&
        collider_1_y < collider_2_y + collider_2_height;
    return x_condition && y_condition;
}

function finishLevel() {
    gameFinished = true;
    gameStarted = false;
}

function createGallinitasList() {
    gallinitas = [
        createChicken(800),
        createChicken(1100),
        createChicken(1700),
        createChicken(2100),
        createChicken(2200),
        createChicken(2700),
        createChicken(3800),
        createChicken(4200),
        createChicken(5100),
        createChicken(5600),
    ];
}

function createPollintosList() {
    pollitos = [
        createChicken(500),
        createChicken(1000),
        createChicken(1500),
        createChicken(1800),
        createChicken(2500),
        createChicken(2800),
        createChicken(4000),
        createChicken(4800),
        createChicken(5200),
        createChicken(5400),
    ];
}

function createChicken(position_x) {
    return {
        position_x: position_x,
        position_y: 286,
        scale: 0.26,
        speed: Math.random() * 6 + 4,
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

function moveright() {
    isMovingRight = true;
    lastKeyPressed = 0;
}

function stopmoveright() {
    isMovingRight = false;
    lastKeyPressed = new Date().getTime();
}

function moveleft() {
    isMovingLeft = true;
    lastKeyPressed = 0;
}

function stopmoveleft() {
    isMovingLeft = false;
    lastKeyPressed = new Date().getTime();
}

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
 * This function recognizes the stop of the throwing of a bottle.
 */
function stopthrowbottle() {
    lastKeyPressed = new Date().getTime();
}

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
 * This function recognizes the stop of the jump of the character.
 */
function stopjump() {
    lastKeyPressed = new Date().getTime();
    if (isMovingRight || isMovingLeft) {
        lastKeyPressed = 0;
    }
}

function turnSoundandMusicOff() {
    document.addEventListener("keydown", (e) => {
        if (e.key == "m" && soundIsOn) {
            AUDIO_RUNNING.muted = true;
            AUDIO_JUMP.muted = true;
            AUDIO_BOTTLE.muted = true;
            AUDIO_THROW.muted = true;
            AUDIO_GLASS.muted = true;
            AUDIO_CHICKEN.muted = true;
            AUDIO_CRACK.muted = true;
            AUDIO_HURT.muted = true;
            AUDIO_WIN.muted = true;
            AUDIO_LOOSE.muted = true;
            AUDIO_COCKSCREAM.muted = true;
            AUDIO_BACKGROUND_MUSIC.muted = true;

            setTimeout(function() {
                soundIsOn = false;
                soundIsOff = true;
            }, 100);
        }

        if (e.key == "m" && soundIsOff) {
            AUDIO_RUNNING.muted = false;
            AUDIO_JUMP.muted = false;
            AUDIO_BOTTLE.muted = false;
            AUDIO_THROW.muted = false;
            AUDIO_GLASS.muted = false;
            AUDIO_CHICKEN.muted = false;
            AUDIO_CRACK.muted = false;
            AUDIO_HURT.muted = false;
            AUDIO_WIN.muted = false;
            AUDIO_LOOSE.muted = false;
            AUDIO_COCKSCREAM.muted = false;
            AUDIO_BACKGROUND_MUSIC.muted = false;
            setTimeout(function() {
                soundIsOn = true;
                soundIsOff = false;
            }, 100);
        }
    });
}