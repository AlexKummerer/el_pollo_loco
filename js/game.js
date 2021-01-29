let canvas;
let ctx;
let character_x = 200;
let character_y = 200;
let character_energy = 100;
let finalBoss_energy = 100;
let isMovingRight = false;
let isMovingLeft = false;
let bg_elemements = 0;
let lastJumpStarted = 0;
let currentCharacterImg = "img/charakter_1.png";
let characterGraphicsRight = [
    "img/charakter_1.png",
    "img/charakter_2.png",
    "img/charakter_3.png",
    "img/charakter_4.png",
];
let characterGraphicsLeft = [
    "img/charakter_left_1.png",
    "img/charakter_left_2.png",
    "img/charakter_left_3.png",
    "img/charakter_left_4.png",
];
let characterGraphicIndex = 0;
let cloudOffSet = 0;
let chickens = [];
let placedBottles = [750, 1000, 1500, 1850, 2100, 2400, 2700, 3050, 3400, 3800];
let collectedBottles = 50;
let bottleThrowTime = 0;
let thrownBottleX = 0;
let thrownBottleY = 0;

//------- Game config
let JUMP_TIME = 200; // in ms
let GAME_SPEED = 5;
let AUDIO_RUNNING = new Audio("audio/running.mp3");
let AUDIO_JUMP = new Audio("audio/jump.mp3");
let AUDIO_BOTTLE = new Audio("audio/bottle.mp3");
let AUDIO_THROW = new Audio("audio/throw.mp3")
let AUDIO_GLASS = new Audio("audio/glass.mp3")
let AUDIO_CHICKEN = new Audio("audio/chicken.mp3")
let AUDIO_BACKGROUND_MUSIC = new Audio("audio/mexican.mp3")
AUDIO_BACKGROUND_MUSIC.loop = true;
AUDIO_BACKGROUND_MUSIC.volume = 0.2;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    createChickenList();
    checkForRunnung();
    draw();
    calculateCloudOffSet();
    listenForKeys();
    calculateChickenPosition();
    checkForCollision();;
}



function checkForCollision() {
    setInterval(() => {
        //check Chicken
        for (let i = 0; i < chickens.length; i++) {
            const chicken = chickens[i];
            const chicken_x = chicken.position_x + bg_elemements;
            if (chicken_x - 40 < character_x && chicken_x + 40 > character_x) {
                if (character_y > 190) {
                    character_energy--;
                }
            }
        }
        // check Bottle
        for (let i = 0; i < placedBottles.length; i++) {
            const bottle_X = placedBottles[i] + bg_elemements;
            if (bottle_X - 40 < character_x && bottle_X + 40 > character_x) {
                if (character_y > 180) {
                    placedBottles.splice(i, 1);
                    //AUDIO_BOTTLE.play();
                    collectedBottles++;
                }
            }
        }

        //check Final Boss
        if (thrownBottleX > 1500 + bg_elemements - 200 && thrownBottleX < 1500 + bg_elemements + 200) {

            finalBoss_energy = finalBoss_energy - 5;
            console.log("finalBoss_energy" + finalBoss_energy)
            AUDIO_GLASS.play()
        }




    }, 100);
}

function calculateChickenPosition() {
    setInterval(() => {
        for (let i = 0; i < chickens.length; i++) {
            const chicken = chickens[i];
            chicken.position_x = chicken.position_x - chicken.speed;
        }
    }, 50);
}

function createChickenList() {
    chickens = [
        createChicken(1, 600),
        createChicken(2, 800),
        createChicken(1, 1100),
        createChicken(2, 1400),
        createChicken(1, 1700),
        createChicken(2, 2000),
        createChicken(1, 2200),
        createChicken(2, 2550),
        createChicken(1, 2650),
    ];
}

function calculateCloudOffSet() {
    setInterval(() => {
        cloudOffSet = cloudOffSet + 0.25;
    }, 50);
}

function draw() {
    drawbackground();
    updateCharacter();
    drawChicken();
    drawBottles();
    requestAnimationFrame(draw);
    drawEnergyBar();
    drawBottleInformation();
    drawThrowBottle();
    drawFinalBoss();
}

function drawFinalBoss() {
    let chicken_x = 1450;
    addBackgroundObject("img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/G1.png", chicken_x, 75, 0.25, 1);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.fillRect(1450 + bg_elemements, 120, 2 * finalBoss_energy, 10);


    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    ctx.fillRect(1445 + bg_elemements, 115, 210, 20);



}



function drawThrowBottle() {
    if (bottleThrowTime) {
        let timePassed = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassed / 300);
        thrownBottleX = 220 + (timePassed * 0.8);
        thrownBottleY = 260 - (timePassed * 0.4 - gravity);
        let base_image = new Image();
        base_image.src = "img/tabasco.png";
        if (base_image.complete) {
            ctx.drawImage(
                base_image,
                thrownBottleX,
                thrownBottleY,
                base_image.width * 0.5,
                base_image.height * 0.5
            );
        }
    }

}


function drawBottleInformation() {
    let base_image = new Image();
    base_image.src = "img/tabasco.png";
    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            15,
            60,
            base_image.width * 0.5,
            base_image.height * 0.5,
        );
    }
    ctx.font = "40px Bradley Hand ITC";
    ctx.fillText("x " + collectedBottles, 60, 95);
}

