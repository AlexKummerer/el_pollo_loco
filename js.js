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
            base_image.height * 0.5
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
    //ctx.fillStyle = "blue";
    ctx.fillRect(40, 15, 2 * character_energy, 30);

    ctx.globalAlpha = 0.2;
    //ctx.fillStyle = "black";
    ctx.fillRect(35, 10, 210, 40);
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