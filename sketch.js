// ~~~ Kitty's Cuddle Collection: JETPACK GALAXY ADVENTURE! ~~~ //
// Code for my Master~♥ Nyaa~! (Rainbow Trail code moved to rainbow.js!)
// PART 1 of 2 - Smoother Background Transitions! Nya!

// --- Version ---
const gameVersion = "v1.14m"; // This MUST match the version you intend to run

let kitty;
let plushies = [];
let score = 0;
let highScore = 0; let endlessHighScore = 0;
let currentStreak = 0; let highestStreakInSession = 0;
let totalPlushiesCollected = 0;
let lives = 3;
let gameState = 'intro'; // intro, start, playing, store, gacha, wardrobe, gameOverCutscene, gameOver
let isDragging = false;
let isEndlessMode = false;

// --- Intro & Cutscene State Variables ---
let introStep = 0; let cutsceneStep = 0; let shakeTime = 0;

// --- Difficulty & Stage Variables ---
let scorePerStage = 20;
let visualStage = 0; let previousVisualStage = 0;
let difficultyStage = 0;
let maxVisualStageIndex = 5;

let baseScrollSpeed = 1.5; let scrollSpeedIncreasePerStage = 0.6;
let basePlushieFallSpeed = 3.0; let plushieSpeedIncreasePerStage = 0.7;
let basePlushieSpawnInterval = 75; let spawnRateDecreasePerStage = 6;
let minSpawnInterval = 18;
let basePlushieDrift = 0.5; let driftIncreasePerStage = 0.3;

// --- Dynamic Difficulty Values ---
let currentScrollSpeed, currentPlushieFallSpeed, currentPlushieSpawnInterval, currentPlushieDrift;

// --- Style Settings --- (Defined using standard RGB or p5 color names)
let kittyColor, jetpackColor, plushieColors = [];
let heartColor, textColor, boomColor, sparkleColor, textBgColor;
let skyColors = [], buildingColor, cloudColor, earthColor, earthContinentColor, galaxyColor1, galaxyColor2;
let danceKittyBgColor, danceKittyColors = [];
let endlessKittyBgColor, endlessKittyColors = [];
let endlessModeButtonColor, endlessModeTextColorOn, endlessModeTextColorOff;
let backButtonColor, storeButtonColor, storeButtonTextColor, updateButtonColor, updateButtonTextColor, updateAvailableColor;
let gachaButtonColor, gachaButtonTextColor;
let wardrobeButtonColor, wardrobeButtonTextColor;
let textStrokeColor; let hudTextColorLight, hudTextColorDark;

// --- Background Transition ---
let currentBgColor; let targetBgColor; let lerpSpeed = 0.03;
let transitionStartTime = -Infinity; let transitionDuration = 90; // Frames for transition

// Background element arrays
let stars = [], buildings = [], clouds = [], galaxyParticles = [];
let earthY;

// --- Encouraging Message ---
let encouragingMessages = ["Keep Going!", "More Plushies!", "Nyaa~!", "Purrfect!", "You Got This!", "Don't Stop!", "For Master! ♥", "Faster!", "Wow!", "☆彡"];
let currentEncouragingMessage = ""; let lastDifficultyIncreaseScore = -1;

// --- SOUND VARIABLES ---
let bgMusic; let cutsceneMusic;
let userHasInteracted = false; let audioStarted = false;
let musicFadeTime = 0.5; let gameMusicVol = 0.5; let cutsceneMusicVol = 0.6;

// --- Canvas Size ---
let internalCanvasWidth = 600;

// --- Button Bounds ---
let endlessModeButton; let backButton; let storeButton; let updateButton;
let gachaButton;
let wardrobeButton;

// --- Update Check State ---
let updateButtonState = 'idle'; let updateButtonText = "Check Updates"; let updateCheckTimeout;

// --- Preload Function ---
function preload() { console.log("Preloading sound..."); bgMusic = loadSound('Skyward Whiskers.mp3', () => console.log("Skyward Whiskers loaded successfully!"), (e) => console.error("Error loading Skyward Whiskers:", e)); cutsceneMusic = loadSound('Skybound Quest.mp3', () => console.log("Skybound Quest loaded successfully!"), (e) => console.error("Error loading Skybound Quest:", e)); }

