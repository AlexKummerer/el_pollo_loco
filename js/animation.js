function calculateDrawingDetails() {
    checkCharacterMovement();
    calculateCloudOffSet();
    calculateGallinitaPosition();
    calculatePollitoPostion();
    calculateBossPosition();
    changeBossAnimations();
}

function checkCharacterMovement() {
    setInterval(() => {
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        //checkIfSleeping();
        animateCharacter();
        characterGraphicIndex++;
    }, 100);
}

function animateCharacter() {
    isJumping = timePassedSinceJump < JUMP_TIME * 2 && !isHurt;
    checkForWaling();
    checkForRunning();
    checkForJumping();
    checkIfHurt();
    animateDeadCharacter();
}

function checkForWaling() {
    if (directionRight && !isMovingRight && !isMovingLeft && !isJumping) {
        let index = characterGraphicIndex % characterStandRight.length; //
        currentCharacterImg = characterStandRight[index];
    }
    if (directionLeft && !isMovingRight && !isMovingLeft && !isJumping) {
        let index = characterGraphicIndex % characterStandLeft.length; //
        currentCharacterImg = characterStandLeft[index];
    }
}

function checkForRunning() {
    if (isMovingRight) {
        directionRight = true;
        directionLeft = false;
        //AUDIO_RUNNING.play();
        let index = characterGraphicIndex % characterGraphicsRight.length; //
        currentCharacterImg = characterGraphicsRight[index];
    }

    // is Moving Left

    if (isMovingLeft) {
        directionRight = false;
        directionLeft = true;
        // AUDIO_RUNNING.play();
        let index = characterGraphicIndex % characterGraphicsLeft.length;
        currentCharacterImg = characterGraphicsLeft[index];
    }

    if (!isMovingLeft && !isMovingRight) {
        //AUDIO_RUNNING.pause();
    }
}

function checkForJumping() {
    let index;

    if (isJumping && directionRight) {
        index = characterJumpIndex % characterJumpRight.length;
        currentCharacterImg = characterJumpRight[index];
        characterJumpIndex = characterJumpIndex + 1;
    }

    if (isJumping && directionLeft) {
        index = characterJumpIndex % characterJumpLeft.length;
        currentCharacterImg = characterJumpLeft[index];
        characterJumpIndex = characterJumpIndex + 1;
    }
}

function checkIfHurt() {
    let index;
    setInterval(() => {
        if (isHurt && directionRight) {
            if (index == 2) {
                isHurt = false;
                index = 0;
                characterHurtGraphicIndex = 0;
            }

            index = characterHurtGraphicIndex % characterHurtRight.length;
            currentCharacterImg = characterHurtRight[index];
            characterHurtGraphicIndex++;
        }

        if (isHurt && directionLeft) {
            if (index == 2) {
                isHurt = false;
                index = 0;
                characterHurtGraphicIndex = 0;
            }
            index = characterHurtGraphicIndex % characterHurtLeft.length;
            currentCharacterImg = characterHurtLeft[index];
            characterHurtGraphicIndex++;
        }
    }, 80);
}

function animateDeadCharacter() {
    if (isDead) {
        let timePassed = new Date().getTime() - character_lost_at;
        character_x -= timePassed / 18;
        let index = characterGraphicIndex % deadCharacter.length;
        currentCharacterImg = characterGraphicsDead[index];
    }
}

function calculateCloudOffSet() {
    setInterval(() => {
        cloudOffSet = cloudOffSet + 0.25;
    }, 50);
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
    } else if (finalBoss_energy < 100) {
        // if boss_energy is reduced, he will attack
        BOSS_POSITION_X -= 15;
    } else if (finalBoss_energy < 60) {
        // if boss_energy is reduced, he will attack
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
    if (BOSS_POSITION_X >= 4300) {
        bossTurning = false;
    }
}

function changeBossAnimations() {
    let index;
    setInterval(() => {
        animateWalkingBoss(index);
        animateAttackingBoss(index);
        animateWoundedBoss(index);
        animateBossDefeat(index);
    }, 125);
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
    }
}

function drawFinalScreen() {

    if (gameFinished && !isDead) {
        drawWinScreen();

    } else if (isDead) {
        drawDefeatScreen();
        removeKeyListener();
    }
}

function drawWinScreen() {
    prepareNotification();
    ctx.fillText('Congrats!', canvas.width / 2, 200);
    ctx.fillText(' You won!', canvas.width / 2, 300);

}

function drawDefeatScreen() {
    prepareNotification();
    ctx.fillText('Oh nooo!', canvas.width / 2, 200);
    ctx.fillText(' You lost!', canvas.width / 2, 300);

}

/**
 * Prepares styles for screen-notification when game is won / over
 */
function prepareNotification() {
    ctx.font = '90px Architects Daughter';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
}