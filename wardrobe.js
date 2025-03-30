// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! Now with ME and better text! Nya~! ♡

// --- Wardrobe State ---
let currentShelf = 'colors';
let scrollIndexColors = 0;
let scrollIndexPlushies = 0;
let scrollIndexUpgrades = 0;
const ITEMS_PER_PAGE = 4;

// --- UI Elements ---
let wardrobeBackButton;
let shelfTabs = {};
let itemDisplayArea;
let leftArrowButton, rightArrowButton;
let wardrobeTitleY, shelvesY;

// --- Mika Commentary --- (Added!) ---
let wardrobeMikaCommentary = "";
let wardrobeMikaCommentaryTimer = 0;
const WARDROBE_MIKA_COMMENTARY_DURATION = 240; // 4 seconds

// --- Data ---
let ownedColorItems = [];

// --- Calculate dynamic Wardrobe layout elements ---
function setupWardrobeLayout(canvasW, canvasH) {
    console.log("Calculating Wardrobe layout...");
    wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 };
    wardrobeTitleY = canvasH * 0.07;
    shelvesY = canvasH * 0.15;

    let tabWidth = canvasW / 3.5; // Adjusted width slightly for potentially longer labels
    let tabSpacing = 10;
    let tabHeight = 40;
    let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2);
    let tabsStartX = canvasW/2 - totalTabWidth/2;

    shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" };
    shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" };
    shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" };

    itemDisplayArea = { x: canvasW * 0.1, y: shelvesY + tabHeight + 20, w: canvasW * 0.8, h: canvasH * 0.5 };

    let arrowSize = 40;
    leftArrowButton = { x: itemDisplayArea.x - arrowSize - 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize };
    rightArrowButton = { x: itemDisplayArea.x + itemDisplayArea.w + 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize };

    console.log("Wardrobe layout calculated!");
}

// --- Display Wardrobe Screen ---
function displayWardrobe() {
    if (!width || !height) return;

    // --- Background ---
    fill(60, 50, 70, 230); rectMode(CORNER); rect(0, 0, width, height);

    // --- Title ---
    fill(textColor); stroke(textStrokeColor); strokeWeight(3);
    textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER);
    text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY);

    // --- Draw Shelf Tabs/Labels (Smaller Text) ---
    textSize(min(width, height) * 0.03); // <-- SMALLER TEXT SIZE for tabs
    strokeWeight(1.5);
    for (const key in shelfTabs) {
        let tab = shelfTabs[key];
        if (currentShelf === key) { fill(180, 150, 200); stroke(textColor); }
        else { fill(100, 80, 120); stroke(180); }
        rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0);

        fill(currentShelf === key ? textColor : 200); noStroke();
        textAlign(CENTER, CENTER); // Ensure centered text in tabs
        text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
    }

    // --- Draw Items Area ---
    noStroke(); fill(40, 30, 50, 180);
    rect(itemDisplayArea.x, itemDisplayArea.y, itemDisplayArea.w, itemDisplayArea.h, 5);
    drawShelfItems();

    // --- Draw Arrows ---
    drawWardrobeArrows();

    // --- Draw Back Button ---
    drawWardrobeBackButton();

    // --- Draw Mika & Commentary --- (Added!) ---
    drawWardrobeMika(); // Helper function for Mika + Bubble

    textAlign(CENTER, CENTER); noStroke(); // Reset
}

// --- Helper to Set Mika's Commentary --- (Added!) ---
function setWardrobeMikaCommentary(text) {
    wardrobeMikaCommentary = text;
    wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION;
}