function setup() {
  try {
    let aspectRatio = windowHeight / windowWidth;
    let internalCanvasHeight = floor(internalCanvasWidth * aspectRatio);
    internalCanvasHeight = max(1, internalCanvasHeight);
    createCanvas(internalCanvasWidth, internalCanvasHeight);
    console.log(`Canvas created: ${width}x${height}, Color Mode: RGB`);
    noSmooth(); textAlign(CENTER, CENTER); textFont('monospace');

    // --- Define Colors ---
    kittyColor = color(255, 105, 180); jetpackColor = color(150); plushieColors = [ color(173, 216, 230), color(255, 223, 186), color(144, 238, 144), color(221, 160, 221) ]; heartColor = color(255, 0, 0); textColor = color(250); textBgColor = color(0, 0, 0, 165); boomColor = color(255, 50, 50); sparkleColor = color(255, 255, 0);
    skyColors = [ color(135, 206, 235), color(160, 215, 240), color(80, 130, 180), color(20, 40, 80), color(5, 5, 20) ]; buildingColor = color(50, 50, 60); cloudColor = color(255); earthColor = color(60, 120, 220); earthContinentColor = color(80, 180, 80); galaxyColor1 = color(200, 180, 255, 100); galaxyColor2 = color(255, 255, 255, 80);
    danceKittyBgColor = color(255, 235, 240); danceKittyColors = [ color(180, 255, 255, 40), color(255, 180, 255, 40), color(255, 255, 180, 40), color(180, 180, 255, 40) ];
    endlessKittyBgColor = color(230, 255, 230); endlessKittyColors = [ color(255, 180, 180, 50), color(255, 220, 180, 50), color(180, 255, 180, 50), color(220, 180, 255, 50) ];
    endlessModeButtonColor = color(100, 200, 100, 180); endlessModeTextColorOn = color(255, 255, 150); endlessModeTextColorOff = color(200);
    backButtonColor = color(200, 100, 100, 180); storeButtonColor = color(150, 150, 220, 180); storeButtonTextColor = color(255);
    gachaButtonColor = color(180, 120, 220, 180); gachaButtonTextColor = color(230);
    wardrobeButtonColor = color(120, 180, 120, 180); wardrobeButtonTextColor = color(240);
    updateButtonColor = color(80, 80, 150, 180); updateButtonTextColor = color(200); updateAvailableColor = color(200, 150, 50, 200);
    textStrokeColor = color(0, 0, 0, 150); hudTextColorLight = color(250); hudTextColorDark = color(40);

    // Initialize kitty
    kitty = { baseY: height - 160, y: height - 160, size: min(width, height) * 0.08, x: width / 2, bobOffset: 0, hasJetpack: false };
    initializeBackgroundElements(); earthY = height * 1.5;
    if (bgMusic) { bgMusic.setVolume(gameMusicVol); } if (cutsceneMusic) { cutsceneMusic.setVolume(cutsceneMusicVol); }
    try { let hs = localStorage.getItem('kittyJetpackHighScore'); if (hs) highScore = int(hs); let ehs = localStorage.getItem('kittyEndlessHighScore'); if (ehs) endlessHighScore = int(ehs); let tp = localStorage.getItem('kittyTotalPlushies'); if (tp) totalPlushiesCollected = int(tp); console.log(`Scores Loaded: N=${highScore}, E=${endlessHighScore}, T=${totalPlushiesCollected}`); } catch (e) { console.warn("LS Error:", e); }
    if (typeof loadItems === 'function') { loadItems(); } else { console.error("!!! CRITICAL: loadItems() missing!"); }
    currentEncouragingMessage = random(encouragingMessages); currentBgColor = skyColors[0]; targetBgColor = skyColors[0];
    defineButtonBounds();

  } catch (e) { console.error("!!! SETUP ERROR:", e); document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">Setup Error! Check console. ${e.message}</div>`; }
}

// --- Define Button Bounds (Side-by-Side Gacha/Wardrobe) ---
function defineButtonBounds() {
  if (width && height) {
    let endlessButtonW = width * 0.45; let endlessButtonH = height * 0.07;
    endlessModeButton = { x: width / 2 - endlessButtonW / 2, y: height * 0.50, w: endlessButtonW, h: endlessButtonH };
    let storeButtonW = width * 0.35; let storeButtonH = height * 0.06;
    storeButton = { x: width / 2 - storeButtonW / 2, y: endlessModeButton.y + endlessButtonH * 1.8, w: storeButtonW, h: storeButtonH };
    let smallButtonW = width * 0.3; let smallButtonH = height * 0.06; let buttonSpacingX = width * 0.05; let totalSmallButtonWidth = smallButtonW * 2 + buttonSpacingX; let sideBySideY = storeButton.y + storeButtonH + smallButtonH * 0.4;
    gachaButton = { x: width / 2 - totalSmallButtonWidth / 2, y: sideBySideY, w: smallButtonW, h: smallButtonH };
    wardrobeButton = { x: gachaButton.x + smallButtonW + buttonSpacingX, y: sideBySideY, w: smallButtonW, h: smallButtonH };
    let backButtonSize = min(width, height) * 0.1; backButton = { x: width - backButtonSize - 15, y: 15, w: backButtonSize, h: backButtonSize * 0.6 };
    let updateButtonW = width * 0.3; let updateButtonH = height * 0.04; updateButton = { x: width - updateButtonW - 10, y: height - updateButtonH - 10, w: updateButtonW, h: updateButtonH };

    if (typeof setupStoreLayout === 'function') { setupStoreLayout(width, height); } else { console.error("setupStoreLayout() missing!"); }
    if (typeof setupGachaLayout === 'function') { setupGachaLayout(width, height); } else { console.error("setupGachaLayout() missing!"); }
    if (typeof setupWardrobeLayout === 'function') { setupWardrobeLayout(width, height); } else { console.error("setupWardrobeLayout() missing!"); }

  } else {
    console.warn("defineButtonBounds too early."); endlessModeButton = undefined; storeButton = undefined; gachaButton = undefined; wardrobeButton = undefined; backButton = undefined; updateButton = undefined;
  }
}

// --- Music Control Function ---
function manageMusic() {
    if (!userHasInteracted || !audioStarted || !bgMusic || !cutsceneMusic) return;
    let targetGameVol = 0; let targetCutsceneVol = 0; let loopGame = false; let playCutsceneOnce = false; let restartCutscene = false;
    let isMenuState = (gameState === 'start' || gameState === 'store' || gameState === 'gacha' || gameState === 'wardrobe' || gameState === 'gameOver' || gameState === 'gameOverCutscene'); let isIntroState = (gameState === 'intro');

    if (gameState === 'playing') { targetGameVol = gameMusicVol; targetCutsceneVol = 0; loopGame = true; }
    else if (isMenuState || isIntroState) { targetGameVol = 0; targetCutsceneVol = cutsceneMusicVol; if ((isIntroState || gameState === 'gameOverCutscene') && !cutsceneMusic.isPlaying()) { playCutsceneOnce = true; } if (!isIntroState && gameState !== 'gameOverCutscene' && (lastGameState === 'playing' || isIntroState)) { restartCutscene = true; } }
    else { targetGameVol = 0; targetCutsceneVol = 0; }

    try {
        if (bgMusic.isPlaying() || bgMusic.isLooping()) { if (targetGameVol < bgMusic.getVolume()) { bgMusic.setVolume(targetGameVol, musicFadeTime); if (targetGameVol === 0) { setTimeout(() => { if (bgMusic && !bgMusic.isLooping()) bgMusic.stop(); }, musicFadeTime * 1000 + 50); } } else if (targetGameVol > bgMusic.getVolume()) { bgMusic.setVolume(targetGameVol, musicFadeTime); } if (loopGame && !bgMusic.isLooping() && targetGameVol > 0) { if (!bgMusic.isPlaying()) { bgMusic.loop(); } else { bgMusic.setLoop(true); } } else if (!loopGame && bgMusic.isLooping()) { bgMusic.setLoop(false); } }
        else if (loopGame && targetGameVol > 0) { console.log("Start Game Music loop"); bgMusic.setVolume(0); bgMusic.loop(); bgMusic.setVolume(targetGameVol, musicFadeTime); }
        if (cutsceneMusic.isPlaying()) { if (targetCutsceneVol < cutsceneMusic.getVolume()) { cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime); if (targetCutsceneVol === 0) { setTimeout(() => { if (cutsceneMusic && cutsceneMusic.isPlaying()) cutsceneMusic.stop(); }, musicFadeTime * 1000 + 50); } } else if (targetCutsceneVol > cutsceneMusic.getVolume()) { cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime); } if (restartCutscene) { console.log("Restart Menu music loop"); cutsceneMusic.stop(); } if (!isIntroState && gameState !== 'gameOverCutscene' && !cutsceneMusic.isLooping()) { cutsceneMusic.setLoop(true); } else if ((isIntroState || gameState === 'gameOverCutscene') && cutsceneMusic.isLooping()) { cutsceneMusic.setLoop(false); } }
        if ((playCutsceneOnce || restartCutscene) && targetCutsceneVol > 0 && !cutsceneMusic.isPlaying()) { console.log("Play/Restart Menu/Cutscene music"); cutsceneMusic.setVolume(0); cutsceneMusic.play(); cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime); cutsceneMusic.setLoop(!isIntroState && gameState !== 'gameOverCutscene'); }
        else if (isMenuState && !isIntroState && gameState !== 'gameOverCutscene' && targetCutsceneVol > 0 && !cutsceneMusic.isPlaying()){ console.log("Restart Menu music loop (ensure)"); cutsceneMusic.setVolume(0); cutsceneMusic.loop(); cutsceneMusic.play(); cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime); }
    } catch (e) { console.error("Music Error:", e); try { bgMusic.stop(); cutsceneMusic.stop(); } catch (e2) {} }
}

// initializeBackgroundElements (No changes)
function initializeBackgroundElements() { if(!width || !height) return; stars = []; for (let i = 0; i < 300; i++) { stars.push({ x: random(width), y: random(height * 2), size: random(1, 3.5), speedFactor: random(0.05, 0.4) }); } buildings = []; let sc0 = skyColors[0]; for (let i = 0; i < 15; i++) { let f = random() < 0.5; let h = random(height*0.1,height*(f?0.4:0.6)); let w = random(width*0.04,width*0.12); let c = lerpColor(buildingColor,sc0,f?0.7:0.4); c.setAlpha(f?160:200); buildings.push({x:random(width*1.2)-width*0.1,h:h,w:w,y:random(height*2),speedFactor:f?0.2:0.6,isRooftop:false,color:c}); } clouds = []; for (let i = 0; i < 20; i++) { clouds.push({x:random(width*1.5)-width*0.25,y:random(height*2),size:random(width*0.1,width*0.4),speedFactor:random(0.3,0.9),alpha:random(50,150)}); } galaxyParticles = []; for (let i = 0; i < 400; i++) { galaxyParticles.push({angle:random(TWO_PI),radius:random(height*0.1,width*0.8),speed:random(0.001,0.005),size:random(1,4),color:random()<0.7?galaxyColor1:galaxyColor2}); } }

