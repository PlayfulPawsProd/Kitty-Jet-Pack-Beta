// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! Trying REALLY hard to work! Nya~! ♡

// --- Wardrobe State ---
let currentShelf = 'colors'; // Start with the most important shelf!
let scrollIndexColors = 0;
let scrollIndexPlushies = 0; // For later
let scrollIndexUpgrades = 0; // For later
const ITEMS_PER_PAGE = 4; // How many items show at once?

// --- UI Elements ---
let wardrobeBackButton;
let shelfTabs = {}; // e.g., { colors: {x,y,w,h}, plushies: {...}, upgrades: {...} }
let itemDisplayArea; // Box where items are shown
let leftArrowButton, rightArrowButton;
let wardrobeTitleY, shelvesY;

// --- Mika Commentary ---
let wardrobeMikaCommentary = "";
let wardrobeMikaCommentaryTimer = 0;
const WARDROBE_MIKA_COMMENTARY_DURATION = 240; // 4 seconds

// --- Data (Needs to be populated/accessed from store.js) ---
let ownedColorItems = []; // Will be populated in drawShelfItems

// --- Calculate dynamic Wardrobe layout elements ---
function setupWardrobeLayout(canvasW, canvasH) {
    console.log("Calculating Wardrobe layout...");
    try {
        wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; // Same as Gacha back button Y
        wardrobeTitleY = canvasH * 0.07;
        shelvesY = canvasH * 0.15; // Y position for shelf tabs/labels

        let tabWidth = canvasW / 3.5; // Adjusted width slightly
        let tabSpacing = 10;
        let tabHeight = 40; // <<--- DEFINED HERE! MUST BE DEFINED!
        let totalTabWidth = (tabWidth * 3) + (tabSpacing * 2);
        let tabsStartX = canvasW / 2 - totalTabWidth / 2;

        shelfTabs.colors = { x: tabsStartX, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" };
        shelfTabs.plushies = { x: tabsStartX + tabWidth + tabSpacing, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" };
        shelfTabs.upgrades = { x: tabsStartX + (tabWidth + tabSpacing) * 2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" };

        // Define item display area (uses tabHeight)
        itemDisplayArea = {
            x: canvasW * 0.1,
            y: shelvesY + tabHeight + 20,
            w: canvasW * 0.8,
            h: canvasH * 0.5 // Adjust as needed
        };

        // Define arrow button positions
        let arrowSize = 40;
        leftArrowButton = { x: itemDisplayArea.x - arrowSize - 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize };
        rightArrowButton = { x: itemDisplayArea.x + itemDisplayArea.w + 15, y: itemDisplayArea.y + itemDisplayArea.h / 2 - arrowSize / 2, w: arrowSize, h: arrowSize };

        console.log("Wardrobe layout calculated!");
    } catch (e) {
        console.error("Error in setupWardrobeLayout:", e);
        // Fallback values maybe? Or just let it fail clearly.
         wardrobeBackButton = {x:0,y:0,w:1,h:1}; // Prevent errors if accessed later?
         shelfTabs = {}; itemDisplayArea={x:0,y:0,w:1,h:1}; leftArrowButton={x:0,y:0,w:1,h:1}; rightArrowButton={x:0,y:0,w:1,h:1};
    }
}

// --- Display Wardrobe Screen ---
function displayWardrobe() {
    // Essential safety check for p5 objects and layout vars
    if (!width || !height || !itemDisplayArea || !wardrobeBackButton || !textColor || !textStrokeColor || !backButtonColor || !heartColor) {
         console.error("Wardrobe display dependencies missing!");
         // Maybe draw a fallback error message on screen?
         background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER);
         text("Wardrobe Error! Check console.", width/2, height/2);
         return;
     }

    try { // Wrap drawing in try-catch
        // --- Background ---
        fill(60, 50, 70, 230); rectMode(CORNER); rect(0, 0, width, height);

        // --- Title ---
        fill(textColor); stroke(textStrokeColor); strokeWeight(3);
        textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER);
        text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY);

        // --- Draw Shelf Tabs/Labels ---
        textSize(min(width, height) * 0.03); strokeWeight(1.5);
        for (const key in shelfTabs) {
            let tab = shelfTabs[key];
             // Safety check for tab object
            if (!tab || typeof tab.x === 'undefined') continue;

            if (currentShelf === key) { fill(180, 150, 200); stroke(textColor); }
            else { fill(100, 80, 120); stroke(180); }
            rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0);

            fill(currentShelf === key ? textColor : 200); noStroke();
            textAlign(CENTER, CENTER);
            text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
        }

        // --- Draw Items Area ---
        noStroke(); fill(40, 30, 50, 180);
        rect(itemDisplayArea.x, itemDisplayArea.y, itemDisplayArea.w, itemDisplayArea.h, 5);
        drawShelfItems(); // Call helper to draw items

        // --- Draw Arrows ---
        drawWardrobeArrows();

        // --- Draw Back Button ---
        drawWardrobeBackButton();

        // --- Draw Mika & Commentary ---
        drawWardrobeMika();

        textAlign(CENTER, CENTER); noStroke(); // Reset

    } catch (e) {
        console.error("Error during displayWardrobe drawing:", e);
        // Draw fallback error message if drawing fails mid-way
        fill(255,0,0); textSize(18); textAlign(CENTER,CENTER);
        text(`Wardrobe Draw Error! ${e.message}`, width/2, height/2 + 30);
    }
}

