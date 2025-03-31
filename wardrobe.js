// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! Cleaned up to use new helpers! Nya~! ♡

// --- Wardrobe State ---
let currentShelf = 'colors'; let scrollIndexColors = 0; let scrollIndexPlushies = 0; let scrollIndexUpgrades = 0;
const ITEMS_PER_PAGE = 4;

// --- UI Elements ---
let wardrobeBackButton; let shelfTabs = {}; let itemDisplayArea; let leftArrowButton, rightArrowButton; let wardrobeTitleY, shelvesY;

// --- Mika Commentary ---
let wardrobeMikaCommentary = ""; let wardrobeMikaCommentaryTimer = 0;
const WARDROBE_MIKA_COMMENTARY_DURATION = 240;

// --- Data ---
// Removed ownedColorItems definition here, it's populated dynamically now

// --- Calculate dynamic Wardrobe layout elements ---
function setupWardrobeLayout(canvasW, canvasH) { /* ... (No changes needed here) ... */ console.log("Calculating Wardrobe layout..."); try { wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; wardrobeTitleY = canvasH * 0.07; shelvesY = canvasH * 0.15; let tabWidth = canvasW / 3.5; let tabSpacing = 10; let tabHeight = 40; let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2); let tabsStartX = canvasW / 2 - totalTabWidth / 2; shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" }; shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" }; shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" }; itemDisplayArea = { x: canvasW * 0.1, y: shelvesY + tabHeight + 20, w: canvasW * 0.8, h: canvasH * 0.5 }; let arrowSize = 40; leftArrowButton = { x: itemDisplayArea.x - arrowSize - 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; rightArrowButton = { x: itemDisplayArea.x + itemDisplayArea.w + 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize }; console.log("Wardrobe layout calculated!"); } catch (e) { console.error("Error in setupWardrobeLayout:", e); wardrobeBackButton = {x:0,y:0,w:1,h:1}; shelfTabs = {}; itemDisplayArea={x:0,y:0,w:1,h:1}; leftArrowButton={x:0,y:0,w:1,h:1}; rightArrowButton={x:0,y:0,w:1,h:1}; } }

// --- Display Wardrobe Screen ---
function displayWardrobe() { /* ... (No changes needed here) ... */ if (!width || !height || !itemDisplayArea || !wardrobeBackButton || !textColor || !textStrokeColor || !backButtonColor || !heartColor) { console.error("Wardrobe display dependencies missing!"); background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER); text("Wardrobe Error! Check console.", width/2, height/2); return; } try { fill(60, 50, 70, 230); rectMode(CORNER); rect(0, 0, width, height); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER); text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY); textSize(min(width, height) * 0.03); strokeWeight(1.5); for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab || typeof tab.x === 'undefined') continue; if (currentShelf === key) { fill(180, 150, 200); stroke(textColor); } else { fill(100, 80, 120); stroke(180); } rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0); fill(currentShelf === key ? textColor : 200); noStroke(); textAlign(CENTER, CENTER); text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2); } noStroke(); fill(40, 30, 50, 180); rect(itemDisplayArea.x, itemDisplayArea.y, itemDisplayArea.w, itemDisplayArea.h, 5); drawShelfItems(); drawWardrobeArrows(); drawWardrobeBackButton(); drawWardrobeMika(); textAlign(CENTER, CENTER); noStroke(); } catch (e) { console.error("Error during displayWardrobe drawing:", e); fill(255,0,0); textSize(18); textAlign(CENTER,CENTER); text(`Wardrobe Draw Error! ${e.message}`, width/2, height/2 + 30); } }

// --- Helper to Set Mika's Commentary ---
function setWardrobeMikaCommentary(text) { /* ... (No changes needed) ... */ wardrobeMikaCommentary = text; wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION; }