// --- Helper to Draw Shelf Items (Smaller Text) ---
function drawShelfItems() {
    let itemsToShow = []; let scrollIndex = 0; let itemType = '';

    if (currentShelf === 'colors') {
        // Get owned colors (including default)
        ownedColorItems = storeItems.filter(item => item.type === 'kitty_color' && (isItemPurchased(item.id))); // Check purchase status
        if (!ownedColorItems.some(item => item.id === 'default')) {
             ownedColorItems.unshift({ id: 'default', name: 'Default Pink', type: 'kitty_color', implemented: true});
        }
        itemsToShow = ownedColorItems; scrollIndex = scrollIndexColors; itemType = 'kitty_color';
    } else if (currentShelf === 'plushies') {
        // Placeholder text
        textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
        text("Plushie shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
    } else if (currentShelf === 'upgrades') {
        // Placeholder text
         textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
        text("Upgrade shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
    }

    if (!itemsToShow || itemsToShow.length === 0) {
         textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
        text("Nothing here yet, Master! Go get me stuff!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
    }

    let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20;
    let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5); // Adjusted size calculation slightly
    let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;
    let nameYOffset = 20; // Space between item and name

    let equippedItemId = null;
    if (typeof getEquippedItem === 'function') {
        equippedItemId = getEquippedItem(itemType);
        if (itemType === 'kitty_color' && equippedItemId === null) { equippedItemId = 'default'; }
    }

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        let itemIndex = scrollIndex + i;
        if (itemIndex >= itemsToShow.length) break;

        let item = itemsToShow[itemIndex];
        let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2);
        let itemDrawX = itemSlotCenterX - (itemSize / 2);
        let itemDrawY = displayStartY + itemDisplayArea.h * 0.15; // Adjusted Y for item preview

        // Draw Item Placeholder
        if (item.type === 'kitty_color') {
            let c;
            // --- Get Color Value (Needs mapping logic) ---
            // This mapping should ideally live elsewhere or be more robust
            if(item.id === 'default') c = color(255, 105, 180);
            else if (item.id === 'kitty_color_black') c = color(50);
            else if (item.id === 'kitty_color_orange') c = color(255, 165, 0);
            else c = color(128); // Fallback
            // --- End Color Value ---

            fill(c); stroke(50); strokeWeight(2);
            rect(itemDrawX, itemDrawY, itemSize, itemSize, 5);
        } else {
            // Placeholder for other types
            fill(100); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5);
            fill(200); noStroke(); textSize(itemSize * 0.5); textAlign(CENTER, CENTER);
            text("?", itemDrawX + itemSize/2, itemDrawY + itemSize/2);
        }

        // Draw Item Name (Smaller Text)
        fill(textColor); noStroke();
        textSize(min(width, height) * 0.022); // <-- SMALLER TEXT SIZE for names
        textAlign(CENTER, TOP); // Center name below item
        text(item.name, itemSlotCenterX, itemDrawY + itemSize + nameYOffset);

        // Indicate if Equipped
        if (equippedItemId === item.id) {
            fill(heartColor); textSize(itemSize * 0.3); textAlign(CENTER, CENTER);
            text("♥", itemSlotCenterX, itemDrawY - 10); // Heart above item
        }
    }
    textAlign(CENTER, CENTER); // Reset alignment
}

// --- Helper to Draw Arrows ---
function drawWardrobeArrows() { /* ... (logic same, check variables) ... */
    let items = []; let index = 0;
    if (currentShelf === 'colors') { items = ownedColorItems; index = scrollIndexColors; }
    // else if (currentShelf === 'plushies') { items = ownedPlushieItems; index = scrollIndexPlushies; } // Later
    // else if (currentShelf === 'upgrades') { items = ownedUpgradeItems; index = scrollIndexUpgrades; } // Later

    // Left Arrow
    fill(150, 150, 180, (index > 0) ? 220 : 80); noStroke();
    triangle(leftArrowButton.x + leftArrowButton.w, leftArrowButton.y, leftArrowButton.x + leftArrowButton.w, leftArrowButton.y + leftArrowButton.h, leftArrowButton.x, leftArrowButton.y + leftArrowButton.h / 2);

    // Right Arrow
    let canScrollRight = (index + ITEMS_PER_PAGE < items.length);
    fill(150, 150, 180, canScrollRight ? 220 : 80); noStroke();
    triangle(rightArrowButton.x, rightArrowButton.y, rightArrowButton.x, rightArrowButton.y + rightArrowButton.h, rightArrowButton.x + rightArrowButton.w, rightArrowButton.y + rightArrowButton.h / 2);
}


// --- Helper to Draw Back Button ---
function drawWardrobeBackButton() { /* ... (no changes) ... */ if (!wardrobeBackButton) return; fill(backButtonColor); rectMode(CORNER); noStroke(); rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2); noStroke(); }

// --- Helper to Draw Mika and Bubble --- (Added!) ---
function drawWardrobeMika() {
    // Gameplay size
    let mikaSize = min(width, height) * 0.08;
    // Position: Bottom Center (should be clear of back button now)
    let mikaX = width / 2;
    let mikaY = height - (mikaSize / 2) - 20; // 20px buffer from bottom

    // Use the drawing function from sketch.js!
    if (typeof drawStaticKitty === 'function') {
         drawStaticKitty(mikaX, mikaY, mikaSize);
    } else {
        // Fallback placeholder
        fill(kittyColor); noStroke(); rectMode(CENTER); rect(mikaX, mikaY, mikaSize * 0.6, mikaSize * 0.6); rectMode(CORNER);
        console.warn("drawStaticKitty function not found!");
    }

    // Draw commentary bubble if active
    if (wardrobeMikaCommentaryTimer > 0) {
        wardrobeMikaCommentaryTimer--;
        let bubbleW = width * 0.6; let bubbleH = height * 0.1;
        let bubbleX = mikaX - bubbleW / 2; // Center bubble horizontally relative to Mika
        let bubbleY = mikaY - bubbleH - mikaSize * 0.4; // Position bubble above Mika

        bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5);

        fill(240, 240, 240, 220); stroke(50); strokeWeight(1);
        rect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
        triangle( // Tail pointing down to Mika
            bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, // Left point of base
            bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, // Right point of base
            mikaX, mikaY - mikaSize * 0.3 // Point towards top of Mika's head
        );

        fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP);
        text(wardrobeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); // Wrap text
        textAlign(CENTER, CENTER);
    }
     else {
        // Maybe show a default thought bubble?
        // setWardrobeMikaCommentary("So many pretty things for me~♡"); // Example default message
     }
}