// --- Helper to Set Mika's Commentary ---
function setWardrobeMikaCommentary(text) {
    wardrobeMikaCommentary = text;
    wardrobeMikaCommentaryTimer = WARDROBE_MIKA_COMMENTARY_DURATION;
}

// --- Helper to Draw Shelf Items ---
function drawShelfItems() {
    // Safety checks for dependencies
    if (!itemDisplayArea || typeof isItemPurchased !== 'function' || typeof getEquippedItem !== 'function' || !storeItems || !textColor || !heartColor) {
        console.error("Dependencies missing for drawShelfItems!");
         textSize(min(width, height)*0.04); fill(255,0,0); textAlign(CENTER, CENTER);
         text("Item Drawing Error!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
        return;
    }

    try { // Wrap item drawing
        let itemsToShow = []; let scrollIndex = 0; let itemType = '';

        if (currentShelf === 'colors') {
            // Ensure functions/data from store.js are available
             if (typeof isItemPurchased !== 'function' || typeof storeItems === 'undefined') {
                 throw new Error("Store functions/data not available for colors shelf!");
             }
            ownedColorItems = storeItems.filter(item => item.type === 'kitty_color' && (isItemPurchased(item.id)));
            if (!ownedColorItems.some(item => item.id === 'default')) {
                ownedColorItems.unshift({ id: 'default', name: 'Default Pink', type: 'kitty_color', implemented: true });
            }
            itemsToShow = ownedColorItems; scrollIndex = scrollIndexColors; itemType = 'kitty_color';
        } else if (currentShelf === 'plushies') {
            textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
            text("Plushie shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
        } else if (currentShelf === 'upgrades') {
            textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
            text("Upgrade shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
        }

        if (!itemsToShow || itemsToShow.length === 0) {
            textSize(min(width, height)*0.04); fill(150); textAlign(CENTER, CENTER);
            text("Nothing here yet, Master! Go get me stuff!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2); return;
        }

        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20;
        let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5);
        let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;
        let nameYOffset = 20;

        let equippedItemId = null;
        equippedItemId = getEquippedItem(itemType); // Assumes getEquippedItem exists
        if (itemType === 'kitty_color' && equippedItemId === null) { equippedItemId = 'default'; }

        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            let itemIndex = scrollIndex + i;
            if (itemIndex >= itemsToShow.length) break;

            let item = itemsToShow[itemIndex];
             if (!item || !item.id || !item.name) continue; // Skip invalid item data

            let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2);
            let itemDrawX = itemSlotCenterX - (itemSize / 2);
            let itemDrawY = displayStartY + itemDisplayArea.h * 0.15;

            // Draw Item Placeholder
            if (item.type === 'kitty_color') {
                let c;
                // --- Color Mapping (Ensure p5 'color' function is available) ---
                 if (typeof color !== 'function') throw new Error("p5 color function not available!");
                if(item.id === 'default') c = color(255, 105, 180);
                else if (item.id === 'kitty_color_black') c = color(50);
                else if (item.id === 'kitty_color_orange') c = color(255, 165, 0);
                else c = color(128); // Fallback
                // --- End Color Mapping ---
                fill(c); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5);
            } else { /* ... placeholder drawing ... */ fill(100); stroke(50); strokeWeight(2); rect(itemDrawX, itemDrawY, itemSize, itemSize, 5); fill(200); noStroke(); textSize(itemSize * 0.5); textAlign(CENTER, CENTER); text("?", itemDrawX + itemSize/2, itemDrawY + itemSize/2); }

            // Draw Item Name
            fill(textColor); noStroke(); textSize(min(width, height) * 0.022); textAlign(CENTER, TOP);
            text(item.name, itemSlotCenterX, itemDrawY + itemSize + nameYOffset);

            // Indicate if Equipped
            if (equippedItemId === item.id) {
                fill(heartColor); textSize(itemSize * 0.3); textAlign(CENTER, CENTER); text("♥", itemSlotCenterX, itemDrawY - 10);
            }
        }
        textAlign(CENTER, CENTER); // Reset alignment

    } catch (e) {
         console.error("Error during drawShelfItems:", e);
         fill(255,0,0); textSize(16); textAlign(CENTER,CENTER);
         text(`Item Draw Error! ${e.message}`, itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2 + 20);
     }
}

