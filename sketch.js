// ~~~ Kitty's Cuddle Collection: JETPACK GALAXY ADVENTURE! ~~~ //
// Code for my Master~♥ Nyaa~! (Rainbow Trail code moved to rainbow.js!)
// PART 1 of 2 - Added drawStaticKitty helper! Nya!

// --- Version ---
const gameVersion = "v1.13"; // This MUST match the version you intend to run

let kitty;
let plushies = [];
let score = 0;
let highScore = 0; let endlessHighScore = 0;
let currentStreak = 0; let highestStreakInSession = 0;
let totalPlushiesCollected = 0;
let lives = 3;
let gameState = 'intro'; // intro, start, playing, store, gacha, gameOverCutscene, gameOver
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
let textStrokeColor; let hudTextColorLight, hudTextColorDark;

// --- Background Transition ---
let currentBgColor; let targetBgColor; let lerpSpeed = 0.03;
let transitionStartTime = -Infinity; let transitionDuration = 90;

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
    // Keep default RGB color mode
    console.log(`Canvas created at internal resolution: ${width}x${height}, Color Mode: RGB`);

    noSmooth(); textAlign(CENTER, CENTER); textFont('monospace');

    // --- Define Colors using RGB or Hex ---
    kittyColor = color(255, 105, 180); jetpackColor = color(150, 150, 150); plushieColors = [ color(173, 216, 230), color(255, 223, 186), color(144, 238, 144), color(221, 160, 221) ]; heartColor = color(255, 0, 0); textColor = color(250, 250, 250); textBgColor = color(0, 0, 0, 165); boomColor = color(255, 50, 50); sparkleColor = color(255, 255, 0);
    skyColors = [ color(135, 206, 235), color(160, 215, 240), color(80, 130, 180), color(20, 40, 80), color(5, 5, 20) ]; buildingColor = color(50, 50, 60); cloudColor = color(255, 255, 255); earthColor = color(60, 120, 220); earthContinentColor = color(80, 180, 80); galaxyColor1 = color(200, 180, 255, 100); galaxyColor2 = color(255, 255, 255, 80);
    danceKittyBgColor = color(255, 235, 240); danceKittyColors = [ color(180, 255, 255, 40), color(255, 180, 255, 40), color(255, 255, 180, 40), color(180, 180, 255, 40) ];
    endlessKittyBgColor = color(230, 255, 230); endlessKittyColors = [ color(255, 180, 180, 50), color(255, 220, 180, 50), color(180, 255, 180, 50), color(220, 180, 255, 50) ];
    endlessModeButtonColor = color(100, 200, 100, 180); endlessModeTextColorOn = color(255, 255, 150); endlessModeTextColorOff = color(200);
    backButtonColor = color(200, 100, 100, 180); // Used by store and gacha now!
    storeButtonColor = color(150, 150, 220, 180);
    storeButtonTextColor = color(255);
    updateButtonColor = color(80, 80, 150, 180);
    updateButtonTextColor = color(200);
    updateAvailableColor = color(200, 150, 50, 200);
    gachaButtonColor = color(180, 120, 220, 180);
    gachaButtonTextColor = color(230);
    textStrokeColor = color(0, 0, 0, 150);
    hudTextColorLight = color(250, 250, 250);
    hudTextColorDark = color(40, 40, 40);

    // Initialize kitty (main game kitty)
    kitty = { baseY: height - 160, y: height - 160, size: min(width, height) * 0.08, x: width / 2, bobOffset: 0, hasJetpack: false };

    // Initialize background elements
    initializeBackgroundElements();
    earthY = height * 1.5;

    // Setup sound volume
    if (bgMusic) { bgMusic.setVolume(gameMusicVol); }
    if (cutsceneMusic) { cutsceneMusic.setVolume(cutsceneMusicVol); }

    // Load High Scores & Total Plushies
    try { let storedHighScore = localStorage.getItem('kittyJetpackHighScore'); if (storedHighScore) { highScore = int(storedHighScore); } let storedEndlessHighScore = localStorage.getItem('kittyEndlessHighScore'); if (storedEndlessHighScore) { endlessHighScore = int(storedEndlessHighScore); } let storedTotalPlushies = localStorage.getItem('kittyTotalPlushies'); if (storedTotalPlushies) { totalPlushiesCollected = int(storedTotalPlushies); } console.log(`Scores Loaded: Normal=${highScore}, Endless=${endlessHighScore}, Total=${totalPlushiesCollected}`); } catch (e) { console.warn("Could not access localStorage:", e); }

    // Select initial message & BG Color
    currentEncouragingMessage = random(encouragingMessages);
    currentBgColor = skyColors[0]; targetBgColor = skyColors[0];

    // Define button bounds
    defineButtonBounds();

    // Load purchases from store.js
    if (typeof loadItems === 'function') { loadItems(); } else { console.error("!!! CRITICAL: loadItems() function not found!"); }

  } catch (e) { console.error("!!! CRITICAL ERROR IN SETUP():", e); document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;">Setup Error! Check console. ${e.message}</div>`; }
}

// --- Define Button Bounds ---
function defineButtonBounds() {
  if (width && height) {
    let endlessButtonW = width * 0.45;
    let endlessButtonH = height * 0.07;
    endlessModeButton = { x: width / 2 - endlessButtonW / 2, y: height * 0.50, w: endlessButtonW, h: endlessButtonH }; // Base position for reference

    let storeButtonW = width * 0.35;
    let storeButtonH = height * 0.06;
    // Position Store button relative to Endless button
    storeButton = { x: width / 2 - storeButtonW / 2, y: endlessModeButton.y + endlessButtonH * 1.8, w: storeButtonW, h: storeButtonH };

    // --- GACHA BUTTON POSITIONING ---
    let gachaButtonW = width * 0.35; // Same width as store for neatness
    let gachaButtonH = height * 0.06; // Same height
    let gachaButtonSpacing = gachaButtonH * 0.4; // Space between store and gacha
    gachaButton = { x: width / 2 - gachaButtonW / 2, y: storeButton.y + storeButtonH + gachaButtonSpacing, w: gachaButtonW, h: gachaButtonH };

    let backButtonSize = min(width, height) * 0.1; // Used for Endless Mode Gameplay only
    backButton = { x: width - backButtonSize - 15, y: 15, w: backButtonSize, h: backButtonSize * 0.6 };

    let updateButtonW = width * 0.3;
    let updateButtonH = height * 0.04;
    updateButton = { x: width - updateButtonW - 10, y: height - updateButtonH - 10, w: updateButtonW, h: updateButtonH };

    // --- Call Layout Setups for Store and Gacha ---
    if (typeof setupStoreLayout === 'function') {
      setupStoreLayout(width, height);
    } else {
      console.error("setupStoreLayout() function not found!");
    }
    if (typeof setupGachaLayout === 'function') {
        setupGachaLayout(width, height);
    } else {
        console.error("setupGachaLayout() function not found!");
    }
    // --- END CALLS ---

  } else {
    console.warn("defineButtonBounds called too early.");
    endlessModeButton = undefined;
    storeButton = undefined;
    gachaButton = undefined;
    backButton = undefined;
    updateButton = undefined;
  }
}