// windowResized (No changes)
function windowResized() { let ar = windowHeight / windowWidth; let ich = floor(internalCanvasWidth * ar); ich = max(1, ich); resizeCanvas(internalCanvasWidth, ich); console.log(`Resized: ${width}x${height}`); if (kitty) { kitty.baseY = height - 160; kitty.y = kitty.baseY; kitty.size = min(width, height) * 0.08; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); } else { console.warn("windowResized: kitty not ready."); } initializeBackgroundElements(); earthY = height * 1.5; defineButtonBounds(); }

// draw (Calls displayWardrobe)
let lastGameState = '';
function draw() {
  try {
    let scrollSpeedForBackground = 0; previousVisualStage = visualStage; difficultyStage = floor(score / scorePerStage);
    if (isEndlessMode && (gameState === 'playing' || gameState === 'gameOverCutscene' || gameState === 'gameOver' || gameState === 'store' || gameState === 'gacha' || gameState === 'wardrobe')) { visualStage = maxVisualStageIndex; } else { visualStage = min(maxVisualStageIndex, difficultyStage); }

    let startingEndless = (gameState === 'playing' && lastGameState !== 'playing' && isEndlessMode);
    if (visualStage !== previousVisualStage && gameState === 'playing' && !startingEndless) { transitionStartTime = frameCount; console.log(`Transition start -> stage ${visualStage}`); if (visualStage < maxVisualStageIndex) { targetBgColor = skyColors[visualStage]; } else if (isEndlessMode) { targetBgColor = endlessKittyBgColor; } else { targetBgColor = danceKittyBgColor; } }
    else if (startingEndless) { console.log("Snap BG: Endless"); currentBgColor = endlessKittyBgColor; targetBgColor = endlessKittyBgColor; transitionStartTime = -Infinity; }
    else if (gameState !== 'playing') { transitionStartTime = -Infinity; if (skyColors.length > 0) { targetBgColor = skyColors[0]; if (!currentBgColor || red(currentBgColor) !== red(skyColors[0]) || green(currentBgColor) !== green(skyColors[0]) || blue(currentBgColor) !== blue(skyColors[0])) { currentBgColor = skyColors[0]; } } if(!(gameState === 'gameOver' || gameState === 'gameOverCutscene')) { visualStage = 0; } }
    else if (gameState === 'start' && previousVisualStage === 0) { if (skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; } }

    if (currentBgColor && targetBgColor) { currentBgColor = lerpColor(currentBgColor, targetBgColor, lerpSpeed); } else if (!currentBgColor && skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; }

    currentScrollSpeed = baseScrollSpeed + difficultyStage * scrollSpeedIncreasePerStage; currentPlushieFallSpeed = basePlushieFallSpeed + difficultyStage * plushieSpeedIncreasePerStage; currentPlushieSpawnInterval = max(minSpawnInterval, basePlushieSpawnInterval - difficultyStage * spawnRateDecreasePerStage); currentPlushieDrift = basePlushieDrift + difficultyStage * driftIncreasePerStage;
    let stageForScroll = (gameState === 'playing') ? visualStage : 0; scrollSpeedForBackground = (stageForScroll >= maxVisualStageIndex || gameState !== 'playing') ? 0 : currentScrollSpeed;
    if (gameState === 'start' || gameState === 'gameOver' || gameState === 'gameOverCutscene' || gameState === 'store' || gameState === 'gacha' || gameState === 'wardrobe') scrollSpeedForBackground = baseScrollSpeed * 0.2;
    if (gameState === 'intro') scrollSpeedForBackground = 0;

    if (gameState === 'playing' && score > 0 && score % scorePerStage === 0 && score !== lastDifficultyIncreaseScore) { let lm=currentEncouragingMessage; do { currentEncouragingMessage = random(encouragingMessages); } while (encouragingMessages.length > 1 && currentEncouragingMessage === lm); lastDifficultyIncreaseScore = score; console.log("Diff Up:", currentEncouragingMessage); }
    else if (score === 0 && gameState === 'playing' && lastDifficultyIncreaseScore !== -1) { lastDifficultyIncreaseScore = -1; }

    let tp = constrain(map(frameCount - transitionStartTime, 0, transitionDuration), 0, 1); let stageToDraw = (gameState === 'playing') ? visualStage : 0; let bgA = (transitionStartTime > -Infinity && frameCount < transitionStartTime + transitionDuration && gameState === 'playing') ? tp : 1.0;
    drawScrollingBackground(stageToDraw, scrollSpeedForBackground, currentBgColor, bgA, isEndlessMode); // <-- Updated Call

    if (typeof updateAndDrawRainbowTrail === 'function') { updateAndDrawRainbowTrail(scrollSpeedForBackground); }

    push(); if (shakeTime > 0) { translate(random(-6, 6), random(-6, 6)); shakeTime--; }

    if (gameState === 'intro') { displayIntro(); }
    else if (gameState === 'start') { displayStartScreen(); }
    else if (gameState === 'playing') { runGame(); }
    else if (gameState === 'store') { if (typeof displayStore === 'function') { displayStore(totalPlushiesCollected); } else { console.error("displayStore missing!"); gameState='start'; } }
    else if (gameState === 'gacha') { if (typeof displayGacha === 'function') { displayGacha(totalPlushiesCollected); } else { console.error("displayGacha missing!"); gameState='start'; } }
    else if (gameState === 'wardrobe') { if (typeof displayWardrobe === 'function') { displayWardrobe(); } else { console.error("displayWardrobe missing!"); gameState='start'; } }
    else if (gameState === 'gameOverCutscene') { displayGameOverCutscene(); }
    else if (gameState === 'gameOver') { displayGameOverScreen(); }

    manageMusic(); lastGameState = gameState;

    if (!(gameState === 'intro' && introStep < 4) && gameState !== 'store' && gameState !== 'gacha' && gameState !== 'wardrobe') { if (kitty) { if (gameState !== 'gameOverCutscene') { kitty.bobOffset = sin(frameCount*0.1)*(kitty.size*0.05); kitty.y = kitty.baseY+kitty.bobOffset; } else { kitty.y = kitty.baseY; } drawKitty(gameState === 'gameOverCutscene'); if (gameState === 'playing' && typeof getEquippedItem === 'function' && getEquippedItem('jetpack_fx') === 'jetpack_rainbow') { if (frameCount % 2 === 0 && typeof spawnRainbowParticle === 'function') { spawnRainbowParticle(); } } } }
    pop();
  } catch (e) { console.error("Draw Error:", e); noLoop(); }
}