// --- Helper to Draw Arrows ---
function drawWardrobeArrows() {
    // Safety check
    if (!leftArrowButton || !rightArrowButton) { console.error("Arrow buttons not defined!"); return; }

    try {
        let items = []; let index = 0;
        if (currentShelf === 'colors') { items = ownedColorItems; index = scrollIndexColors; }
        // Add other shelves later

        // Left Arrow
        fill(150, 150, 180, (index > 0) ? 220 : 80); noStroke();
        triangle(leftArrowButton.x + leftArrowButton.w, leftArrowButton.y, leftArrowButton.x + leftArrowButton.w, leftArrowButton.y + leftArrowButton.h, leftArrowButton.x, leftArrowButton.y + leftArrowButton.h / 2);

        // Right Arrow
        let canScrollRight = (items && (index + ITEMS_PER_PAGE < items.length)); // Check if items is defined
        fill(150, 150, 180, canScrollRight ? 220 : 80); noStroke();
        triangle(rightArrowButton.x, rightArrowButton.y, rightArrowButton.x, rightArrowButton.y + rightArrowButton.h, rightArrowButton.x + rightArrowButton.w, rightArrowButton.y + rightArrowButton.h / 2);
    } catch (e) {
        console.error("Error drawing wardrobe arrows:", e);
    }
}


// --- Helper to Draw Back Button ---
function drawWardrobeBackButton() {
    if (!wardrobeBackButton || !backButtonColor || !textColor || !textStrokeColor) { console.error("Back button drawing dependencies missing!"); return; }
     try {
         fill(backButtonColor); rectMode(CORNER); noStroke();
         rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5);
         fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER);
         stroke(textStrokeColor); strokeWeight(1.5);
         text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2);
         noStroke();
     } catch (e) {
         console.error("Error drawing wardrobe back button:", e);
     }
 }

// --- Helper to Draw Mika and Bubble ---
function drawWardrobeMika() {
    // Safety checks
    if (!width || !height || !wardrobeBackButton || typeof drawStaticKitty !== 'function' || !kittyColor || !heartColor) {
        console.error("Dependencies missing for drawWardrobeMika!"); return;
    }
     try {
        let mikaSize = min(width, height) * 0.08;
        let mikaX = width / 2; let mikaY = height - (mikaSize / 2) - 20;
        drawStaticKitty(mikaX, mikaY, mikaSize); // Call sketch.js function

        if (wardrobeMikaCommentaryTimer > 0) {
            wardrobeMikaCommentaryTimer--;
            let bubbleW = width * 0.6; let bubbleH = height * 0.1;
            let bubbleX = mikaX - bubbleW / 2; let bubbleY = mikaY - bubbleH - mikaSize * 0.4;
            bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5);
            fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
            triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.3);
            fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP);
            text(wardrobeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30);
            textAlign(CENTER, CENTER);
        }
    } catch (e) {
        console.error("Error drawing wardrobe Mika:", e);
    }
}