// --- Music Control Function ---
// Manages transitions between game music and menu music
function manageMusic() {
    if (!userHasInteracted || !audioStarted || !bgMusic || !cutsceneMusic) return;

    let targetGameVol = 0;
    let targetCutsceneVol = 0;
    let loopGame = false;
    let playCutsceneOnce = false;
    let restartCutscene = false;

    // Determine target volumes and loop states based on gameState
    if (gameState === 'playing') {
        targetGameVol = gameMusicVol;
        targetCutsceneVol = 0;
        loopGame = true;
    } else if (gameState === 'intro' || gameState === 'start' || gameState === 'gameOverCutscene' || gameState === 'gameOver' || gameState === 'store' || gameState === 'gacha') {
        targetGameVol = 0;
        targetCutsceneVol = cutsceneMusicVol;
        if ((gameState === 'intro' || gameState === 'gameOverCutscene') && !cutsceneMusic.isPlaying()) {
            playCutsceneOnce = true;
        }
        if ((gameState === 'start' || gameState === 'store' || gameState === 'gacha') && (lastGameState === 'gameOver' || lastGameState === 'gameOverCutscene' || lastGameState === 'playing' || lastGameState === 'intro')) {
            restartCutscene = true;
        }
    } else {
        targetGameVol = 0; targetCutsceneVol = 0;
    }

    try {
        // Manage Game Music (Background Loop)
        if (bgMusic.isPlaying() || bgMusic.isLooping()) {
            if (targetGameVol < bgMusic.getVolume()) {
                bgMusic.setVolume(targetGameVol, musicFadeTime);
                if (targetGameVol === 0) { setTimeout(() => { if (bgMusic && !bgMusic.isLooping()) bgMusic.stop(); }, musicFadeTime * 1000 + 50); }
            } else if (targetGameVol > bgMusic.getVolume()) {
                bgMusic.setVolume(targetGameVol, musicFadeTime);
            }
            if (loopGame && !bgMusic.isLooping() && targetGameVol > 0) { if (!bgMusic.isPlaying()) { bgMusic.loop(); } else { bgMusic.setLoop(true); } }
            else if (!loopGame && bgMusic.isLooping()) { bgMusic.setLoop(false); }
        } else if (loopGame && targetGameVol > 0) {
             console.log("Starting Game Music loop with fade-in"); bgMusic.setVolume(0); bgMusic.loop(); bgMusic.setVolume(targetGameVol, musicFadeTime);
        }

        // Manage Cutscene/Menu Music
        if (cutsceneMusic.isPlaying()) {
            if (targetCutsceneVol < cutsceneMusic.getVolume()) {
                cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime);
                if (targetCutsceneVol === 0) { setTimeout(() => { if (cutsceneMusic && cutsceneMusic.isPlaying()) cutsceneMusic.stop(); }, musicFadeTime * 1000 + 50); }
            } else if (targetCutsceneVol > cutsceneMusic.getVolume()) {
                cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime);
            }
            if (restartCutscene) { console.log("Restarting Cutscene music for Start/Store/Gacha screen loop"); cutsceneMusic.stop(); }
        }

        if ((playCutsceneOnce || restartCutscene) && targetCutsceneVol > 0 && !cutsceneMusic.isPlaying()) {
            console.log("Playing/Restarting Cutscene music with fade-in"); cutsceneMusic.setVolume(0); cutsceneMusic.play(); cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime);
            cutsceneMusic.setLoop(gameState !== 'intro' && gameState !== 'gameOverCutscene');
        } else if ((gameState === 'gameOver' || gameState === 'start' || gameState === 'store' || gameState === 'gacha') && targetCutsceneVol > 0 && !cutsceneMusic.isPlaying()){
             console.log("Restarting Cutscene music loop for Game Over/Start/Store/Gacha screen"); cutsceneMusic.setVolume(0); cutsceneMusic.loop(); cutsceneMusic.play(); cutsceneMusic.setVolume(targetCutsceneVol, musicFadeTime);
        } else if (cutsceneMusic.isPlaying() && (gameState === 'gameOver' || gameState === 'start' || gameState === 'store' || gameState === 'gacha') && !cutsceneMusic.isLooping()) {
             console.log("Ensuring cutscene music is looping on menu state"); cutsceneMusic.setLoop(true);
        } else if (cutsceneMusic.isPlaying() && !(gameState === 'gameOver' || gameState === 'start' || gameState === 'store' || gameState === 'gacha') && cutsceneMusic.isLooping()) {
             cutsceneMusic.setLoop(false);
        }
    } catch (e) {
        console.error("Error in manageMusic:", e);
        try { bgMusic.stop(); cutsceneMusic.stop(); } catch (e2) {}
    }
}


// initializeBackgroundElements (No changes)
function initializeBackgroundElements() { if(!width || !height) return; stars = []; for (let i = 0; i < 300; i++) { stars.push({ x: random(width), y: random(height * 2), size: random(1, 3.5), speedFactor: random(0.05, 0.4) }); } buildings = []; let skyColorStage0 = skyColors[0]; for (let i = 0; i < 15; i++) { let far = random() < 0.5; let bldHeight = random(height * 0.1, height * (far ? 0.4 : 0.6)); let bldWidth = random(width * 0.04, width * 0.12); let finalColor = lerpColor(buildingColor, skyColorStage0, far ? 0.7 : 0.4); finalColor.setAlpha(far ? 160 : 200); buildings.push({ x: random(width * 1.2) - width * 0.1, h: bldHeight, w: bldWidth, y: random(height * 2), speedFactor: far ? 0.2 : 0.6, isRooftop: false, color: finalColor }); } clouds = []; for (let i = 0; i < 20; i++) { clouds.push({ x: random(width * 1.5) - width * 0.25, y: random(height * 2), size: random(width * 0.1, width * 0.4), speedFactor: random(0.3, 0.9), alpha: random(50, 150) }); } galaxyParticles = []; for (let i = 0; i < 400; i++) { galaxyParticles.push({ angle: random(TWO_PI), radius: random(height * 0.1, width * 0.8), speed: random(0.001, 0.005), size: random(1, 4), color: random() < 0.7 ? galaxyColor1 : galaxyColor2 }); } }

// windowResized (Calls setupGachaLayout)
function windowResized() {
    let aspectRatio = windowHeight / windowWidth;
    let internalCanvasHeight = floor(internalCanvasWidth * aspectRatio);
    internalCanvasHeight = max(1, internalCanvasHeight);
    resizeCanvas(internalCanvasWidth, internalCanvasHeight);
    console.log(`Canvas resized to internal resolution: ${width}x${height}`);
    if (kitty) {
        kitty.baseY = height - 160;
        kitty.y = kitty.baseY;
        kitty.size = min(width, height) * 0.08;
        kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2);
    } else {
        console.warn("windowResized: kitty not ready yet.");
    }
    initializeBackgroundElements();
    earthY = height * 1.5;
    defineButtonBounds(); // This now calls setupStoreLayout and setupGachaLayout internally
}

