// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! SUPER DUPER DEBUG MODE! Nya~!

// --- Wardrobe State ---
let currentShelf = 'colors';
// Commenting out scroll indices for now as they aren't used
// let scrollIndexColors = 0;
// let scrollIndexPlushies = 0;
// let scrollIndexUpgrades = 0;
// const ITEMS_PER_PAGE = 4;

// --- UI Elements ---
let wardrobeBackButton;
let shelfTabs = {};
// let itemDisplayArea; // Commented out - not drawing it
// let leftArrowButton, rightArrowButton; // Commented out - not drawing arrows
let wardrobeTitleY, shelvesY;

// --- Mika Commentary --- (Keep vars, but won't be drawn)
let wardrobeMikaCommentary = "";
let wardrobeMikaCommentaryTimer = 0;
const WARDROBE_MIKA_COMMENTARY_DURATION = 240;

// --- Calculate dynamic Wardrobe layout elements (Simplified) ---
function setupWardrobeLayout(canvasW, canvasH) {
    console.log("Calculating SIMPLE Wardrobe layout...");
    try {
        wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 };
        wardrobeTitleY = canvasH * 0.07;
        shelvesY = canvasH * 0.15;

        let tabWidth = canvasW / 3.5;
        let tabSpacing = 10;
        let tabHeight = 40;
        let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2);
        let tabsStartX = canvasW / 2 - totalTabWidth / 2;

        shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" };
        shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" };
        shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" };

        // itemDisplayArea, leftArrowButton, rightArrowButton - no need to calculate if not drawn

        console.log("SIMPLE Wardrobe layout calculated!");
    } catch (e) {
        console.error("Error in setupWardrobeLayout (Simple):", e);
        // Minimal fallback
        wardrobeBackButton = {x:0,y:0,w:1,h:1}; shelfTabs = {};
    }
}

// --- Display Wardrobe Screen (SUPER Simplified) ---
function displayWardrobe() {
    // ** Minimal Dependency Check **
    const dependencies = [ { name: 'width', type: 'variable' }, { name: 'height', type: 'variable' }, { name: 'wardrobeBackButton', type: 'variable' }, { name: 'shelfTabs', type: 'variable' }, { name: 'color', type: 'function' }, { name: 'background', type: 'function'}, { name: 'fill', type: 'function' }, { name: 'stroke', type: 'function' }, { name: 'rect', type: 'function' }, { name: 'textSize', type: 'function'}, { name: 'textAlign', type: 'function'}, { name: 'text', type: 'function' }, { name: 'noStroke', type: 'function'}, { name: 'strokeWeight', type: 'function'}, { name: 'min', type: 'function' }, { name: 'textColor', type: 'variable' }, { name: 'textStrokeColor', type: 'variable' }, { name: 'backButtonColor', type: 'variable' } ];
    let missingDep = null;
    for (const dep of dependencies) { let value; try { value = eval(dep.name); } catch (e) { missingDep = dep.name + " (RefErr)"; break; } if (dep.type === 'function' && typeof value !== 'function') { missingDep = dep.name + " (!func)"; break; } else if (dep.type === 'variable' && (typeof value === 'undefined' || value === null)) { if (dep.name === 'shelfTabs' && (typeof value !== 'object' || Object.keys(value).length === 0)) { missingDep = dep.name + " (!obj)"; break; } else if (dep.name !== 'shelfTabs'){ missingDep = dep.name + " (undef)"; break; } } }
    if (missingDep) { console.error(`Wardrobe display dependency missing: ${missingDep}!`); try { background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); noStroke(); text(`Wardrobe Error!\nMissing: ${missingDep}\nCheck console.`, width / 2 || 200, height / 2 || 200); } catch(e) {} return; }

    // --- Minimal Drawing ---
    try {
        fill(60, 50, 70, 230); rectMode(CORNER); rect(0, 0, width, height); // Background
        fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER); text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY); // Title

        // Draw Tabs ONLY
        textSize(min(width, height) * 0.03); strokeWeight(1.5);
        for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab || typeof tab.x === 'undefined') continue; if (currentShelf === key) { fill(180, 150, 200); stroke(textColor); } else { fill(100, 80, 120); stroke(180); } rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0); fill(currentShelf === key ? textColor : 200); noStroke(); textAlign(CENTER, CENTER); text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2); }

        // --- Commented out drawing these ---
        // drawShelfItems();
        // drawWardrobeArrows();
        // drawWardrobeMika();
        // --- End commented out ---

        drawWardrobeBackButton(); // Draw ONLY the back button

        textAlign(CENTER, CENTER); noStroke(); // Reset

    } catch (e) { console.error("Error during simple displayWardrobe drawing:", e); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Wardrobe Draw Error! ${e.message}`, width/2, height/2 + 30); }
}

// --- Helper to Set Mika's Commentary (Keep for input handler) ---
function setWardrobeMikaCommentary(text) { wardrobeMikaCommentary = text; wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION; }

// --- Helper to Draw Shelf Items (Keep placeholder version) ---
function drawShelfItems() {
    // Just draw nothing or a placeholder message if needed
     textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
     if(itemDisplayArea) { // Check if area is defined
        text("(Items Hidden for Debug)", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
     }
}

// --- Helper to Draw Arrows (Keep placeholder version) ---
function drawWardrobeArrows() {
    // Draw nothing for now
}

// --- Helper to Draw Back Button (Keep actual drawing) ---
function drawWardrobeBackButton() { if (!wardrobeBackButton || !backButtonColor || !textColor || !textStrokeColor) { return; } try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing wardrobe back button:", e); } }

// --- Helper to Draw Mika and Bubble (Keep function definition but call is commented out) ---
function drawWardrobeMika() { /* ... definition is still here ... */ }


// --- Handle Wardrobe Input (Simplified - Only handle Back & Tabs) ---
function handleWardrobeInput(px, py) {
    // Minimal Dependency Check for Input
    const neededVars = [wardrobeBackButton, shelfTabs, gameState, shakeTime, currentShelf];
    for(const v of neededVars) { if (typeof v === 'undefined') { console.error(`Wardrobe Input missing variable!`); return false; }}

    try {
        // 1. Back Button
        if (px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) { console.log("Wardrobe Back!"); gameState = 'start'; return true; }

        // 2. Shelf Tabs
        for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab) continue; if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) { if (currentShelf !== key) { if (key === 'colors') { console.log("Switch shelf: colors"); currentShelf = key; /* Maybe no commentary */ } else { console.log("Shelf WIP:", key); shakeTime = 8; /* Maybe no commentary */ } } return true; } }

        // --- Temporarily Disabled Arrow & Item Clicks ---
        /*
        // 3. Arrow Buttons Check...
        // 4. Item Clicks Check...
        */
        // --- End Disabled ---

    } catch (e) { console.error("Error during simple handleWardrobeInput:", e); return false; }
    return false; // Click wasn't handled
}

// --- Dependencies ---
// Still needs functions from store.js IF item drawing/handling is re-enabled.
// Needs items.js array IF item drawing/handling is re-enabled.
// Needs sketch.js globals & p5 functions.