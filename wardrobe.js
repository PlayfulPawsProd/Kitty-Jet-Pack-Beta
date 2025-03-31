// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! DEBUGGING Invisible Back Button! Nya~! ♡

// --- Wardrobe State ---
let currentShelf = 'colors'; let scrollIndexColors = 0; let scrollIndexPlushies = 0; let scrollIndexUpgrades = 0;
const ITEMS_PER_PAGE = 4;

// --- UI Elements ---
let wardrobeBackButton; let shelfTabs = {}; let itemDisplayArea; let leftArrowButton, rightArrowButton; let wardrobeTitleY, shelvesY;

// --- Mika Commentary ---
let wardrobeMikaCommentary = ""; let wardrobeMikaCommentaryTimer = 0;
const WARDROBE_MIKA_COMMENTARY_DURATION = 240;

// --- Data --- (Populated dynamically)

// --- Calculate dynamic Wardrobe layout elements ---
function setupWardrobeLayout(canvasW, canvasH) { console.log("Calculating Wardrobe layout..."); try { wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; wardrobeTitleY = canvasH * 0.07; shelvesY = canvasH * 0.15; let tabWidth = canvasW / 3.5; let tabSpacing = 10; let tabHeight = 40; let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2); let tabsStartX = canvasW / 2 - totalTabWidth / 2; shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" }; shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" }; shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" }; itemDisplayArea = { x: canvasW * 0.1, y: shelvesY + tabHeight + 20, w: canvasW * 0.8, h: canvasH * 0.5 }; let arrowSize = 40; leftArrowButton = { x: itemDisplayArea.x - arrowSize - 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; rightArrowButton = { x: itemDisplayArea.x + itemDisplayArea.w + 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; console.log("Wardrobe layout calculated!"); } catch (e) { console.error("Error in setupWardrobeLayout:", e); wardrobeBackButton = {x:0,y:0,w:1,h:1}; shelfTabs = {}; itemDisplayArea={x:0,y:0,w:1,h:1}; leftArrowButton={x:0,y:0,w:1,h:1}; rightArrowButton={x:0,y:0,w:1,h:1}; } }