// draw (Calls displayGacha)
let lastGameState = '';
function draw() {
  try {
    // --- Difficulty / Stage Calculation ---
    let scrollSpeedForBackground = 0;
    previousVisualStage = visualStage;
    difficultyStage = floor(score / scorePerStage);

    if (isEndlessMode && (gameState === 'playing' || gameState === 'gameOverCutscene' || gameState === 'gameOver' || gameState === 'store' || gameState === 'gacha')) {
        visualStage = maxVisualStageIndex; // Track stage based on score, but background might differ
    } else {
        visualStage = min(maxVisualStageIndex, difficultyStage);
    }

    // --- Background Transition Logic ---
    let startingEndless = (gameState === 'playing' && lastGameState !== 'playing' && isEndlessMode);
    if (visualStage !== previousVisualStage && gameState === 'playing' && !startingEndless) {
        transitionStartTime = frameCount;
        console.log(`Transitioning to visual stage ${visualStage}`);
        if (visualStage < maxVisualStageIndex) { targetBgColor = skyColors[visualStage]; }
        else if (isEndlessMode) { targetBgColor = endlessKittyBgColor; }
        else { targetBgColor = danceKittyBgColor; }
    } else if (startingEndless) {
        console.log("Snapping BG to Endless Mode color");
        currentBgColor = endlessKittyBgColor; targetBgColor = endlessKittyBgColor;
        transitionStartTime = -Infinity;
    } else if (gameState !== 'playing') {
        transitionStartTime = -Infinity;
        if (skyColors.length > 0) { targetBgColor = skyColors[0]; if (!currentBgColor || red(currentBgColor) !== red(skyColors[0]) || green(currentBgColor) !== green(skyColors[0]) || blue(currentBgColor) !== blue(skyColors[0])) { currentBgColor = skyColors[0]; } }
        if(!(gameState === 'gameOver' || gameState === 'gameOverCutscene')) { visualStage = 0; } // Reset visual stage for menus
    } else if (gameState === 'start' && previousVisualStage === 0) { // Ensure start screen has stage 0 bg
        if (skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; }
    }

    // Lerp background color
    if (currentBgColor && targetBgColor) { currentBgColor = lerpColor(currentBgColor, targetBgColor, lerpSpeed); }
    else if (!currentBgColor && skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; }

    // --- Update Dynamic Difficulty Values ---
    currentScrollSpeed = baseScrollSpeed + difficultyStage * scrollSpeedIncreasePerStage;
    currentPlushieFallSpeed = basePlushieFallSpeed + difficultyStage * plushieSpeedIncreasePerStage;
    currentPlushieSpawnInterval = max(minSpawnInterval, basePlushieSpawnInterval - difficultyStage * spawnRateDecreasePerStage);
    currentPlushieDrift = basePlushieDrift + difficultyStage * driftIncreasePerStage;

    // --- Set background scroll speed ---
    let stageForScroll = (gameState === 'playing') ? visualStage : 0; // Use visual stage if playing, 0 otherwise
    scrollSpeedForBackground = (stageForScroll >= maxVisualStageIndex || gameState !== 'playing') ? 0 : currentScrollSpeed;
    if (gameState === 'start' || gameState === 'gameOver' || gameState === 'gameOverCutscene' || gameState === 'store' || gameState === 'gacha') scrollSpeedForBackground = baseScrollSpeed * 0.2;
    if (gameState === 'intro') scrollSpeedForBackground = 0;

    // --- Update Encouraging Message ---
    if (gameState === 'playing' && score > 0 && score % scorePerStage === 0 && score !== lastDifficultyIncreaseScore) {
        let lastMessage = currentEncouragingMessage;
        do { currentEncouragingMessage = random(encouragingMessages); } while (encouragingMessages.length > 1 && currentEncouragingMessage === lastMessage);
        lastDifficultyIncreaseScore = score; console.log("Difficulty Up! Message:", currentEncouragingMessage);
    } else if (score === 0 && gameState === 'playing' && lastDifficultyIncreaseScore !== -1) { // Reset only when game starts
        lastDifficultyIncreaseScore = -1;
    }

    // --- Draw Background ---
    let transitionProgress = constrain(map(frameCount - transitionStartTime, 0, transitionDuration), 0, 1);
    let stageToDraw = (gameState === 'playing') ? visualStage : 0; // Always draw stage 0 on menus
    let bgAlpha = (transitionStartTime > -Infinity && frameCount < transitionStartTime + transitionDuration && gameState === 'playing') ? transitionProgress : 1.0; // Only transition alpha during gameplay
    drawScrollingBackground(stageToDraw, scrollSpeedForBackground, currentBgColor, bgAlpha, isEndlessMode);


    // --- Draw Rainbow Trail ---
    if (typeof updateAndDrawRainbowTrail === 'function') {
        updateAndDrawRainbowTrail(scrollSpeedForBackground);
    }

    // --- Screen Shake ---
    push();
    if (shakeTime > 0) { translate(random(-6, 6), random(-6, 6)); shakeTime--; }

    // --- Game State Display Logic & Music ---
    if (gameState === 'intro') { displayIntro(); }
    else if (gameState === 'start') { displayStartScreen(); }
    else if (gameState === 'playing') { runGame(); }
    else if (gameState === 'store') { if (typeof displayStore === 'function') { displayStore(totalPlushiesCollected); } else { console.error("displayStore not found!"); gameState='start'; } }
    else if (gameState === 'gacha') { if (typeof displayGacha === 'function') { displayGacha(totalPlushiesCollected); } else { console.error("displayGacha not found!"); gameState='start'; } }
    else if (gameState === 'gameOverCutscene') { displayGameOverCutscene(); }
    else if (gameState === 'gameOver') { displayGameOverScreen(); }

    manageMusic();
    lastGameState = gameState;

    // --- Draw Kitty --- (If applicable)
    if (!(gameState === 'intro' && introStep < 4) && gameState !== 'store' && gameState !== 'gacha') {
        if (kitty) {
            if (gameState !== 'gameOverCutscene') { kitty.bobOffset = sin(frameCount * 0.1) * (kitty.size * 0.05); kitty.y = kitty.baseY + kitty.bobOffset; }
            else { kitty.y = kitty.baseY; }
            drawKitty(gameState === 'gameOverCutscene');

            if (gameState === 'playing' && typeof getEquippedItem === 'function' && getEquippedItem('jetpack_fx') === 'jetpack_rainbow') {
                if (frameCount % 2 === 0 && typeof spawnRainbowParticle === 'function') { spawnRainbowParticle(); }
            }
        }
    }

    pop(); // End shake transformation
  } catch (e) {
    console.error("Error in draw():", e); noLoop();
  }
}

