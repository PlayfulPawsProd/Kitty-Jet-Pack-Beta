// ~~~ gacha.js ~~~ //
// Kana's Kapsule Khaos Machine - Handle with care! Nya~!

// --- Gacha Settings ---
const GACHA_COST = 100; // It costs THIS many of MY plushies! Hmph!

// --- Gacha Screen UI Elements ---
let gachaBackButton;
let gachaPullButton;
let machineBox; // To hold the machine's general position/size

// --- Gacha State ---
let isGachaAnimating = false; // Are we currently playing the pull animation?
// (We'll add more animation state variables later!)

// --- Calculate dynamic Gacha layout elements ---
// This needs to be called from sketch.js's defineButtonBounds and windowResized!
function setupGachaLayout(canvasW, canvasH) {
    console.log("Calculating Gacha layout...");
    // Back Button (bottom left?)
    gachaBackButton = {
        x: 15,
        y: canvasH - 55, // Similar position to store back button
        w: 100,
        h: 40
    };

    // Machine Body (centered, takes up decent space)
    let machineWidth = canvasW * 0.6;
    let machineHeight = canvasH * 0.6;
    machineBox = {
        x: canvasW / 2 - machineWidth / 2,
        y: canvasH * 0.15, // Leave space for title/plushie count
        w: machineWidth,
        h: machineHeight
    };

    // Pull Button (somewhere on the machine?)
    let pullButtonSize = machineWidth * 0.3;
    gachaPullButton = {
        x: machineBox.x + machineBox.w / 2 - pullButtonSize / 2,
        y: machineBox.y + machineBox.h * 0.6, // Lower middle part of machine box
        w: pullButtonSize,
        h: pullButtonSize * 0.8 // Make it slightly rectangular?
    };

    console.log("Gacha layout calculated!", gachaBackButton, machineBox, gachaPullButton);
}

// --- Display Gacha Screen ---
function displayGacha(currentTotalPlushies) {
    if (!width || !height) return; // Safety check!

    // --- Draw Background (Maybe a slightly different dimming?) ---
    fill(30, 30, 40, 230); // Darker, slightly bluer than store?
    rectMode(CORNER);
    rect(0, 0, width, height);

    // --- Draw Title ---
    fill(textColor);
    stroke(textStrokeColor);
    strokeWeight(3);
    textSize(min(width, height) * 0.07);
    textAlign(CENTER, TOP);
    text("Kana's Kapsule Khaos!", width / 2, height * 0.05);

    // --- Draw Plushie Count ---
    textSize(min(width, height) * 0.04);
    strokeWeight(2);
    text(`Your Plushies: ${currentTotalPlushies}`, width / 2, height * 0.12);
    noStroke();

    // --- Draw Kana's Rickety Machine (Basic Placeholder) ---
    if (machineBox) {
        // Simple box for now
        fill(100, 100, 110); // Placeholder grey
        rectMode(CORNER);
        rect(machineBox.x, machineBox.y, machineBox.w, machineBox.h, 10); // Rounded corners?

        // Placeholder for the Big Red Button
        if (gachaPullButton) {
            fill(200, 0, 0); // BIG RED!
            rect(gachaPullButton.x, gachaPullButton.y, gachaPullButton.w, gachaPullButton.h, 5);
            fill(255);
            textSize(min(width, height) * 0.035);
            textAlign(CENTER, CENTER);
            text(`Pull! (${GACHA_COST})`, gachaPullButton.x + gachaPullButton.w / 2, gachaPullButton.y + gachaPullButton.h / 2);
        }

        // Placeholder for Prize Chute
        fill(40);
        rect(machineBox.x + machineBox.w * 0.3, machineBox.y + machineBox.h * 0.85, machineBox.w * 0.4, machineBox.h * 0.1);

        // TODO: Add wires, smoke, funnel, warning labels later! Nya!
    }

    // --- Draw Back Button ---
    if (gachaBackButton) {
        fill(backButtonColor); // Use the same color defined in sketch.js
        rectMode(CORNER);
        noStroke();
        rect(gachaBackButton.x, gachaBackButton.y, gachaBackButton.w, gachaBackButton.h, 5);
        fill(textColor);
        textSize(min(width, height) * 0.04);
        textAlign(CENTER, CENTER);
        stroke(textStrokeColor);
        strokeWeight(1.5);
        text("Back", gachaBackButton.x + gachaBackButton.w / 2, gachaBackButton.y + gachaBackButton.h / 2);
        noStroke(); // Reset stroke
    }

    // Reset alignments maybe
    textAlign(CENTER, CENTER);
}

// --- Handle Gacha Input ---
// Returns true if input was handled (e.g., back button), false otherwise
function handleGachaInput(px, py, currentTotalPlushies) {
    if (isGachaAnimating) {
        console.log("Gacha is animating, input ignored!");
        return true; // Prevent other actions during animation
    }

    // Check Back Button
    if (gachaBackButton && px >= gachaBackButton.x && px <= gachaBackButton.x + gachaBackButton.w &&
        py >= gachaBackButton.y && py <= gachaBackButton.y + gachaBackButton.h) {
        console.log("Gacha Back button pressed!");
        gameState = 'start'; // Go back to start screen (defined in sketch.js)
        return true; // Handled
    }

    // Check Pull Button
    if (gachaPullButton && px >= gachaPullButton.x && px <= gachaPullButton.x + gachaPullButton.w &&
        py >= gachaPullButton.y && py <= gachaPullButton.y + gachaPullButton.h) {
        console.log("Gacha Pull button pressed!");
        if (currentTotalPlushies >= GACHA_COST) {
            console.log("Enough plushies! Starting Gacha pull...");
            // TODO: Start the animation!
            // TODO: Subtract cost (maybe return cost to sketch.js?)
            isGachaAnimating = true; // Placeholder for now
            // We'll need to handle the actual cost subtraction and prize generation later
            setTimeout(() => { isGachaAnimating = false; console.log("DEBUG: Animation finished (placeholder)"); }, 1500); // Simple timer for now
            return true; // Input was to start the pull
        } else {
            console.log("Not enough plushies! Need", GACHA_COST);
            // TODO: Add a "Denied!" visual/sound effect? Shake?
            shakeTime = 10; // Use the shake effect from sketch.js!
            return true; // Input was handled (tried to pull but failed)
        }
    }

    return false; // Click was not on a gacha button
}

// We'll add drawing details and animation logic later! Nya~!