// --- Handle Wardrobe Input --- (Added Commentary calls) ---
function handleWardrobeInput(px, py) {

    // 1. Check Back Button
    if (wardrobeBackButton && px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) {
        console.log("Wardrobe Back button pressed!"); gameState = 'start'; return true;
    }

    // 2. Check Shelf Tabs
    for (const key in shelfTabs) { /* ... (logic same) ... */
        let tab = shelfTabs[key];
        if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) {
            if (currentShelf !== key) {
                 if (key === 'colors') { // Only allow switching to implemented shelves
                    console.log("Switched shelf to:", key); currentShelf = key;
                    setWardrobeMikaCommentary("Let's look at my colors!"); // Set commentary
                 } else {
                     console.log("Shelf not implemented yet:", key); shakeTime = 8;
                     setWardrobeMikaCommentary("Hmph! Nothing there yet!"); // Set commentary
                 }
            }
            return true;
        }
     }


    // 3. Check Arrow Buttons
    let items = []; let indexRef = { index: 0 };
    if (currentShelf === 'colors') { items = ownedColorItems; indexRef.index = scrollIndexColors; }
    // Add other shelves later

    // Left Arrow
    if (indexRef.index > 0 && px >= leftArrowButton.x && px <= leftArrowButton.x + leftArrowButton.w && py >= leftArrowButton.y && py <= leftArrowButton.y + leftArrowButton.h) {
        console.log("Scroll left on shelf:", currentShelf); indexRef.index = max(0, indexRef.index - ITEMS_PER_PAGE);
        if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
        setWardrobeMikaCommentary("Oooh, what else is there?"); // Set commentary
        return true;
    }
    // Right Arrow
    if ((indexRef.index + ITEMS_PER_PAGE < items.length) && px >= rightArrowButton.x && px <= rightArrowButton.x + rightArrowButton.w && py >= rightArrowButton.y && py <= rightArrowButton.y + rightArrowButton.h) {
        console.log("Scroll right on shelf:", currentShelf); indexRef.index += ITEMS_PER_PAGE;
        if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
        setWardrobeMikaCommentary("More shinies this way!"); // Set commentary
        return true;
    }

    // 4. Check Item Clicks
    let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20;
    let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5);
    let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        let itemIndex = indexRef.index + i; if (itemIndex >= items.length) break;
        let item = items[itemIndex];
        let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2);
        let itemDrawX = itemSlotCenterX - (itemSize / 2);
        let itemDrawY = displayStartY + itemDisplayArea.h * 0.15;

        if (px >= itemDrawX && px <= itemDrawX + itemSize && py >= itemDrawY && py <= itemDrawY + itemSize + 40) { // Increased click area height to include name
            console.log("Clicked item:", item.name);
            // Equip/Unequip Logic
            if (item.type === 'kitty_color' && typeof equipItem === 'function') {
                let currentEquipped = getEquippedItem('kitty_color');
                if ((currentEquipped === item.id) || (item.id === 'default' && currentEquipped === null)) {
                     console.log("Unequipping color -> default pink."); equipItem('kitty_color', null);
                     setWardrobeMikaCommentary("Back to classic pink! Always cute~"); // Set commentary
                     kittyColor = color(255, 105, 180); // Update global color immediately
                } else {
                    console.log("Equipping color:", item.name); equipItem('kitty_color', item.id);
                    setWardrobeMikaCommentary(`Hehe! How do I look in ${item.name}? ♡`); // Set commentary
                     // --- Update global kittyColor (Needs mapping) ---
                     if(item.id === 'default') kittyColor = color(255, 105, 180);
                     else if (item.id === 'kitty_color_black') kittyColor = color(50);
                     else if (item.id === 'kitty_color_orange') kittyColor = color(255, 165, 0);
                     else kittyColor = color(255, 105, 180); // Fallback
                     // --- End Update ---
                }
            } else { console.log("Cannot equip:", item.type); shakeTime = 8; setWardrobeMikaCommentary("Can't wear that!"); }
            return true;
        }
    }
    return false; // Click wasn't handled
}

// --- Need functions from store.js ---
// Assume these exist:
// function isItemPurchased(itemId) { /* ... */ }
// function getEquippedItem(itemType) { /* ... */ }
// function equipItem(itemType, itemId) { /* ... updates equippedItems & localStorage ... */ }
// Assume storeItems is accessible or passed somehow