// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Hunting the Unclickable Button! Nya~!

// ... (Keep Gacha Settings, Pool, State, Commentary, Particles etc. same) ...
let gachaColorPool = []; let prizeDisplay = null; let pendingPrizeId = null;
let gachaBackButton; let gachaPullButton; let machineBox;
let isGachaAnimating = false; // <--- Could this be stuck?
let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];
let gachaMikaCommentary = ""; let gachaMikaCommentaryTimer = 0;
const GACHA_MIKA_COMMENTARY_DURATION = 240;
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;
const GACHA_COST = 0; const PULL_ANIMATION_DURATION = 300;

// --- Function to Create Weighted Gacha Pool ---
function createGachaPool() { /* ... */ }
// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { /* ... */ }
// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) { /* ... */ }
// --- Helper to Set Gacha Mika's Commentary ---
function setGachaMikaCommentary(text) { /* ... */ }
// --- Sub-Drawing Functions ---
function drawMachineBase() { /* ... */ } function drawPullButton(currentTotalPlushies) { /* ... */ } function drawGachaBackButton() { /* ... */ } function drawGachaMika() { /* ... */ }

// --- Animation Logic ---
// --- Check function name carefully ---
function startGachaAnimation() { // <-- Is this spelled EXACTLY right?
    if (gachaColorPool.length === 0 || gachaColorPool[0].startsWith('error_')) { console.error("Cannot start gacha: Pool invalid!"); setGachaMikaCommentary("Nya? The machine seems broken..."); return; }
    // --- Log setting animation flag ---
    console.log(">>> Setting isGachaAnimating to TRUE");
    isGachaAnimating = true;
    // --- End Log ---
    gachaAnimationTimer = 0; currentGachaStep = 'shaking'; prizeDisplay = null; spentPlushieParticles = []; sparkParticles = []; let rawPrizeId = random(gachaColorPool); if (typeof storeItems === 'undefined') { console.error("storeItems missing!"); pendingPrizeId = null; } else { let prizeItem = storeItems.find(item => item && item.id === rawPrizeId); if (!prizeItem) { console.error(`Pulled invalid ID: ${rawPrizeId}!`); pendingPrizeId = null; } else { pendingPrizeId = prizeItem.id; console.log(`Gacha prize determined: ${pendingPrizeId} (${prizeItem.name})`); } } setGachaMikaCommentary("Here we go! Don't break, stupid machine!"); console.log("Gacha animation started: shaking");
}
// --- Check function name carefully ---
function updateGachaAnimation() { // <-- Is this spelled EXACTLY right?
    gachaAnimationTimer++;
    if (currentGachaStep === 'shaking' && gachaAnimationTimer > 60) { currentGachaStep = 'sparking'; setGachaMikaCommentary("Eek! Zappy! Is that safe?!"); }
    else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 150) { currentGachaStep = 'poofing'; setGachaMikaCommentary("POOF! There go my plushies... Hope it's worth it!"); spawnSpentPlushieParticles(); }
    else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 240) { currentGachaStep = 'dropping'; setGachaMikaCommentary("Clunk! What was that...?"); }
    else if (currentGachaStep === 'dropping' && gachaAnimationTimer > PULL_ANIMATION_DURATION - 30) { currentGachaStep = 'revealing'; console.log("Gacha step: revealing prize..."); if (typeof isItemCollected !== 'function' || typeof storeItems === 'undefined') { console.error("Deps missing for reveal!"); setGachaMikaCommentary("Nya! Error checking prize!"); prizeDisplay = { item: { name: "System Error!", type:'error' }, isNew: false }; } else if (!pendingPrizeId) { console.error("No prize ID!"); setGachaMikaCommentary("Huh? Nothing?! Rigged!"); prizeDisplay = { item: { name: "Nothing!", type:'error' }, isNew: false }; } else { let prizeItem = storeItems.find(item => item && item.id === pendingPrizeId); if (!prizeItem) { console.error("Prize ID invalid!"); setGachaMikaCommentary("Wha-? Prize vanished!"); prizeDisplay = { item: { name: "Error!", type:'error' }, isNew: false }; } else { let isNew = !isItemCollected(pendingPrizeId); if (isNew) { console.log("NEW ITEM!", prizeItem.name); collectedGachaItems[pendingPrizeId] = true; try { localStorage.setItem(`gacha_${pendingPrizeId}`, 'true'); console.log(`Saved gacha: ${pendingPrizeId}`); } catch (e) { console.warn(`LS save fail ${pendingPrizeId}:`, e); } if (prizeItem.rarity === 'super_rare') setGachaMikaCommentary(`NYA~! A ${prizeItem.name}!! SO RARE! ♡`); else if (prizeItem.rarity === 'rare') setGachaMikaCommentary(`Ooh! A ${prizeItem.name}! Pretty!`); else setGachaMikaCommentary(`Yay! New: ${prizeItem.name}!`); } else { console.log("DUPLICATE!", prizeItem.name); setGachaMikaCommentary(`Hmph. Another ${prizeItem.name}. Already got that...`); } prizeDisplay = { item: prizeItem, isNew: isNew }; } } pendingPrizeId = null; }
    else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 90) {
         currentGachaStep = 'idle';
         // --- Log clearing animation flag ---
         console.log(">>> Setting isGachaAnimating to FALSE");
         isGachaAnimating = false;
         // --- End Log ---
         console.log("Gacha animation finished."); setGachaMikaCommentary("Ready for another go, Master? Hehe~"); prizeDisplay = null;
    }
    if (currentGachaStep === 'sparking' && frameCount % 4 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) { spawnSparkParticle(); } if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 20 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); }
}