function drawBottles() {
    for (let i = 0; i < placedBottles.length; i++) {
        const bootle_x = placedBottles[i];
        addBackgroundObject("img/tabasco.png", bootle_x, 290, 0.5, 1);
    }
}

function drawEnergyBar() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "blue";
    ctx.fillRect(40, 15, 2 * character_energy, 30);

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    ctx.fillRect(35, 10, 210, 40);
}

function drawChicken() {
    for (i = 0; i < chickens.length; i = i + 1) {
        let chicken = chickens[i];
        addBackgroundObject(
            chicken.img,
            chicken.position_x,
            chicken.position_y,
            chicken.scale,
            0.8
        );
    }
}

function createChicken(type, position_x) {
    return {
        img: "img/chicken" + type + ".png",
        position_x: position_x,
        position_y: 285,
        scale: 0.6,
        speed: Math.random() * 5,
    };
}

function checkForRunnung() {
    isMovingRight;
    isMovingLeft;
    setInterval(() => {
        if (isMovingRight) {
            //AUDIO_RUNNING.play();
            let index = characterGraphicIndex % characterGraphicsRight.length;
            currentCharacterImg = characterGraphicsRight[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }
        // is Moving LEft

        if (isMovingLeft) {
            // AUDIO_RUNNING.play();
            let index = characterGraphicIndex % characterGraphicsLeft.length;
            currentCharacterImg = characterGraphicsLeft[index];
            characterGraphicIndex = characterGraphicIndex + 1;
        }

        if (!isMovingLeft && isMovingRight) {
            //AUDIO_RUNNING.pause();
        }
    }, 100);
}

function updateCharacter() {
    let base_image = new Image();
    base_image.src = currentCharacterImg;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    if (timePassedSinceJump < JUMP_TIME) {
        character_y = character_y - 15;
    } else {
        //check Falling

        if (character_y < 200) {
            character_y = character_y + 15;
        }
    }

    if (base_image.complete) {
        ctx.drawImage(
            base_image,
            character_x,
            character_y,
            base_image.width * 0.35,
            base_image.height * 0.35
        );
    }
}

function drawbackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();
    //draw Clouds
    addBackgroundObject("img/cloud1.png", 100 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 400 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 700 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 1000 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 1300 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 1600 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 1900 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 2200 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 2500 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 2700 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 3000 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 3300 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 3600 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 3900 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 4200 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 4500 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud2.png", 4700 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 5000 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 5300 - cloudOffSet, 20, 0.6, 0.8);
    addBackgroundObject("img/cloud1.png", 5600 - cloudOffSet, 20, 0.8, 0.8);
    addBackgroundObject("img/cloud2.png", 5900 - cloudOffSet, 20, 0.6, 0.8);
}

function drawGround() {
    if (isMovingRight) {
        bg_elemements = bg_elemements - GAME_SPEED;
    }

    if (isMovingLeft && bg_elemements < 250) {
        bg_elemements = bg_elemements + GAME_SPEED;
    }

    addBackgroundObject("img/bg_elem_1.png", 0, 145, 0.6, 0.5);
    addBackgroundObject("img/bg_elem_2.png", 250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 1000, 145, 0.6, 0.5);

    addBackgroundObject("img/bg_elem_2.png", 1250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 1500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 1750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 2000, 270, 0.2, 0.4);

    addBackgroundObject("img/bg_elem_2.png", 2250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 2500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 2750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 3000, 270, 0.2, 0.4);

    addBackgroundObject("img/bg_elem_2.png", 3250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 3500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 3750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 4000, 270, 0.2, 0.4);

    addBackgroundObject("img/bg_elem_2.png", 3250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 3500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 3750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 4000, 270, 0.2, 0.4);

    addBackgroundObject("img/bg_elem_2.png", 4250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 4500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 4750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 5000, 270, 0.2, 0.4);

    addBackgroundObject("img/bg_elem_2.png", 5250, 70, 0.6, 0.3);
    addBackgroundObject("img/bg_elem_1.png", 5500, 270, 0.2, 0.4);
    addBackgroundObject("img/bg_elem_2.png", 5750, 200, 0.3, 0.8);
    addBackgroundObject("img/bg_elem_1.png", 6000, 270, 0.2, 0.4);

    // Draw Ground

    ctx.fillStyle = "#FFE699 ";
    ctx.fillRect(0, 330, canvas.width, canvas.height - 330);

    for (let i = 0; i < 10; i = i + 1) {
        addBackgroundObject("img/sand.png", i * canvas.width, 330, 0.5, 0.5);
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
            offsetX + bg_elemements,
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
            //character_x = character_x + 5;
        }

        if (k == "ArrowLeft") {
            isMovingLeft = true;
            //character_x = character_x - 5;
        }

        if (k == "d" && collectedBottles > 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                AUDIO_THROW.play();
                collectedBottles--;
                bottleThrowTime = new Date().getTime();
            }

        }



        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == "Space" && timePassedSinceJump > JUMP_TIME * 2) {
            //AUDIO_JUMP.play();
            lastJumpStarted = new Date().getTime();
        }




    });
}

document.addEventListener("keyup", (e) => {
    const k = e.key;
    if (k == "ArrowRight") {
        isMovingRight = false;
        //character_x = character_x + 5;
    }

    if (k == "ArrowLeft") {
        isMovingLeft = false;
        //character_x = character_x - 5;
    }
});