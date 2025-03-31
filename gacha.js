// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Fixing the shy screen bug! Nya~! ♡

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

// --- Mika Commentary (Gacha Specific) --- (Renamed!)
let gachaMikaCommentary = "";
let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240;

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;

// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() { /* ... (Same as before) ... */ console.log("Creating Gacha Pool..."); gachaColorPool = []; if (typeof storeItems === 'undefined' || !Array.isArray(storeItems)) { console.error("Cannot create gacha pool: storeItems missing!"); gachaColorPool.push('error_pool_creation_failed'); return; } const rarityWeights = { common: 15, uncommon: 7, rare: 3, super_rare: 1 }; storeItems.forEach(item => { if (item && item.type === 'kitty_color' && item.id !== 'default') { let weight = rarityWeights[item.rarity] || 1; for (let i = 0; i < weight; i++) { gachaColorPool.push(item.id); } } }); if (gachaColorPool.length === 0) { console.error("Gacha Pool empty!"); gachaColorPool.push('error_empty_pool'); } else { console.log(`Gacha Pool created: ${gachaColorPool.length} entries.`); } }

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { /* ... (Same as before) ... */ console.log("Calculating Gacha layout..."); try { gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; machineBox = { x: canvasW / 2 - (canvasW * 0.6) / 2, y: canvasH * 0.18, w: canvasW * 0.6, h: canvasH * 0.6 }; let pullButtonSize = machineBox.w * 0.3; gachaPullButton = { x: machineBox.x + machineBox.w / 2 - pullButtonSize / 2, y: machineBox.y + machineBox.h * 0.65, w: pullButtonSize, h: pullButtonSize * 0.7 }; console.log("Gacha layout calculated!"); } catch (e) { console.error("Error in setupGachaLayout:", e); gachaBackButton = {x:0,y:0,w:1,h:1}; machineBox={x:0,y:0,w:1,h:1}; gachaPullButton={x:0,y:0,w:1,h:1};} }

// --- Display Gacha Screen (FIXED DEPENDENCY CHECK!) ---
function displayGacha(currentTotalPlushies) {
    const dependencies = [ { name: 'width', value: width }, { name: 'height', value: height }, { name: 'machineBox', value: machineBox }, { name: 'gachaPullButton', value: gachaPullButton }, { name: 'gachaBackButton', value: gachaBackButton }, { name: 'color', value: color }, { name: 'storeItems', value: storeItems }, { name: 'drawStaticKitty', value: drawStaticKitty }, { name: 'getColorValueById', value: getColorValueById }, { name: 'isItemCollected', value: isItemCollected }, { name: 'textColor', value: textColor }, { name: 'textStrokeColor', value: textStrokeColor }, { name: 'backButtonColor', value: backButtonColor }, { name: 'kittyColor', value: kittyColor} ];
    for (const dep of dependencies) { if (typeof dep.value === 'undefined' || dep.value === null) { console.error(`Gacha display dependency missing: ${dep.name}!`); background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); text(`Gacha Error!\nMissing: ${dep.name}\nCheck console.`, width / 2, height / 2); return; } }
    if (gachaColorPool.length === 0) { createGachaPool(); } if (gachaColorPool.length > 0 && gachaColorPool[0].startsWith('error_')) { background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Pool Error!\n(${gachaColorPool[0]})`, width/2, height/2); drawGachaBackButton(); return; }
    try { // --- Normal Drawing ---
        if (isGachaAnimating) { updateGachaAnimation(); } else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
        updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles(); fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); } drawMachineBase(); pop(); drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles(); drawPrizeDisplay(); drawPullButton(currentTotalPlushies); drawGachaBackButton(); drawGachaMika(); // Renamed draw func call
        textAlign(CENTER, CENTER); noStroke();
    } catch(e) { console.error("Error during displayGacha draw:", e); background(0); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Gacha Draw Error! ${e.message}`, width/2, height/2); }
}