// Separate Element Drawing Functions (No changes)
function drawStage0Elements(scrollSpeed, alphaFactor) { buildings.forEach(b => { b.y += scrollSpeed * b.speedFactor; if (b.y > height) b.y -= height * 2; let c = b.color; fill(red(c), green(c), blue(c), alpha(c) * alphaFactor); rect(b.x, b.y, b.w, b.h); }); }
function drawStage1Elements(scrollSpeed, alphaFactor) { buildings.forEach(b => { if (!b.isRooftop) { b.h = random(height*0.05, height*0.15); b.isRooftop = true; } b.y += scrollSpeed * (b.speedFactor + 0.2); if (b.y > height) b.y -= height * 2; let c = b.color; let baseAlpha = max(0, alpha(c) - 100); fill(red(c), green(c), blue(c), baseAlpha * alphaFactor); if (baseAlpha * alphaFactor > 1) rect(b.x, b.y, b.w, b.h); }); clouds.forEach(c => { c.y += scrollSpeed * c.speedFactor; if (c.y > height) c.y -= height * 2; fill(red(cloudColor), green(cloudColor), blue(cloudColor), c.alpha * alphaFactor); ellipse(c.x, c.y, c.size * 1.2, c.size * 0.8); ellipse(c.x + c.size*0.3, c.y + c.size*0.1, c.size, c.size*0.7); ellipse(c.x - c.size*0.3, c.y + c.size*0.1, c.size*0.9, c.size*0.6); }); }
function drawStage2Elements(scrollSpeed, alphaFactor) { clouds.forEach(c => { c.y += scrollSpeed * c.speedFactor; if (c.y > height) c.y -= height * 2; let baseAlpha = max(0, c.alpha - 80); fill(red(cloudColor), green(cloudColor), blue(cloudColor), baseAlpha * alphaFactor); if (baseAlpha * alphaFactor > 1) { ellipse(c.x, c.y, c.size * 1.2, c.size * 0.8); ellipse(c.x + c.size*0.3, c.y + c.size*0.1, c.size, c.size*0.7); ellipse(c.x - c.size*0.3, c.y + c.size*0.1, c.size*0.9, c.size*0.6); } }); stars.slice(0, 100).forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height * 2; let flicker = map(sin(frameCount * 0.08 + s.x), -1, 1, 0.6, 1.2); fill(255, 255, 255, map(s.speedFactor, 0.1, 0.5, 50, 150) * alphaFactor); ellipse(s.x, s.y, s.size * flicker * 0.8, s.size * flicker * 0.8); }); fill(red(earthColor), green(earthColor), blue(earthColor), 255 * alphaFactor); arc(width/2, height*1.5, width*2, height*2, PI, TWO_PI); }
function drawStage3Elements(scrollSpeed, alphaFactor) { earthY += scrollSpeed * 0.1; if (earthY > height * 1.8) earthY -= height * 2.5; fill(red(earthColor), green(earthColor), blue(earthColor), 255 * alphaFactor); ellipse(width / 2, earthY, width * 1.6, width * 1.6); fill(red(earthContinentColor), green(earthContinentColor), blue(earthContinentColor), 255 * alphaFactor); ellipse(width*0.4, earthY - width*0.15, width*0.35, width*0.25); ellipse(width*0.65, earthY + width*0.2, width*0.45, width*0.3); stars.forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height * 2; let flicker = map(sin(frameCount * 0.1 + s.x), -1, 1, 0.7, 1.3); fill(255, 255, 255, map(s.speedFactor, 0.05, 0.4, 150, 255) * alphaFactor); ellipse(s.x, s.y, s.size * flicker, s.size * flicker); }); }
function drawStage4Elements(scrollSpeed, alphaFactor) { stars.forEach(s => { s.y += scrollSpeed * s.speedFactor; if (s.y > height) s.y -= height * 2; let flicker = map(sin(frameCount * 0.1 + s.x + 50), -1, 1, 0.8, 1.4); fill(255, 255, 255, map(s.speedFactor, 0.05, 0.4, 180, 255) * alphaFactor); ellipse(s.x, s.y, s.size * flicker, s.size * flicker); }); push(); translate(width / 2, height / 2); rotate(frameCount * 0.001); galaxyParticles.forEach(p => { p.angle += p.speed; let x = cos(p.angle) * p.radius; let y = sin(p.angle) * p.radius * 0.3; let flicker = random(0.5, 1.5); let baseAlpha = alpha(p.color); fill(red(p.color), green(p.color), blue(p.color), baseAlpha * flicker * 0.8 * alphaFactor); ellipse(x, y, p.size * flicker, p.size * flicker); }); pop(); }
function drawStage5Elements(alphaFactor, isEndless) { /* ... same subtle kitties ... */ let kittySize = 40; let spacing = kittySize * 1.5; let cols = ceil(width / spacing); let rows = ceil(height / spacing); let colorsToUse = isEndless ? endlessKittyColors : danceKittyColors; noStroke(); for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { let x = i * spacing + spacing / 2; let y = j * spacing + spacing / 2; let wiggleX = sin(frameCount * 0.1 + i * 0.5 + j * 0.3) * 3; let wiggleY = cos(frameCount * 0.1 + i * 0.3 + j * 0.5) * 2; let kittyIndex = (i + j) % colorsToUse.length; let c = colorsToUse[kittyIndex]; fill(red(c), green(c), blue(c), alpha(c) * alphaFactor); rectMode(CENTER); rect(x + wiggleX, y + wiggleY, kittySize * 0.6, kittySize * 0.6); triangle(x + wiggleX - kittySize*0.3, y + wiggleY - kittySize*0.3, x + wiggleX - kittySize*0.3, y + wiggleY - kittySize*0.5, x + wiggleX - kittySize*0.1, y + wiggleY - kittySize*0.3); triangle(x + wiggleX + kittySize*0.3, y + wiggleY - kittySize*0.3, x + wiggleX + kittySize*0.3, y + wiggleY - kittySize*0.5, x + wiggleX + kittySize*0.1, y + wiggleY - kittySize*0.3); } } if (currentEncouragingMessage !== "") { fill(255, 255, 255, 60 * alphaFactor); textSize(min(width, height) * 0.15); textAlign(CENTER, CENTER); text(currentEncouragingMessage, width / 2, height / 2); } rectMode(CORNER); }

// drawScrollingBackground (No changes)
function drawScrollingBackground(currentStageIndex, scrollSpeed, bgColor, transitionProgress, isEndless) { let stageIndex = constrain(floor(currentStageIndex), 0, maxVisualStageIndex); rectMode(CORNER); noStroke(); background(bgColor); let drawFuncs = [drawStage0Elements, drawStage1Elements, drawStage2Elements, drawStage3Elements, drawStage4Elements, drawStage5Elements]; let alphaValue = transitionProgress; if (drawFuncs[stageIndex]) { if (stageIndex === maxVisualStageIndex) { drawFuncs[stageIndex](alphaValue, isEndless); } else { drawFuncs[stageIndex](scrollSpeed, alphaValue); } } }

// Gameplay Loop (No changes)
function runGame() { if(!kitty) return; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); if (frameCount % floor(currentPlushieSpawnInterval) === 0) { spawnPlushie(); } for (let i = plushies.length - 1; i >= 0; i--) { let p = plushies[i]; p.y += currentScrollSpeed + currentPlushieFallSpeed * (height/600); p.x += p.dx; if (p.x < p.size / 2 || p.x > width - p.size / 2) { p.dx *= -0.9; p.x = constrain(p.x, p.size/2, width - p.size/2); } drawPlushie(p); if (checkCollision(kitty, p)) { score++; totalPlushiesCollected++; if (isEndlessMode) { currentStreak++; highestStreakInSession = max(highestStreakInSession, currentStreak); } plushies.splice(i, 1); } else if (p.y > height + p.size) { plushies.splice(i, 1); if (isEndlessMode) { console.log(`Endless Miss! Streak broken at ${currentStreak}. Score and speed reset.`); score = 0; difficultyStage = 0; currentStreak = 0; lastDifficultyIncreaseScore = -1; } else { lives--; console.log(`Life lost! ${lives} remaining.`); if (lives <= 0) { isDragging = false; if (score > highScore) { highScore = score; try { localStorage.setItem('kittyJetpackHighScore', highScore); console.log("New High Score saved!", highScore); } catch(e){ console.warn("Failed to save high score:", e); }} try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("Failed to save total plushies:", e); } if (visualStage === maxVisualStageIndex && !isEndlessMode) { gameState = 'gameOverCutscene'; cutsceneStep = 0; console.log("Starting Game Over Cutscene!"); } else { gameState = 'gameOver'; } } } } } displayHUD(); }

// --- Screen Displays ---

