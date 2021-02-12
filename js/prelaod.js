let imagePaths = [...characterGraphicsRight, ...characterGraphicsLeft, ...allGallinitas, ...allPollitos, "img/bg_2.png", "img/bg_1.png", "img/clouds.png",
    "img/sky.png", "img/bg.png", ...characterStandRight, ...characterStandLeft, ...characterJumpRight, ...characterHurtRight, ...characterJumpLeft, ...characterHurtLeft, "img/vidas.png",
    ...bossGraphicsWalkingLeft, ...bossEnergy, ...bossGraphicsAttacking, "img/tabasco.png", ...bossWoundedGraphics, ...bossGraphicsDead, ...deadCharacter, ...characterSleepRight, ...characterSleepLeft
]
let images = [];

/**
 * Preload all images. This function should be executed before starting the game.
 * imagePaths should contain all images that will be loaded: ['img/image1.png', 'img/image2.png', 'img/image3.png', ...]
 */
function preloadImages() {
    for (let i = 0; i < imagePaths.length; i++) {
        let image = new Image();
        image.src = imagePaths[i];
        images.push(image); // push image-path to images-array (which contains all image-paths)
    }
}

/**
 * Check if background-image is already loaded in cache; if not, create new image
 * @param {string} src_path - scr-path of background-image 
 */
function checkBackgroundImageCache(src_path) {
    // Check if image is found in images-array.
    let base_image = images.find(function(img) {
        return img.src.endsWith(src_path.substring(0, src_path.length));
    });
    // Create new image if not found in cache
    if (!base_image) {
        base_image = new Image();
        base_image.src = src_path;
    }
    return base_image;

}