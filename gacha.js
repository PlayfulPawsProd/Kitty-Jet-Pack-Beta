// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Now with shaky-sparky-poofy action! Nya~!

// --- Gacha Settings ---
const GACHA_COST = 0; // FREE PULLS FOR NOW! Don't get used to it, Master! Hmph!
const PULL_ANIMATION_DURATION = 180; // Total frames for the animation (3 seconds at 60fps)

// --- Gacha Screen UI Elements ---
let gachaBackButton;
let gachaPullButton;
let machineBox;

// --- Gacha Animation State ---
let isGachaAnimating = false;
let gachaAnimationTimer = 0;
let currentGachaStep = 'idle'; // idle, shaking, sparking, poofing, dropping, revealing
let capsule = null; // { y: number, color: p5.Color }
let spentPlushieParticles = [];
let sparkParticles = [];
let smokeParticles = []; // More smoke during animation!

// --- Mika Commentary ---
let mikaCommentary = "";
let mikaCommentaryTimer = 0;
const MIKA_COMMENTARY_DURATION = 120; // How long text stays (2 seconds)

// --- Particle Settings ---
const MAX_SMOKE_PARTICLES = 15;
const MAX_SPARK_PARTICLES = 20;
const MAX_PLUSHIE_PARTICLES = 10;

// --- Calculate dynamic Gacha layout elements ---
function setupGachaLayout(canvasW, canvasH) {
    console.log("Calculating Gacha layout...");
    gachaBackButton = { x: 15, y: canvasH - 55, w: 100, h: 40 };

    let machineWidth = canvasW * 0.6;
    let machineHeight = canvasH * 0.6;
    machineBox = { x: canvasW / 2 - machineWidth / 2, y: canvasH * 0.18, w: machineWidth, h: machineHeight }; // Slightly higher Y

    let pullButtonSize = machineWidth * 0.3;
    gachaPullButton = { x: machineBox.x + machineBox.w / 2 - pullButtonSize / 2, y: machineBox.y + machineBox.h * 0.65, w: pullButtonSize, h: pullButtonSize * 0.7 }; // Adjusted Y slightly

    console.log("Gacha layout calculated!");
}

// --- Display Gacha Screen (Now includes animation drawing) ---
function displayGacha(currentTotalPlushies) {
    if (!width || !height) return;

    // Update animation state if running
    if (isGachaAnimating) {
        updateGachaAnimation();
    } else {
        // Idle smoke puffs
        if (frameCount % 45 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES / 2) {
            spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1);
        }
    }

    // Update all active particles
    updateSmokeParticles();
    updateSparkParticles();
    updateSpentPlushieParticles();


    // --- Draw Background ---
    fill(30, 30, 40, 230);
    rectMode(CORNER);
    rect(0, 0, width, height);

    // --- Draw Title ---
    fill(textColor); stroke(textStrokeColor); strokeWeight(3);
    textSize(min(width, height) * 0.07); textAlign(CENTER, TOP);
    text("Kana's Kapsule Khaos!", width / 2, height * 0.04); // Adjusted Y slightly

    // --- Draw Plushie Count ---
    textSize(min(width, height) * 0.04); strokeWeight(2);
    text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.11); // Adjusted Y slightly
    noStroke();

    // --- Draw Kana's Rickety Machine ---
    push(); // Apply shaking only to the machine parts
    if (currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') {
        translate(random(-4, 4), random(-2, 2)); // Shaky shaky!
    }
    drawMachineBase(); // Draw the static parts
    pop(); // End machine shake

    // Draw dynamic animation effects on top (not shaking)
    drawSmokeParticles();
    drawSparkParticles();
    drawSpentPlushieParticles();
    drawCapsule();

    // --- Draw Pull Button (Grey out if animating) ---
    drawPullButton(currentTotalPlushies);

    // --- Draw Back Button ---
    drawGachaBackButton();

    // --- Draw Mika & Commentary ---
    drawMikaCommentary();


    // Reset alignments maybe
    textAlign(CENTER, CENTER);
    noStroke();
}


// --- Sub-Drawing Functions ---

