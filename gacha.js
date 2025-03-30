// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Smoother, cuter, and slower! Nya~!

// --- Gacha Settings ---
const GACHA_COST = 0; // Still free! For now... >:3
const PULL_ANIMATION_DURATION = 300; // Total frames for animation (5 seconds at 60fps) - SLOWER!

// --- Gacha Screen UI Elements ---
let gachaBackButton;
let gachaPullButton;
let machineBox;

// --- Gacha Animation State ---
let isGachaAnimating = false;
let gachaAnimationTimer = 0;
let currentGachaStep = 'idle'; // idle, shaking, sparking, poofing, dropping, revealing
let capsule = null;
let spentPlushieParticles = [];
let sparkParticles = [];
let smokeParticles = [];

// --- Mika Commentary ---
let mikaCommentary = "";
let mikaCommentaryTimer = 0;
const MIKA_COMMENTARY_DURATION = 240; // How long text stays (4 seconds) - SLOWER!

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15;
const MAX_SPARK_PARTICLES = 20;
const MAX_PLUSHIE_PARTICLES = 10;

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) {
    console.log("Calculating Gacha layout...");
    // Move back button slightly higher to avoid any potential future overlap
    gachaBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; // Adjusted Y

    let machineWidth = canvasW * 0.6;
    let machineHeight = canvasH * 0.6;
    machineBox = { x: canvasW / 2 - machineWidth / 2, y: canvasH * 0.18, w: machineWidth, h: machineHeight };

    let pullButtonSize = machineWidth * 0.3;
    gachaPullButton = { x: machineBox.x + machineBox.w / 2 - pullButtonSize / 2, y: machineBox.y + machineBox.h * 0.65, w: pullButtonSize, h: pullButtonSize * 0.7 };

    console.log("Gacha layout calculated!");
}

// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) {
    if (!width || !height) return;

    if (isGachaAnimating) {
        updateGachaAnimation();
    } else {
        if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) {
            spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1);
        }
    }
    updateSmokeParticles();
    updateSparkParticles();
    updateSpentPlushieParticles();

    // --- Draw Background ---
    fill(30, 30, 40, 230); rectMode(CORNER); rect(0, 0, width, height);

    // --- Draw Title & Plushie Count ---
    fill(textColor); stroke(textStrokeColor); strokeWeight(3);
    textSize(min(width, height) * 0.07); textAlign(CENTER, TOP);
    text("Kana's Kapsule Khaos!", width / 2, height * 0.04);
    textSize(min(width, height) * 0.04); strokeWeight(2);
    text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11);
    noStroke();

    // --- Draw Kana's Rickety Machine ---
    push();
    if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') {
        translate(random(-3, 3), random(-1.5, 1.5)); // Slightly reduced shake intensity
    }
    drawMachineBase();
    pop();

    // Draw dynamic effects
    drawSmokeParticles();
    drawSparkParticles();
    drawSpentPlushieParticles();
    drawCapsule();

    // --- Draw Buttons ---
    drawPullButton(currentTotalPlushies);
    drawGachaBackButton();

    // --- Draw Mika & Commentary ---
    drawMikaCommentary(); // Uses the new static kitty draw function!

    textAlign(CENTER, CENTER); noStroke();
}


// --- Sub-Drawing Functions ---