// Intro Display (No changes)
function displayIntro() { let lineY = height * 0.2; let lineSpacing = min(width, height) * 0.05; let baseTextSize = lineSpacing * 0.7; let textBlockHeight = 0; let textBlockWidth = width * 0.85; let boxCenterY = height * 0.45; if (introStep <= 1) textBlockHeight = lineSpacing * 2.5; else if (introStep === 2) textBlockHeight = lineSpacing * 4; else if (introStep === 3) textBlockHeight = lineSpacing * 2.5; else if (introStep === 4) textBlockHeight = lineSpacing * 4; else if (introStep === 5) textBlockHeight = lineSpacing * 4.5; else if (introStep === 6) textBlockHeight = lineSpacing * 4.5; else if (introStep === 7) textBlockHeight = lineSpacing * 4; else if (introStep === 8) textBlockHeight = lineSpacing * 4.5; else if (introStep === 9) textBlockHeight = lineSpacing * 4; else if (introStep === 10) textBlockHeight = lineSpacing * 4.5; else if (introStep === 11) textBlockHeight = lineSpacing * 3.5; else textBlockHeight = lineSpacing * 3; fill(textBgColor); rectMode(CENTER); rect(width / 2, boxCenterY, textBlockWidth, textBlockHeight, 15); fill(textColor); textSize(baseTextSize); let currentLineY = boxCenterY - textBlockHeight / 2 + lineSpacing; if (introStep === 0) { text("Zzzzzz... purrrr...", width / 2, currentLineY); } else if (introStep === 1) { text("Zzzzzz...", width / 2, currentLineY); text("Suddenly, next door...", width / 2, currentLineY + lineSpacing); } else if (introStep === 2) { text("Suddenly...", width / 2, currentLineY); textSize(baseTextSize * 1.8); fill(boomColor); text("*** KABLOOOOOOM!!! ***", width / 2, currentLineY + lineSpacing * 1.5); textSize(baseTextSize); fill(textColor); } else if (introStep === 3) { text("NYA?! THAT BLAST AGAIN! Kana, you IDIOT!", width / 2, currentLineY); } else if (introStep === 4) { text("The whole house is shaking!", width / 2, currentLineY); text("The ceiling--! It's collapsing!", width / 2, currentLineY + lineSpacing); } else if (introStep === 5) { text("EEK! Gotta get out!", width / 2, currentLineY); text("But... wait...", width / 2, currentLineY + lineSpacing); text("What's that gleaming in the rubble?!", width / 2, currentLineY + lineSpacing * 2); } else if (introStep === 6) { text("What's that gleaming?!", width / 2, currentLineY); textSize(baseTextSize * 1.2); fill(sparkleColor); text("✨ A... JETPACK?! ✨", width / 2, currentLineY + lineSpacing * 1.2); textSize(baseTextSize); fill(textColor); text("And it fits purrfectly!", width / 2, currentLineY + lineSpacing * 2.4); } else if (introStep === 7) { text("Who cares where it came from!", width / 2, currentLineY); textSize(baseTextSize * 1.4); text("WHOOSH! Up we go!", width / 2, currentLineY + lineSpacing * 1.5); textSize(baseTextSize); } else if (introStep === 8) { text("WHOA! Flying!", width / 2, currentLineY); text("But... OH NO!", width / 2, currentLineY + lineSpacing); text("Explosion scattered plushies EVERYWHERE!", width / 2, currentLineY + lineSpacing * 2); } else if (introStep === 9) { text("They're floating all around!", width / 2, currentLineY); text("Gotta grab 'em while we fly!", width / 2, currentLineY + lineSpacing); } else if (introStep === 10) { text("Gotta grab 'em!", width / 2, currentLineY); textSize(baseTextSize * 1.2); text("They're MINE!", width / 2, currentLineY + lineSpacing); textSize(baseTextSize * 0.9); fill(kittyColor); text("...OURS, Master! OURS! ♥", width / 2, currentLineY + lineSpacing * 2); fill(textColor); textSize(baseTextSize); } else if (introStep === 11) { text("Use your finger to drag me left and right!", width / 2, currentLineY); text("Catch every single one!", width / 2, currentLineY + lineSpacing); } else if (introStep === 12) { text("Catch every single one!", width / 2, currentLineY); textSize(baseTextSize * 0.8); text("(Tap screen to start the ascent!)", width / 2, currentLineY + lineSpacing); } if (introStep < 12) { textSize(baseTextSize * 0.7); fill(200); text("[Tap to continue]", width / 2, height - lineSpacing * 0.7); } rectMode(CORNER); }


// END OF PART 1
// PART 2 of 2 - Added drawStaticKitty helper! Nya!

// Start Screen (No changes here)
function displayStartScreen() {
  fill(textColor); stroke(textStrokeColor); strokeWeight(2.5);
  let titleSize = min(width, height) * 0.095; let instructionSize = titleSize * 0.5; let masterSize = instructionSize * 1.1; let tapSize = instructionSize * 0.85; let highScoreSize = tapSize * 0.90; let totalPlushieSize = highScoreSize * 0.9; let buttonTextSize = instructionSize * 0.75; let updateButtonTextSize = buttonTextSize * 0.8; let versionTextSize = updateButtonTextSize * 0.7; let lineSpacingFactor = 1.2;
  textSize(titleSize); text("Kitty's Cuddle", width / 2, height * 0.18); text("Collection~♥", width / 2, height * 0.18 + titleSize * lineSpacingFactor);
  let instructionY = height * 0.18 + titleSize * lineSpacingFactor * 2.2;
  textSize(instructionSize); text("Ready for Liftoff?", width / 2, instructionY); instructionY += instructionSize * lineSpacingFactor; text("DRAG me left/right", width / 2, instructionY); instructionY += instructionSize * lineSpacingFactor * 0.9; text("to catch plushies,", width/2, instructionY); instructionY += instructionSize * lineSpacingFactor * 1.3; fill(kittyColor); textSize(masterSize); stroke(textStrokeColor); strokeWeight(2.5); text("Master~!", width/2, instructionY); instructionY += masterSize * lineSpacingFactor * 1.2;
  if (endlessModeButton) { endlessModeButton.y = instructionY; rectMode(CORNER); fill(endlessModeButtonColor); noStroke(); rect(endlessModeButton.x, endlessModeButton.y, endlessModeButton.w, endlessModeButton.h, 5); textSize(buttonTextSize); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); if (isEndlessMode) { fill(endlessModeTextColorOn); text("Endless Mode: ON", endlessModeButton.x + endlessModeButton.w / 2, endlessModeButton.y + endlessModeButton.h / 2); } else { fill(endlessModeTextColorOff); text("Endless Mode: OFF", endlessModeButton.x + endlessModeButton.w / 2, endlessModeButton.y + endlessModeButton.h / 2); } instructionY += endlessModeButton.h * 1.2; if (isEndlessMode) { noStroke(); fill(200); textSize(buttonTextSize * 0.8); text("(Score/Speed resets on Miss)", width / 2, instructionY); instructionY += buttonTextSize * 0.8 * lineSpacingFactor; } }
  if (storeButton) { storeButton.y = instructionY; rectMode(CORNER); fill(storeButtonColor); noStroke(); rect(storeButton.x, storeButton.y, storeButton.w, storeButton.h, 5); textSize(buttonTextSize * 0.9); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); fill(storeButtonTextColor); text("Store", storeButton.x + storeButton.w / 2, storeButton.y + storeButton.h / 2); instructionY += storeButton.h * 1.5; }
  if (gachaButton) { gachaButton.y = instructionY; rectMode(CORNER); fill(gachaButtonColor); noStroke(); rect(gachaButton.x, gachaButton.y, gachaButton.w, gachaButton.h, 5); textSize(buttonTextSize * 0.9); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); fill(gachaButtonTextColor); text("Gacha", gachaButton.x + gachaButton.w / 2, gachaButton.y + gachaButton.h / 2); instructionY += gachaButton.h * 1.5; }
  fill(textColor); textSize(tapSize); strokeWeight(2); if (frameCount % 60 < 40) { text("Tap Here or Above to FLY!", width / 2, instructionY); } instructionY += tapSize * lineSpacingFactor * 1.5;
  textSize(highScoreSize); fill(200); stroke(textStrokeColor); strokeWeight(2); text(`Normal High Score: ${highScore}`, width/2, instructionY); instructionY += highScoreSize * lineSpacingFactor; text(`Endless Streak High Score: ${endlessHighScore}`, width/2, instructionY); instructionY += highScoreSize * lineSpacingFactor; textSize(totalPlushieSize); text(`Total Plushies Collected: ${totalPlushiesCollected}`, width/2, instructionY);
  if (updateButton) { let currentUpdateButtonColor = updateButtonColor; let currentUpdateButtonTextColor = updateButtonTextColor; if (updateButtonState === 'checking') { currentUpdateButtonColor = color(150, 150, 80); currentUpdateButtonTextColor = color(50); } else if (updateButtonState === 'available') { currentUpdateButtonColor = updateAvailableColor; currentUpdateButtonTextColor = color(0); } else if (updateButtonState === 'uptodate' || updateButtonState === 'error') { currentUpdateButtonColor = color(100); currentUpdateButtonTextColor = color(180); } rectMode(CORNER); fill(currentUpdateButtonColor); noStroke(); rect(updateButton.x, updateButton.y, updateButton.w, updateButton.h, 5); fill(currentUpdateButtonTextColor); stroke(textStrokeColor); strokeWeight(1); textSize(updateButtonTextSize); textAlign(CENTER, CENTER); text(updateButtonText, updateButton.x + updateButton.w / 2, updateButton.y + updateButton.h / 2); }
  textSize(versionTextSize); fill(150); noStroke(); textAlign(LEFT, BOTTOM); text(gameVersion, 5, height - 5); noStroke(); textAlign(CENTER, CENTER);
}