function drawMachineBase() {
     if (!machineBox) return;
     rectMode(CORNER);

     // Main Body (Placeholder - TODO: Add details like panels, bolts)
     fill(100, 100, 110);
     rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10);

     // Smoke Pipe (Placeholder)
     fill(80);
     rect(machineBox.x + machineBox.w * 0.8, machineBox.y, machineBox.w * 0.1, machineBox.h * 0.15);

     // Input Hopper (Placeholder)
     fill(90);
     triangle(
         machineBox.x + machineBox.w * 0.1, machineBox.y,
         machineBox.x + machineBox.w * 0.3, machineBox.y,
         machineBox.x + machineBox.w * 0.2, machineBox.y + machineBox.h * 0.15
     );

     // Prize Chute
     fill(40);
     rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1);

     // Warning Sign (Placeholder)
     fill(255, 220, 0);
     rect(machineBox.x + machineBox.w * 0.05, machineBox.y + machineBox.h * 0.75, machineBox.w * 0.2, machineBox.h * 0.1);
     fill(0); textSize(min(width, height) * 0.018); textAlign(CENTER, CENTER);
     text("!!DANGER!!", machineBox.x + machineBox.w * 0.15, machineBox.y + machineBox.h * 0.8);
}

function drawPullButton(currentTotalPlushies) {
    if (!gachaPullButton) return;
    let btnColor = color(200, 0, 0);
    let btnTextColor = color(255);
    let btnText = `Pull! (${GACHA_COST === 0 ? 'Free!' : GACHA_COST})`; // Show Free! if cost is 0

    if (isGachaAnimating) {
        btnColor = color(100); // Grey out
        btnTextColor = color(150);
        btnText = "Working...";
    } else if (GACHA_COST > 0 && currentTotalPlushies < GACHA_COST) {
        btnColor = color(150, 0, 0); // Darker red if not enough
        btnTextColor = color(200);
    }

    rectMode(CORNER);
    fill(btnColor); stroke(50); strokeWeight(1);
    rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5);

    fill(btnTextColor); noStroke();
    textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER);
    text(btnText, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2);
}

function drawGachaBackButton() {
    if (!gachaBackButton) return;
    fill(backButtonColor); rectMode(CORNER); noStroke();
    rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5);
    fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER);
    stroke(textStrokeColor); strokeWeight(1.5);
    text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2);
    noStroke();
}

function drawMikaCommentary() {
    let mikaSize = min(width, height) * 0.15;
    let mikaX = width * 0.1;
    let mikaY = height - mikaSize * 0.8;

    // Draw simplified Mika (Placeholder: pink square with ears!)
    fill(kittyColor); noStroke(); rectMode(CENTER);
    rect(mikaX, mikaY, mikaSize * 0.6, mikaSize * 0.6); // Body
    triangle( // Left ear
        mikaX - mikaSize * 0.3, mikaY - mikaSize * 0.3,
        mikaX - mikaSize * 0.3, mikaY - mikaSize * 0.5,
        mikaX - mikaSize * 0.1, mikaY - mikaSize * 0.3
    );
    triangle( // Right ear
        mikaX + mikaSize * 0.3, mikaY - mikaSize * 0.3,
        mikaX + mikaSize * 0.3, mikaY - mikaSize * 0.5,
        mikaX + mikaSize * 0.1, mikaY - mikaSize * 0.3
    );
    rectMode(CORNER); // Reset rectMode

    // Draw commentary bubble if active
    if (mikaCommentaryTimer > 0) {
        mikaCommentaryTimer--;
        let bubbleW = width * 0.6;
        let bubbleH = height * 0.1;
        let bubbleX = mikaX + mikaSize * 0.5;
        let bubbleY = mikaY - bubbleH * 0.8;

        // Draw bubble shape (simple rect with tail)
        fill(240, 240, 240, 220); stroke(50); strokeWeight(1);
        rect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
        triangle( // Tail pointing to Mika
            bubbleX + bubbleW * 0.05, bubbleY + bubbleH,
            bubbleX + bubbleW * 0.15, bubbleY + bubbleH,
            bubbleX + bubbleW * 0.1, bubbleY + bubbleH + 15
        );

        // Draw text
        fill(50); noStroke();
        textSize(min(width, height) * 0.03); textAlign(LEFT, CENTER);
        text(mikaCommentary, bubbleX + 15, bubbleY + bubbleH / 2, bubbleW - 30); // Wrap text
        textAlign(CENTER, CENTER); // Reset alignment
    }
}

// --- Animation Logic ---

function startGachaAnimation() {
    isGachaAnimating = true;
    gachaAnimationTimer = 0;
    currentGachaStep = 'shaking';
    capsule = null; // Clear previous capsule
    spentPlushieParticles = []; // Clear old particles
    sparkParticles = [];
    // Don't clear smoke, let it linger
    setMikaCommentary("Here we go! Don't break, stupid machine!");
    console.log("Gacha animation started: shaking");
}