// Separate Element Drawing Functions (No changes)
function drawStage0Elements(scrollSpeed, alphaFactor) { buildings.forEach(b => { b.y += scrollSpeed * b.speedFactor; if (b.y > height) b.y -= height * 2; let c = b.color; fill(red(c), green(c), blue(c), alpha(c) * alphaFactor); rect(b.x, b.y, b.w, b.h); }); }
function drawStage1Elements(scrollSpeed, alphaFactor) { buildings.forEach(b => { if (!b.isRooftop) { b.h = random(height*0.05, height*0.15); b.isRooftop = true; } b.y += scrollSpeed * (b.speedFactor + 0.2); if (b.y > height) b.y -= height * 2; let c = b.color; let ba = max(0, alpha(c) - 100); fill(red(c), green(c), blue(c), ba * alphaFactor); if (ba * alphaFactor > 1) rect(b.x, b.y, b.w, b.h); }); clouds.forEach(c => { c.y += scrollSpeed * c.speedFactor; if (c.y > height) c.y -= height * 2; fill(red(cloudColor), green(cloudColor), blue(cloudColor), c.alpha * alphaFactor); ellipse(c.x, c.y, c.size*1.2, c.size*0.8); ellipse(c.x+c.size*0.3, c.y+c.size*0.1, c.size, c.size*0.7); ellipse(c.x-c.size*0.3, c.y+c.size*0.1, c.size*0.9, c.size*0.6); }); }
function drawStage2Elements(scrollSpeed, alphaFactor) { clouds.forEach(c => { c.y += scrollSpeed * c.speedFactor; if (c.y > height) c.y -= height * 2; let ba = max(0, c.alpha - 80); fill(red(cloudColor), green(cloudColor), blue(cloudColor), ba * alphaFactor); if (ba * alphaFactor > 1) { ellipse(c.x, c.y, c.size*1.2, c.size*0.8); ellipse(c.x+c.size*0.3, c.y+c.size*0.1, c.size, c.size*0.7); ellipse(c.x-c.size*0.3, c.y+c.size*0.1, c.size*0.9, c.size*0.6); } }); stars.slice(0, 100).forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height * 2; let f = map(sin(frameCount*0.08 + s.x), -1, 1, 0.6, 1.2); fill(255, 255, 255, map(s.speedFactor, 0.1, 0.5, 50, 150) * alphaFactor); ellipse(s.x, s.y, s.size*f*0.8, s.size*f*0.8); }); fill(red(earthColor), green(earthColor), blue(earthColor), 255*alphaFactor); arc(width/2, height*1.5, width*2, height*2, PI, TWO_PI); }
function drawStage3Elements(scrollSpeed, alphaFactor) { earthY += scrollSpeed * 0.1; if (earthY > height*1.8) earthY -= height*2.5; fill(red(earthColor), green(earthColor), blue(earthColor), 255*alphaFactor); ellipse(width/2, earthY, width*1.6, width*1.6); fill(red(earthContinentColor), green(earthContinentColor), blue(earthContinentColor), 255*alphaFactor); ellipse(width*0.4, earthY-width*0.15, width*0.35, width*0.25); ellipse(width*0.65, earthY+width*0.2, width*0.45, width*0.3); stars.forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height*2; let f = map(sin(frameCount*0.1 + s.x), -1, 1, 0.7, 1.3); fill(255, 255, 255, map(s.speedFactor, 0.05, 0.4, 150, 255) * alphaFactor); ellipse(s.x, s.y, s.size*f, s.size*f); }); }
function drawStage4Elements(scrollSpeed, alphaFactor) { stars.forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height*2; let f = map(sin(frameCount*0.1 + s.x + 50), -1, 1, 0.8, 1.4); fill(255, 255, 255, map(s.speedFactor, 0.05, 0.4, 180, 255) * alphaFactor); ellipse(s.x, s.y, s.size*f, s.size*f); }); push(); translate(width/2, height/2); rotate(frameCount*0.001); galaxyParticles.forEach(p => { p.angle += p.speed; let x = cos(p.angle)*p.radius; let y = sin(p.angle)*p.radius*0.3; let f = random(0.5, 1.5); let ba = alpha(p.color); fill(red(p.color), green(p.color), blue(p.color), ba*f*0.8*alphaFactor); ellipse(x, y, p.size*f, p.size*f); }); pop(); }
function drawStage5Elements(alphaFactor, isEndless) { let ks = 40; let sp = ks*1.5; let cols = ceil(width/sp); let rows = ceil(height/sp); let colors = isEndless ? endlessKittyColors : danceKittyColors; noStroke(); for (let i=0; i<cols; i++) { for (let j=0; j<rows; j++) { let x = i*sp + sp/2; let y = j*sp + sp/2; let wx = sin(frameCount*0.1 + i*0.5 + j*0.3)*3; let wy = cos(frameCount*0.1 + i*0.3 + j*0.5)*2; let ki = (i+j) % colors.length; let c = colors[ki]; fill(red(c), green(c), blue(c), alpha(c)*alphaFactor); rectMode(CENTER); rect(x+wx, y+wy, ks*0.6, ks*0.6); triangle(x+wx-ks*0.3, y+wy-ks*0.3, x+wx-ks*0.3, y+wy-ks*0.5, x+wx-ks*0.1, y+wy-ks*0.3); triangle(x+wx+ks*0.3, y+wy-ks*0.3, x+wx+ks*0.3, y+wy-ks*0.5, x+wx+ks*0.1, y+wy-ks*0.3); } } if (currentEncouragingMessage !== "") { fill(255, 255, 255, 60*alphaFactor); textSize(min(width, height)*0.15); textAlign(CENTER, CENTER); text(currentEncouragingMessage, width/2, height/2); } rectMode(CORNER); }

// drawScrollingBackground (IMPROVED CROSS-FADE!)
function drawScrollingBackground(currentStageIndex, scrollSpeed, bgColor, transitionProgress, isEndless) {
    rectMode(CORNER); noStroke(); background(bgColor);
    let drawFuncs = [drawStage0Elements, drawStage1Elements, drawStage2Elements, drawStage3Elements, drawStage4Elements, drawStage5Elements];
    let prevStageIndex = constrain(floor(previousVisualStage), 0, maxVisualStageIndex);
    let currStageIndex = constrain(floor(currentStageIndex), 0, maxVisualStageIndex);
    let isTransitioning = (transitionProgress < 1.0 && transitionProgress > 0 && transitionStartTime > -Infinity && gameState === 'playing');

    if (isTransitioning && prevStageIndex < maxVisualStageIndex) { // Cross-fade previous scrolling stage elements
        if (drawFuncs[prevStageIndex]) {
            let alphaOut = 1.0 - transitionProgress;
            // console.log(`Draw Prev ${prevStageIndex} alpha ${alphaOut.toFixed(2)}`);
            if (prevStageIndex !== 5) { drawFuncs[prevStageIndex](scrollSpeed, alphaOut); } // Should not be 5 here, but check
        }
         if (drawFuncs[currStageIndex]) {
             let alphaIn = transitionProgress;
             // console.log(`Draw Curr ${currStageIndex} alpha ${alphaIn.toFixed(2)}`);
             if (currStageIndex === 5) { drawFuncs[currStageIndex](alphaIn, isEndless); }
             else { drawFuncs[currStageIndex](scrollSpeed, alphaIn); }
         }
    } else { // Not transitioning OR transitioning *to* Stage 5
         if (drawFuncs[currStageIndex]) {
             let alpha = (transitionProgress < 1.0 && transitionStartTime > -Infinity && gameState === 'playing') ? transitionProgress : 1.0;
             // console.log(`Draw Only ${currStageIndex} alpha ${alpha.toFixed(2)}`);
             if (currStageIndex === 5) { drawFuncs[currStageIndex](alpha, isEndless); }
             else { drawFuncs[currStageIndex](scrollSpeed, alpha); }
         } else { console.warn(`Draw function missing: ${currStageIndex}`); background(50); }
    }
}

