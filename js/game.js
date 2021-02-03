let canvas;
let ctx;
let character_x = 200;
let character_y = 115;
let character_energy = 20;
let finalBoss_energy = 100;
let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;
let bg_elements = 0;
let lastJumpStarted = 0;
let currentCharacterImg = "img/standright1.png";
let characterStandRight = [
    "img/standright1.png",
    "img/standright2.png",
    "img/standright3.png",
    "img/standright4.png",
    "img/standright5.png",
    "img/standright6.png",
    "img/standright7.png",
    "img/standright8.png",
    "img/standright9.png",
    "img/standright10.png",
];
let characterGraphicsRight = [
    "img/fwd_1.png",
    "img/fwd_2.png",
    "img/fwd_3.png",
    "img/fwd_4.png",
    "img/fwd_5.png",
    "img/fwd_6.png",
];
let characterJumpRight = [
    "img/jumpright3.png",
    "img/jumpright4.png",
    "img/jumpright5.png",
    "img/jumpright6.png",
    "img/jumpright7.png",
    "img/jumpright8.png",
    "img/jumpright9.png",
];

let characterStandLeft = [
    "img/standleft1.png",
    "img/standleft2.png",
    "img/standleft3.png",
    "img/standleft4.png",
    "img/standleft5.png",
    "img/standleft6.png",
    "img/standleft7.png",
    "img/standleft8.png",
    "img/standleft9.png",
    "img/standleft10.png",
];
let characterGraphicsLeft = [
    "img/bwd_1.png",
    "img/bwd_2.png",
    "img/bwd_3.png",
    "img/bwd_4.png",
    "img/bwd_5.png",
    "img/bwd_6.png",
];
let characterGraphicIndex = 0;
let currentGallinita = "img/chicken1.png";
let allGallinitas = [
    "img/chicken1.png",
    "img/chicken2.png",
    "img/chicken3.png",
];
let gallinitasIndex = 0;
let gallinitas = [];
let currentPollito = "img/pollito1.png";
let allPollitos = ["img/pollito1.png", "img/pollito2.png", "img/pollito3.png"];
let pollitoIndex = 0;
let pollitos = [];
let cloudOffSet = 0;
let directionRight = true;
let directionLeft = false;
let placedBottles = [750, 1000, 1500, 1850, 2100, 2400, 2700, 3050, 3400, 3800];
let collectedBottles = 50;
let bottleThrowTime = 0;
let thrownBottleX = 0;
let thrownBottleY = 0;
let bossDefeatedAt = 0;
let game_finished = false;
let character_lost_at = 0;
//------- Game config
let JUMP_TIME = 350; // in ms
let GAME_SPEED = 7;
let BOSS_POSITION = 4300;
let AUDIO_RUNNING = new Audio("audio/running.mp3");
let AUDIO_JUMP = new Audio("audio/jump.mp3");
let AUDIO_BOTTLE = new Audio("audio/bottle.mp3");
let AUDIO_THROW = new Audio("audio/throw.mp3");
let AUDIO_GLASS = new Audio("audio/glass.mp3");
let AUDIO_CHICKEN = new Audio("audio/chicken.mp3");
let AUDIO_BACKGROUND_MUSIC = new Audio("audio/mexican.mp3");
AUDIO_BACKGROUND_MUSIC.loop = true;
AUDIO_BACKGROUND_MUSIC.volume = 0.2;
let cache = {};

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
    checkForGallinitas();
    checkForPollintos();
    calculateCloudOffSet();
    listenForKeys();
    calculateGallinitaPosition();
    calculatePollitoPostion();
    checkForCollision();
    checkForJumping();
}

function checkForCollision() {
    setInterval(() => {
        //check pollitos
        for (let i = 0; i < pollitos.length; i++) {
            const pollito = pollitos[i];
            const pollito_x = pollito.position_x + bg_elements;
            if (pollito_x - 40 < character_x && pollito_x + 40 > character_x) {
                if (character_y > 110) {
                    if (character_energy >= 0) {
                        character_energy -= 2;
                    } else {
                        character_lost_at = new Date().getTime();
                        game_finished = true;
                    }
                }
            }
        }

        //check gallinitas
        for (let i = 0; i < gallinitas.length; i++) {
            const gallinita = gallinitas[i];
            const gallinita_x = gallinita.position_x + bg_elements;
            if (gallinita_x - 40 < character_x && gallinita_x + 40 > character_x) {
                if (character_y > 110) {
                    if (character_energy >= 0) {
                        character_energy -= 2;
                    } else {
                        character_lost_at = new Date().getTime();
                        game_finished = true;
                    }
                }
            }
        }
        // check Bottle
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

        //check Final Boss
        if (
            thrownBottleX > BOSS_POSITION + bg_elements - 200 &&
            thrownBottleX < BOSS_POSITION + bg_elements + 200
        ) {
            if (finalBoss_energy >= 0) {
                finalBoss_energy = finalBoss_energy - 5;
                //AUDIO_GLASS.play();
            } else if (bossDefeatedAt == 0) {
                bossDefeatedAt = new Date().getTime();
                finishLevel();
            }
        }
    }, 100);
}

function finishLevel() {
    game_finished = true;
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
    }
    drawFinalBoss();
}

function drawFinalBoss() {
    let chicken_x = BOSS_POSITION;
    let chicken_y = 75;
    let bossImage =
        "img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/G1.png";
    if (bossDefeatedAt > 0) {
        bossImage =
            "img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/4.Muerte/G24.png";
        let timePassed = new Date().getTime() - bossDefeatedAt;
        chicken_x = chicken_x + timePassed * 0.1;
        chicken_y = chicken_y - timePassed;
    }

    addBackgroundObject(bossImage, chicken_x, chicken_y, 0.25, 1);
    if (bossDefeatedAt == 0) {
        ctx.globalAlpha = 0.5;
        //ctx.fillStyle = "red";
        ctx.fillRect(
            BOSS_POSITION - 30 + bg_elements,
            120,
            2 * finalBoss_energy,
            10
        );
        ctx.globalAlpha = 0.2;
        //ctx.fillStyle = "black";
        ctx.fillRect(BOSS_POSITION - 32 + bg_elements, 115, 210, 20);
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

function checkForJumping() {
    let index
    console.log(isJumping)
    setInterval(() => {
        if (isJumping && directionRight) {
            console.log(index)

            if (index == 6) {
                isJumping = false;
                index = 0;
                characterGraphicIndex = 0;
            }
            index = characterGraphicIndex % characterJumpRight.length;
            currentCharacterImage = characterJumpRight[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }


    }, 125);
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