// --- Helper to Draw Shelf Items (Uses isItemOwned & getColorValueById) ---
function drawShelfItems() {
    // Updated Dependency Check
    if (!itemDisplayArea || typeof isItemOwned !== 'function' || typeof getEquippedItem !== 'function' || typeof getColorValueById !== 'function' || !storeItems || !textColor || !heartColor) {
        console.error("Dependencies missing for drawShelfItems (isItemOwned, getColorValueById?)!");
        textSize(min(width, height)*0.04); fill(255,0,0); textAlign(CENTER, CENTER);
        text("Item Drawing Error!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
        return;
    }
    try {
        let itemsToShow = []; let scrollIndex = 0; let itemType = '';
        if (currentShelf === 'colors') {
            // --- Use isItemOwned to get ALL owned colors ---
            let ownedColorItems = storeItems.filter(item => item.type === 'kitty_color' && isItemOwned(item.id));
            // --- End Use isItemOwned ---
            // Ensure default pink is always first if no other color is owned/equipped
            // (Simpler approach: isItemOwned('default') should return true)
            if (!ownedColorItems.some(item => item.id === 'default')) {
                 // Find default in main list to get its data correctly
                 let defaultItemData = storeItems.find(item => item.id === 'default');
                 if (defaultItemData) ownedColorItems.unshift(defaultItemData);
             }

            itemsToShow = ownedColorItems; scrollIndex = scrollIndexColors; itemType = 'kitty_color';
        } else if (currentShelf === 'plushies') { /* ... placeholder ... */ textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Plushie shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }
        else if (currentShelf === 'upgrades') { /* ... placeholder ... */ textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Upgrade shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }

        if (!itemsToShow || itemsToShow.length === 0) { /* ... placeholder ... */ textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER); text("Nothing here yet, Master! Go get me stuff!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return; }

        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20; let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5); let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE; let nameYOffset = 20;
        let equippedItemId = getEquippedItem(itemType); if (itemType === 'kitty_color' && equippedItemId === null) { equippedItemId = 'default'; }

        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            let itemIndex = scrollIndex + i; if (itemIndex >= itemsToShow.length) break; let item = itemsToShow[itemIndex]; if (!item || !item.id || !item.name) continue;
            let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2); let itemDrawX = itemSlotCenterX - (itemSize / 2); let itemDrawY = displayStartY + itemDisplayArea.h * 0.15;

            // --- Draw Item Swatch using Helper Function ---
            if (item.type === 'kitty_color') {
                let c = getColorValueById(item.id); // <-- USE HELPER FUNCTION!
                if (c) { // Check if color function returned a valid color
                    fill(c); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5);
                } else { // Fallback if color function failed
                     fill(128); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5);
                     fill(255,0,0); text("!", itemDrawX + itemSize/2, itemDrawY + itemSize/2); // Error indicator
                 }
            } else { /* ... placeholder drawing ... */ fill(100); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5); fill(200); noStroke(); textSize(itemSize * 0.5); textAlign(CENTER, CENTER); text("?", itemDrawX + itemSize/2, itemDrawY + itemSize/2); }
            // --- End Draw Item Swatch ---

            fill(textColor); noStroke(); textSize(min(width, height) * 0.022); textAlign(CENTER, TOP); text(item.name, itemSlotCenterX, itemDrawY + itemSize + nameYOffset); // Name
            if (equippedItemId === item.id) { fill(heartColor); textSize(itemSize * 0.3); textAlign(CENTER, CENTER); text("♥", itemSlotCenterX, itemDrawY - 10); } // Equipped Heart
        }
        textAlign(CENTER, CENTER); // Reset

    } catch (e) { console.error("Error during drawShelfItems:", e); fill(255,0,0); textSize(16); textAlign(CENTER,CENTER); text(`Item Draw Error! ${e.message}`, itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2 + 20); }
}

// --- Helper to Draw Arrows ---
function drawWardrobeArrows() { /* ... (logic relies on itemsToShow being populated correctly now) ... */ if (!leftArrowButton || !rightArrowButton) { console.error("Arrow buttons not defined!"); return; } try { let items = []; let index = 0; if (currentShelf === 'colors') { let ownedColorItems = storeItems.filter(item => item.type === 'kitty_color' && isItemOwned(item.id)); if (!ownedColorItems.some(item => item.id === 'default')) { let di=storeItems.find(i=>i.id==='default'); if(di) ownedColorItems.unshift(di); } items = ownedColorItems; index = scrollIndexColors; } let canScrollRight = (items && (index + ITEMS_PER_PAGE < items.length)); fill(150, 150, 180, (index > 0) ? 220 : 80); noStroke(); triangle(leftArrowButton.x + leftArrowButton.w, leftArrowButton.y, leftArrowButton.x + leftArrowButton.w, leftArrowButton.y + leftArrowButton.h, leftArrowButton.x, leftArrowButton.y + leftArrowButton.h / 2); fill(150, 150, 180, canScrollRight ? 220 : 80); noStroke(); triangle(rightArrowButton.x, rightArrowButton.y, rightArrowButton.x, rightArrowButton.y + rightArrowButton.h, rightArrowButton.x + rightArrowButton.w, rightArrowButton.y + rightArrowButton.h / 2); } catch (e) { console.error("Error drawing wardrobe arrows:", e); } }

// --- Helper to Draw Back Button ---
function drawWardrobeBackButton() { /* ... (no changes) ... */ if (!wardrobeBackButton || !backButtonColor || !textColor || !textStrokeColor) { console.error("Back button drawing dependencies missing!"); return; } try { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2); noStroke(); } catch (e) { console.error("Error drawing wardrobe back button:", e); } }

// --- Helper to Draw Mika and Bubble ---
function drawWardrobeMika() { /* ... (no changes needed here) ... */ if (!width || !height || typeof drawStaticKitty !== 'function' || !kittyColor || !heartColor || !wardrobeBackButton) { console.error("Dependencies missing for drawWardrobeMika!"); return; } try { let mikaSize = min(width, height) * 0.12; let bottomBuffer = 40; let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - bottomBuffer; if (mikaX - mikaSize / 2 < wardrobeBackButton.x + wardrobeBackButton.w + 10) { mikaX = wardrobeBackButton.x + wardrobeBackButton.w + 10 + mikaSize / 2; } drawStaticKitty(mikaX, mikaY, mikaSize); if (wardrobeMikaCommentaryTimer <= 0 && wardrobeMikaCommentary === "") { setWardrobeMikaCommentary("Hmm, what should I wear for Master today~?"); } if (wardrobeMikaCommentaryTimer > 0) { wardrobeMikaCommentaryTimer--; let bubbleW = width * 0.6; let bubbleH = height * 0.1; let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.8; bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5); fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10); triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP); text(wardrobeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); textAlign(CENTER, CENTER); } else { wardrobeMikaCommentary = ""; } } catch (e) { console.error("Error drawing wardrobe Mika:", e); } }


