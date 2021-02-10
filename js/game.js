function init() {
    preloadImages();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    draw();
}


function loadGame() {
    gameStarted = true;
    runGame();
}

function runGame() {
    createGallinitasList();
    createPollintosList();
    calculateDrawingDetails();
    if (!gameFinished) {
        listenForKeys();
        checkForCollision();
        checkForGallinitas();
        checkForPollintos();
        //moveOnMobile();
    }
}

function checkForCollision() {
    setInterval(() => {
        checkBottleCollison();
        checkBossBottleCollison();
        checkBossCollision();
    }, 125);
    checkGallinitasCollison();
    checkPollitosCollison();

}

function checkBossCollision() {
    if (
        checkCollisionCondition(
            character_x,
            characterWidth - 480,
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
    game_finished = true;
    characterDefeatedAt = new Date().getTime();
    character_lost_at = new Date().getTime();
}

function checkPollitosCollison() {
    setInterval(() => {
        for (let i = 0; i < pollitos.length; i++) {
            const pollito = pollitos[i];
            const pollito_x = pollito.position_x + bg_elements;
            if (pollito_x - 40 < character_x && pollito_x + 40 > character_x) {
                if (character_y > 110) {
                    if (character_energy >= 0) {
                        reduceCharacterEnergy();
                        isHurt = true;

                    }
                }
            }
        }

    }, 125);
}

function checkGallinitasCollison() {
    setInterval(() => {
        for (let i = 0; i < gallinitas.length; i++) {
            const gallinita = gallinitas[i];
            const gallinita_x = gallinita.position_x + bg_elements;
            if (gallinita_x - 40 < character_x && gallinita_x + 40 > character_x) {
                if (character_y > 110) {
                    if (character_energy >= 0) {
                        reduceCharacterEnergy();
                        isHurt = true;
                    }
                }
            }
        }
    }, 125);
}

function checkBottleCollison() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bottle_X = placedBottles[i] + bg_elements;
        if (bottle_X - 40 < character_x && bottle_X + 40 > character_x) {
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
    if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
        // boss is immune if still in wounded state
        bossIsWounded = false;
    }
    let collisionTrue = checkCollisionCondition(
        thrownBottleX,
        70,
        BOSS_POSITION_X + bg_elements,
        BOSS_WIDTH,
        thrownBottleY,
        65,
        BOSS_POSITION_Y,
        BOSS_HEIGHT
    );

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
        collider_1_y + collider_1_height >
        (collider_2_y && collider_1_y) <
        collider_2_y + collider_2_height;
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

function createChicken(position_x) {
    return {
        position_x: position_x,
        position_y: 286,
        scale: 0.26,
        speed: Math.random() * 6 + 1,
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
            console.log(timePassed);
            if (timePassed > 1000) {
                //AUDIO_THROW.play();
                collectedBottles--;

                bottleThrowTime = new Date().getTime();
            }
        }

        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == "Space" && timePassedSinceJump > JUMP_TIME * 2 && !isHurt) {
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