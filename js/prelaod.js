const imagePaths = [
  ...characterGraphicsRight,
  ...characterGraphicsLeft,
  ...allGallinitas,
  ...allPollitos,
  "img/bg_2.png",
  "img/bg_1.png",
  "img/clouds.png",
  "img/sky.png",
  "img/bg.png",
  ...characterStandRight,
  ...characterStandLeft,
  ...characterJumpRight,
  ...characterHurtRight,
  ...characterJumpLeft,
  ...characterHurtLeft,
  "img/vidas.png",
  ...bossGraphicsWalkingLeft,
  ...bossEnergy,
  ...bossGraphicsAttacking,
  "img/tabasco.png",
  ...bossWoundedGraphics,
  ...bossGraphicsDead,
  ...deadCharacter,
  ...characterSleepRight,
  ...characterSleepLeft,
];
const images = [];

/**
 * Preload all images. This function should be executed before starting the game.
 * imagePaths should contain all images that will be loaded: ['img/image1.png', 'img/image2.png', 'img/image3.png', ...]
 */
function preloadImages() {

    const promises = imagePaths.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
            images.push(img);
        });
    });
    console.log("Images preloaded", promises.length, "images", images)
    return Promise.all(promises);
}

/**
 * Check if background-image is already loaded in cache; if not, create new image
 * @param {string} src_path - scr-path of background-image
 * @returns {HTMLImageElement} - The background image
 */
function checkBackgroundImageCache(src_path) {
  const base_image = images.find((img) =>
    img.src.endsWith(src_path.substring(0, src_path.length))
  );
  if (!base_image) {
    const new_image = new Image();
    new_image.src = src_path;
    return new_image;
  }
  return base_image;
}
