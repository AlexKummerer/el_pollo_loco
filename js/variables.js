let canvas;
let ctx;
let character_x = 100;
let character_y = 115;
let character_energy = 20;
let finalBoss_energy = 100;
let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;
let isDead = false;
let isSleeping = false;
let gameFinished = false;
let bg_elements = 0;
let lastJumpStarted = 0;
let lastKeyPressed = 0;

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

let characterSleepRight = ["img/sleepright1.png", "img/sleepright2.png", "img/sleepright3.png", "img/sleepright4.png", "img/sleepright5.png", "img/sleepright6.png", "img/sleepright7.png", "img/sleepright8.png", "img/sleepright9.png", "img/sleepright10.png"]
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
let characterSleepLeft = ["img/sleepleft1.png", "img/sleepleft2.png", "img/sleepleft3.png", "img/sleepleft4.png", "img/sleepleft5.png", "img/sleepleft6.png", "img/sleepleft7.png", "img/sleepleft8.png", "img/sleepleft9.png", "img/sleepleft10.png"


]


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
let deadCharacter = ["img/dead1.png", "img/dead2.png", "img/dead3.png", "img/dead4.png", "img/dead5.png", "img/dead6.png", "img/dead7.png"]
let currentGallinita = "img/chicken1.png";
let allGallinitas = [
    "img/chicken1.png",
    "img/chicken2.png",
    "img/chicken3.png",
];
let lostenergy = 1;
let gallinitasIndex = 0;
let gallinitas = [];
let currentPollito = "img/pollito1.png";
let allPollitos = ["img/pollito1.png", "img/pollito2.png", "img/pollito3.png"];
let pollitoIndex = 0;
let pollitos = [];
let cloudOffSet = 0;
let directionRight = true;
let directionLeft = false;
let placedBottles = [535, 1000, 1500, 1850, 2500, 3000];
let collectedBottles = 0;
let bottleThrowTime = 0;
let thrownBottleX = 0;
let thrownBottleY = 0;
let bossDefeatedAt = 0;
let game_finished = false;
let character_lost_at = 0;
let isHurt = false;
let currentBossIndex = 0;
let bossIsDead = false;
let gameStarted = false;
let currentBossImage = "img/boss1.png";
let bossGraphicsWalkingLeft = ["img/boss1.png", "img/boss2.png", "img/boss3.png", "img/boss4.png"]
let bossGraphicsAttacking = ["img/bossattack1.png", "img/bossattack2.png", "img/bossattack3.png", "img/bossattack4.png", "img/bossattack5.png", "img/bossattack6.png", "img/bossattack7.png", "img/bossattack8.png", "img/bossattack9.png", "img/bossattack10.png", "img/bossattack11.png", "img/bossattack12.png",
    "img/bossattack13.png", "img/bossattack14.png", "img/bossattack15.png", "img/bossattack16.png"
]
let bossWoundedGraphics = ["img/bosswounded1.png", "img/bosswounded2.png", "img/bosswounded3.png"]
let bossGraphicsDead = ["img/bossdead1.png", "img/bossdead2.png", "img/bossdead3.png"];
let bossEnergy = ["img/bossenergy/0_.png", "img/bossenergy/20_.png", "img/bossenergy/40_.png", "img/bossenergy/60_.png", "img/bossenergy/80_.png", "img/bossenergy/100_.png"]
let characterGraphicsDead = ["img/dead1.png", "img/dead2.png", "img/dead3.png", "img/dead4.png", "img/dead5.png", "img/dead6.png", "img/dead7.png"]
let bossTurning = false;
let bossIsWounded = false;
let updateIntervals = [];
let timeSinceLastBottleCollision = 1000;
let timeOfBottleCollision;
let bossAttack = false;
let characterHeight;
let characterWidth;
let isWounded = false;
let timeOfCollision = 0;
let soundIsOn = true
    //------- Game config
let JUMP_TIME = 300; // in ms
let HURT_TIME = 700;
let DEAD_TIME = 500;
let GAME_SPEED = 7;
let BOSS_POSITION_X = 4300;
let BOSS_POSITION_Y = 80;
let AUDIO_RUNNING = new Audio("audio/running.wav");
let AUDIO_JUMP = new Audio("audio/jump.mp3");
let AUDIO_BOTTLE = new Audio("audio/bottle.mp3");
let AUDIO_THROW = new Audio("audio/throw.mp3");
let AUDIO_GLASS = new Audio("audio/glass.mp3");
let AUDIO_CHICKEN = new Audio("audio/chicken.mp3");
let AUDIO_CRACK = new Audio("audio/crack.wav");
let AUDIO_HURT = new Audio("audio/hurt.wav");
let AUDIO_WIN = new Audio("audio/win.mp3");
let AUDIO_LOOSE = new Audio("audio/loose.wav")
let AUDIO_COCKSCREAM = new Audio("audio/cockScream.wav")
let AUDIO_BACKGROUND_MUSIC = new Audio("audio/mexican.mp3");
AUDIO_BACKGROUND_MUSIC.loop = true;
AUDIO_BACKGROUND_MUSIC.volume = 0.10;
const DURATION_WOUNDED_STATE = 750;
const COLLISION_ENERGY_LOSS = 20;
let BOSS_WIDTH = 350;
let BOSS_HEIGHT = 400;
let cache = {};