// Game Over Cutscene Display (No changes)
function displayGameOverCutscene() { let lineY = height * 0.2; let lineSpacing = min(width, height) * 0.05; let baseTextSize = lineSpacing * 0.7; let textBlockHeight = 0; let textBlockWidth = width * 0.85; let boxCenterY = height * 0.45; if (cutsceneStep <= 1) textBlockHeight = lineSpacing * 2.5; else if (cutsceneStep === 2) textBlockHeight = lineSpacing * 3.5; else if (cutsceneStep === 3) textBlockHeight = lineSpacing * 2.5; else if (cutsceneStep === 4) textBlockHeight = lineSpacing * 4; else if (cutsceneStep === 5) textBlockHeight = lineSpacing * 2.5; else textBlockHeight = lineSpacing * 3; fill(textBgColor); rectMode(CENTER); rect(width / 2, boxCenterY, textBlockWidth, textBlockHeight, 15); fill(textColor); textSize(baseTextSize); let currentLineY = boxCenterY - textBlockHeight / 2 + lineSpacing; if (cutsceneStep === 0) { text("*Phew...*", width / 2, currentLineY); text("That was a LOT of plushies...", width / 2, currentLineY + lineSpacing); } else if (cutsceneStep === 1) { text("I think... I think I got them all...?", width / 2, currentLineY); text("(Finally... peace and quiet...)", width / 2, currentLineY + lineSpacing); } else if (cutsceneStep === 2) { text("Wait... what's that noise?", width / 2, currentLineY); text("*Clatter! Crash!*", width/2, currentLineY + lineSpacing); text("Oh no... not AGAIN!", width / 2, currentLineY + lineSpacing * 2); } else if (cutsceneStep === 3) { text("KANA! DON'T TOUCH THAT--!", width / 2, currentLineY + lineSpacing); if(shakeTime <= 0) shakeTime = 15; } else if (cutsceneStep === 4) { textSize(baseTextSize * 1.8); fill(boomColor); text("*** KABOOOOOOM!!! ***", width / 2, currentLineY + lineSpacing * 1.5); textSize(baseTextSize); fill(textColor); for(let i=0; i<5; i++) { fill(random(plushieColors)); rect(random(width), random(height*0.6, height), 15, 15); } } else if (cutsceneStep === 5) { text("NYAAAAAAAAA!", width / 2, currentLineY); text("They're everywhere AGAIN!", width / 2, currentLineY + lineSpacing); } else if (cutsceneStep === 6) { text("They're everywhere AGAIN!", width / 2, currentLineY); textSize(baseTextSize * 0.8); text("(Tap to see your score... *sigh*)", width / 2, currentLineY + lineSpacing); } if (cutsceneStep < 6) { textSize(baseTextSize * 0.7); fill(200); text("[Tap to continue]", width / 2, height - lineSpacing * 0.7); } rectMode(CORNER); }
// Game Over Screen (No changes)
function displayGameOverScreen() { fill(textColor); let gameOverSize = min(width, height) * 0.09; let messageSize = gameOverSize * 0.55; let scoreSize = messageSize * 0.9; let retrySize = scoreSize * 0.8; let lineSpacingFactor = 1.3; let endlessModeMsgSize = retrySize * 0.9; textSize(gameOverSize); let currentY = height * 0.15; let finalDifficultyStageNum = difficultyStage + 1; if (!isEndlessMode) { if (visualStage >= maxVisualStageIndex) { text("KITTY OVERLOAD!", width / 2, currentY); currentY += gameOverSize * lineSpacingFactor; textSize(messageSize); text(`You got ${score} adorable plushies!`, width / 2, currentY); currentY += messageSize * lineSpacingFactor; text(`Survived until Difficulty ${finalDifficultyStageNum}!`, width/2, currentY); currentY += messageSize * lineSpacingFactor; text("Truly Purrfect, Master!", width / 2, currentY); currentY += messageSize * lineSpacingFactor; fill(kittyColor); text("Our infinite hoard thanks you~♥", width / 2, currentY); } else { text("Grounded!", width / 2, currentY); currentY += gameOverSize * lineSpacingFactor; textSize(messageSize); text(`${score} plushies? Pathetic!`, width / 2, currentY); currentY += messageSize * lineSpacingFactor; text(`Only reached Stage ${visualStage + 1}... Need more!`, width/2, currentY); currentY += messageSize * lineSpacingFactor; text("Need more practice, hmph!", width / 2, currentY); currentY += messageSize * lineSpacingFactor; fill(150, 0, 0); text("*Pouty Jetpack Sputters*", width/2, currentY); } } else { text("Endless Flight Over!", width / 2, currentY); currentY += gameOverSize * lineSpacingFactor; textSize(messageSize); text(`Final Streak: ${highestStreakInSession}`, width / 2, currentY); currentY += messageSize * lineSpacingFactor * 1.5; text("Ready for another run?", width / 2, currentY); } currentY += messageSize * lineSpacingFactor * 1.2; textSize(scoreSize * 0.9); fill(200); text(`(Normal High Score: ${highScore})`, width/2, currentY); currentY += scoreSize * 1.3; text(`(Endless Streak High Score: ${endlessHighScore})`, width/2, currentY); if (isEndlessMode) { textSize(endlessModeMsgSize); fill(endlessModeTextColorOn); currentY += scoreSize * 1.3; text("(Endless Mode - Score Not Saved for Normal High Score)", width / 2, currentY); } fill(textColor); textSize(retrySize); if (frameCount % 60 < 40) { text("Tap Anywhere to Fly Again!", width / 2, height * 0.88); } }
// HUD Display (No changes)
function displayHUD() { let hudTextSize = min(width, height) * 0.04; let heartSize = hudTextSize * 1.3; let backTextSize = hudTextSize * 0.9; let bestRunTextSize = hudTextSize * 1.1; let currentHudTextColor = hudTextColorLight; if (visualStage === maxVisualStageIndex && isEndlessMode) { currentHudTextColor = hudTextColorDark; } fill(currentHudTextColor); stroke(textStrokeColor); strokeWeight(1.5); textSize(hudTextSize); textAlign(LEFT, TOP); let lineY = 15; let lineSpacing = hudTextSize * 1.3; text(`Plushies: ${score}`, 15, lineY); lineY += lineSpacing; text(`Difficulty: ${difficultyStage + 1}`, 15, lineY); lineY += lineSpacing; if (isEndlessMode) { fill(endlessModeTextColorOff); textSize(hudTextSize); text(`Best Run: `, 15, lineY); fill(endlessModeTextColorOn); textSize(bestRunTextSize); text(`${highestStreakInSession}`, 15 + textWidth("Best Run: "), lineY); lineY += lineSpacing; fill(endlessModeTextColorOn); textSize(bestRunTextSize); text(`Streak: ${currentStreak}`, 15, lineY); } else { textAlign(RIGHT, TOP); let hearts = ''; for (let i = 0; i < lives; i++) { hearts += '♥ '; } fill(heartColor); textSize(heartSize); noStroke(); text(hearts, width - 15, 10); } if (gameState === 'playing' && isEndlessMode && backButton) { rectMode(CORNER); fill(backButtonColor); noStroke(); rect(backButton.x, backButton.y, backButton.w, backButton.h, 3); fill(textColor); stroke(textStrokeColor); strokeWeight(1.5); textSize(backTextSize); textAlign(CENTER, CENTER); text("Back", backButton.x + backButton.w / 2, backButton.y + backButton.h / 2); } textAlign(CENTER, CENTER); noStroke(); }