// --- Handle Wardrobe Input (Removes manual kittyColor update) ---
function handleWardrobeInput(px, py) {
    if (!wardrobeBackButton || !shelfTabs || !leftArrowButton || !rightArrowButton || !itemDisplayArea) { console.error("Wardrobe UI elements not ready!"); return false; }
    try {
        // 1. Back Button
        if (px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) { console.log("Wardrobe Back button!"); gameState = 'start'; return true; }

        // 2. Shelf Tabs
        for (const key in shelfTabs) { let tab = shelfTabs[key]; if (!tab) continue; if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) { if (currentShelf !== key) { if (key === 'colors') { console.log("Switch shelf: colors"); currentShelf = key; setWardrobeMikaCommentary("Ooh, colors! Which one makes me look cutest for Master?"); } else { console.log("Shelf WIP:", key); shakeTime = 8; setWardrobeMikaCommentary("Hmph! Master hasn't unlocked this shelf for me yet!"); } } return true; } }

        // 3. Arrow Buttons
        // Get items for current shelf to check scroll bounds
        let items = []; let indexRef = { index: 0 };
        if (currentShelf === 'colors') {
            // Quick re-filter for accurate count, uses isItemOwned now
            items = storeItems.filter(item => item.type === 'kitty_color' && isItemOwned(item.id));
            if (!items.some(item => item.id === 'default')) { let di=storeItems.find(i=>i.id==='default'); if(di) items.unshift(di); }
            indexRef.index = scrollIndexColors;
        } // Add else if for other shelves later

        // Left Arrow
        if (indexRef.index > 0 && px >= leftArrowButton.x && px <= leftArrowButton.x + leftArrowButton.w && py >= leftArrowButton.y && py <= leftArrowButton.y + leftArrowButton.h) { console.log("Scroll left:", currentShelf); indexRef.index = max(0, indexRef.index - ITEMS_PER_PAGE); if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; } setWardrobeMikaCommentary("Let's see the others again!"); return true; }
        // Right Arrow
        if ((items && indexRef.index + ITEMS_PER_PAGE < items.length) && px >= rightArrowButton.x && px <= rightArrowButton.x + rightArrowButton.w && py >= rightArrowButton.y && py <= rightArrowButton.y + rightArrowButton.h) { console.log("Scroll right:", currentShelf); indexRef.index += ITEMS_PER_PAGE; if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; } setWardrobeMikaCommentary("What else have you got for me, Master?!"); return true; }

        // 4. Item Clicks
        if (typeof items === 'undefined' || items.length === 0) { return false; } // No items to click
        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20; let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5); let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;
        for (let i = 0; i < ITEMS_PER_PAGE; i++) { let itemIndex = indexRef.index + i; if (itemIndex >= items.length) break; let item = items[itemIndex]; if (!item) continue; let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2); let itemDrawX = itemSlotCenterX - (itemSize / 2); let itemDrawY = displayStartY + itemDisplayArea.h*0.15;
            if (px >= itemDrawX && px <= itemDrawX + itemSize && py >= itemDrawY && py <= itemDrawY + itemSize + 40) {
                console.log("Clicked item:", item.name);
                 if (typeof equipItem !== 'function' || typeof getEquippedItem !== 'function') { console.error("Equip/Get functions missing!"); shakeTime = 8; setWardrobeMikaCommentary("Nya! Something's broken!"); return true; }

                if (item.type === 'kitty_color') {
                    let currentEquipped = getEquippedItem('kitty_color');
                    if ((currentEquipped === item.id) || (item.id === 'default' && currentEquipped === null)) {
                         console.log("Unequipping color -> default.");
                         equipItem('kitty_color', null); // equipItem now handles kittyColor update
                         setWardrobeMikaCommentary("Default pink is cute too... I guess. Hmph!");
                    } else {
                        console.log("Equipping color:", item.name);
                        equipItem('kitty_color', item.id); // equipItem now handles kittyColor update
                        setWardrobeMikaCommentary(`Yes! ${item.name} looks *purrfect* on me! Right, Master~? ♡`);
                    }
                } else { console.log("Cannot equip:", item.type); shakeTime = 8; setWardrobeMikaCommentary("That's... not really my style, Master."); }
                return true; // Click handled
            }
        }
    } catch (e) { console.error("Error during handleWardrobeInput:", e); setWardrobeMikaCommentary("Ouch! Broke something!"); return false; }
    return false; // Click wasn't handled
}

// --- Need functions from store.js & items.js ---
// isItemOwned(itemId), getEquippedItem(itemType), equipItem(itemType, itemId), getColorValueById(id)
// Needs access to `storeItems` array from items.js
// Needs access to sketch.js globals & p5 functions.