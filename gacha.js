// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - DEBUGGING VANISHING MACHINE! Nya~!

// ... (Keep Gacha Settings, Pool, State, Commentary, Particles etc. same) ...
let gachaColorPool = []; let prizeDisplay = null; let pendingPrizeId = null;
let gachaBackButton; let gachaPullButton; let machineBox; // <--- Make sure this isn't getting messed up
let isGachaAnimating = false; let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];
let gachaMikaCommentary = ""; let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240;
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;
const GACHA_COST = 0; const PULL_ANIMATION_DURATION = 300;


// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() { /* ... (Same as before) ... */ }

// --- Calculate dynamic Gacha layout elements (Check for NaN/Zero, better fallback) ---
function setupGachaLayout(canvasW, canvasH) {
    console.log(">>> Calculating Gacha layout...");
    canvasW = Number(canvasW) || 600; canvasH = Number(canvasH) || 400;
    if (isNaN(canvasW) || isNaN(canvasH) || canvasW <= 0 || canvasH <=0) { console.error("!!! Invalid canvas dimensions:", canvasW, canvasH); canvasW = 600; canvasH = 400; }

    try {
        gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 };
        let machineWidth = canvasW * 0.6;
        let machineHeight = canvasH * 0.6;
        machineBox = {
            x: canvasW / 2 - machineWidth / 2,
            y: canvasH * 0.18,
            w: machineWidth,
            h: machineHeight
        };
        // ** Check for NaN or Zero width/height **
        if (isNaN(machineBox.x) || isNaN(machineBox.y) || isNaN(machineBox.w) || isNaN(machineBox.h) || machineBox.w <= 0 || machineBox.h <= 0) {
             console.error(">>> Invalid values calculated for machineBox! Using fallback.", machineBox);
             // Make fallback VERY obvious
             machineBox = {x: canvasW * 0.2, y: canvasH * 0.2, w: canvasW * 0.6, h: canvasH * 0.6, fallback: true};
        }

        let pullButtonSize = machineBox.w * 0.3;
        gachaPullButton = {
            x: machineBox.x + machineBox.w / 2 - pullButtonSize / 2,
            y: machineBox.y + machineBox.h * 0.65,
            w: pullButtonSize,
            h: pullButtonSize * 0.7
        };
         if (isNaN(gachaPullButton.x) || isNaN(gachaPullButton.y) || isNaN(gachaPullButton.w) || isNaN(gachaPullButton.h) || gachaPullButton.w <= 0 || gachaPullButton.h <= 0) {
             console.error(">>> Invalid values calculated for gachaPullButton! Using fallback.", gachaPullButton);
             gachaPullButton = {x: machineBox.x + 20, y: machineBox.y + machineBox.h - 60, w: 80, h: 40, fallback: true}; // Fallback button
         }
        console.log(">>> Gacha layout calculated!", machineBox);
    } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:50,y:50,w:100,h:200, fallback:true}; gachaPullButton={x:75, y:150, w:50, h:40, fallback:true};}
}


// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) { /* ... (Keep dependency check) ... */ const dependencies = [ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ]; let missingDep = null; for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { missingDep = dep.name; break; } } if (missingDep) { console.error(`Gacha display dependency missing: ${missingDep}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${missingDep}\nCheck console.`, width / 2, height / 2); return; } if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; } try { if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } } updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles(); fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); } drawMachineBase(); pop(); drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay(); drawPullButton(currentTotalPlushies); drawGachaBackButton(); drawGachaMika(); textAlign(CENTER, CENTER); noStroke(); } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); } }

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
// --- drawMachineBase (ADDED LOGGING & FALLBACK COLOR) ---
function drawMachineBase() {
    // ** Check if machineBox exists and has valid properties **
    if (!machineBox || typeof machineBox.x !== 'number' || typeof machineBox.y !== 'number' || typeof machineBox.w !== 'number' || typeof machineBox.h !== 'number' || machineBox.w <= 0 || machineBox.h <= 0 ) {
         console.error(">>> drawMachineBase called with invalid machineBox:", machineBox);
         // Draw a bright error box instead?
         fill(255, 0, 0, 150); // Bright semi-transparent red
         rectMode(CORNER);
         rect(10, 10, width - 20, height - 20); // Draw covering most of screen
         fill(255); textSize(20); textAlign(CENTER,CENTER);
         text("Machine Box Error!", width/2, height/2);
         return; // Stop drawing the rest of the machine
     }

    // Log the values being used
    console.log(`>>> Drawing Machine Base with: x=${machineBox.x.toFixed(1)}, y=${machineBox.y.toFixed(1)}, w=${machineBox.w.toFixed(1)}, h=${machineBox.h.toFixed(1)}`);

    rectMode(CORNER);
    // Use a bright color if it's the fallback object
    if (machineBox.fallback) { fill(255, 0, 255); } // Bright Magenta for fallback
    else { fill(100, 100, 110); } // Normal grey
    rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); // Main Body

     // --- Draw other parts relative to machineBox ---
     fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); // Smoke Pipe
     fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); // Hopper
     fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); // Chute
     fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); // Warning Sign
     fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); // Sign text
}
function drawPullButton(currentTotalPlushies) { /* ... (Same) ... */ }
function drawGachaBackButton() { /* ... (Same) ... */ }
function drawGachaMika() { /* ... (Same) ... */ }

// --- Animation Logic ---
function startGachaAnimation() { /* ... (Same) ... */ }
function updateGachaAnimation() { /* ... (Same) ... */ }

// --- Particle Spawning ---
function spawnSmokeParticle(x, y) { /* ... */ } function spawnSparkParticle() { /* ... */ } function spawnSpentPlushieParticles() { /* ... */ }

// --- Particle Updating ---
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }

// --- Particle Drawing ---
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input ---
function handleGachaInput(px, py, currentTotalPlushies) { /* ... (Same as last version with checks) ... */ }

// --- Dependencies ---