function updateGachaAnimation() {
    gachaAnimationTimer++;

    // --- Step Transitions ---
    if (currentGachaStep === 'shaking' && gachaAnimationTimer > 40) { // ~0.6s
        currentGachaStep = 'sparking';
        setMikaCommentary("Whoa! Sparky! Is that safe?!");
        console.log("Gacha step: sparking");
    } else if (currentGachaStep === 'sparking' && gachaAnimationTimer > 90) { // ~1.5s total
        currentGachaStep = 'poofing';
        setMikaCommentary("KANA! It's gonna blow! My plushies!!");
        spawnSpentPlushieParticles(); // Spawn plushies flying out
        console.log("Gacha step: poofing");
    } else if (currentGachaStep === 'poofing' && gachaAnimationTimer > 130) { // ~2.1s total
        currentGachaStep = 'dropping';
        spawnCapsule(); // Create the capsule to drop
        setMikaCommentary("Phew... wait, did something come out?");
        console.log("Gacha step: dropping");
    } else if (currentGachaStep === 'dropping' && capsule && capsule.y >= machineBox.y + machineBox.h * 0.9) { // When capsule hits bottom
        currentGachaStep = 'revealing';
        // In a real system, we'd determine the prize here based on the capsule
        setMikaCommentary("A prize! For me?! ...I mean, US, Master! ♡");
        console.log("Gacha step: revealing");
         // Keep revealing state for a bit
    } else if (currentGachaStep === 'revealing' && gachaAnimationTimer > PULL_ANIMATION_DURATION + 30) { // Stay revealed for 0.5s extra
         currentGachaStep = 'idle';
         isGachaAnimating = false;
         capsule = null; // Clear capsule for next pull
         console.log("Gacha animation finished.");
    }

    // --- Continuous Effects during steps ---
    if (currentGachaStep === 'sparking' && frameCount % 3 === 0 && sparkParticles.length < MAX_SPARK_PARTICLES) {
        spawnSparkParticle();
    }
    if ((currentGachaStep === 'shaking' || currentGachaStep === 'sparking' || currentGachaStep === 'poofing') && frameCount % 15 === 0 && smokeParticles.length < MAX_SMOKE_PARTICLES) {
        spawnSmokeParticle(machineBox.x + machineBox.w * 0.85, machineBox.y + machineBox.h * 0.1); // More smoke!
    }

    // Update capsule position if dropping
    if (currentGachaStep === 'dropping' && capsule) {
        capsule.y += 5; // Adjust drop speed as needed
    }
}

function setMikaCommentary(text) {
    mikaCommentary = text;
    mikaCommentaryTimer = MIKA_COMMENTARY_DURATION;
}

// --- Particle Spawning ---

function spawnSmokeParticle(x, y) {
     smokeParticles.push({
        x: x + random(-5, 5),
        y: y + random(-5, 5),
        vx: random(-0.2, 0.2),
        vy: random(-0.8, -0.3), // Moves up
        size: random(15, 30),
        alpha: random(100, 180),
        life: 1.0
     });
}

function spawnSparkParticle() {
    // Spawn near wires (imaginary for now, just around machine edges)
    let side = floor(random(4));
    let x, y;
    if (side === 0) { // Top
        x = machineBox.x + random(machineBox.w); y = machineBox.y;
    } else if (side === 1) { // Bottom
        x = machineBox.x + random(machineBox.w); y = machineBox.y + machineBox.h;
    } else if (side === 2) { // Left
        x = machineBox.x; y = machineBox.y + random(machineBox.h);
    } else { // Right
        x = machineBox.x + machineBox.w; y = machineBox.y + random(machineBox.h);
    }

    sparkParticles.push({
        x: x, y: y,
        vx: random(-2, 2), vy: random(-2, 2),
        len: random(5, 15),
        life: 1.0,
        alpha: 255
    });
}

function spawnSpentPlushieParticles() {
    let poofX = machineBox.x + machineBox.w / 2;
    let poofY = machineBox.y + machineBox.h * 0.3; // Poof from upper-mid machine
    for (let i = 0; i < MAX_PLUSHIE_PARTICLES; i++) {
        spentPlushieParticles.push({
            x: poofX + random(-10, 10),
            y: poofY + random(-10, 10),
            vx: random(-3, 3), // Fly outwards
            vy: random(-5, -1), // Fly upwards initially
            size: random(8, 15),
            color: random(plushieColors), // Use colors from sketch.js
            angle: random(TWO_PI),
            spin: random(-0.1, 0.1),
            life: 1.0,
            alpha: 255
        });
    }
}

