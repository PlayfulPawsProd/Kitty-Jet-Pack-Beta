// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Now Dispensing Colors! Nya~! ♡

// --- Gacha Settings ---
const GACHA_COST = 0; // Still free! Spoiled Master! >.<
const PULL_ANIMATION_DURATION = 300;

// --- Gacha Prize Pool --- (NEW!) ---
let gachaColorPool = []; // This will hold item IDs, weighted by rarity!
let prizeDisplay = null; // { item: object, isNew: boolean } -> Stores the revealed prize details

// --- Gacha Screen UI Elements ---
let gachaBackButton; let gachaPullButton; let machineBox;

// --- Gacha Animation State ---
let isGachaAnimating = false; let gachaAnimationTimer = 0; let currentGachaStep = 'idle';
let spentPlushieParticles = []; let sparkParticles = []; let smokeParticles = [];
// Removed 'capsule' variable, using 'prizeDisplay' now

// --- Mika Commentary ---
let wardrobeMikaCommentary = ""; let wardrobeMikaCommentaryTimer = 0; // Reusing variable name, context is clear
const WARDROBE_MIKA_COMMENTARY_DURATION = 240;

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15; const MAX_SPARK_PARTICLES = 20; const MAX_PLUSHIE_PARTICLES = 10;

// --- Function to Create Weighted Gacha Pool --- (NEW!) ---
function createGachaPool() {
    console.log("Creating Gacha Pool...");
    gachaColorPool = []; // Reset the pool

    if (typeof storeItems === 'undefined') {
        console.error("Cannot create gacha pool: storeItems not loaded!");
        return;
    }

    // Define weights (adjust these numbers to change odds!)
    const rarityWeights = {
        common: 15,
        uncommon: 7,
        rare: 3,
        super_rare: 1
    };

    storeItems.forEach(item => {
        // Only add potential gacha items (e.g., colors, maybe accessories/FX later?)
        // Exclude the 'default' color and items explicitly marked not for gacha
        if ((item.type === 'kitty_color' && item.id !== 'default') /* || item.type === 'other_gacha_types' */ ) {
            let weight = rarityWeights[item.rarity] || 1; // Default to weight 1 if rarity undefined
             // Only add implemented items to the pool? Or allow winning WIP ones? Let's allow for now.
            // if (item.implemented) {
                for (let i = 0; i < weight; i++) {
                    gachaColorPool.push(item.id);
                }
             // }
        }
    });

    if (gachaColorPool.length === 0) {
        console.error("Gacha Pool is empty! No valid gacha items found in storeItems.");
        // Add a dummy fallback?
        gachaColorPool.push('error_empty_pool');
    } else {
         console.log(`Gacha Pool created with ${gachaColorPool.length} weighted entries.`);
    }
    // Optional: Shuffle the pool for extra randomness?
    // gachaColorPool = shuffle(gachaColorPool); // Requires a shuffle function
}
// --- End Create Gacha Pool ---


// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) { /* ... (No changes needed) ... */ console.log("Calculating Gacha layout..."); try { wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; wardrobeTitleY = canvasH * 0.07; shelvesY = canvasH * 0.15; let tabWidth = canvasW / 3.5; let tabSpacing = 10; let tabHeight = 40; let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2); let tabsStartX = canvasW / 2 - totalTabWidth / 2; shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" }; shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" }; shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" }; itemDisplayArea = { x: canvasW * 0.1, y: shelvesY + tabHeight + 20, w: canvasW * 0.8, h: canvasH * 0.5 }; let arrowSize = 40; leftArrowButton = { x: itemDisplayArea.x - arrowSize - 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; rightArrowButton = { x: itemDisplayArea.x + itemDisplayArea.w + 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; console.log("Wardrobe layout calculated!"); } catch (e) { console.error("Error in setupWardrobeLayout:", e); wardrobeBackButton = {x:0,y:0,w:1,h:1}; shelfTabs = {}; itemDisplayArea={x:0,y:0,w:1,h:1}; leftArrowButton={x:0,y:0,w:1,h:1}; rightArrowButton={x:0,y:0,w:1,h:1}; } }


// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) {
    if (!width || !height) return;
    // Create pool on first display if empty
    if (gachaColorPool.length === 0) {
        createGachaPool();
    }

    if (isGachaAnimating) { updateGachaAnimation(); }
    else { if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); } }
    updateSmokeParticles(); updateSparkParticles(); updateSpentPlushieParticles();

    fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height); // Background
    fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, TOP); text("Kana's Kapsule Khaos!", width / 2, height * 0.04); // Title
    textSize(min(width, height) * 0.04); strokeWeight(2); text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); noStroke(); // Plushie Count

    // Draw Machine (shaking if animating)
    push(); if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') { translate(random(-3, 3), random(-1.5, 1.5)); }
    drawMachineBase(); pop();

    // Draw Effects & Prize
    drawSmokeParticles(); drawSparkParticles(); drawSpentPlushieParticles();
    drawPrizeDisplay(); // <-- Renamed from drawCapsule

    // Draw Buttons & Mika
    drawPullButton(currentTotalPlushies); drawGachaBackButton(); drawWardrobeMika(); // Reusing wardrobe Mika draw function

    textAlign(CENTER, CENTER); noStroke();
}

// --- Helper to Set Mika's Commentary ---
function setWardrobeMikaCommentary(text) { wardrobeMikaCommentary = text; wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION; }

