// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Debugging Layout Calculation! Nya~!

// --- Gacha Settings ---
const GACHA_COST = 0;
const PULL_ANIMATION_DURATION = 300;

// --- Gacha Prize Pool ---
let gachaColorPool = [];
let prizeDisplay = null; // { item: object, isNew: boolean }
let pendingPrizeId = null; // Store the ID before reveal

// --- Gacha Screen UI Elements ---
let gachaBackButton; // Defined for this screen
let gachaPullButton;
let machineBox; // Will hold x, y, w, h

// --- Gacha Animation State ---
let isGachaAnimating = false; let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];

// --- Mika Commentary (Gacha Specific) ---
let gachaMikaCommentary = ""; // Renamed variable
let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240; // Renamed constant

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;

// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() {
    console.log("Creating Gacha Pool..."); gachaColorPool = [];
    if (typeof storeItems === 'undefined' || !Array.isArray(storeItems)) { console.error("Cannot create gacha pool: storeItems missing!"); gachaColorPool.push('error_pool_creation_failed'); return; }
    const rarityWeights = { common: 15, uncommon: 7, rare: 3, super_rare: 1 };
    storeItems.forEach(item => { if (item && item.type === 'kitty_color' && item.id !== 'default') { let weight = rarityWeights[item.rarity] || 1; for (let i = 0; i < weight; i++) { gachaColorPool.push(item.id); } } });
    if (gachaColorPool.length === 0) { console.error("Gacha Pool empty!"); gachaColorPool.push('error_empty_pool'); } else { console.log(`Gacha Pool created: ${gachaColorPool.length} entries.`); }
}

// --- Calculate dynamic Gacha layout elements (MORE LOGS & CHECKS!) ---
function setupGachaLayout(canvasW, canvasH) {
    console.log(`>>> Calculating Gacha layout with W=${canvasW}, H=${canvasH}`); // Log inputs

    // Ensure inputs are valid numbers, fallback if not
    let safeW = Number(canvasW) || 600;
    let safeH = Number(canvasH) || 400; // Use a default height if needed
    if (isNaN(safeW) || isNaN(safeH) || safeW <= 0 || safeH <= 0) {
        console.error("!!! Invalid canvas dimensions passed to setupGachaLayout:", canvasW, canvasH, "Using defaults:", safeW, safeH);
        safeW = 600; safeH = 400; // Reset to absolute defaults
    }

    try {
        // Back button (less likely to fail)
        gachaBackButton = { x: 15, y: safeH - 65, w: 100, h: 40 };

        // Machine calculations
        let machineWidth = safeW * 0.6;
        let machineHeight = safeH * 0.6;
        console.log(`>>> Calculated machine dims: W=${machineWidth.toFixed(1)}, H=${machineHeight.toFixed(1)}`); // Log calculated dims

        // ** Check calculated machine dimensions BEFORE creating machineBox **
        if (isNaN(machineWidth) || isNaN(machineHeight) || machineWidth <= 0 || machineHeight <= 0) {
             console.error(">>> !!! Calculated machineWidth or machineHeight is invalid!", machineWidth, machineHeight);
             // Use obvious fallback dimensions for the box
             machineBox = {x: safeW * 0.2, y: safeH * 0.2, w: safeW * 0.6, h: safeH * 0.6, fallback: true, error: "BadDims"};
        } else {
             // Calculate machineBox position
             let boxX = safeW / 2 - machineWidth / 2;
             let boxY = safeH * 0.18;
             console.log(`>>> Calculated machine pos: X=${boxX.toFixed(1)}, Y=${boxY.toFixed(1)}`); // Log calculated pos

             // ** Check calculated position **
             if (isNaN(boxX) || isNaN(boxY)) {
                  console.error(">>> !!! Calculated machineBox X or Y is NaN!", boxX, boxY);
                  machineBox = {x: safeW * 0.2, y: safeH * 0.2, w: machineWidth, h: machineHeight, fallback: true, error: "BadPos"};
             } else {
                  machineBox = { x: boxX, y: boxY, w: machineWidth, h: machineHeight };
             }
        }

        // Pull Button calculations (only if machineBox is valid)
        // Ensure machineBox exists and has width before calculating pull button size
        if (machineBox && typeof machineBox.w === 'number' && machineBox.w > 0 && !machineBox.error) {
            let pullButtonSize = machineBox.w * 0.3;
            let pullX = machineBox.x + machineBox.w / 2 - pullButtonSize / 2;
            let pullY = machineBox.y + machineBox.h * 0.65;
            let pullW = pullButtonSize;
            let pullH = pullButtonSize * 0.7;

             // ** Check pull button calculations **
            if (isNaN(pullX) || isNaN(pullY) || isNaN(pullW) || isNaN(pullH) || pullW <= 0 || pullH <= 0) {
                console.error(">>> Invalid values calculated for gachaPullButton! Using fallback.", {pullX, pullY, pullW, pullH});
                gachaPullButton = {x: machineBox.x + 20, y: machineBox.y + machineBox.h - 60, w: 80, h: 40, fallback: true, error:"BadPullCalc"};
            } else {
                 gachaPullButton = { x: pullX, y: pullY, w: pullW, h: pullH };
             }
        } else {
             // Machine box had error or invalid dims, use fallback for pull button too
             console.warn(">>> MachineBox error/invalid dims, using fallback pull button.");
             gachaPullButton = {x: (machineBox ? machineBox.x + 20 : 70), y: (machineBox ? machineBox.y + machineBox.h - 60 : 150), w: 80, h: 40, fallback: true, error:"MachineBoxError"};
         }

        console.log(">>> Gacha layout calculation finished. machineBox:", machineBox, "gachaPullButton:", gachaPullButton); // Final log

    } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:50,y:50,w:100,h:200, fallback:true, error:"Catch"}; gachaPullButton={x:75, y:150, w:50, h:40, fallback:true, error:"Catch"};}
}


// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) {
    // console.log("--- Entering displayGacha ---");
    const dependencies = [ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ];
    let missingDep = null; for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { missingDep = dep.name; break; } } if (missingDep) { console.error(`Gacha display dependency missing: ${missingDep}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${dep.name}\nCheck console.`, width / 2, height / 2); return; }
    if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; }

    try { // --- Normal Drawing ---
        if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles(); fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); } drawMachineBase(); pop(); drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay();
        // console.log(">>> Attempting to draw Pull Button. Data:", gachaPullButton);
        drawPullButton(currentTotalPlushies);
        // console.log(">>> Attempting to draw Back Button. Data:", gachaBackButton);
        drawGachaBackButton();
        // console.log(">>> Attempting to draw Mika. Back Button for Ref:", gachaBackButton);
        drawGachaMika();
        textAlign(CENTER, CENTER); noStroke();
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
// --- drawMachineBase (Restored Original Drawing Code + Fallback color) ---
function drawMachineBase() {
    if (!machineBox || typeof machineBox.x !== 'number' || typeof machineBox.y !== 'number' || typeof machineBox.w !== 'number' || typeof machineBox.h !== 'number' || machineBox.w <= 0 || machineBox.h <= 0 ) { console.error(">>> drawMachineBase called with invalid machineBox:", machineBox); fill(255, 0, 0, 150); rectMode(CORNER); rect(10, 10, width - 20, height - 20); fill(255); textSize(20); textAlign(CENTER,CENTER); text("Machine Box Error!", width/2, height/2); return; }
    // console.log(`>>> Drawing Machine Base with: x=${machineBox.x.toFixed(1)}, y=${machineBox.y.toFixed(1)}, w=${machineBox.w.toFixed(1)}, h=${machineBox.h.toFixed(1)}`);
    rectMode(CORNER); if (machineBox.fallback) { fill(255, 0, 255); console.log(">>> Using Fallback Machine Color!") } else { fill(100, 100, 110); } rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8);
}
// --- drawPullButton (Added Logs) ---
function drawPullButton(currentTotalPlushies) {
    // console.log(">>> Inside drawPullButton. Data:", gachaPullButton);
    if (!gachaPullButton || typeof gachaPullButton.x !== 'number' || typeof color !== 'function') { console.error("Cannot draw Pull Button - data/color missing"); return; }
    let btnColor = color(200, 0, 0); let btnTextColor = color(255); let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`; if (isGachaAnimating) { btnColor = color(100); btnTextColor = color(150); btnText = "Working..."; } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) { btnColor = color(150, 0, 0); btnTextColor = color(200); }
    rectMode(CORNER); fill(btnColor); stroke(50); strokeWeight(1); rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5);
    fill(btnTextColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2);
}
// --- drawGachaBackButton (Added Logs) ---
function drawGachaBackButton() {
    // console.log(">>> Inside drawGachaBackButton. Data:", gachaBackButton);
    if (!gachaBackButton || !backButtonColor || !textColor || !textStrokeColor) { console.error("Cannot draw Back Button - data/colors missing"); return; }
    try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing gacha back button:", e); }
}
// --- drawGachaMika (Added Logs) ---
function drawGachaMika() {
    // console.log(">>> Inside drawGachaMika. Back Button for Ref:", gachaBackButton);
    if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error("Deps missing for drawGachaMika!"); return; }
    try {
        let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer;
        if (mikaX - mikaSize / 2 < gachaBackButton.x + gachaBackButton.w + 10) { mikaX = gachaBackButton.x + gachaBackButton.w + 10 + mikaSize / 2; }
        // console.log(`>>> Drawing Mika at x=${mikaX.toFixed(1)}, y=${mikaY.toFixed(1)}`);
        drawStaticKitty(mikaX, mikaY, mikaSize); // Draw me
        if (gachaMikaCommentaryTimer <= 0 && gachaMikaCommentary === "") { setGachaMikaCommentary("Push the button, Master! Let's see what happens!"); } if (gachaMikaCommentaryTimer > 0) { gachaMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(gachaMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { gachaMikaCommentary = ""; }
    } catch (e) { console.error("Error drawing gacha Mika:", e); }
}


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

// --- Handle Gacha Input (With Logs) ---
function handleGachaInput(px, py, currentTotalPlushies) {
    console.log(`>>> handleGachaInput called. Click at: (${px.toFixed(1)}, ${py.toFixed(1)})`);
    if (isGachaAnimating) { console.log(">>> Gacha animating, input blocked."); return true; }
    if (!gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error(">>> BACK BUTTON MISSING in handleGachaInput!"); return false; }
    if (!gachaPullButton || typeof gachaPullButton.x === 'undefined') { console.error(">>> PULL BUTTON MISSING in handleGachaInput!"); return false; }

    let isInsideBack = (px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h);
    console.log(`>>> Checking Back Btn: Bounds=(${gachaBackButton.x.toFixed(1)}, ${gachaBackButton.y.toFixed(1)}, ${gachaBackButton.w.toFixed(1)}, ${gachaBackButton.h.toFixed(1)}), Inside=${isInsideBack}`);
    if (isInsideBack) { console.log(">>> !!! Gacha Back button HIT !!!"); if(typeof gameState !== 'undefined') { gameState = 'start'; gachaMikaCommentary = ""; gachaMikaCommentaryTimer = 0; return 'back'; } else { console.error(">>> Cannot change gameState!"); return false; } }

    let isInsidePull = (px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h);
    console.log(`>>> Checking Pull Btn: Bounds=(${gachaPullButton.x.toFixed(1)}, ${gachaPullButton.y.toFixed(1)}, ${gachaPullButton.w.toFixed(1)}, ${gachaPullButton.h.toFixed(1)}), Inside=${isInsidePull}`);
    if (isInsidePull) { console.log(">>> !!! Gacha Pull button HIT !!!"); if (gachaColorPool.length > 0 && !gachaColorPool[0].startsWith('error_')) { if (typeof startGachaAnimation === 'function') { startGachaAnimation(); return 'start_pull'; } else { console.error(">>> startGachaAnimation missing!"); return false; } } else { if(typeof setGachaMikaCommentary === 'function') { setGachaMikaCommentary("Machine looks broken... Nya..."); } else { console.error(">>> setGachaMikaCommentary missing!"); } return 'pull_fail_pool'; } }

    console.log(">>> No Gacha button hit this time.");
    return false;
}

// --- Dependencies ---