// --- Particle Spawning ---
function spawnSmokeParticle(x, y) { /* ... */ } function spawnSparkParticle() { /* ... */ } function spawnSpentPlushieParticles() { /* ... */ }
// --- Particle Updating ---
function updateSmokeParticles() { /* ... */ } function updateSparkParticles() { /* ... */ } function updateSpentPlushieParticles() { /* ... */ }
// --- Particle Drawing ---
function drawSmokeParticles() { /* ... */ } function drawSparkParticles() { /* ... */ } function drawSpentPlushieParticles() { /* ... */ }
// --- Draw Prize Display ---
function drawPrizeDisplay() { /* ... */ }

// --- Handle Gacha Input (Log Animation State & Pool Check) ---
function handleGachaInput(px, py, currentTotalPlushies) {
    console.log(`>>> handleGachaInput called. Click at: (${px.toFixed(1)}, ${py.toFixed(1)}). Animating=${isGachaAnimating}`); // LOG Animation State

    if (isGachaAnimating) { console.log(">>> Gacha animating, input blocked."); return true; }
    if (!gachaBackButton || typeof gachaBackButton.x === 'undefined') { console.error(">>> BACK BUTTON MISSING in handleGachaInput!"); return false; }
    if (!gachaPullButton || typeof gachaPullButton.x === 'undefined') { console.error(">>> PULL BUTTON MISSING in handleGachaInput!"); return false; }

    // 1. Check Back Button
    let isInsideBack = (px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h);
    // console.log(`>>> Checking Back Btn: Inside=${isInsideBack}`); // Simplify log
    if (isInsideBack) { console.log(">>> !!! Gacha Back button HIT !!!"); if(typeof gameState !== 'undefined') { gameState = 'start'; gachaMikaCommentary = ""; gachaMikaCommentaryTimer = 0; return 'back'; } else { console.error(">>> Cannot change gameState!"); return false; } }

    // 2. Check Pull Button
    let isInsidePull = (px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h);
    // console.log(`>>> Checking Pull Btn: Inside=${isInsidePull}`); // Simplify log
    if (isInsidePull) {
        console.log(">>> !!! Gacha Pull button HIT !!!");
        // --- Log Pool Status ---
        let poolValid = (gachaColorPool.length > 0 && !gachaColorPool[0].startsWith('error_'));
        console.log(`>>> Pool Check: Valid=${poolValid}, Length=${gachaColorPool.length}`);
        // --- End Log ---
        if (poolValid) {
             if (typeof startGachaAnimation === 'function') {
                console.log(">>> Pool valid, calling startGachaAnimation..."); // LOG Before Call
                startGachaAnimation(); // <-- Double-check spelling here too!
                return 'start_pull';
             } else { console.error(">>> startGachaAnimation function missing!"); return false; }
        } else {
            console.log(">>> Pool invalid, not starting animation."); // LOG Pool Fail
            if(typeof setGachaMikaCommentary === 'function') { setGachaMikaCommentary("Machine looks broken... Nya..."); } else { console.error(">>> setGachaMikaCommentary missing!"); }
            return 'pull_fail_pool';
        }
    }
    // console.log(">>> No Gacha button hit this time."); // Simplify log
    return false;
}

// --- Dependencies ---