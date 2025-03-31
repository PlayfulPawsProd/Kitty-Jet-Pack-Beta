// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - DEBUGGING Where is it breaking?! Nya~!

// --- Gacha Settings ---
const GACHA_COST = 0;
const PULL_ANIMATION_DURATION = 300;

// --- Gacha Prize Pool ---
let gachaColorPool = [];
let prizeDisplay = null;
let pendingPrizeId = null;

// --- Gacha Screen UI Elements ---
let gachaBackButton;
let gachaPullButton;
let machineBox;

// --- Gacha Animation State ---
let isGachaAnimating = false; let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];

// --- Mika Commentary (Gacha Specific) ---
let gachaMikaCommentary = "";
let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240;

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;

// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() { /* ... (Same as before) ... */ console.log("Creating Gacha Pool..."); gachaColorPool = []; if (typeof storeItems === 'undefined' || !Array.isArray(storeItems)) { console.error("Cannot create gacha pool: storeItems missing!"); gachaColorPool.push('error_pool_creation_failed'); return; } const rarityWeights = { common: 15, uncommon: 7, rare: 3, super_rare: 1 }; storeItems.forEach(item => { if (item && item.type === 'kitty_color' && item.id !== 'default') { let weight = rarityWeights[item.rarity] || 1; for (let i = 0; i < weight; i++) { gachaColorPool.push(item.id); } } }); if (gachaColorPool.length === 0) { console.error("Gacha Pool empty!"); gachaColorPool.push('error_empty_pool'); } else { console.log(`Gacha Pool created: ${gachaColorPool.length} entries.`); } }

// --- Calculate dynamic Gacha layout elements (ADDED NaN CHECKS & LOGS) ---
function setupGachaLayout(canvasW, canvasH) {
    console.log(">>> Calculating Gacha layout..."); // DEBUG LOG
    // Ensure inputs are valid numbers
    canvasW = Number(canvasW) || 600; // Use default if invalid
    canvasH = Number(canvasH) || 400;
    if (isNaN(canvasW) || isNaN(canvasH) || canvasW <= 0 || canvasH <=0) {
        console.error("!!! Invalid canvas dimensions for Gacha layout:", canvasW, canvasH);
        canvasW = 600; canvasH = 400; // Reset to defaults
    }

    try {
        gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 };
        let machineWidth = canvasW * 0.6;
        let machineHeight = canvasH * 0.6;
        machineBox = {
            x: Number(canvasW / 2 - machineWidth / 2) || 0,
            y: Number(canvasH * 0.18) || 0,
            w: Number(machineWidth) || 1,
            h: Number(machineHeight) || 1
        };
        let pullButtonSize = machineBox.w * 0.3;
        gachaPullButton = {
            x: Number(machineBox.x + machineBox.w / 2 - pullButtonSize / 2) || 0,
            y: Number(machineBox.y + machineBox.h * 0.65) || 0,
            w: Number(pullButtonSize) || 1,
            h: Number(pullButtonSize * 0.7) || 1
        };
        // Check for NaN values after calculation
        if (isNaN(machineBox.x) || isNaN(machineBox.y) || isNaN(machineBox.w) || isNaN(machineBox.h)) {
             console.error(">>> NaN detected in machineBox calculation!", machineBox);
             machineBox = {x:50, y:50, w:100, h:200}; // Safe fallbacks
        }
         if (isNaN(gachaPullButton.x) || isNaN(gachaPullButton.y) || isNaN(gachaPullButton.w) || isNaN(gachaPullButton.h)) {
             console.error(">>> NaN detected in gachaPullButton calculation!", gachaPullButton);
             gachaPullButton = {x:75, y:150, w:50, h:40}; // Safe fallbacks
         }
        console.log(">>> Gacha layout calculated!", machineBox); // DEBUG LOG
    } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:0,y:0,w:1,h:1}; gachaPullButton={x:0,y:0,w:1,h:1};}
}


