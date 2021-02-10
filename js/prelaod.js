let imagePaths = ["img/fwd_1.png", "img/fwd_2.png", "img/fwd_3.png", "img/fwd_4.png", "img/fwd_5.png", "img/fwd_6.png", "img/bwd_1.png", "img/bwd_2.png", "img/bwd_3.png", "img/bwd_4.png", "img/bwd_5.png",
    "img/bwd_6.png", "img/chicken1.png", "img/chicken2.png", "img/chicken3.png", "img/pollito1.png", "img/pollito2.png", "img/pollito3.png", "img/bg_2.png", "img/bg_1.png", "img/clouds.png",
    "img/sky.png", "img/bg.png", ...characterStandRight, ...characterStandLeft, ...characterJumpRight, ...characterHurtRight, ...characterJumpLeft, ...characterHurtLeft, "img/vidas.png", "img/vidas.png", "img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/G1.png", "img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/4.Muerte/G24.png",
    ...bossGraphicsWalkingLeft, ...bossEnergy, ...bossGraphicsAttacking, "img/tabasco.png", ...bossWoundedGraphics, ...bossGraphicsDead, ...deadCharacter
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