// --- Helper to Set Gacha Mika's Commentary --- (Renamed!) ---
function setGachaMikaCommentary(text) { gachaMikaCommentary = text; gachaMikaCommentaryTimer = GACHA_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
function drawMachineBase() { /* ... (no change) ... */ }
function drawPullButton(currentTotalPlushies) { /* ... (no change) ... */ }
function drawGachaBackButton() { /* ... (no change) ... */ }
// --- Renamed Mika Drawing Function ---
function drawGachaMika() {
    if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !gachaBackButton) { return; }
    try {
        let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer;
        if (mikaX - mikaSize / 2 < gachaBackButton.x + gachaBackButton.w + 10) { mikaX = gachaBackButton.x + gachaBackButton.w + 10 + mikaSize / 2; }
        drawStaticKitty(mikaX, mikaY, mikaSize);
        // Use renamed commentary vars
        if (gachaMikaCommentaryTimer <= 0 && gachaMikaCommentary === "") { setGachaMikaCommentary("Push the button, Master! Let's see what happens!"); }
        if (gachaMikaCommentaryTimer > 0) {
            gachaMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(gachaMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER);
        } else { gachaMikaCommentary = ""; }
    } catch (e) { console.error("Error drawing gacha Mika:", e); }
}

// --- Animation Logic ---
function startGachaAnimation() { /* ... (Same logic, uses renamed commentary setter) ... */ if (gachaColorPool.length === 0 || gachaColorPool[0].startsWith('error_')) { console.error("Cannot start gacha: Pool invalid!"); setGachaMikaCommentary("Nya? The machine seems broken..."); return; } isGachaAnimating = true; gachaAnimationTimer = 0; currentGachaStep = 'shaking'; prizeDisplay = null; spentPlushieParticles = []; sparkParticles = []; let rawPrizeId = random(gachaColorPool); if (typeof storeItems === 'undefined') { console.error("storeItems missing!"); pendingPrizeId = null; } else { let prizeItem = storeItems.find(item => item && item.id === rawPrizeId); if (!prizeItem) { console.error(`Pulled invalid ID: ${rawPrizeId}!`); pendingPrizeId = null; } else { pendingPrizeId = prizeItem.id; console.log(`Gacha prize determined: ${pendingPrizeId} (${prizeItem.name})`); } } setGachaMikaCommentary("Here we go! Don't break, stupid machine!"); console.log("Gacha animation started: shaking"); }

function updateGachaAnimation() { /* ... (Same logic, uses renamed commentary setter) ... */ gachaAnimationTimer++; if (currentGachaStep === 'shaking' && gachaAnimationTimer > 60) { currentGachaStep = 'sparking'; setGachaMikaCommentary("Eek! Zappy! Is that safe?!"); } else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 150) { currentGachaStep = 'poofing'; setGachaMikaCommentary("POOF! There go my plushies... Hope it's worth it!"); spawnSpentPlushieParticles(); } else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 240) { currentGachaStep = 'dropping'; setGachaMikaCommentary("Clunk! What was that...?"); } else if (currentGachaStep === 'dropping' && gachaAnimationTimer > PULL_ANIMATION_DURATION - 30) { currentGachaStep = 'revealing'; console.log("Gacha step: revealing prize..."); if (typeof isItemCollected !== 'function' || typeof storeItems === 'undefined') { console.error("Deps missing for reveal!"); setGachaMikaCommentary("Nya! Error checking prize!"); prizeDisplay = { item: { name: "System Error!", type:'error' }, isNew: false }; } else if (!pendingPrizeId) { console.error("No prize ID!"); setGachaMikaCommentary("Huh? Nothing?! Rigged!"); prizeDisplay = { item: { name: "Nothing!", type:'error' }, isNew: false }; } else { let prizeItem = storeItems.find(item => item && item.id === pendingPrizeId); if (!prizeItem) { console.error("Prize ID invalid!"); setGachaMikaCommentary("Wha-? Prize vanished!"); prizeDisplay = { item: { name: "Error!", type:'error' }, isNew: false }; } else { let isNew = !isItemCollected(pendingPrizeId); if (isNew) { console.log("NEW ITEM!", prizeItem.name); collectedGachaItems[pendingPrizeId] = true; try { localStorage.setItem(`gacha_${pendingPrizeId}`, 'true'); console.log(`Saved gacha: ${pendingPrizeId}`); } catch (e) { console.warn(`LS save fail ${pendingPrizeId}:`, e); } if (prizeItem.rarity === 'super_rare') setGachaMikaCommentary(`NYA~! A ${prizeItem.name}!! SO RARE! ♡`); else if (prizeItem.rarity === 'rare') setGachaMikaCommentary(`Ooh! A ${prizeItem.name}! Pretty!`); else setGachaMikaCommentary(`Yay! New: ${prizeItem.name}!`); } else { console.log("DUPLICATE!", prizeItem.name); setGachaMikaCommentary(`Hmph. Another ${prizeItem.name}. Already got that...`); } prizeDisplay = { item: prizeItem, isNew: isNew }; } } pendingPrizeId = null; } else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 90) { currentGachaStep = 'idle'; isGachaAnimating = false; console.log("Gacha animation finished."); setGachaMikaCommentary("Ready for another go, Master? Hehe~"); prizeDisplay = null; } if (currentGachaStep === 'sparking' && frameCount % 4 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) { spawnSparkParticle(); } if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 20 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }

