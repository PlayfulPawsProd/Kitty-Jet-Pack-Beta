// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Fixing Input Bugs! Nya~! ♡

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
let machineBox;

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
function createGachaPool() { console.log("Creating Gacha Pool..."); gachaColorPool = []; if (typeof storeItems === 'undefined' || !Array.isArray(storeItems)) { console.error("Cannot create gacha pool: storeItems missing!"); gachaColorPool.push('error_pool_creation_failed'); return; } const rarityWeights = { common: 15, uncommon: 7, rare: 3, super_rare: 1 }; storeItems.forEach(item => { if (item && item.type === 'kitty_color' && item.id !== 'default') { let weight = rarityWeights[item.rarity] || 1; for (let i = 0; i < weight; i++) { gachaColorPool.push(item.id); } } }); if (gachaColorPool.length === 0) { console.error("Gacha Pool empty!"); gachaColorPool.push('error_empty_pool'); } else { console.log(`Gacha Pool created: ${gachaColorPool.length} entries.`); } }

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { console.log(">>> Calculating Gacha layout..."); canvasW = Number(canvasW) || 600; canvasH = Number(canvasH) || 400; if (isNaN(canvasW) || isNaN(canvasH) || canvasW <= 0 || canvasH <=0) { console.error("!!! Invalid canvas dimensions for Gacha layout:", canvasW, canvasH); canvasW = 600; canvasH = 400; } try { gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; let machineWidth = canvasW * 0.6; let machineHeight = canvasH * 0.6; machineBox = { x: Number(canvasW / 2 - machineWidth / 2) || 0, y: Number(canvasH * 0.18) || 0, w: Number(machineWidth) || 1, h: Number(machineHeight) || 1 }; let pullButtonSize = machineBox.w * 0.3; gachaPullButton = { x: Number(machineBox.x + machineBox.w / 2 - pullButtonSize / 2) || 0, y: Number(machineBox.y + machineBox.h * 0.65) || 0, w: Number(pullButtonSize) || 1, h: Number(pullButtonSize * 0.7) || 1 }; if (isNaN(machineBox.x) || isNaN(machineBox.y) || isNaN(machineBox.w) || isNaN(machineBox.h)) { console.error(">>> NaN detected in machineBox calculation!", machineBox); machineBox = {x:50, y:50, w:100, h:200}; } if (isNaN(gachaPullButton.x) || isNaN(gachaPullButton.y) || isNaN(gachaPullButton.w) || isNaN(gachaPullButton.h)) { console.error(">>> NaN detected in gachaPullButton calculation!", gachaPullButton); gachaPullButton = {x:75, y:150, w:50, h:40}; } console.log(">>> Gacha layout calculated!", machineBox); } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:0,y:0,w:1,h:1}; gachaPullButton={x:0,y:0,w:1,h:1};} }

// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) {
    // console.log("--- Entering displayGacha ---"); // Keep logs minimal unless debugging specific part
    const dependencies = [ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ];
    let missingDep = null;
    for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { missingDep = dep.name; break; } }
    if (missingDep) { console.error(`Gacha display dependency missing: ${missingDep}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${missingDep}\nCheck console.`, width / 2, height / 2); return; }
    // console.log(">>> Gacha Dependencies OK.");
    if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { console.error(">>> Gacha Pool Error State!"); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; }

    try { // --- Normal Drawing ---
        // console.log(">>> Starting Gacha Draw block...");
        if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles(); fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); } drawMachineBase(); pop(); drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay(); drawPullButton(currentTotalPlushies); drawGachaBackButton(); drawGachaMika();
        textAlign(CENTER, CENTER); noStroke();
        // console.log(">>> Finished Gacha Draw block.");
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
function drawMachineBase() { /* ... */ } function drawPullButton(currentTotalPlushies) { /* ... */ } function drawGachaBackButton() { /* ... */ }
function drawGachaMika() { if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !gachaBackButton) { return; } try { let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer; if (mikaX - mikaSize / 2 < gachaBackButton.x + gachaBackButton.w + 10) { mikaX = gachaBackButton.x + gachaBackButton.w + 10 + mikaSize / 2; } drawStaticKitty(mikaX, mikaY, mikaSize); if (gachaMikaCommentaryTimer <= 0 && gachaMikaCommentary === "") { setGachaMikaCommentary("Push the button, Master! Let's see what happens!"); } if (gachaMikaCommentaryTimer > 0) { gachaMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(gachaMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { gachaMikaCommentary = ""; } } catch (e) { console.error("Error drawing gacha Mika:", e); } }

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

// --- Handle Gacha Input (FIXED py and added checks) ---
function handleGachaInput(px, py, currentTotalPlushies) {
    console.log(`>>> handleGachaInput called with px=${px}, py=${py}`); // DEBUG

    if (isGachaAnimating) { console.log(">>> Gacha animating, input blocked."); return true; }
    if (!gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error(">>> gachaBackButton not defined in handleGachaInput!"); return false; }
    if (!gachaPullButton || typeof gachaPullButton.x === 'undefined') { console.error(">>> gachaPullButton not defined in handleGachaInput!"); return false; }

    // 1. Check Back Button
    if (px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h) {
        console.log(">>> Gacha Back button CLICKED!");
        if(typeof gameState !== 'undefined') { gameState = 'start'; gachaMikaCommentary = ""; gachaMikaCommentaryTimer = 0; return 'back'; }
        else { console.error(">>> Cannot change gameState!"); return false; }
    }

    // 2. Check Pull Button
    if (px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) {
        console.log(">>> Gacha Pull button CLICKED!");
        if (gachaColorPool.length > 0 && !gachaColorPool[0].startsWith('error_')) {
             if (typeof startGachaAnimation === 'function') { startGachaAnimation(); return 'start_pull'; }
             else { console.error(">>> startGachaAnimation function missing!"); return false; }
        } else {
            if(typeof setGachaMikaCommentary === 'function') { setGachaMikaCommentary("Machine looks broken... Nya..."); }
            else { console.error(">>> setGachaMikaCommentary is missing!"); }
            return 'pull_fail_pool';
        }
    }

    console.log(">>> No Gacha button hit.");
    return false; // Click wasn't handled
}

// --- Dependencies ---