// --- Display Gacha Screen (MORE LOGS!) ---
function displayGacha(currentTotalPlushies) {
     console.log("--- Entering displayGacha ---"); // DEBUG LOG

    // ** Check ALL dependencies needed **
    const dependencies = [ /* ... same list as before ... */ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ];
    let missingDep = null;
    for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { missingDep = dep.name; break; } }
    if (missingDep) { console.error(`>>> Gacha display dependency missing: ${missingDep}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${missingDep}\nCheck console.`, width / 2, height / 2); return; }
    console.log(">>> Gacha Dependencies OK."); // DEBUG LOG

    if (gachaColorPool.length === 0) { console.log(">>> Gacha Pool empty, creating..."); createGachaPool(); }
    if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { console.error(">>> Gacha Pool Error State!"); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; }

    try { // --- Normal Drawing ---
        console.log(">>> Starting Gacha Draw block..."); // DEBUG LOG
        if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles();
        fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); // BG
        fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); // Title
        textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); // Count

        push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); }
        console.log(">>> Attempting to draw machine base..."); // DEBUG LOG
        drawMachineBase(); // Machine
        console.log(">>> Finished drawing machine base."); // DEBUG LOG
        pop();

        console.log(">>> Drawing particles..."); // DEBUG LOG
        drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay();
        console.log(">>> Drawing buttons and Mika..."); // DEBUG LOG
        drawPullButton(currentTotalPlushies); drawGachaBackButton(); drawGachaMika();
        textAlign(CENTER, CENTER); noStroke();
        console.log(">>> Finished Gacha Draw block."); // DEBUG LOG
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
function drawMachineBase() { if (!machineBox || typeof fill !== 'function') return; /* ... (Same simple drawing code) ... */ rectMode(CORNER); fill(100, 100, 110); rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); }
function drawPullButton(currentTotalPlushies) { /* ... (Same) ... */ if (!gachaPullButton || typeof color !== 'function') return; let btnColor = color(200, 0, 0); let btnTextColor = color(255); let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`; if (isGachaAnimating) { btnColor = color(100); btnTextColor = color(150); btnText = "Working..."; } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) { btnColor = color(150, 0, 0); btnTextColor = color(200); } rectMode(CORNER); fill(btnColor); stroke(50); strokeWeight(1); rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5); fill(btnTextColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2); }
function drawGachaBackButton() { /* ... (Same) ... */ if (!gachaBackButton || !backButtonColor || !textColor || !textStrokeColor) { return; } try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing gacha back button:", e); } }
function drawGachaMika() { /* ... (Same) ... */ if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !gachaBackButton) { return; } try { let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer; if (mikaX - mikaSize / 2 < gachaBackButton.x + gachaBackButton.w + 10) { mikaX = gachaBackButton.x + gachaBackButton.w + 10 + mikaSize / 2; } drawStaticKitty(mikaX, mikaY, mikaSize); if (gachaMikaCommentaryTimer <= 0 && gachaMikaCommentary === "") { setGachaMikaCommentary("Push the button, Master! Let's see what happens!"); } if (gachaMikaCommentaryTimer > 0) { gachaMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(gachaMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { gachaMikaCommentary = ""; } } catch (e) { console.error("Error drawing gacha Mika:", e); } }

// --- Animation Logic ---
function startGachaAnimation() { /* ... (Same) ... */ if (gachaColorPool.length === 0 || gachaColorPool[0].startsWith('error_')) { console.error("Cannot start gacha: Pool invalid!"); setGachaMikaCommentary("Nya? The machine seems broken..."); return; } isGachaAnimating = true; gachaAnimationTimer = 0; currentGachaStep = 'shaking'; prizeDisplay = null; spentPlushieParticles = []; sparkParticles = []; let rawPrizeId = random(gachaColorPool); if (typeof storeItems === 'undefined') { console.error("storeItems missing!"); pendingPrizeId = null; } else { let prizeItem = storeItems.find(item => item && item.id === rawPrizeId); if (!prizeItem) { console.error(`Pulled invalid ID: ${rawPrizeId}!`); pendingPrizeId = null; } else { pendingPrizeId = prizeItem.id; console.log(`Gacha prize determined: ${pendingPrizeId} (${prizeItem.name})`); } } setGachaMikaCommentary("Here we go! Don't break, stupid machine!"); console.log("Gacha animation started: shaking"); }
function updateGachaAnimation() { /* ... (Same) ... */ gachaAnimationTimer++; if (currentGachaStep === 'shaking' && gachaAnimationTimer > 60) { currentGachaStep = 'sparking'; setGachaMikaCommentary("Eek! Zappy! Is that safe?!"); } else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 150) { currentGachaStep = 'poofing'; setGachaMikaCommentary("POOF! There go my plushies... Hope it's worth it!"); spawnSpentPlushieParticles(); } else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 240) { currentGachaStep = 'dropping'; setGachaMikaCommentary("Clunk! What was that...?"); } else if (currentGachaStep === 'dropping' && gachaAnimationTimer > PULL_ANIMATION_DURATION - 30) { currentGachaStep = 'revealing'; console.log("Gacha step: revealing prize..."); if (typeof isItemCollected !== 'function' || typeof storeItems === 'undefined') { console.error("Deps missing for reveal!"); setGachaMikaCommentary("Nya! Error checking prize!"); prizeDisplay = { item: { name: "System Error!", type:'error' }, isNew: false }; } else if (!pendingPrizeId) { console.error("No prize ID!"); setGachaMikaCommentary("Huh? Nothing?! Rigged!"); prizeDisplay = { item: { name: "Nothing!", type:'error' }, isNew: false }; } else { let prizeItem = storeItems.find(item => item && item.id === pendingPrizeId); if (!prizeItem) { console.error("Prize ID invalid!"); setGachaMikaCommentary("Wha-? Prize vanished!"); prizeDisplay = { item: { name: "Error!", type:'error' }, isNew: false }; } else { let isNew = !isItemCollected(pendingPrizeId); if (isNew) { console.log("NEW ITEM!", prizeItem.name); collectedGachaItems[pendingPrizeId] = true; try { localStorage.setItem(`gacha_${pendingPrizeId}`, 'true'); console.log(`Saved gacha: ${pendingPrizeId}`); } catch (e) { console.warn(`LS save fail ${pendingPrizeId}:`, e); } if (prizeItem.rarity === 'super_rare') setGachaMikaCommentary(`NYA~! A ${prizeItem.name}!! SO RARE! ♡`); else if (prizeItem.rarity === 'rare') setGachaMikaCommentary(`Ooh! A ${prizeItem.name}! Pretty!`); else setGachaMikaCommentary(`Yay! New: ${prizeItem.name}!`); } else { console.log("DUPLICATE!", prizeItem.name); setGachaMikaCommentary(`Hmph. Another ${prizeItem.name}. Already got that...`); } prizeDisplay = { item: prizeItem, isNew: isNew }; } } pendingPrizeId = null; } else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 90) { currentGachaStep = 'idle'; isGachaAnimating = false; console.log("Gacha animation finished."); setGachaMikaCommentary("Ready for another go, Master? Hehe~"); prizeDisplay = null; } if (currentGachaStep === 'sparking' && frameCount % 4 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) { spawnSparkParticle(); } if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 20 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }

// --- Particle Spawning ---
function spawnSmokeParticle(x, y) { /* ... */ } function spawnSparkParticle() { /* ... */ } function spawnSpentPlushieParticles() { /* ... */ }

// --- Particle Updating ---
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }

// --- Particle Drawing ---
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }

// --- Draw Prize Display ---
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input ---
function handleGachaInput(px, py, currentTotalPlushies) { /* ... */ }

// --- Dependencies ---