// --- Display Wardrobe Screen ---
function displayWardrobe() {
    const dependencies = [ { name: 'width', type: 'variable' }, { name: 'height', type: 'variable' }, { name: 'itemDisplayArea', type: 'variable' }, { name: 'wardrobeBackButton', type: 'variable' }, { name: 'shelfTabs', type: 'variable' }, { name: 'leftArrowButton', type: 'variable' }, { name: 'rightArrowButton', type: 'variable' }, { name: 'wardrobeTitleY', type: 'variable' }, { name: 'color', type: 'function' }, { name: 'background', type: 'function'}, { name: 'fill', type: 'function' }, { name: 'stroke', type: 'function' }, { name: 'rectMode', type: 'function'}, { name: 'rect', type: 'function' }, { name: 'textSize', type: 'function'}, { name: 'textAlign', type: 'function'}, { name: 'text', type: 'function' }, { name: 'noStroke', type: 'function'}, { name: 'strokeWeight', type: 'function'}, { name: 'min', type: 'function' }, { name: 'constrain', type: 'function' }, { name: 'triangle', type: 'function' }, { name: 'storeItems', type: 'variable' }, { name: 'textColor', type: 'variable' }, { name: 'textStrokeColor', type: 'variable' }, { name: 'backButtonColor', type: 'variable' }, { name: 'heartColor', type: 'variable' }, { name: 'kittyColor', type: 'variable'}, { name: 'isItemOwned', type: 'function' }, { name: 'getEquippedItem', type: 'function' }, { name: 'getColorValueById', type: 'function' }, { name: 'drawStaticKitty', type: 'function' } ];
    let missingDep = null; for (const dep of dependencies) { let value; try { value = eval(dep.name); } catch (e) { missingDep = dep.name + " (RefErr)"; break; } if (dep.type === 'function' && typeof value !== 'function') { missingDep = dep.name + " (!func)"; break; } else if (dep.type === 'variable' && (typeof value === 'undefined' || value === null)) { if (dep.name === 'shelfTabs' && (typeof value !== 'object' || Object.keys(value).length === 0)) { missingDep = dep.name + " (!obj)"; break; } else if (dep.name !== 'shelfTabs'){ missingDep = dep.name + " (undef)"; break; } } }
    if (missingDep) { console.error(`Wardrobe display dependency missing: ${missingDep}!`); try { background(0); fill(255, 0, 0); textSize(20); textAlign(CENTER, CENTER); noStroke(); text(`Wardrobe Error!\nMissing: ${missingDep}\nCheck console.`, width / 2 || 200, height / 2 || 200); } catch(e) {} return; }

    try { // --- Normal Drawing ---
        fill(60, 50, 70, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER); text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY); textSize(min(width, height) * 0.03); strokeWeight(1.5);
        for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab || typeof tab.x === 'undefined') continue; if (currentShelf === key) { fill(180, 150, 200); stroke(textColor); } else { fill(100, 80, 120); stroke(180); } rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0); fill(currentShelf === key ? textColor : 200); noStroke(); textAlign(CENTER, CENTER); text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2); }
        noStroke(); fill(40, 30, 50, 180); rect(itemDisplayArea.x, itemDisplayArea.y, itemDisplayArea.w, itemDisplayArea.h, 5);
        drawShelfItems(); // Drawing items restored
        drawWardrobeArrows(); // Drawing arrows restored
        drawWardrobeBackButton(); // Drawing back button (with logs)
        drawWardrobeMika(); // Drawing Mika restored
        textAlign(CENTER, CENTER); noStroke();
    } catch (e) { console.error("Error during displayWardrobe drawing:", e); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Wardrobe Draw Error! ${e.message}`, width/2, height/2 + 30); }
}

// --- Helper to Set Mika's Commentary ---
function setWardrobeMikaCommentary(text) { wardrobeMikaCommentary = text; wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION; }

// --- Helper to Draw Shelf Items (Restored) ---
function drawShelfItems() {
    if (!itemDisplayArea || typeof isItemOwned !== 'function' || typeof getEquippedItem !== 'function' || typeof getColorValueById !== 'function' || !storeItems || !textColor || !heartColor) { console.error("Deps missing for drawShelfItems!"); textSize(min(width, height)*0.04); fill(255,0,0); textAlign(CENTER, CENTER); text("Item Drawing Error!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }
    try {
        let itemsToShow = []; let scrollIndex = 0; let itemType = '';
        if (currentShelf === 'colors') { if (!Array.isArray(storeItems)) throw new Error("storeItems not array!"); let ownedColorItems = storeItems.filter(item => item && item.type === 'kitty_color' && isItemOwned(item.id)); let defaultItemData = storeItems.find(item => item && item.id === 'default'); if (defaultItemData && !ownedColorItems.some(item => item && item.id === 'default')) { ownedColorItems.unshift(defaultItemData); } itemsToShow = ownedColorItems; scrollIndex = scrollIndexColors; itemType = 'kitty_color'; }
        else if (currentShelf === 'plushies') { textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Plushie shelf soon!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }
        else if (currentShelf === 'upgrades') { textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Upgrade shelf soon!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }

        if (!Array.isArray(itemsToShow)) { console.warn("itemsToShow invalid!"); itemsToShow = [];}
        if (itemsToShow.length === 0) { textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Nothing here yet!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }

        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20; let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5); let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE; let nameYOffset = 20;
        let equippedItemId = getEquippedItem(itemType); if (itemType === 'kitty_color' && equippedItemId === null) { equippedItemId = 'default'; }

        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            let itemIndex = scrollIndex + i; if (itemIndex >= itemsToShow.length) break; let item = itemsToShow[itemIndex]; if (!item || !item.id || !item.name) continue;
            let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2); let itemDrawX = itemSlotCenterX - (itemSize / 2); let itemDrawY = displayStartY + itemDisplayArea.h * 0.15;

            if (item.type === 'kitty_color') { let c = getColorValueById(item.id); if (c) { fill(c); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5); } else { fill(128); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5); fill(255,0,0); text("!", itemDrawX + itemSize/2, itemDrawY + itemSize/2); } }
            else { fill(100); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5); fill(200); noStroke(); textSize(itemSize * 0.5); textAlign(CENTER, CENTER); text("?", itemDrawX + itemSize/2, itemDrawY + itemSize/2); }
            fill(textColor); noStroke(); textSize(min(width, height) * 0.022); textAlign(CENTER, TOP); text(item.name, itemSlotCenterX, itemDrawY + itemSize + nameYOffset);
            if (equippedItemId === item.id) { fill(heartColor); textSize(itemSize * 0.3); textAlign(CENTER, CENTER); text("♥", itemSlotCenterX, itemDrawY - 10); }
        }
        textAlign(CENTER, CENTER);

    } catch (e) { console.error("Error during drawShelfItems:", e); fill(255,0,0); textSize(16); textAlign(CENTER,CENTER); text(`Item Draw Error! ${e.message}`, itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2 + 20); }
}

// --- Helper to Draw Arrows ---
function drawWardrobeArrows() { /* ... (Same logic) ... */ if (!leftArrowButton || !rightArrowButton || typeof isItemOwned !== 'function' || typeof storeItems === 'undefined') { console.error("Arrow draw deps missing!"); return; } try { let items = []; let index = 0; if (currentShelf === 'colors') { if(Array.isArray(storeItems)) { items = storeItems.filter(item => item && item.type === 'kitty_color' && isItemOwned(item.id)); let di=storeItems.find(i=>i&&i.id==='default'); if (di && !items.some(item => item && item.id === 'default')){ items.unshift(di); }} index = scrollIndexColors; } if (!Array.isArray(items)) items = []; let canScrollRight = (items.length > 0 && (index + ITEMS_PER_PAGE < items.length)); fill(150, 150, 180, (index > 0) ? 220 : 80); noStroke(); triangle(leftArrowButton.x + leftArrowButton.w, leftArrowButton.y, leftArrowButton.x + leftArrowButton.w, leftArrowButton.y + leftArrowButton.h, leftArrowButton.x, leftArrowButton.y + leftArrowButton.h / 2); fill(150, 150, 180, canScrollRight ? 220 : 80); noStroke(); triangle(rightArrowButton.x, rightArrowButton.y, rightArrowButton.x, rightArrowButton.y + rightArrowButton.h, rightArrowButton.x + rightArrowButton.w, rightArrowButton.y + rightArrowButton.h / 2); } catch (e) { console.error("Error drawing wardrobe arrows:", e); } }

// --- Helper to Draw Back Button (WITH DEBUG LOGS!) ---
function drawWardrobeBackButton() {
    console.log(">>> Attempting to draw Wardrobe Back Button..."); // LOG: Function called

    // Check dependencies again, just in case
    if (!wardrobeBackButton || typeof wardrobeBackButton.x === 'undefined' || !backButtonColor || !textColor || !textStrokeColor) {
        console.error(">>> Back button drawing dependencies missing! Button:", wardrobeBackButton, "Colors:", backButtonColor, textColor, textStrokeColor);
        return; // Stop if critical things are missing
    }
    if (typeof fill !== 'function' || typeof rectMode !== 'function' || typeof noStroke !== 'function' || typeof rect !== 'function' || typeof textSize !== 'function' || typeof textAlign !== 'function' || typeof stroke !== 'function' || typeof strokeWeight !== 'function' || typeof text !== 'function') {
        console.error(">>> Basic p5 drawing functions missing for Back Button!");
        return;
    }

    try {
        console.log(`>>> Back Btn Coords: x=${wardrobeBackButton.x.toFixed(1)}, y=${wardrobeBackButton.y.toFixed(1)}, w=${wardrobeBackButton.w.toFixed(1)}, h=${wardrobeBackButton.h.toFixed(1)}`); // LOG: Coordinates
        console.log(">>> Back Btn Colors: BG=", backButtonColor.toString(), "Text=", textColor.toString()); // LOG: Colors

        // --- Draw Rectangle ---
        fill(backButtonColor); // Use the defined color
        console.log(">>> Set fill for rect:", backButtonColor.toString()); // LOG: Fill set
        rectMode(CORNER);
        noStroke();
        console.log(">>> Called noStroke() for rect."); // LOG: Stroke off
        rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5); // Draw the rectangle
        console.log(">>> Drew rect."); // LOG: Rect drawn

        // --- Draw Text ---
        fill(textColor); // Use text color
        console.log(">>> Set fill for text:", textColor.toString()); // LOG: Fill set
        textSize(min(width, height) * 0.04);
        textAlign(CENTER, CENTER);
        stroke(textStrokeColor); // Set stroke for text
        strokeWeight(1.5);
        console.log(">>> Set stroke for text."); // LOG: Stroke set
        text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2); // Draw the text
        console.log(">>> Drew text 'Back'."); // LOG: Text drawn

        // --- Reset Stroke ---
        noStroke(); // Reset stroke for other drawing elements
        console.log(">>> Reset stroke after text."); // LOG: Stroke reset

    } catch (e) {
        // ** Log any error during drawing **
        console.error(">>> !!! ERROR drawing wardrobe back button:", e.message, e);
    }
}

// --- Helper to Draw Mika and Bubble (Restored) ---
function drawWardrobeMika() { if (!width || !height || typeof drawStaticKitty !== 'function' || typeof kittyColor === 'undefined' || !heartColor || !wardrobeBackButton) { console.error("Deps missing for drawWardrobeMika!"); return; } try { let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer; if (mikaX - mikaSize / 2 < wardrobeBackButton.x + wardrobeBackButton.w + 10) { mikaX = wardrobeBackButton.x + wardrobeBackButton.w + 10 + mikaSize / 2; } drawStaticKitty(mikaX, mikaY, mikaSize); if (wardrobeMikaCommentaryTimer <= 0 && wardrobeMikaCommentary === "") { setWardrobeMikaCommentary("Hmm, what should I wear for Master today~?"); } if (wardrobeMikaCommentaryTimer > 0) { wardrobeMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(wardrobeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { wardrobeMikaCommentary = ""; } } catch (e) { console.error("Error drawing wardrobe Mika:", e); } }


// --- Handle Wardrobe Input (Restored) ---
function handleWardrobeInput(px, py) {
    const neededFuncs = [isItemOwned, getEquippedItem, equipItem, setWardrobeMikaCommentary]; const neededVars = [wardrobeBackButton, shelfTabs, leftArrowButton, rightArrowButton, itemDisplayArea, storeItems, gameState, shakeTime, kittyColor, currentShelf, scrollIndexColors];
    for(const func of neededFuncs) { if (typeof func !== 'function') { console.error(`Wardrobe Input missing func: ${func.name}!`); return false; }}
    for(const v of neededVars) { if (typeof v === 'undefined') { console.error(`Wardrobe Input missing var!`); return false; }}

    try {
        // 1. Back Button
        if (px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) { console.log("Wardrobe Back!"); gameState = 'start'; return true; }

        // 2. Shelf Tabs
        for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab) continue; if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) { if (currentShelf !== key) { if (key === 'colors') { console.log("Switch shelf: colors"); currentShelf = key; setWardrobeMikaCommentary("Ooh, colors! Which one makes me look cutest for Master?"); } else { console.log("Shelf WIP:", key); shakeTime = 8; setWardrobeMikaCommentary("Hmph! Master hasn't unlocked this shelf for me yet!"); } } return true; } }

        // 3. Arrow Buttons
        let items = []; let indexRef = { index: 0 };
        if (currentShelf === 'colors') { if(Array.isArray(storeItems)) { items = storeItems.filter(item => item && item.type === 'kitty_color' && isItemOwned(item.id)); let di=storeItems.find(i=>i&&i.id==='default'); if (di && !items.some(item => item && item.id === 'default')){ items.unshift(di); }} indexRef.index = scrollIndexColors; }
        if (!Array.isArray(items)) items = [];

        if (indexRef.index > 0 && px >= leftArrowButton.x && px <= leftArrowButton.x + leftArrowButton.w && py >= leftArrowButton.y && py <= leftArrowButton.y + leftArrowButton.h) { console.log("Scroll left:", currentShelf); indexRef.index = max(0, indexRef.index - ITEMS_PER_PAGE); if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; } setWardrobeMikaCommentary("Let's see the others again!"); return true; }
        if ((items.length > 0 && indexRef.index + ITEMS_PER_PAGE < items.length) && px >= rightArrowButton.x && px <= rightArrowButton.x + rightArrowButton.w && py >= rightArrowButton.y && py <= rightArrowButton.y + rightArrowButton.h) { console.log("Scroll right:", currentShelf); indexRef.index += ITEMS_PER_PAGE; if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; } setWardrobeMikaCommentary("What else have you got for me, Master?!"); return true; }

        // 4. Item Clicks
        if (items.length === 0) { return false; }
        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20; let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5); let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;
        for (let i = 0; i < ITEMS_PER_PAGE; i++) { let itemIndex = indexRef.index + i; if (itemIndex >= items.length) break; let item = items[itemIndex]; if (!item) continue; let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2); let itemDrawX = itemSlotCenterX - (itemSize / 2); let itemDrawY = displayStartY + itemDisplayArea.h*0.15;
            if (px >= itemDrawX && px <= itemDrawX + itemSize && py >= itemDrawY && py <= itemDrawY + itemSize + 40) {
                console.log("Clicked item:", item.name);
                if (item.type === 'kitty_color') {
                    let currentEquipped = getEquippedItem('kitty_color');
                    if ((currentEquipped === item.id) || (item.id === 'default' && currentEquipped === null)) { console.log("Unequip color."); equipItem('kitty_color', null); setWardrobeMikaCommentary("Default pink is cute too... I guess. Hmph!"); }
                    else { console.log("Equip color:", item.name); equipItem('kitty_color', item.id); setWardrobeMikaCommentary(`Yes! ${item.name} looks *purrfect* on me! Right, Master~? ♡`); }
                } else { console.log("Cannot equip:", item.type); shakeTime = 8; setWardrobeMikaCommentary("That's... not really my style, Master."); }
                return true; // Click handled
            }
        }
    } catch (e) { console.error("Error during handleWardrobeInput:", e); setWardrobeMikaCommentary("Ouch! Broke something!"); return false; }
    return false; // Click wasn't handled
}

// --- Dependencies ---