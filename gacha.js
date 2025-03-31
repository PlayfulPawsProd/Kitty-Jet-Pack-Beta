// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Debugging Missing Button & Mika! Nya~!

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
function createGachaPool() { /* ... (Same as before) ... */ }

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { /* ... (Same as before, with NaN checks) ... */ console.log(">>> Calculating Gacha layout..."); canvasW = Number(canvasW) || 600; canvasH = Number(canvasH) || 400; if (isNaN(canvasW) || isNaN(canvasH) || canvasW <= 0 || canvasH <=0) { console.error("!!! Invalid canvas dimensions for Gacha layout:", canvasW, canvasH); canvasW = 600; canvasH = 400; } try { gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; let machineWidth = canvasW * 0.6; let machineHeight = canvasH * 0.6; machineBox = { x: Number(canvasW / 2 - machineWidth / 2) || 0, y: Number(canvasH * 0.18) || 0, w: Number(machineWidth) || 1, h: Number(machineHeight) || 1 }; if (isNaN(machineBox.x) || isNaN(machineBox.y) || isNaN(machineBox.w) || isNaN(machineBox.h) || machineBox.w <= 0 || machineBox.h <= 0) { console.error(">>> Invalid values for machineBox! Using fallback.", machineBox); machineBox = {x: canvasW * 0.2, y: canvasH * 0.2, w: canvasW * 0.6, h: canvasH * 0.6, fallback: true}; } let pullButtonSize = machineBox.w * 0.3; gachaPullButton = { x: Number(machineBox.x + machineBox.w / 2 - pullButtonSize / 2) || 0, y: Number(machineBox.y + machineBox.h * 0.65) || 0, w: Number(pullButtonSize) || 1, h: Number(pullButtonSize * 0.7) || 1 }; if (isNaN(gachaPullButton.x) || isNaN(gachaPullButton.y) || isNaN(gachaPullButton.w) || isNaN(gachaPullButton.h) || gachaPullButton.w <= 0 || gachaPullButton.h <= 0) { console.error(">>> Invalid values for gachaPullButton! Using fallback.", gachaPullButton); gachaPullButton = {x: machineBox.x + 20, y: machineBox.y + machineBox.h - 60, w: 80, h: 40, fallback: true}; } console.log(">>> Gacha layout calculated!", machineBox, gachaPullButton); } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:50,y:50,w:100,h:200, fallback:true}; gachaPullButton={x:75, y:150, w:50, h:40, fallback:true};} }


// --- Display Gacha Screen (ADDED LOGS before button/mika draw) ---
function displayGacha(currentTotalPlushies) {
    // Dependency Check... (Keep this)
    const dependencies = [ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ];
    let missingDep = null; for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { missingDep = dep.name; break; } } if (missingDep) { console.error(`Gacha display dependency missing: ${missingDep}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${dep.name}\nCheck console.`, width / 2, height / 2); return; }
    if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; }

    try { // --- Normal Drawing ---
        if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles();
        fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height);
        fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04);
        textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke();
        push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); }
        drawMachineBase(); // Machine Base (Restored Original)
        pop();
        drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay();

        // --- DEBUG LOGS ADDED ---
        console.log(">>> Attempting to draw Pull Button. Data:", gachaPullButton);
        drawPullButton(currentTotalPlushies); // Pull Button
        console.log(">>> Attempting to draw Back Button. Data:", gachaBackButton);
        drawGachaBackButton(); // Back Button
        console.log(">>> Attempting to draw Mika. Back Button for Ref:", gachaBackButton);
        drawGachaMika(); // Mika + Commentary
        // --- END DEBUG LOGS ---

        textAlign(CENTER, CENTER); noStroke();
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
// --- drawMachineBase (RESTORED ORIGINAL DRAWING CODE) ---
function drawMachineBase() {
    if (!machineBox || typeof machineBox.x !== 'number' || typeof machineBox.y !== 'number' || typeof machineBox.w !== 'number' || typeof machineBox.h !== 'number' || machineBox.w <= 0 || machineBox.h <= 0 ) { console.error(">>> drawMachineBase called with invalid machineBox:", machineBox); return; }
    // console.log(`>>> Drawing Machine Base with: x=${machineBox.x.toFixed(1)}, y=${machineBox.y.toFixed(1)}, w=${machineBox.w.toFixed(1)}, h=${machineBox.h.toFixed(1)}`); // Optional log
    rectMode(CORNER);
    fill(100, 100, 110); rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); // Main Body
    fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); // Smoke Pipe
    fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); // Hopper
    fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); // Chute
    fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); // Warning Sign
    fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); // Sign text
}
// --- drawPullButton (ADDED LOGS) ---
function drawPullButton(currentTotalPlushies) {
    console.log(">>> Inside drawPullButton. Data:", gachaPullButton); // DEBUG LOG
    if (!gachaPullButton || typeof gachaPullButton.x !== 'number' || typeof color !== 'function') { console.error("Cannot draw Pull Button - data/color missing"); return; }
    let btnColor = color(200, 0, 0); let btnTextColor = color(255); let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`;
    if (isGachaAnimating) { btnColor = color(100); btnTextColor = color(150); btnText = "Working..."; } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) { btnColor = color(150, 0, 0); btnTextColor = color(200); }
    rectMode(CORNER); fill(btnColor); stroke(50); strokeWeight(1); rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5);
    fill(btnTextColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2);
}
// --- drawGachaBackButton (ADDED LOGS) ---
function drawGachaBackButton() {
    console.log(">>> Inside drawGachaBackButton. Data:", gachaBackButton); // DEBUG LOG
    if (!gachaBackButton || !backButtonColor || !textColor || !textStrokeColor) { console.error("Cannot draw Back Button - data/colors missing"); return; }
    try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing gacha back button:", e); }
}
// --- drawGachaMika (ADDED LOGS) ---
function drawGachaMika() {
    console.log(">>> Inside drawGachaMika. Back Button for Ref:", gachaBackButton); // DEBUG LOG
    if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error("Deps missing for drawGachaMika!"); return; }
    try {
        let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer;
        if (mikaX - mikaSize / 2 < gachaBackButton.x + gachaBackButton.w + 10) { mikaX = gachaBackButton.x + gachaBackButton.w + 10 + mikaSize / 2; }
        console.log(`>>> Drawing Mika at x=${mikaX.toFixed(1)}, y=${mikaY.toFixed(1)}`); // DEBUG LOG
        drawStaticKitty(mikaX, mikaY, mikaSize); // Draw me
        // Draw commentary bubble... (same logic)
        if (gachaMikaCommentaryTimer <= 0 && gachaMikaCommentary === "") { setGachaMikaCommentary("Push the button, Master! Let's see what happens!"); } if (gachaMikaCommentaryTimer > 0) { gachaMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(gachaMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { gachaMikaCommentary = ""; }
    } catch (e) { console.error("Error drawing gacha Mika:", e); }
}


// --- Animation Logic ---
function startGachaAnimation() { /* ... (Same) ... */ }
function updateGachaAnimation() { /* ... (Same) ... */ }
// --- Particle Spawning ---
function spawnSmokeParticle(x, y) { /* ... */ } function spawnSparkParticle() { /* ... */ } function spawnSpentPlushieParticles() { /* ... */ }
// --- Particle Updating ---
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }
// --- Particle Drawing ---
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }
// --- Draw Prize Display ---
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input ---
function handleGachaInput(px, py, currentTotalPlushies) { /* ... (Same as last fix) ... */ }

// --- Dependencies ---