// --- Sub-Drawing Functions ---
function drawMachineBase() { /* ... (No changes needed) ... */ if (!machineBox) return; rectMode(CORNER); fill(100, 100, 110); rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); }
function drawPullButton(currentTotalPlushies) { /* ... (No changes needed) ... */ if (!gachaPullButton) return; let btnColor = color(200, 0, 0); let btnTextColor = color(255); let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`; if (isGachaAnimating) { btnColor = color(100); btnTextColor = color(150); btnText = "Working..."; } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) { btnColor = color(150, 0, 0); btnTextColor = color(200); } rectMode(CORNER); fill(btnColor); stroke(50); strokeWeight(1); rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5); fill(btnTextColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2); }
function drawGachaBackButton() { /* ... (No changes needed) ... */ if (!wardrobeBackButton || !backButtonColor || !textColor || !textStrokeColor) { return; } try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing gacha back button:", e); } }
function drawWardrobeMika() { /* ... (No changes needed - reuses function) ... */ if (!width || !height || typeof drawStaticKitty !== 'function' || !kittyColor || !heartColor || !wardrobeBackButton) { return; } try { let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer; if (mikaX - mikaSize / 2 < wardrobeBackButton.x + wardrobeBackButton.w + 10) { mikaX = wardrobeBackButton.x + wardrobeBackButton.w + 10 + mikaSize / 2; } drawStaticKitty(mikaX, mikaY, mikaSize); if (wardrobeMikaCommentaryTimer <= 0 && wardrobeMikaCommentary === "") { setWardrobeMikaCommentary("Push the button, Master! Let's see what happens!"); } if (wardrobeMikaCommentaryTimer > 0) { wardrobeMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(wardrobeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { wardrobeMikaCommentary = ""; } } catch (e) { console.error("Error drawing gacha Mika:", e); } }

// --- Animation Logic (UPDATED TO HANDLE PRIZE) ---

function startGachaAnimation() {
    if (gachaColorPool.length === 0 || gachaColorPool[0] === 'error_empty_pool') {
         console.error("Cannot start gacha: Pool is empty or invalid!");
         setWardrobeMikaCommentary("Nya? The machine seems empty...");
         return; // Don't start animation
     }

    isGachaAnimating = true; gachaAnimationTimer = 0; currentGachaStep = 'shaking';
    prizeDisplay = null; // Clear previous prize display
    spentPlushieParticles = []; sparkParticles = []; // Clear particles

    // --- Determine Prize --- (Do this at the START)
    let rawPrizeId = random(gachaColorPool); // Pick ID from weighted pool
    let prizeItem = storeItems.find(item => item.id === rawPrizeId);

    if (!prizeItem) {
        console.error(`Pulled invalid item ID: ${rawPrizeId}! Defaulting prize?`);
        // Handle error - maybe give a default common item? Or nothing?
        // For now, let's store null and handle it later.
        pendingPrizeId = null; // Store null prize ID
    } else {
         pendingPrizeId = prizeItem.id; // Store the valid ID
         console.log(`Gacha prize determined: ${pendingPrizeId} (${prizeItem.name})`);
    }
    // --- End Determine Prize ---

    setWardrobeMikaCommentary("Here we go! Don't break, stupid machine!");
    console.log("Gacha animation started: shaking");
}

function updateGachaAnimation() {
    gachaAnimationTimer++;

    // --- Step Transitions ---
    if (currentGachaStep === 'shaking' && gachaAnimationTimer > 60) { currentGachaStep = 'sparking'; setWardrobeMikaCommentary("Eek! Zappy! Is that safe?!"); }
    else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 150) { currentGachaStep = 'poofing'; setWardrobeMikaCommentary("POOF! There go my plushies... Hope it's worth it!"); spawnSpentPlushieParticles(); }
    else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 240) { currentGachaStep = 'dropping'; /* No capsule spawn here anymore */ setWardrobeMikaCommentary("Clunk! What was that...?"); }
    // --- Reveal Step (Handles prize logic) ---
    else if (currentGachaStep === 'dropping' && gachaAnimationTimer > PULL_ANIMATION_DURATION - 30) { // Start revealing near the end
        currentGachaStep = 'revealing';
        console.log("Gacha step: revealing prize...");

        // Check if prize determination failed earlier
        if (!pendingPrizeId) {
            console.error("No prize ID determined!");
            setWardrobeMikaCommentary("Huh? It didn't give anything! Rigged!");
            prizeDisplay = { item: { name: "Nothing!", type:'error' }, isNew: false }; // Display error message
        } else {
             // Find prize details again (safer)
             let prizeItem = storeItems.find(item => item.id === pendingPrizeId);
             if (!prizeItem) { // Should not happen if ID was valid before, but check
                 console.error("Prize ID invalid during reveal!");
                 setWardrobeMikaCommentary("Wha-? The prize vanished!");
                 prizeDisplay = { item: { name: "Error!", type:'error' }, isNew: false };
             } else {
                 // Check ownership and update collection
                 let isNew = !isItemCollected(pendingPrizeId); // Use helper from store.js
                 if (isNew) {
                     console.log("NEW ITEM!", prizeItem.name);
                     collectedGachaItems[pendingPrizeId] = true; // Update local tracking
                     try { // Save to localStorage
                         localStorage.setItem(`gacha_${pendingPrizeId}`, 'true');
                         console.log(`Saved gacha collection: ${pendingPrizeId}`);
                     } catch (e) { console.warn(`LS save fail for gacha item ${pendingPrizeId}:`, e); }
                     // Set commentary based on rarity?
                     if (prizeItem.rarity === 'super_rare') setWardrobeMikaCommentary(`NYA~! A ${prizeItem.name}!! SO RARE! Master, look!`);
                     else if (prizeItem.rarity === 'rare') setWardrobeMikaCommentary(`Ooh! A ${prizeItem.name}! Pretty!`);
                     else setWardrobeMikaCommentary(`Yay! New: ${prizeItem.name}!`);
                 } else {
                     console.log("DUPLICATE ITEM!", prizeItem.name);
                     // Add duplicate logic later (tickets?)
                     setWardrobeMikaCommentary(`Hmph. Another ${prizeItem.name}. Already got that one...`);
                 }
                 // Set prize details for display
                 prizeDisplay = { item: prizeItem, isNew: isNew };
             }
        }
        pendingPrizeId = null; // Clear pending prize ID
    }
    // --- End Reveal Step ---
    else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 90) { // Stay revealed longer
         currentGachaStep = 'idle'; isGachaAnimating = false;
         console.log("Gacha animation finished.");
         setWardrobeMikaCommentary("Ready for another go, Master? Hehe~");
         prizeDisplay = null; // Clear display for next pull
    }

    // --- Continuous Effects ---
    if (currentGachaStep === 'sparking' && frameCount % 4 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) { spawnSparkParticle(); }
    if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 20 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) { spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); }

    // No capsule dropping anymore
}

// --- Particle Spawning --- (No changes needed)
function spawnSmokeParticle(x, y) { smokeParticles.push({ x: x+random(-5,5), y: y+random(-5,5), vx: random(-0.2,0.2), vy: random(-0.8,-0.3), size: random(15,30), alpha: random(100,180), life: 1.0 }); }
function spawnSparkParticle() { let s=floor(random(4)); let x,y; if(s===0){x=machineBox.x+random(machineBox.w);y=machineBox.y;}else if(s===1){x=machineBox.x+random(machineBox.w);y=machineBox.y+machineBox.h;}else if(s===2){x=machineBox.x;y=machineBox.y+random(machineBox.h);}else{x=machineBox.x+machineBox.w;y=machineBox.y+random(machineBox.h);} sparkParticles.push({ x: x, y: y, vx: random(-2,2), vy: random(-2,2), len: random(5,15), life: 1.0, alpha: 255 }); }
function spawnSpentPlushieParticles() { let px=machineBox.x+machineBox.w/2; let py=machineBox.y+machineBox.h*0.3; for(let i=0; i<MAX_PLUSHIE_PARTICLES; i++){ spentPlushieParticles.push({ x:px+random(-10,10), y:py+random(-10,10), vx:random(-3,3), vy:random(-5,-1), size:random(8,15), color:random(plushieColors), angle:random(TWO_PI), spin:random(-0.1,0.1), life:1.0, alpha:255 }); } }
// Removed spawnCapsule

// --- Particle Updating --- (No changes needed)
function updateSmokeParticles() { for (let i=smokeParticles.length-1; i>=0; i--) { let p=smokeParticles[i]; p.x+=p.vx; p.y+=p.vy; p.vy*=0.98; p.life-=0.015; p.size*=0.99; if(p.life<=0){ smokeParticles.splice(i,1); } } }
function updateSparkParticles() { for (let i=sparkParticles.length-1; i>=0; i--) { let p=sparkParticles[i]; p.x+=p.vx; p.y+=p.vy; p.vx*=0.9; p.vy*=0.9; p.life-=0.08; p.alpha=p.life*255; if(p.life<=0){ sparkParticles.splice(i,1); } } }
function updateSpentPlushieParticles() { for (let i=spentPlushieParticles.length-1; i>=0; i--) { let p=spentPlushieParticles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.15; p.angle+=p.spin; p.life-=0.02; p.alpha=p.life*255; if(p.life<=0){ spentPlushieParticles.splice(i,1); } } }

// --- Particle Drawing --- (No changes needed)
function drawSmokeParticles() { noStroke(); for (let p of smokeParticles) { fill(150, p.alpha*p.life); ellipse(p.x,p.y,p.size); } }
function drawSparkParticles() { strokeWeight(2); for (let p of sparkParticles) { stroke(255,255,0,p.alpha); line(p.x,p.y, p.x+p.vx*p.len*p.life, p.y+p.vy*p.len*p.life); } noStroke(); }
function drawSpentPlushieParticles() { rectMode(CENTER); for (let p of spentPlushieParticles) { push(); translate(p.x,p.y); rotate(p.angle); fill(red(p.color), green(p.color), blue(p.color), p.alpha); rect(0,0,p.size,p.size); pop(); } rectMode(CORNER); }

// --- Draw Prize Display (Replaces drawCapsule) --- (NEW!) ---
function drawPrizeDisplay() {
    if (currentGachaStep === 'revealing' && prizeDisplay && prizeDisplay.item) {
        let item = prizeDisplay.item;
        let chuteCenterX = machineBox.x + machineBox.w / 2;
        let chuteY = machineBox.y + machineBox.h * 0.9; // Center vertically in chute rect
        let displaySize = machineBox.w * 0.2; // Size of the prize swatch/icon

        // Draw swatch for color items
        if (item.type === 'kitty_color') {
            let c = getColorValueById(item.id);
             if (c) { fill(c); } else { fill(128); } // Use helper, fallback grey
             stroke(50); strokeWeight(2);
             rectMode(CENTER);
             rect(chuteCenterX, chuteY, displaySize, displaySize, 5);
             rectMode(CORNER); // Reset
        }
        // TODO: Add drawing for other item types (accessories, upgrades) later
        else {
             fill(100); stroke(50); strokeWeight(2); rectMode(CENTER);
             rect(chuteCenterX, chuteY, displaySize, displaySize, 5);
             fill(200); noStroke(); textSize(displaySize*0.6);
             text("?", chuteCenterX, chuteY); rectMode(CORNER);
         }

        // Draw Item Name below
        fill(textColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER);
        text(item.name, chuteCenterX, chuteY + displaySize * 0.7 + 10);

        // Draw "NEW!" indicator if applicable
        if (prizeDisplay.isNew) {
            fill(sparkleColor); // Yellowish color
             textSize(min(width, height) * 0.035);
             text("NEW!", chuteCenterX, chuteY - displaySize * 0.7 - 5);
        }
    }
}
// --- End Draw Prize Display ---


// --- Handle Gacha Input --- (No logic changes needed here)
function handleGachaInput(px, py, currentTotalPlushies) { /* ... same logic ... */ if (isGachaAnimating) { return true; } if (wardrobeBackButton && px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) { console.log("Gacha Back button!"); gameState = 'start'; wardrobeMikaCommentary = ""; wardrobeMikaCommentaryTimer = 0; return 'back'; } if (gachaPullButton && px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) { console.log("Gacha Pull button!"); if (gachaColorPool.length > 0 && gachaColorPool[0] !== 'error_empty_pool') { startGachaAnimation(); return 'start_pull'; } else { setWardrobeMikaCommentary("Machine looks broken... Nya..."); return 'pull_fail_pool'; } } return false; }

// --- Need functions from store.js & items.js ---
// isItemCollected(itemId), storeItems array, getColorValueById(id)
// Needs access to sketch.js globals & p5 functions.