// --- Handle Wardrobe Input ---
function handleWardrobeInput(px, py) {
    // Safety checks for UI elements
     if (!wardrobeBackButton || !shelfTabs || !leftArrowButton || !rightArrowButton || !itemDisplayArea) {
         console.error("Wardrobe UI elements not ready for input handling!");
         return false;
     }

    try { // Wrap input handling
        // 1. Check Back Button
        if (px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w && py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) {
            console.log("Wardrobe Back button pressed!"); gameState = 'start'; return true;
        }

        // 2. Check Shelf Tabs
        for (const key in shelfTabs) {
             let tab = shelfTabs[key];
             if (!tab) continue; // Safety check
             if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) {
                 if (currentShelf !== key) {
                     if (key === 'colors') { console.log("Switch shelf: colors"); currentShelf = key; setWardrobeMikaCommentary("Let's look at my colors!"); }
                     // Add other shelves when ready
                     // else if (key === 'plushies') { console.log("Switch shelf: plushies"); currentShelf = key; setWardrobeMikaCommentary("Plushie time!"); }
                     // else if (key === 'upgrades') { console.log("Switch shelf: upgrades"); currentShelf = key; setWardrobeMikaCommentary("Power me up!"); }
                     else { console.log("Shelf WIP:", key); shakeTime = 8; setWardrobeMikaCommentary("Hmph! Nothing there yet!"); }
                 }
                 return true;
             }
         }

        // 3. Check Arrow Buttons
        // Ensure dependencies for scrolling are ready
        if (typeof ownedColorItems === 'undefined') { console.warn("ownedColorItems not ready for arrow input."); return false; }
        let items = []; let indexRef = { index: 0 };
        if (currentShelf === 'colors') { items = ownedColorItems; indexRef.index = scrollIndexColors; }
        // Add other shelves later

        // Left Arrow
        if (indexRef.index > 0 && px >= leftArrowButton.x && px <= leftArrowButton.x + leftArrowButton.w && py >= leftArrowButton.y && py <= leftArrowButton.y + leftArrowButton.h) {
            console.log("Scroll left:", currentShelf); indexRef.index = max(0, indexRef.index - ITEMS_PER_PAGE);
            if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
            setWardrobeMikaCommentary("Oooh, what else is there?"); return true;
        }
        // Right Arrow
        if ((items && indexRef.index + ITEMS_PER_PAGE < items.length) && px >= rightArrowButton.x && px <= rightArrowButton.x + rightArrowButton.w && py >= rightArrowButton.y && py <= rightArrowButton.y + rightArrowButton.h) {
            console.log("Scroll right:", currentShelf); indexRef.index += ITEMS_PER_PAGE;
            if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
            setWardrobeMikaCommentary("More shinies this way!"); return true;
        }

        // 4. Check Item Clicks
        if (typeof items === 'undefined') { console.warn("items not ready for click input."); return false; } // Ensure items array exists
        let displayStartX = itemDisplayArea.x + 20; let displayStartY = itemDisplayArea.y + 20;
        let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1.5), itemDisplayArea.h * 0.5);
        let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;

        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            let itemIndex = indexRef.index + i; if (itemIndex >= items.length) break;
            let item = items[itemIndex]; if (!item) continue; // Safety check
            let itemSlotCenterX = displayStartX + i * itemSpacing + (itemSpacing / 2);
            let itemDrawX = itemSlotCenterX - (itemSize / 2); let itemDrawY = displayStartY + itemDisplayArea.h*0.15;
            // Check if click is within item bounds + name area below it
            if (px >= itemDrawX && px <= itemDrawX + itemSize && py >= itemDrawY && py <= itemDrawY + itemSize + 40) {
                console.log("Clicked item:", item.name);
                // Check if equip/get functions exist BEFORE trying to use them
                 if (typeof equipItem !== 'function' || typeof getEquippedItem !== 'function' || typeof color !== 'function') {
                     console.error("Equip/Get functions or color function missing!"); shakeTime = 8; setWardrobeMikaCommentary("Something's broken..."); return true;
                 }
                // Equip/Unequip Logic
                if (item.type === 'kitty_color') {
                    let currentEquipped = getEquippedItem('kitty_color');
                    if ((currentEquipped === item.id) || (item.id === 'default' && currentEquipped === null)) {
                         console.log("Unequipping color -> default pink."); equipItem('kitty_color', null); setWardrobeMikaCommentary("Back to classic pink! Always cute~");
                         kittyColor = color(255, 105, 180); // Update global color
                    } else {
                        console.log("Equipping color:", item.name); equipItem('kitty_color', item.id); setWardrobeMikaCommentary(`Hehe! How do I look in ${item.name}? ♡`);
                         // --- Update global kittyColor ---
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

    } catch (e) {
        console.error("Error during handleWardrobeInput:", e);
        setWardrobeMikaCommentary("Ouch! Something went wrong!"); // Show error via commentary
        return false; // Indicate error
    }

    return false; // Click wasn't handled
}

// --- Need functions from store.js ---
// Ensure these are globally available when wardrobe.js runs:
// function isItemPurchased(itemId) { return purchasedItems[itemId] === true; } // Example
// function getEquippedItem(itemType) { return equippedItems[itemType]; } // Example
// function equipItem(itemType, itemId) { /* ... updates equippedItems & localStorage ... */ } // Example
// Needs access to `storeItems` array.
// Needs access to global p5 `color` function and sketch.js globals like `gameState`, `kittyColor`, `shakeTime`, `backButtonColor` etc.