function spawnCapsule() {
     // Random color for now - later this could indicate rarity!
    let capsuleColors = [color(255,100,100), color(100,100,255), color(255,255,100), color(200)];
    capsule = {
        x: machineBox.x + machineBox.w / 2, // Center of chute
        y: machineBox.y + machineBox.h * 0.8, // Start just above chute opening
        size: machineBox.w * 0.15,
        color: random(capsuleColors)
    };
}


// --- Particle Updating ---

function updateSmokeParticles() {
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        let p = smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.98; // Slow down vertical rise
        p.life -= 0.015; // Fade out
        p.size *= 0.99; // Shrink slightly
        if (p.life <= 0) {
            smokeParticles.splice(i, 1);
        }
    }
}

function updateSparkParticles() {
     for (let i = sparkParticles.length - 1; i >= 0; i--) {
        let p = sparkParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.9; // Slow down quickly
        p.vy *= 0.9;
        p.life -= 0.08; // Sparks are fast!
        p.alpha = p.life * 255;
        if (p.life <= 0) {
            sparkParticles.splice(i, 1);
        }
    }
}

function updateSpentPlushieParticles() {
     for (let i = spentPlushieParticles.length - 1; i >= 0; i--) {
        let p = spentPlushieParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Add gravity
        p.angle += p.spin;
        p.life -= 0.02;
        p.alpha = p.life * 255;
        if (p.life <= 0) {
            spentPlushieParticles.splice(i, 1);
        }
    }
}

// --- Particle Drawing ---

function drawSmokeParticles() {
    noStroke();
    for (let p of smokeParticles) {
        fill(150, p.alpha * p.life); // Grey smoke
        ellipse(p.x, p.y, p.size);
    }
}

function drawSparkParticles() {
    strokeWeight(2);
    for (let p of sparkParticles) {
        stroke(255, 255, 0, p.alpha); // Yellow sparks
        line(p.x, p.y, p.x + p.vx * p.len * p.life, p.y + p.vy * p.len * p.life); // Draw as lines
    }
    noStroke();
}

function drawSpentPlushieParticles() {
    rectMode(CENTER); // Draw plushies centered and rotated
    for (let p of spentPlushieParticles) {
        push();
        translate(p.x, p.y);
        rotate(p.angle);
        fill(red(p.color), green(p.color), blue(p.color), p.alpha); // Use plushie color
        rect(0, 0, p.size, p.size);
        pop();
    }
    rectMode(CORNER); // Reset rectMode
}

function drawCapsule() {
    if (capsule && (currentGachaStep === 'dropping' || currentGachaStep === 'revealing')) {
        fill(capsule.color);
        stroke(50); strokeWeight(1);
        // Draw simple ellipse capsule
        ellipse(capsule.x, capsule.y, capsule.size, capsule.size * 1.2);
        // Add a highlight?
        fill(255, 255, 255, 150); noStroke();
        ellipse(capsule.x - capsule.size * 0.2, capsule.y - capsule.size * 0.2, capsule.size * 0.3, capsule.size * 0.3);
        noStroke();
    }
}


// --- Handle Gacha Input (Updated for animation) ---
function handleGachaInput(px, py, currentTotalPlushies) {
    if (isGachaAnimating) {
        // console.log("Gacha is animating, input ignored!");
        return true; // Prevent other actions during animation
    }

    // Check Back Button
    if (gachaBackButton && px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w &&
        py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h) {
        console.log("Gacha Back button pressed!");
        gameState = 'start'; // Go back to start screen (defined in sketch.js)
        // Clear commentary when leaving
        mikaCommentary = "";
        mikaCommentaryTimer = 0;
        return 'back'; // Indicate back action
    }

    // Check Pull Button
    if (gachaPullButton && px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w &&
        py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) {
        console.log("Gacha Pull button pressed!");
        // --- COST CHECK REMOVED FOR NOW ---
        // if (currentTotalPlushies >= GACHA_COST) {
            console.log("Enough plushies! Starting Gacha pull...");
            startGachaAnimation();
            // We need to tell sketch.js to subtract cost later when cost is not 0
            // Maybe return GACHA_COST here?
            return 'start_pull'; // Signal that pull started
        // } else {
        //     console.log("Not enough plushies! Need", GACHA_COST);
        //     setMikaCommentary(`Hmph! Not enough plushies! You need ${GACHA_COST}!`);
        //     shakeTime = 10; // Use the shake effect from sketch.js!
        //     return 'pull_fail_cost'; // Indicate failure due to cost
        // }
    }

    return false; // Click was not on a gacha button
}