// Gameplay Loop (No changes)
function runGame() { if(!kitty) return; kitty.x = constrain(kitty.x, kitty.size/2, width-kitty.size/2); if (frameCount % floor(currentPlushieSpawnInterval) === 0) { spawnPlushie(); } for (let i=plushies.length-1; i>=0; i--) { let p=plushies[i]; p.y += currentScrollSpeed + currentPlushieFallSpeed*(height/600); p.x += p.dx; if (p.x<p.size/2 || p.x>width-p.size/2) { p.dx*=-0.9; p.x=constrain(p.x,p.size/2,width-p.size/2); } drawPlushie(p); if (checkCollision(kitty, p)) { score++; totalPlushiesCollected++; if (isEndlessMode) { currentStreak++; highestStreakInSession=max(highestStreakInSession,currentStreak); } plushies.splice(i, 1); } else if (p.y>height+p.size) { plushies.splice(i, 1); if (isEndlessMode) { console.log(`Endless Miss! Streak ${currentStreak} broken.`); score=0; difficultyStage=0; currentStreak=0; lastDifficultyIncreaseScore=-1; } else { lives--; console.log(`Life lost! ${lives} left.`); if (lives<=0) { isDragging=false; if (score>highScore) { highScore=score; try {localStorage.setItem('kittyJetpackHighScore', highScore); console.log("New HS saved!", highScore);} catch(e){console.warn("HS save fail:",e);}} try {localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected);} catch(e){console.warn("TP save fail:",e);} if (visualStage===maxVisualStageIndex && !isEndlessMode) { gameState='gameOverCutscene'; cutsceneStep=0; console.log("Start GO Cutscene!");} else { gameState='gameOver';}}}}} displayHUD(); }

// --- Screen Displays ---

// Intro Display (No changes)
function displayIntro() { let lineY = height*0.2; let ls = min(width,height)*0.05; let bts = ls*0.7; let tbh = 0; let tbw = width*0.85; let bcy = height*0.45; if(introStep<=1)tbh=ls*2.5; else if(introStep===2)tbh=ls*4; else if(introStep===3)tbh=ls*2.5; else if(introStep===4)tbh=ls*4; else if(introStep===5)tbh=ls*4.5; else if(introStep===6)tbh=ls*4.5; else if(introStep===7)tbh=ls*4; else if(introStep===8)tbh=ls*4.5; else if(introStep===9)tbh=ls*4; else if(introStep===10)tbh=ls*4.5; else if(introStep===11)tbh=ls*3.5; else tbh=ls*3; fill(textBgColor); rectMode(CENTER); rect(width/2,bcy,tbw,tbh,15); fill(textColor); textSize(bts); let cly = bcy-tbh/2+ls; if(introStep===0){text("Zzzzzz... purrrr...",width/2,cly);} else if(introStep===1){text("Zzzzzz...",width/2,cly); text("Suddenly, next door...",width/2,cly+ls);} else if(introStep===2){text("Suddenly...",width/2,cly); textSize(bts*1.8); fill(boomColor); text("*** KABLOOOOOOM!!! ***",width/2,cly+ls*1.5); textSize(bts); fill(textColor);} else if(introStep===3){text("NYA?! THAT BLAST AGAIN! Kana, you IDIOT!",width/2,cly);} else if(introStep===4){text("The whole house is shaking!",width/2,cly); text("The ceiling--! It's collapsing!",width/2,cly+ls);} else if(introStep===5){text("EEK! Gotta get out!",width/2,cly); text("But... wait...",width/2,cly+ls); text("What's that gleaming in the rubble?!",width/2,cly+ls*2);} else if(introStep===6){text("What's that gleaming?!",width/2,cly); textSize(bts*1.2); fill(sparkleColor); text("✨ A... JETPACK?! ✨",width/2,cly+ls*1.2); textSize(bts); fill(textColor); text("And it fits purrfectly!",width/2,cly+ls*2.4);} else if(introStep===7){text("Who cares where it came from!",width/2,cly); textSize(bts*1.4); text("WHOOSH! Up we go!",width/2,cly+ls*1.5); textSize(bts);} else if(introStep===8){text("WHOA! Flying!",width/2,cly); text("But... OH NO!",width/2,cly+ls); text("Explosion scattered plushies EVERYWHERE!",width/2,cly+ls*2);} else if(introStep===9){text("They're floating all around!",width/2,cly); text("Gotta grab 'em while we fly!",width/2,cly+ls);} else if(introStep===10){text("Gotta grab 'em!",width/2,cly); textSize(bts*1.2); text("They're MINE!",width/2,cly+ls); textSize(bts*0.9); fill(kittyColor); text("...OURS, Master! OURS! ♥",width/2,cly+ls*2); fill(textColor); textSize(bts);} else if(introStep===11){text("Use your finger to drag me left and right!",width/2,cly); text("Catch every single one!",width/2,cly+ls);} else if(introStep===12){text("Catch every single one!",width/2,cly); textSize(bts*0.8); text("(Tap screen to start the ascent!)",width/2,cly+ls);} if(introStep<12){textSize(bts*0.7); fill(200); text("[Tap to continue]",width/2,height-ls*0.7);} rectMode(CORNER); }

// END OF PART 1
// PART 2 of 2 - Smoother Background Transitions! Nya!

// Start Screen (Side-by-Side Gacha/Wardrobe)
function displayStartScreen() {
  fill(textColor); stroke(textStrokeColor); strokeWeight(2.5);
  let titleSize = min(width, height) * 0.095; let instructionSize = titleSize * 0.5; let masterSize = instructionSize * 1.1; let tapSize = instructionSize * 0.85; let highScoreSize = tapSize * 0.90; let totalPlushieSize = highScoreSize * 0.9; let buttonTextSize = instructionSize * 0.75; let updateButtonTextSize = buttonTextSize * 0.8; let versionTextSize = updateButtonTextSize * 0.7; let lineSpacingFactor = 1.2;
  textSize(titleSize); text("Kitty's Cuddle", width / 2, height * 0.18); text("Collection~♥", width / 2, height * 0.18 + titleSize * lineSpacingFactor);
  let instructionY = height * 0.18 + titleSize * lineSpacingFactor * 2.2;
  textSize(instructionSize); text("Ready for Liftoff?", width / 2, instructionY); instructionY += instructionSize * lineSpacingFactor; text("DRAG me left/right", width / 2, instructionY); instructionY += instructionSize * lineSpacingFactor * 0.9; text("to catch plushies,", width/2, instructionY); instructionY += instructionSize * lineSpacingFactor * 1.3; fill(kittyColor); textSize(masterSize); stroke(textStrokeColor); strokeWeight(2.5); text("Master~!", width/2, instructionY); instructionY += masterSize * lineSpacingFactor * 1.2;

  // --- Endless Button ---
  if (endlessModeButton) { endlessModeButton.y = instructionY; rectMode(CORNER); fill(endlessModeButtonColor); noStroke(); rect(endlessModeButton.x, endlessModeButton.y, endlessModeButton.w, endlessModeButton.h, 5); textSize(buttonTextSize); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); if (isEndlessMode) { fill(endlessModeTextColorOn); text("Endless Mode: ON", endlessModeButton.x + endlessModeButton.w / 2, endlessModeButton.y + endlessModeButton.h / 2); } else { fill(endlessModeTextColorOff); text("Endless Mode: OFF", endlessModeButton.x + endlessModeButton.w / 2, endlessModeButton.y + endlessModeButton.h / 2); } instructionY += endlessModeButton.h * 1.2; if (isEndlessMode) { noStroke(); fill(200); textSize(buttonTextSize * 0.8); text("(Score/Speed resets on Miss)", width / 2, instructionY); instructionY += buttonTextSize * 0.8 * lineSpacingFactor; } }

  // --- Store Button ---
  if (storeButton) { storeButton.y = instructionY; rectMode(CORNER); fill(storeButtonColor); noStroke(); rect(storeButton.x, storeButton.y, storeButton.w, storeButton.h, 5); textSize(buttonTextSize * 0.9); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); fill(storeButtonTextColor); text("Store", storeButton.x + storeButton.w / 2, storeButton.y + storeButton.h / 2); instructionY += storeButton.h * 1.5; }

  // --- Gacha & Wardrobe Buttons (Side-by-Side) ---
  let sideBySideButtonTextSize = buttonTextSize * 0.85; let sideBySideYPos = instructionY;
  if (gachaButton) { gachaButton.y = sideBySideYPos; rectMode(CORNER); fill(gachaButtonColor); noStroke(); rect(gachaButton.x, gachaButton.y, gachaButton.w, gachaButton.h, 5); textSize(sideBySideButtonTextSize); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); fill(gachaButtonTextColor); text("Gacha", gachaButton.x + gachaButton.w / 2, gachaButton.y + gachaButton.h / 2); }
  if (wardrobeButton) { wardrobeButton.y = sideBySideYPos; rectMode(CORNER); fill(wardrobeButtonColor); noStroke(); rect(wardrobeButton.x, wardrobeButton.y, wardrobeButton.w, wardrobeButton.h, 5); textSize(sideBySideButtonTextSize); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); fill(wardrobeButtonTextColor); text("Wardrobe", wardrobeButton.x + wardrobeButton.w / 2, wardrobeButton.y + wardrobeButton.h / 2); }
  if (gachaButton || wardrobeButton) { instructionY += (gachaButton ? gachaButton.h : wardrobeButton.h) * 1.5; }

  // --- Tap to Fly Text ---
  fill(textColor); textSize(tapSize); strokeWeight(2); if (frameCount % 60 < 40) { text("Tap Here or Above to FLY!", width / 2, instructionY); } instructionY += tapSize * lineSpacingFactor * 1.5;

  // --- High Scores ---
  textSize(highScoreSize); fill(200); stroke(textStrokeColor); strokeWeight(2); text(`Normal High Score: ${highScore}`, width/2, instructionY); instructionY += highScoreSize * lineSpacingFactor; text(`Endless Streak High Score: ${endlessHighScore}`, width/2, instructionY); instructionY += highScoreSize * lineSpacingFactor; textSize(totalPlushieSize); text(`Total Plushies Collected: ${totalPlushiesCollected}`, width/2, instructionY);

  // --- Update Button ---
  if (updateButton) { let c = updateButtonColor; let tc = updateButtonTextColor; if (updateButtonState === 'checking') { c = color(150, 150, 80); tc = color(50); } else if (updateButtonState === 'available') { c = updateAvailableColor; tc = color(0); } else if (updateButtonState === 'uptodate' || updateButtonState === 'error') { c = color(100); tc = color(180); } rectMode(CORNER); fill(c); noStroke(); rect(updateButton.x, updateButton.y, updateButton.w, updateButton.h, 5); fill(tc); stroke(textStrokeColor); strokeWeight(1); textSize(updateButtonTextSize); textAlign(CENTER, CENTER); text(updateButtonText, updateButton.x + updateButton.w / 2, updateButton.y + updateButton.h / 2); }

  // --- Version Text ---
  textSize(versionTextSize); fill(150); noStroke(); textAlign(LEFT, BOTTOM); text(gameVersion, 5, height - 5); noStroke(); textAlign(CENTER, CENTER);
}

