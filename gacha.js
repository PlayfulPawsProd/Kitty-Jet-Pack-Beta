// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - VISUALIZING the Pull Button! Nya~!

// ... (Keep Gacha Settings, Pool, State, Commentary, Particles etc. same) ...
let gachaColorPool = []; let prizeDisplay = null; let pendingPrizeId = null;
let gachaBackButton; let gachaPullButton; let machineBox;
let isGachaAnimating = false; let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];
let gachaMikaCommentary = ""; let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240;
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;
const GACHA_COST = 0; const PULL_ANIMATION_DURATION = 300;


// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() { /* ... */ }

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { /* ... */ }


// --- Display Gacha Screen (ADDED HITBOX VISUALIZATION!) ---
function displayGacha(currentTotalPlushies) {
    // Dependency Check... (Keep this)
    const dependencies = [ /* ... */ ]; let missingDep = null; /* ... check ... */ if (missingDep) { /* ... error display ... */ return; }
    if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { /* ... pool error display ... */ return; }

    try { // --- Normal Drawing ---
        if (isGachaAnimating) { updateGachaAnimation(); } else { /* ... idle smoke ... */ }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles();
        fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); // BG
        fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); // Title
        textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); // Count
        push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); } drawMachineBase(); pop(); // Machine
        drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay(); // Effects & Prize

        // --- Draw Buttons ---
        drawPullButton(currentTotalPlushies);
        drawGachaBackButton();

        // --- DEBUG: Draw Pull Button Hitbox --- (NEW!)
        if (gachaPullButton) {
             fill(0, 255, 0, 80); // Semi-transparent GREEN
             noStroke();
             rectMode(CORNER);
             rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h);
             console.log(`Debug Hitbox Drawn: ${gachaPullButton.x}, ${gachaPullButton.y}, ${gachaPullButton.w}, ${gachaPullButton.h}`); // Log coordinates used for hitbox
        }
        // --- End Debug Hitbox ---

        drawGachaMika(); // Mika

        textAlign(CENTER, CENTER); noStroke();
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
function drawMachineBase() { /* ... (Restored Original Code) ... */ if (!machineBox || typeof machineBox.x !== 'number' || typeof machineBox.y !== 'number' || typeof machineBox.w !== 'number' || typeof machineBox.h !== 'number' || machineBox.w <= 0 || machineBox.h <= 0 ) { console.error(">>> drawMachineBase called with invalid machineBox:", machineBox); fill(255, 0, 0, 150); rectMode(CORNER); rect(10, 10, width - 20, height - 20); fill(255); textSize(20); textAlign(CENTER,CENTER); text("Machine Box Error!", width/2, height/2); return; } /* console.log(`>>> Drawing Machine Base with: x=${machineBox.x.toFixed(1)}, y=${machineBox.y.toFixed(1)}, w=${machineBox.w.toFixed(1)}, h=${machineBox.h.toFixed(1)}`);*/ rectMode(CORNER); if (machineBox.fallback) { fill(255, 0, 255); } else { fill(100, 100, 110); } rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); }
function drawPullButton(currentTotalPlushies) { /* ... (No change needed) ... */ }
function drawGachaBackButton() { /* ... (No change needed) ... */ }
function drawGachaMika() { /* ... (No change needed) ... */ }

// --- Animation Logic ---
function startGachaAnimation() { /* ... */ } function updateGachaAnimation() { /* ... */ }
// --- Particle Spawning ---
function spawnSmokeParticle(x, y) { /* ... */ } function spawnSparkParticle() { /* ... */ } function spawnSpentPlushieParticles() { /* ... */ }
// --- Particle Updating ---
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }
// --- Particle Drawing ---
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }
// --- Draw Prize Display ---
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input (Keep Logs) ---
function handleGachaInput(px, py, currentTotalPlushies) {
    console.log(`>>> handleGachaInput called. Click at: (${px.toFixed(1)}, ${py.toFixed(1)})`); // Confirm coords received
    if (isGachaAnimating) { console.log(">>> Gacha animating, input blocked."); return true; }
    if (!gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error(">>> BACK BUTTON MISSING in handleGachaInput!"); return false; }
    if (!gachaPullButton || typeof gachaPullButton.x === 'undefined') { console.error(">>> PULL BUTTON MISSING in handleGachaInput!"); return false; }

    // 1. Check Back Button
    let isInsideBack = (px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h);
    console.log(`>>> Checking Back Btn: Bounds=(${gachaBackButton.x.toFixed(1)}, ${gachaBackButton.y.toFixed(1)}, ${gachaBackButton.w.toFixed(1)}, ${gachaBackButton.h.toFixed(1)}), Inside=${isInsideBack}`);
    if (isInsideBack) { console.log(">>> !!! Gacha Back button HIT !!!"); if(typeof gameState !== 'undefined') { gameState = 'start'; gachaMikaCommentary = ""; gachaMikaCommentaryTimer = 0; return 'back'; } else { console.error(">>> Cannot change gameState!"); return false; } }

    // 2. Check Pull Button
    let isInsidePull = (px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h);
    console.log(`>>> Checking Pull Btn: Bounds=(${gachaPullButton.x.toFixed(1)}, ${gachaPullButton.y.toFixed(1)}, ${gachaPullButton.w.toFixed(1)}, ${gachaPullButton.h.toFixed(1)}), Inside=${isInsidePull}`);
    if (isInsidePull) { console.log(">>> !!! Gacha Pull button HIT !!!"); if (gachaColorPool.length > 0 && !gachaColorPool[0].startsWith('error_')) { if (typeof startGachaAnimation === 'function') { startGachaAnimation(); return 'start_pull'; } else { console.error(">>> startGachaAnimation missing!"); return false; } } else { if(typeof setGachaMikaCommentary === 'function') { setGachaMikaCommentary("Machine looks broken... Nya..."); } else { console.error(">>> setGachaMikaCommentary missing!"); } return 'pull_fail_pool'; } }

    console.log(">>> No Gacha button hit this time.");
    return false; // Click wasn't handled
}

// --- Dependencies ---