function drawMachineBase() { /* ... (No changes needed here) ... */ if (!machineBox) return; rectMode(CORNER); fill(100, 100, 110); rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); fill(80); rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15); fill(90); triangle( machineBox.x + machineBox.w * 0.1, machineBox.y, machineBox.x + machineBox.w * 0.3, machineBox.y, machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15 ); fill(40); rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1); fill(255, 220, 0); rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1); fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER); text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8); }
function drawPullButton(currentTotalPlushies) { /* ... (No changes needed here) ... */ if (!gachaPullButton) return; let btnColor = color(200, 0, 0); let btnTextColor = color(255); let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`; if (isGachaAnimating) { btnColor = color(100); btnTextColor = color(150); btnText = "Working..."; } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) { btnColor = color(150, 0, 0); btnTextColor = color(200); } rectMode(CORNER); fill(btnColor); stroke(50); strokeWeight(1); rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5); fill(btnTextColor); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2); }
function drawGachaBackButton() { /* ... (No changes needed here) ... */ if (!gachaBackButton) return; fill(backButtonColor); rectMode(CORNER); noStroke(); rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2); noStroke(); }

// --- Mika Drawing and Commentary (UPDATED) ---
function drawMikaCommentary() {
    let mikaSize = min(width, height) * 0.15;
    // Adjust position: More right, slightly higher to clearly avoid button
    let mikaX = width * 0.18; // Moved right
    let mikaY = height - mikaSize * 0.7 - gachaBackButton.h * 0.5; // Positioned relative to bottom, avoiding button space

    // Use the new drawing function from sketch.js!
    if (typeof drawStaticKitty === 'function') {
         drawStaticKitty(mikaX, mikaY, mikaSize);
         // console.log("Drawing static kitty!"); // Debug log
    } else {
        // Fallback placeholder if function isn't found (shouldn't happen)
        fill(kittyColor); noStroke(); rectMode(CENTER);
        rect(mikaX, mikaY, mikaSize * 0.6, mikaSize * 0.6);
        rectMode(CORNER);
        console.warn("drawStaticKitty function not found!");
    }


    // Draw commentary bubble if active
    if (mikaCommentaryTimer > 0) {
        mikaCommentaryTimer--;
        let bubbleW = width * 0.6;
        let bubbleH = height * 0.1;
        let bubbleX = mikaX + mikaSize * 0.4; // Position bubble relative to Mika
        let bubbleY = mikaY - bubbleH * 0.8; // Position bubble above Mika

        // Constrain bubble position to stay on screen
        bubbleX = constrain(bubbleX, 5, width - bubbleW - 5);
        bubbleY = constrain(bubbleY, 5, height - bubbleH - 5);


        fill(240, 240, 240, 220); stroke(50); strokeWeight(1);
        rect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
        triangle( // Tail pointing towards Mika (adjust based on bubble position relative to Mika)
            bubbleX + bubbleW * 0.1, bubbleY + bubbleH, // Left point of base
            bubbleX + bubbleW * 0.2, bubbleY + bubbleH, // Right point of base
            mikaX + mikaSize * 0.1, mikaY - mikaSize * 0.3 // Point towards top-right of Mika's head approx
        );

        fill(50); noStroke();
        textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); // Use TOP align for text wrap
        text(mikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); // Add padding
        textAlign(CENTER, CENTER);
    }
}

// --- Animation Logic (UPDATED TIMINGS) ---

function startGachaAnimation() {
    isGachaAnimating = true;
    gachaAnimationTimer = 0;
    currentGachaStep = 'shaking';
    capsule = null;
    spentPlushieParticles = [];
    sparkParticles = [];
    setMikaCommentary("Alright, let's see what this junk spits out!");
    console.log("Gacha animation started: shaking");
}

function updateGachaAnimation() {
    gachaAnimationTimer++;

    // --- Step Transitions (Slower!) ---
    if (currentGachaStep === 'shaking' && gachaAnimationTimer > 60) { // ~1.0s shake
        currentGachaStep = 'sparking';
        setMikaCommentary("Eek! Zappy! Kana probably used cheap wires...");
        console.log("Gacha step: sparking");
    } else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 150) { // ~2.5s total (1.5s sparking)
        currentGachaStep = 'poofing';
        setMikaCommentary("POOF! There go my plushies... Hope it's worth it!");
        spawnSpentPlushieParticles();
        console.log("Gacha step: poofing");
    } else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 240) { // ~4.0s total (1.5s poofing)
        currentGachaStep = 'dropping';
        spawnCapsule();
        setMikaCommentary("Clunk! Was that... a prize? Or just more scrap?");
        console.log("Gacha step: dropping");
    } else if (currentGachaStep === 'dropping' && capsule && capsule.y >= machineBox.y + machineBox.h * 0.9) {
        currentGachaStep = 'revealing';
        setMikaCommentary("Ooh! Shiny! What is it, Master?! ♡");
        console.log("Gacha step: revealing");
    } else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 60) { // Stay revealed for 1s extra
         currentGachaStep = 'idle';
         isGachaAnimating = false;
         capsule = null;
         console.log("Gacha animation finished.");
         setMikaCommentary("Ready for another go, Master? Hehe~"); // Reset commentary
    }

    // --- Continuous Effects ---
    if (currentGachaStep === 'sparking' && frameCount % 4 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) { // Slightly slower spark spawn
        spawnSparkParticle();
    }
    if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 20 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) { // Slower smoke spawn
        spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1);
    }

    // Update capsule position
    if (currentGachaStep === 'dropping' && capsule) {
        capsule.y += 4; // Slightly slower drop speed
    }
}

function setMikaCommentary(text) {
    mikaCommentary = text;
    mikaCommentaryTimer = MIKA_COMMENTARY_DURATION;
}

// --- Particle Spawning --- (No changes needed here)
function spawnSmokeParticle(x, y) { smokeParticles.push({ x: x + random(-5, 5), y: y + random(-5, 5), vx: random(-0.2, 0.2), vy: random(-0.8, -0.3), size: random(15, 30), alpha: random(100, 180), life: 1.0 }); }
function spawnSparkParticle() { let side = floor(random(4)); let x, y; if (side === 0) { x = machineBox.x + random(machineBox.w); y = machineBox.y; } else if (side === 1) { x = machineBox.x + random(machineBox.w); y = machineBox.y + machineBox.h; } else if (side === 2) { x = machineBox.x; y = machineBox.y + random(machineBox.h); } else { x = machineBox.x + machineBox.w; y = machineBox.y + random(machineBox.h); } sparkParticles.push({ x: x, y: y, vx: random(-2, 2), vy: random(-2, 2), len: random(5, 15), life: 1.0, alpha: 255 }); }
function spawnSpentPlushieParticles() { let poofX = machineBox.x + machineBox.w / 2; let poofY = machineBox.y + machineBox.h * 0.3; for (let i = 0; i < MAX_PLUSHIE_PARTICLES; i++) { spentPlushieParticles.push({ x: poofX + random(-10, 10), y: poofY + random(-10, 10), vx: random(-3, 3), vy: random(-5, -1), size: random(8, 15), color: random(plushieColors), angle: random(TWO_PI), spin: random(-0.1, 0.1), life: 1.0, alpha: 255 }); } }
function spawnCapsule() { let capsuleColors = [color(255,100,100), color(100,100,255), color(255,255,100), color(200)]; capsule = { x: machineBox.x + machineBox.w / 2, y: machineBox.y + machineBox.h * 0.8, size: machineBox.w * 0.15, color: random(capsuleColors) }; }

// --- Particle Updating --- (No changes needed here)
function updateSmokeParticles() { for (let i = smokeParticles.length - 1; i >= 0; i--) { let p = smokeParticles[i]; p.x += p.vx; p.y += p.vy; p.vy *= 0.98; p.life -= 0.015; p.size *= 0.99; if (p.life <= 0) { smokeParticles.splice(i, 1); } } }
function updateSparkParticles() { for (let i = sparkParticles.length - 1; i >= 0; i--) { let p = sparkParticles[i]; p.x += p.vx; p.y += p.vy; p.vx *= 0.9; p.vy *= 0.9; p.life -= 0.08; p.alpha = p.life * 255; if (p.life <= 0) { sparkParticles.splice(i, 1); } } }
function updateSpentPlushieParticles() { for (let i = spentPlushieParticles.length - 1; i >= 0; i--) { let p = spentPlushieParticles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.angle += p.spin; p.life -= 0.02; p.alpha = p.life * 255; if (p.life <= 0) { spentPlushieParticles.splice(i, 1); } } }

// --- Particle Drawing --- (No changes needed here)
function drawSmokeParticles() { noStroke(); for (let p of smokeParticles) { fill(150, p.alpha * p.life); ellipse(p.x, p.y, p.size); } }
function drawSparkParticles() { strokeWeight(2); for (let p of sparkParticles) { stroke(255, 255, 0, p.alpha); line(p.x, p.y, p.x + p.vx * p.len * p.life, p.y + p.vy * p.len * p.life); } noStroke(); }
function drawSpentPlushieParticles() { rectMode(CENTER); for (let p of spentPlushieParticles) { push(); translate(p.x, p.y); rotate(p.angle); fill(red(p.color), green(p.color), blue(p.color), p.alpha); rect(0, 0, p.size, p.size); pop(); } rectMode(CORNER); }
function drawCapsule() { if (capsule && (currentGachaStep === 'dropping' || currentGachaStep === 'revealing')) { fill(capsule.color); stroke(50); strokeWeight(1); ellipse(capsule.x, capsule.y, capsule.size, capsule.size * 1.2); fill(255, 255, 255, 150); noStroke(); ellipse(capsule.x - capsule.size * 0.2, capsule.y - capsule.size * 0.2, capsule.size * 0.3, capsule.size * 0.3); noStroke(); } }


// --- Handle Gacha Input --- (No changes needed here, logic is fine)
function handleGachaInput(px, py, currentTotalPlushies) { /* ... same ... */ if (isGachaAnimating) { return true; } if (gachaBackButton && px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w && py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h) { console.log("Gacha Back button pressed!"); gameState = 'start'; mikaCommentary = ""; mikaCommentaryTimer = 0; return 'back'; } if (gachaPullButton && px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w && py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) { console.log("Gacha Pull button pressed!"); console.log("Enough plushies! Starting Gacha pull..."); startGachaAnimation(); return 'start_pull'; } return false; }