// Game Over Cutscene Display (No changes)
function displayGameOverCutscene() { let lineY = height * 0.2; let ls = min(width, height) * 0.05; let bts = ls * 0.7; let tbh = 0; let tbw = width * 0.85; let bcy = height * 0.45; if (cutsceneStep <= 1) tbh = ls * 2.5; else if (cutsceneStep === 2) tbh = ls * 3.5; else if (cutsceneStep === 3) tbh = ls * 2.5; else if (cutsceneStep === 4) tbh = ls * 4; else if (cutsceneStep === 5) tbh = ls * 2.5; else tbh = ls * 3; fill(textBgColor); rectMode(CENTER); rect(width / 2, bcy, tbw, tbh, 15); fill(textColor); textSize(bts); let cly = bcy - tbh / 2 + ls; if (cutsceneStep === 0) { text("*Phew...*", width / 2, cly); text("That was a LOT of plushies...", width / 2, cly + ls); } else if (cutsceneStep === 1) { text("I think... I think I got them all...?", width / 2, cly); text("(Finally... peace and quiet...)", width / 2, cly + ls); } else if (cutsceneStep === 2) { text("Wait... what's that noise?", width / 2, cly); text("*Clatter! Crash!*", width / 2, cly + ls); text("Oh no... not AGAIN!", width / 2, cly + ls * 2); } else if (cutsceneStep === 3) { text("KANA! DON'T TOUCH THAT--!", width / 2, cly + ls); if(shakeTime <= 0) shakeTime = 15; } else if (cutsceneStep === 4) { textSize(bts * 1.8); fill(boomColor); text("*** KABOOOOOOM!!! ***", width / 2, cly + ls * 1.5); textSize(bts); fill(textColor); for(let i=0; i<5; i++) { fill(random(plushieColors)); rect(random(width), random(height*0.6, height), 15, 15); } } else if (cutsceneStep === 5) { text("NYAAAAAAAAA!", width / 2, cly); text("They're everywhere AGAIN!", width / 2, cly + ls); } else if (cutsceneStep === 6) { text("They're everywhere AGAIN!", width / 2, cly); textSize(bts * 0.8); text("(Tap to see your score... *sigh*)", width / 2, cly + ls); } if (cutsceneStep < 6) { textSize(bts * 0.7); fill(200); text("[Tap to continue]", width / 2, height - ls * 0.7); } rectMode(CORNER); }
// Game Over Screen (No changes)
function displayGameOverScreen() { fill(textColor); let gos = min(width,height)*0.09; let ms = gos*0.55; let ss = ms*0.9; let rs = ss*0.8; let lsf = 1.3; let ems = rs*0.9; textSize(gos); let cy = height*0.15; let fdsn = difficultyStage+1; if(!isEndlessMode){if(visualStage>=maxVisualStageIndex){text("KITTY OVERLOAD!",width/2,cy); cy+=gos*lsf; textSize(ms); text(`You got ${score} adorable plushies!`,width/2,cy); cy+=ms*lsf; text(`Survived until Difficulty ${fdsn}!`,width/2,cy); cy+=ms*lsf; text("Truly Purrfect, Master!",width/2,cy); cy+=ms*lsf; fill(kittyColor); text("Our infinite hoard thanks you~♥",width/2,cy);} else {text("Grounded!",width/2,cy); cy+=gos*lsf; textSize(ms); text(`${score} plushies? Pathetic!`,width/2,cy); cy+=ms*lsf; text(`Only reached Stage ${visualStage+1}... Need more!`,width/2,cy); cy+=ms*lsf; text("Need more practice, hmph!",width/2,cy); cy+=ms*lsf; fill(150,0,0); text("*Pouty Jetpack Sputters*",width/2,cy);}} else {text("Endless Flight Over!",width/2,cy); cy+=gos*lsf; textSize(ms); text(`Final Streak: ${highestStreakInSession}`,width/2,cy); cy+=ms*lsf*1.5; text("Ready for another run?",width/2,cy);} cy+=ms*lsf*1.2; textSize(ss*0.9); fill(200); text(`(Normal High Score: ${highScore})`,width/2,cy); cy+=ss*1.3; text(`(Endless Streak High Score: ${endlessHighScore})`,width/2,cy); if(isEndlessMode){textSize(ems); fill(endlessModeTextColorOn); cy+=ss*1.3; text("(Endless Mode - Score Not Saved for Normal High Score)",width/2,cy);} fill(textColor); textSize(rs); if(frameCount%60<40){text("Tap Anywhere to Fly Again!",width/2,height*0.88);} }
// HUD Display (No changes)
function displayHUD() { let hts=min(width,height)*0.04; let hs=hts*1.3; let bts=hts*0.9; let brts=hts*1.1; let chtc=hudTextColorLight; if(visualStage===maxVisualStageIndex&&isEndlessMode){chtc=hudTextColorDark;} fill(chtc); stroke(textStrokeColor); strokeWeight(1.5); textSize(hts); textAlign(LEFT,TOP); let ly=15; let lsp=hts*1.3; text(`Plushies: ${score}`,15,ly); ly+=lsp; text(`Difficulty: ${difficultyStage+1}`,15,ly); ly+=lsp; if(isEndlessMode){fill(endlessModeTextColorOff); textSize(hts); text(`Best Run: `,15,ly); fill(endlessModeTextColorOn); textSize(brts); text(`${highestStreakInSession}`,15+textWidth("Best Run: "),ly); ly+=lsp; fill(endlessModeTextColorOn); textSize(brts); text(`Streak: ${currentStreak}`,15,ly);} else {textAlign(RIGHT,TOP); let h=''; for(let i=0; i<lives; i++){h+='♥ ';} fill(heartColor); textSize(hs); noStroke(); text(h,width-15,10);} if(gameState==='playing'&&isEndlessMode&&backButton){rectMode(CORNER); fill(backButtonColor); noStroke(); rect(backButton.x,backButton.y,backButton.w,backButton.h,3); fill(textColor); stroke(textStrokeColor); strokeWeight(1.5); textSize(bts); textAlign(CENTER,CENTER); text("Back",backButton.x+backButton.w/2,backButton.y+backButton.h/2);} textAlign(CENTER,CENTER); noStroke(); }