// --- Helper Functions ---
function spawnPlushie() { if(!kitty) return; let plushieSize = kitty.size * 0.8; let spawnX = random(plushieSize, width - plushieSize); let plushie = { x: spawnX, y: -plushieSize, size: plushieSize, color: random(plushieColors), dx: random(-currentPlushieDrift, currentPlushieDrift) }; plushies.push(plushie); }
function drawKitty(inCutscene = false) { if(!kitty) return; let drawBow = false; if (typeof getEquippedItem === 'function') { if (getEquippedItem('kitty_accessory') === 'kitty_bow_pink') { drawBow = true; } } if (kitty.hasJetpack) { rectMode(CENTER); fill(jetpackColor); stroke(50); strokeWeight(max(1, kitty.size * 0.03)); rect(kitty.x, kitty.y + kitty.size * 0.1, kitty.size * 0.6, kitty.size * 0.7, kitty.size * 0.1); rect(kitty.x - kitty.size * 0.2, kitty.y + kitty.size * 0.4, kitty.size * 0.15, kitty.size * 0.2); rect(kitty.x + kitty.size * 0.2, kitty.y + kitty.size * 0.4, kitty.size * 0.15, kitty.size * 0.2); if (!inCutscene || cutsceneStep < 3 || cutsceneStep > 4) { let flameSize = kitty.size * map(abs(kitty.bobOffset), 0, kitty.size * 0.05, 0.3, 0.6) * random(0.8, 1.2); if (!(typeof getEquippedItem === 'function' && getEquippedItem('jetpack_fx') === 'jetpack_rainbow')){ fill(255, random(150, 200), 0, 200); noStroke(); triangle(kitty.x - kitty.size * 0.2, kitty.y + kitty.size * 0.5, kitty.x - kitty.size * 0.2 - flameSize * 0.3, kitty.y + kitty.size * 0.5 + flameSize, kitty.x - kitty.size * 0.2 + flameSize * 0.3, kitty.y + kitty.size * 0.5 + flameSize); triangle(kitty.x + kitty.size * 0.2, kitty.y + kitty.size * 0.5, kitty.x + kitty.size * 0.2 - flameSize * 0.3, kitty.y + kitty.size * 0.5 + flameSize, kitty.x + kitty.size * 0.2 + flameSize * 0.3, kitty.y + kitty.size * 0.5 + flameSize); } } } fill(kittyColor); stroke(50); strokeWeight(max(1, kitty.size * 0.05)); rectMode(CENTER); rect(kitty.x, kitty.y, kitty.size, kitty.size); let earSize = kitty.size * 0.4; let earOffset = kitty.size * 0.1; triangle(kitty.x - kitty.size/2 + earOffset, kitty.y - kitty.size/2, kitty.x - kitty.size/2 + earOffset, kitty.y - kitty.size/2 - earSize, kitty.x - earOffset, kitty.y - kitty.size/2); triangle(kitty.x + kitty.size/2 - earOffset, kitty.y - kitty.size/2, kitty.x + kitty.size/2 - earOffset, kitty.y - kitty.size/2 - earSize, kitty.x + earOffset, kitty.y - kitty.size/2); strokeWeight(max(2, kitty.size * 0.1)); line(kitty.x + kitty.size / 2, kitty.y, kitty.x + kitty.size * 0.8, kitty.y - kitty.size*0.2); let eyeSize = kitty.size * 0.1; fill(40); noStroke(); ellipse(kitty.x - kitty.size * 0.2, kitty.y - kitty.size * 0.1, eyeSize, eyeSize); ellipse(kitty.x + kitty.size * 0.2, kitty.y - kitty.size * 0.1, eyeSize, eyeSize); if (drawBow) { let bowSize = kitty.size * 0.3; fill(255, 100, 150); stroke(50); strokeWeight(1); let bowX = kitty.x; let bowY = kitty.y - kitty.size * 0.5; triangle(bowX - bowSize, bowY, bowX, bowY - bowSize * 0.4, bowX, bowY + bowSize * 0.4); triangle(bowX + bowSize, bowY, bowX, bowY - bowSize * 0.4, bowX, bowY + bowSize * 0.4); } rectMode(CORNER); noStroke(); }

// --- Helper Function to Draw Static Kitty (for Menus) --- ADDED HERE! ---
function drawStaticKitty(x, y, size) {
    let drawBow = false;
    if (typeof getEquippedItem === 'function') {
        if (getEquippedItem('kitty_accessory') === 'kitty_bow_pink') { drawBow = true; }
    }
    fill(kittyColor); stroke(50); strokeWeight(max(1, size * 0.05)); rectMode(CENTER); rect(x, y, size, size);
    let earSize = size * 0.4; let earOffset = size * 0.1;
    triangle(x - size/2 + earOffset, y - size/2, x - size/2 + earOffset, y - size/2 - earSize, x - earOffset, y - size/2);
    triangle(x + size/2 - earOffset, y - size/2, x + size/2 - earOffset, y - size/2 - earSize, x + earOffset, y - size/2);
    strokeWeight(max(2, size * 0.1)); line(x + size / 2, y, x + size * 0.8, y - size * 0.2);
    let eyeSize = size * 0.1; fill(40); noStroke(); ellipse(x - size * 0.2, y - size * 0.1, eyeSize, eyeSize); ellipse(x + size * 0.2, y - size * 0.1, eyeSize, eyeSize);
    if (drawBow) { let bowSize = size * 0.3; fill(255, 100, 150); stroke(50); strokeWeight(1); let bowX = x; let bowY = y - size * 0.5; triangle(bowX - bowSize, bowY, bowX, bowY - bowSize * 0.4, bowX, bowY + bowSize * 0.4); triangle(bowX + bowSize, bowY, bowX, bowY - bowSize * 0.4, bowX, bowY + bowSize * 0.4); }
    rectMode(CORNER); noStroke();
}
// --- END drawStaticKitty ---

// updateAndDrawRainbowTrail (Moved to rainbow.js)
function drawPlushie(p) { fill(p.color); stroke(50); strokeWeight(max(1, p.size * 0.04)); rectMode(CENTER); rect(p.x, p.y, p.size, p.size); let eyeSize = p.size * 0.1; fill(40); ellipse(p.x - p.size * 0.2, p.y - p.size * 0.1, eyeSize, eyeSize); ellipse(p.x + p.size * 0.2, p.y - p.size * 0.1, eyeSize, eyeSize); rectMode(CORNER); noStroke(); }
function checkCollision(player, obj) { if(!player || !obj) return false; let kittyLeft = player.x - player.size / 2, kittyRight = player.x + player.size / 2; let kittyTop = player.y - player.size / 2, kittyBottom = player.y + player.size / 2; let plushieLeft = obj.x - obj.size / 2, plushieRight = obj.x + obj.size / 2; let plushieTop = obj.y - obj.size / 2, plushieBottom = obj.y + obj.size / 2; let noOverlap = kittyLeft > plushieRight || kittyRight < plushieLeft || kittyTop > plushieBottom || kittyBottom < plushieTop; return !noOverlap; }
function isPointInKitty(px, py) { if(!kitty) return false; let buffer = kitty.size * 0.5; let kittyLeft = kitty.x - kitty.size / 2 - buffer, kittyRight = kitty.x + kitty.size / 2 + buffer; let kittyTop = kitty.y - kitty.size / 2 - buffer, kittyBottom = kitty.y + kitty.size / 2 + buffer; return px >= kittyLeft && px <= kittyRight && py >= kittyTop && py <= kittyBottom; }

