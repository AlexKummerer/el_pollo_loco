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
    "img/jumpright1.png",
    "img/jumpright2.png",
    "img/jumpright3.png",
    "img/jumpright4.png",
    "img/jumpright5.png",
    "img/jumpright6.png",
    "img/jumpright7.png",
    "img/jumpright8.png",
    "img/jumpright9.png",
];

let characterHurtRight = [
    "img/hurtright1.png",
    "img/hurtright2.png",
    "img/hurtright3.png",
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

let characterJumpLeft = [
    "img/jumpleft1.png",
    "img/jumpleft2.png",
    "img/jumpleft3.png",
    "img/jumpleft4.png",
    "img/jumpleft5.png",
    "img/jumpleft6.png",
    "img/jumpleft7.png",
    "img/jumpleft8.png",
    "img/jumpleft9.png",
];

let characterHurtLeft = [
    "img/hurtleft1.png",
    "img/hurtleft2.png",
    "img/hurtleft3.png",
];
let characterJumpIndex = 0;
let characterHurtGraphicIndex = 0;
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
let isHurt = false;
let currentBossIndex = 0;
let currentBossImage = "img/boss1.png";
let bossGraphicsWalkingLeft = ["img/boss1.png", "img/boss2.png", "img/boss3.png", "img/boss4.png"]
let bossTurning = false;
//------- Game config
let JUMP_TIME = 300; // in ms
let HURT_TIME = 700;
let DEAD_TIME = 500;
let GAME_SPEED = 7;
let BOSS_POSITION_X = 4300;
let BOSS_POSITION_Y = 80;
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