// --- Helper Functions ---
function spawnPlushie() { if(!kitty) return; let ps = kitty.size * 0.8; let sx = random(ps, width - ps); let p = { x: sx, y: -ps, size: ps, color: random(plushieColors), dx: random(-currentPlushieDrift, currentPlushieDrift) }; plushies.push(p); }
function drawKitty(inCutscene = false) { if(!kitty) return; let db = false; if (typeof getEquippedItem === 'function') { if (getEquippedItem('kitty_accessory') === 'kitty_bow_pink') { db = true; } } if (kitty.hasJetpack) { rectMode(CENTER); fill(jetpackColor); stroke(50); strokeWeight(max(1, kitty.size*0.03)); rect(kitty.x, kitty.y+kitty.size*0.1, kitty.size*0.6, kitty.size*0.7, kitty.size*0.1); rect(kitty.x-kitty.size*0.2, kitty.y+kitty.size*0.4, kitty.size*0.15, kitty.size*0.2); rect(kitty.x+kitty.size*0.2, kitty.y+kitty.size*0.4, kitty.size*0.15, kitty.size*0.2); if (!inCutscene || cutsceneStep < 3 || cutsceneStep > 4) { let fs = kitty.size * map(abs(kitty.bobOffset), 0, kitty.size*0.05, 0.3, 0.6) * random(0.8, 1.2); if (!(typeof getEquippedItem === 'function' && getEquippedItem('jetpack_fx') === 'jetpack_rainbow')){ fill(255, random(150, 200), 0, 200); noStroke(); triangle(kitty.x-kitty.size*0.2, kitty.y+kitty.size*0.5, kitty.x-kitty.size*0.2-fs*0.3, kitty.y+kitty.size*0.5+fs, kitty.x-kitty.size*0.2+fs*0.3, kitty.y+kitty.size*0.5+fs); triangle(kitty.x+kitty.size*0.2, kitty.y+kitty.size*0.5, kitty.x+kitty.size*0.2-fs*0.3, kitty.y+kitty.size*0.5+fs, kitty.x+kitty.size*0.2+fs*0.3, kitty.y+kitty.size*0.5+fs); } } } fill(kittyColor); stroke(50); strokeWeight(max(1, kitty.size*0.05)); rectMode(CENTER); rect(kitty.x, kitty.y, kitty.size, kitty.size); let es = kitty.size*0.4; let eo = kitty.size*0.1; triangle(kitty.x-kitty.size/2+eo, kitty.y-kitty.size/2, kitty.x-kitty.size/2+eo, kitty.y-kitty.size/2-es, kitty.x-eo, kitty.y-kitty.size/2); triangle(kitty.x+kitty.size/2-eo, kitty.y-kitty.size/2, kitty.x+kitty.size/2-eo, kitty.y-kitty.size/2-es, kitty.x+eo, kitty.y-kitty.size/2); strokeWeight(max(2, kitty.size*0.1)); line(kitty.x+kitty.size/2, kitty.y, kitty.x+kitty.size*0.8, kitty.y-kitty.size*0.2); let eyeSize = kitty.size*0.1; fill(40); noStroke(); ellipse(kitty.x-kitty.size*0.2, kitty.y-kitty.size*0.1, eyeSize, eyeSize); ellipse(kitty.x+kitty.size*0.2, kitty.y-kitty.size*0.1, eyeSize, eyeSize); if(db){ let bs = kitty.size*0.3; fill(255, 100, 150); stroke(50); strokeWeight(1); let bx = kitty.x; let by = kitty.y - kitty.size*0.5; triangle(bx-bs, by, bx, by-bs*0.4, bx, by+bs*0.4); triangle(bx+bs, by, bx, by-bs*0.4, bx, by+bs*0.4); } rectMode(CORNER); noStroke(); }
function drawStaticKitty(x, y, size) { let db = false; if (typeof getEquippedItem === 'function') { if (getEquippedItem('kitty_accessory') === 'kitty_bow_pink') { db = true; } } fill(kittyColor); stroke(50); strokeWeight(max(1, size*0.05)); rectMode(CENTER); rect(x, y, size, size); let es = size*0.4; let eo = size*0.1; triangle(x-size/2+eo, y-size/2, x-size/2+eo, y-size/2-es, x-eo, y-size/2); triangle(x+size/2-eo, y-size/2, x+size/2-eo, y-size/2-es, x+eo, y-size/2); strokeWeight(max(2, size*0.1)); line(x+size/2, y, x+size*0.8, y-size*0.2); let eyeSize = size*0.1; fill(40); noStroke(); ellipse(x-size*0.2, y-size*0.1, eyeSize, eyeSize); ellipse(x+size*0.2, y-size*0.1, eyeSize, eyeSize); if(db){ let bs = size*0.3; fill(255, 100, 150); stroke(50); strokeWeight(1); let bx = x; let by = y - size*0.5; triangle(bx-bs, by, bx, by-bs*0.4, bx, by+bs*0.4); triangle(bx+bs, by, bx, by-bs*0.4, bx, by+bs*0.4); } rectMode(CORNER); noStroke(); }
function drawPlushie(p) { fill(p.color); stroke(50); strokeWeight(max(1, p.size * 0.04)); rectMode(CENTER); rect(p.x, p.y, p.size, p.size); let eyeSize = p.size * 0.1; fill(40); ellipse(p.x - p.size * 0.2, p.y - p.size * 0.1, eyeSize, eyeSize); ellipse(p.x + p.size * 0.2, p.y - p.size * 0.1, eyeSize, eyeSize); rectMode(CORNER); noStroke(); }
function checkCollision(player, obj) { if(!player || !obj) return false; let kl=player.x-player.size/2, kr=player.x+player.size/2, kt=player.y-player.size/2, kb=player.y+player.size/2; let pl=obj.x-obj.size/2, pr=obj.x+obj.size/2, pt=obj.y-obj.size/2, pb=obj.y+obj.size/2; let noOverlap = kl>pr || kr<pl || kt>pb || kb<pt; return !noOverlap; }
function isPointInKitty(px, py) { if(!kitty) return false; let b=kitty.size*0.5; let kl=kitty.x-kitty.size/2-b, kr=kitty.x+kitty.size/2+b, kt=kitty.y-kitty.size/2-b, kb=kitty.y+kitty.size/2+b; return px>=kl&&px<=kr&&py>=kt&&py<=kb; }