// --- Particle Spawning --- (No changes)
function spawnSmokeParticle(x, y) { /* ... */ smokeParticles.push({ x: x+random(-5,5), y: y+random(-5,5), vx: random(-0.2,0.2), vy: random(-0.8,-0.3), size: random(15,30), alpha: random(100,180), life: 1.0 }); }
function spawnSparkParticle() { /* ... */ let s=floor(random(4)); let x,y; if(!machineBox) return; if(s===0){x=machineBox.x+random(machineBox.w);y=machineBox.y;}else if(s===1){x=machineBox.x+random(machineBox.w);y=machineBox.y+machineBox.h;}else if(s===2){x=machineBox.x;y=machineBox.y+random(machineBox.h);}else{x=machineBox.x+machineBox.w;y=machineBox.y+random(machineBox.h);} sparkParticles.push({ x: x, y: y, vx: random(-2,2), vy: random(-2,2), len: random(5,15), life: 1.0, alpha: 255 }); }
function spawnSpentPlushieParticles() { /* ... */ let px=machineBox.x+machineBox.w/2; let py=machineBox.y+machineBox.h*0.3; if(!plushieColors) return; for(let i=0; i<MAX_PLUSHIE_PARTICLES; i++){ spentPlushieParticles.push({ x:px+random(-10,10), y:py+random(-10,10), vx:random(-3,3), vy:random(-5,-1), size:random(8,15), color:random(plushieColors), angle:random(TWO_PI), spin:random(-0.1,0.1), life:1.0, alpha:255 }); } }

// --- Particle Updating --- (No changes)
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }

// --- Particle Drawing --- (No changes)
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }

// --- Draw Prize Display --- (No changes)
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input --- (Uses renamed commentary setter)
function handleGachaInput(px, py, currentTotalPlushies) { if (isGachaAnimating) { return true; } if (!gachaBackButton || !gachaPullButton) { console.error("Gacha buttons missing!"); return false; } if (px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h) { console.log("Gacha Back!"); gameState = 'start'; gachaMikaCommentary = ""; gachaMikaCommentaryTimer = 0; return 'back'; } if (px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) { console.log("Gacha Pull!"); if (gachaColorPool.length > 0 && !gachaColorPool[0].startsWith('error_')) { startGachaAnimation(); return 'start_pull'; } else { setGachaMikaCommentary("Machine looks broken... Nya..."); return 'pull_fail_pool'; } } return false; }

// --- Dependencies ---