// --- Input Handling --- (Uses pressY correctly now)
function handlePressStart() {
  if (!userHasInteracted) { userHasInteracted = true; userStartAudio().then(() => { console.log("Audio context ready! Nyaa!"); audioStarted = true; }, (e) => { console.error("userStartAudio failed:", e); audioStarted = false; }); }
  let pressX = mouseX; let pressY = mouseY; // Use correct variable name
  try { if (touches.length > 0 && touches[0]) { pressX = touches[0].x; pressY = touches[0].y; } } catch(e) { console.warn("Error accessing touch data:", e); return; }
  let endlessButtonDefined = (typeof endlessModeButton !== 'undefined' && endlessModeButton !== null); let storeButtonDefined = (typeof storeButton !== 'undefined' && storeButton !== null); let gachaButtonDefined = (typeof gachaButton !== 'undefined' && gachaButton !== null); let backButtonDefined = (typeof backButton !== 'undefined' && backButton !== null); let updateButtonDefined = (typeof updateButton !== 'undefined' && updateButton !== null);

  if (gameState === 'playing' && isEndlessMode && backButtonDefined) { if (pressX >= backButton.x && pressX <= backButton.x + backButton.w && pressY >= backButton.y && pressY <= backButton.y + backButton.h) { console.log("Back button pressed!"); if (highestStreakInSession > endlessHighScore) { endlessHighScore = highestStreakInSession; try { localStorage.setItem('kittyEndlessHighScore', endlessHighScore); console.log("New Endless High Score Saved:", endlessHighScore); } catch(e){ console.warn("Failed to save endless high score:", e); } } try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("Failed to save total plushies:", e); } gameState = 'start'; resetGame(); return; } }
  if (gameState === 'start') { if (updateButtonDefined && pressX >= updateButton.x && pressX <= updateButton.x + updateButton.w && pressY >= updateButton.y && pressY <= updateButton.y + updateButton.h) { if (updateButtonState === 'idle' || updateButtonState === 'uptodate' || updateButtonState === 'error') { checkVersion(); } else if (updateButtonState === 'available') { console.log("Reloading for update..."); window.location.reload(true); } return; } if (endlessButtonDefined && pressX >= endlessModeButton.x && pressX <= endlessModeButton.x + endlessModeButton.w && pressY >= endlessModeButton.y && pressY <= endlessModeButton.y + endlessModeButton.h) { isEndlessMode = !isEndlessMode; console.log("Endless Mode Toggled:", isEndlessMode); return; } if (storeButtonDefined && pressX >= storeButton.x && pressX <= storeButton.x + storeButton.w && pressY >= storeButton.y && pressY <= storeButton.y + storeButton.h) { console.log("Store button pressed! Entering store..."); gameState = 'store'; return; } if (gachaButtonDefined && pressX >= gachaButton.x && pressX <= gachaButton.x + gachaButton.w && pressY >= gachaButton.y && pressY <= gachaButton.y + gachaButton.h) { console.log("Gacha button pressed! Entering Gacha screen..."); gameState = 'gacha'; return; } kitty.hasJetpack = true; resetGame(); gameState = 'playing'; return; }
  else if (gameState === 'store') { if (typeof handleStoreInput === 'function') { let purchaseCost = handleStoreInput(pressX, pressY, totalPlushiesCollected); if (typeof purchaseCost === 'number' && purchaseCost > 0) { totalPlushiesCollected -= purchaseCost; try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("Failed to save total plushies after purchase:", e); } } } else { console.warn("handleStoreInput function not found! Switching back to start."); gameState = 'start'; } return; }
  else if (gameState === 'gacha') { if (typeof handleGachaInput === 'function' && typeof GACHA_COST !== 'undefined') { let gachaAction = handleGachaInput(pressX, pressY, totalPlushiesCollected); if (gachaAction === 'start_pull' && GACHA_COST > 0) { console.log(`Deducting ${GACHA_COST} plushies for gacha in sketch.js.`); totalPlushiesCollected -= GACHA_COST; try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); } catch(e){ console.warn("Failed to save total plushies after gacha pull:", e); } } else if (gachaAction === 'pull_fail_cost') { console.log("Sketch received 'pull_fail_cost'."); } } else { console.warn("handleGachaInput function or GACHA_COST not found! Switching back to start."); gameState = 'start'; } return; }
  else if (gameState === 'intro') { if (introStep < 12) { if (introStep === 1) { shakeTime = 15; } else if (introStep === 5) { kitty.hasJetpack = true; } else { shakeTime = 0; } introStep++; } else { gameState = 'start'; } }
  else if (gameState === 'gameOverCutscene') { if (cutsceneStep < 6) { if (cutsceneStep === 2) { shakeTime = 15; } else if (cutsceneStep === 3) { shakeTime = 15;} else { shakeTime = 0; } cutsceneStep++; } else { gameState = 'gameOver'; } }
  else if (gameState === 'gameOver') { gameState = 'start'; }
  else if (gameState === 'playing') { if (pressX !== undefined && kitty && isPointInKitty(pressX, pressY)) { isDragging = true; } }
}

// --- Version Check Function --- (No changes)
function checkVersion() { if (updateButtonState === 'checking') return; console.log("Checking for updates..."); updateButtonState = 'checking'; updateButtonText = "Checking..."; clearTimeout(updateCheckTimeout); const versionUrl = 'version.json'; fetch(versionUrl + '?t=' + Date.now()).then(response => { if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); } return response.json(); }).then(data => { if (data && data.version) { console.log(`Current Version: ${gameVersion}, Latest Version: ${data.version}`); if (data.version !== gameVersion) { console.log("Update Available!"); updateButtonState = 'available'; updateButtonText = "Update Found!"; } else { console.log("Game is up to date! Nya~!"); updateButtonState = 'uptodate'; updateButtonText = "Up to Date! ♡"; updateCheckTimeout = setTimeout(() => { updateButtonState = 'idle'; updateButtonText = "Check Updates"; }, 3000); } } else { throw new Error("Invalid version data received."); } }).catch(error => { console.error("Error checking version:", error); updateButtonState = 'error'; updateButtonText = "Check Failed :("; updateCheckTimeout = setTimeout(() => { updateButtonState = 'idle'; updateButtonText = "Check Updates"; }, 5000); }); }

// Standard p5 mouse/touch listeners (No changes)
function mousePressed() { handlePressStart(); if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) { return false; } }
function touchStarted() { handlePressStart(); if (touches.length > 0 && touches[0] && touches[0].x > 0 && touches[0].x < width && touches[0].y > 0 && touches[0].y < height) { return false; } }
function mouseDragged() { if (isDragging && gameState === 'playing') { if(!kitty) return; kitty.x = mouseX; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); return false; } }
function touchMoved() { if (isDragging && gameState === 'playing') { if(!kitty) return; if (touches.length > 0 && touches[0]) { kitty.x = touches[0].x; kitty.x = constrain(kitty.x, kitty.size / 2, width - kitty.size / 2); } return false; } }
function mouseReleased() { if (isDragging) { isDragging = false; } }
function touchEnded() { if (isDragging) { isDragging = false; } }

// resetGame (No changes)
function resetGame() { if (lastGameState === 'playing') { try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); console.log("Total plushies saved on reset:", totalPlushiesCollected); } catch(e){ console.warn("Failed to save total plushies:", e); } } score = 0; if (!isEndlessMode) lives = 3; plushies = []; difficultyStage = 0; visualStage = 0; previousVisualStage = 0; currentStreak = 0; highestStreakInSession = 0; if(kitty) kitty.x = width / 2; isDragging = false; frameCount = 0; shakeTime = 0; initializeBackgroundElements(); earthY = height * 1.5; lastDifficultyIncreaseScore = -1; currentEncouragingMessage = random(encouragingMessages); transitionStartTime = -Infinity; if(skyColors && skyColors.length > 0) { currentBgColor = skyColors[0]; targetBgColor = skyColors[0]; } cutsceneStep = 0; }

// END OF PART 2