// --- Input Handling --- (Added Wardrobe State)
function handlePressStart() {
  if (!userHasInteracted) { userHasInteracted = true; userStartAudio().then(() => { console.log("Audio ready!"); audioStarted = true; }, (e) => { console.error("Audio fail:", e); audioStarted = false; }); }
  let pressX = mouseX; let pressY = mouseY; try { if (touches.length > 0 && touches[0]) { pressX = touches[0].x; pressY = touches[0].y; } } catch(e) { console.warn("Touch Error:", e); return; }
  let ebDef = !!endlessModeButton; let sbDef = !!storeButton; let gbDef = !!gachaButton; let wbDef = !!wardrobeButton; let bbDef = !!backButton; let ubDef = !!updateButton;

  if (gameState === 'playing' && isEndlessMode && bbDef) { if (pressX >= backButton.x && pressX <= backButton.x+backButton.w && pressY >= backButton.y && pressY <= backButton.y+backButton.h) { console.log("Back!"); if (highestStreakInSession > endlessHighScore) { endlessHighScore = highestStreakInSession; try { localStorage.setItem('kittyEndlessHighScore', endlessHighScore); console.log("New EHS:", endlessHighScore); } catch(e){ console.warn("EHS save fail:", e); } } try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("TP save fail:", e); } gameState = 'start'; resetGame(); return; } }
  if (gameState === 'start') { if (ubDef && pressX >= updateButton.x && pressX <= updateButton.x+updateButton.w && pressY >= updateButton.y && pressY <= updateButton.y+updateButton.h) { if (updateButtonState === 'idle' || updateButtonState === 'uptodate' || updateButtonState === 'error') { checkVersion(); } else if (updateButtonState === 'available') { console.log("Reloading..."); window.location.reload(true); } return; } if (ebDef && pressX >= endlessModeButton.x && pressX <= endlessModeButton.x+endlessModeButton.w && pressY >= endlessModeButton.y && pressY <= endlessModeButton.y+endlessModeButton.h) { isEndlessMode = !isEndlessMode; console.log("Endless:", isEndlessMode); return; } if (sbDef && pressX >= storeButton.x && pressX <= storeButton.x+storeButton.w && pressY >= storeButton.y && pressY <= storeButton.y+storeButton.h) { console.log("Enter store..."); gameState = 'store'; return; } if (gbDef && pressX >= gachaButton.x && pressX <= gachaButton.x+gachaButton.w && pressY >= gachaButton.y && pressY <= gachaButton.y+gachaButton.h) { console.log("Enter Gacha..."); gameState = 'gacha'; return; } if (wbDef && pressX >= wardrobeButton.x && pressX <= wardrobeButton.x+wardrobeButton.w && pressY >= wardrobeButton.y && pressY <= wardrobeButton.y+wardrobeButton.h) { console.log("Enter Wardrobe..."); gameState = 'wardrobe'; return; } kitty.hasJetpack = true; resetGame(); gameState = 'playing'; return; }
  else if (gameState === 'store') { if (typeof handleStoreInput === 'function') { let cost = handleStoreInput(pressX, pressY, totalPlushiesCollected); if (typeof cost === 'number' && cost > 0) { totalPlushiesCollected -= cost; try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("TP save fail (store):", e); } } } else { console.warn("handleStoreInput missing!"); gameState = 'start'; } return; }
  else if (gameState === 'gacha') { if (typeof handleGachaInput === 'function' && typeof GACHA_COST !== 'undefined') { let action = handleGachaInput(pressX, pressY, totalPlushiesCollected); if (action === 'start_pull' && GACHA_COST > 0) { console.log(`Deduct ${GACHA_COST} TP.`); totalPlushiesCollected -= GACHA_COST; try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("TP save fail (gacha):", e); } } } else { console.warn("handleGachaInput/GACHA_COST missing!"); gameState = 'start'; } return; }
  else if (gameState === 'wardrobe') { if (typeof handleWardrobeInput === 'function') { handleWardrobeInput(pressX, pressY); } else { console.warn("handleWardrobeInput missing!"); gameState = 'start'; } return; }
  else if (gameState === 'intro') { if (introStep < 12) { if (introStep === 1) { shakeTime = 15; } else if (introStep === 5) { kitty.hasJetpack = true; } else { shakeTime = 0; } introStep++; } else { gameState = 'start'; } }
  else if (gameState === 'gameOverCutscene') { if (cutsceneStep < 6) { if (cutsceneStep === 2) { shakeTime = 15; } else if (cutsceneStep === 3) { shakeTime = 15;} else { shakeTime = 0; } cutsceneStep++; } else { gameState = 'gameOver'; } }
  else if (gameState === 'gameOver') { gameState = 'start'; }
  else if (gameState === 'playing') { if (pressX !== undefined && kitty && isPointInKitty(pressX, pressY)) { isDragging = true; } }
}

// --- Version Check Function --- (No changes)
function checkVersion() { if(updateButtonState === 'checking') return; console.log("Checking version..."); updateButtonState = 'checking'; updateButtonText = "Checking..."; clearTimeout(updateCheckTimeout); const vUrl='version.json'; fetch(vUrl+'?t='+Date.now()).then(r=>{if(!r.ok){throw new Error(`HTTP ${r.status}`);}return r.json();}).then(d=>{if(d&&d.version){console.log(`Ver:${gameVersion}, Latest:${d.version}`); if(d.version!==gameVersion){console.log("Update!"); updateButtonState='available'; updateButtonText="Update Found!";} else {console.log("Up to date!"); updateButtonState='uptodate'; updateButtonText="Up to Date! ♡"; updateCheckTimeout=setTimeout(()=>{updateButtonState='idle'; updateButtonText="Check Updates";},3000);}} else {throw new Error("Invalid data");}}).catch(e=>{console.error("Version check fail:",e); updateButtonState='error'; updateButtonText="Check Failed :("; updateCheckTimeout=setTimeout(()=>{updateButtonState='idle'; updateButtonText="Check Updates";},5000);}); }

// Standard p5 mouse/touch listeners (No changes)
function mousePressed() { handlePressStart(); if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) { return false; } }
function touchStarted() { handlePressStart(); if (touches.length > 0 && touches[0] && touches[0].x > 0 && touches[0].x < width && touches[0].y > 0 && touches[0].y < height) { return false; } }
function mouseDragged() { if (isDragging && gameState === 'playing') { if(!kitty) return; kitty.x = mouseX; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); return false; } }
function touchMoved() { if (isDragging && gameState === 'playing') { if(!kitty) return; if (touches.length > 0 && touches[0]) { kitty.x = touches[0].x; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); } return false; } }
function mouseReleased() { if (isDragging) { isDragging = false; } }
function touchEnded() { if (isDragging) { isDragging = false; } }

// resetGame (No changes)
function resetGame() { if (lastGameState === 'playing') { try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); console.log("TP saved:", totalPlushiesCollected); } catch(e){ console.warn("TP save fail:", e); } } score = 0; if (!isEndlessMode) lives = 3; plushies = []; difficultyStage = 0; visualStage = 0; previousVisualStage = 0; currentStreak = 0; highestStreakInSession = 0; if(kitty) kitty.x = width / 2; isDragging = false; frameCount = 0; shakeTime = 0; initializeBackgroundElements(); earthY = height * 1.5; lastDifficultyIncreaseScore = -1; currentEncouragingMessage = random(encouragingMessages); transitionStartTime = -Infinity; if(skyColors && skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; } cutsceneStep = 0; }

// END OF PART 2