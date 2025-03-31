// ~~~ store.js ~~~ //
// Magic spells for the Plushie Store! Nya~! (Item list moved to items.js!)

// --- Item Master List (REMOVED - Defined in items.js now!) ---

// --- Store Data ---
let purchasedItems = {}; // Tracks items BOUGHT from store { 'itemId': true }
let collectedGachaItems = {}; // Tracks items WON from gacha { 'itemId': true } -> NEW!
let equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null };

// --- Helper to get COLOR VALUE by ID ---
// Uses the global storeItems list from items.js
function getColorValueById(id) {
    // Default pink value
    const defaultColorVal = [255, 105, 180];
    if (!id) { // Handle null/undefined id (unequipped/default)
        // Check if p5 'color' function is available before using it
        if (typeof color === 'function') {
            return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]);
        } else {
            console.error("p5 'color' function not available for default color!");
            return null; // Return null or a placeholder if color isn't ready
        }
    }

    // Ensure storeItems is loaded
    if (typeof storeItems === 'undefined') {
        console.error("storeItems list not loaded before getColorValueById!");
        // Fallback if color function is available
         if (typeof color === 'function') return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]);
         else return null;
    }

    // Find the item in the global list
    const item = storeItems.find(item => item.id === id);

    // Check if it's a color item with a defined colorValue array
    if (item && item.type === 'kitty_color' && Array.isArray(item.colorValue) && item.colorValue.length === 3) {
        // Check if p5 'color' function is available
        if (typeof color === 'function') {
             return color(item.colorValue[0], item.colorValue[1], item.colorValue[2]);
         } else {
             console.error(`p5 'color' function not available for item ${id}!`);
             return null;
         }
    }

    // Fallback to default pink if not found or invalid
    console.warn(`Color value not found or invalid for ID: ${id}. Defaulting.`);
    if (typeof color === 'function') return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]);
    else return null;
}


// --- Store UI Variables ---
let storeButtonHeight = 60; let storeButtonSpacing = 75;
let buyButtonWidth; let buyButtonHeight = 40;
let storeItemYStart; let storeBackButton;

// --- Calculate dynamic store layout elements ---
function setupStoreLayout(canvasW, canvasH) {
    // Basic safety checks for dimensions
    if (!canvasW || !canvasH) { console.warn("setupStoreLayout called with invalid dimensions."); return; }
    buyButtonWidth = canvasW * 0.25;
    storeItemYStart = canvasH * 0.20;
    storeBackButton = { x: 15, y: canvasH - 55, w: 100, h: 40 }; // Consistent position
    console.log("Store layout calculated!");
}

// --- Store Display Function ---
// Uses the global storeItems list from items.js
function displayStore(currentTotalPlushies) {
    // Essential safety checks for p5 objects and layout vars
    if (!width || !height || !storeBackButton || typeof purchasedItems === 'undefined' || typeof equippedItems === 'undefined' || !textColor || !textStrokeColor || !backButtonColor) {
         console.error("Store display dependencies missing!");
         // Draw error message?
         background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER); text("Store Error! Check console.", width/2, height/2);
         return;
     }
     // Ensure storeItems is loaded
     if (typeof storeItems === 'undefined') {
         console.error("storeItems list not loaded before displayStore!");
         background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER); text("Store Item Error! Check console.", width/2, height/2);
         return;
     }

    try { // Wrap drawing logic
        background(50, 50, 70, 220); // Store background
        fill(textColor); stroke(textStrokeColor); strokeWeight(3);
        textSize(min(width, height) * 0.08); textAlign(CENTER, CENTER);
        text("Plushie Store!", width / 2, height * 0.1);
        textSize(min(width, height) * 0.05); strokeWeight(2);
        text(`Total Plushies: ${currentTotalPlushies}`, width / 2, height * 0.18);
        noStroke();

        let itemY = storeItemYStart;
        storeItems.forEach((item) => {
            // Only display items marked as 'buyable' in the store
            if (!item.buyable) {
                return; // Skip non-buyable items
            }

            // --- Draw Item Box ---
            fill(100, 100, 120, 200); rectMode(CORNER);
            rect(width * 0.05, itemY, width * 0.9, storeButtonHeight, 5);

            // --- Draw Text ---
            fill(textColor); textAlign(LEFT, TOP); textSize(min(width, height) * 0.035);
            stroke(textStrokeColor); strokeWeight(1);
            text(`${item.name}`, width * 0.08, itemY + 8);
            textSize(min(width, height) * 0.025); noStroke();
            text(item.description, width * 0.08, itemY + 32);

            // --- Draw Button ---
            // Ensure buyButtonWidth is defined
            if (typeof buyButtonWidth === 'undefined') { console.error("buyButtonWidth not defined in displayStore!"); return; }
            let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
            let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;
            rectMode(CORNER); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER);

            let buttonText = ""; let buttonColor = color(150); let buttonTextColor = color(80);
            let isClickable = item.implemented;

            if (!item.implemented) { buttonText = "Soon!"; isClickable = false; }
            else if (purchasedItems[item.id]) { // If already purchased
                buttonColor = color(100, 150, 200); buttonTextColor = color(255);
                if (equippedItems[item.type] === item.id) { buttonText = "Unequip"; buttonColor = color(200, 100, 100); }
                else { buttonText = "Equip"; }
            } else { // Not purchased yet
                if (currentTotalPlushies >= item.cost) { buttonColor = color(100, 200, 100); buttonTextColor = color(0); }
                else { buttonColor = color(150); buttonTextColor = color(80); isClickable = false; } // Cannot afford
                buttonText = `Buy (${item.cost})`;
            }
            if (!isClickable) { buttonColor = color(120); buttonTextColor = color(70); } // Final override

            fill(buttonColor); rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
            fill(buttonTextColor); stroke(textStrokeColor); strokeWeight(1);
            text(buttonText, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2);

            itemY += storeButtonSpacing;
        });

        // --- Draw Back Button ---
        if (storeBackButton) { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2); }
        textAlign(CENTER, CENTER); noStroke();

    } catch(e) { console.error("Error displaying store:", e); /* Draw error message? */ }
}

// --- Store Input Handler ---
// Uses the global storeItems list from items.js
function handleStoreInput(px, py, currentTotalPlushies) {
    if (!audioStarted) return false;
     if (typeof storeItems === 'undefined') { console.error("storeItems missing for handleStoreInput!"); return false; }
     if (!storeBackButton || typeof buyButtonWidth === 'undefined') { console.error("Store UI missing for input!"); return false; }

    try { // Wrap input handling
        // Check Back Button
        if (px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w && py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h) { gameState = 'start'; console.log("Exiting Store"); return true; }

        let itemY = storeItemYStart; let itemHandled = false; let costToReturn = 0;

        for (let item of storeItems) {
            if (!item.buyable) { itemY += storeButtonSpacing; continue; } // Skip non-buyable, still increment Y

            let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
            let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;

            if (px >= buttonX && px <= buttonX + buyButtonWidth && py >= buttonTopY && py <= buttonTopY + buyButtonHeight) {
                itemHandled = true; // Click is on *a* button row
                if (!item.implemented) { console.log("Clicked WIP:", item.name); shakeTime = 8; break; }

                // Check dependencies for equip function
                 if (typeof equipItem !== 'function') { console.error("equipItem function is missing!"); break; }

                if (purchasedItems[item.id]) { // Owned -> Equip/Unequip
                    if (equippedItems[item.type] === item.id) { equipItem(item.type, null); console.log(`Unequipped ${item.name}`); }
                    else { equipItem(item.type, item.id); console.log(`Equipped ${item.name}`); }
                } else { // Not owned -> Try to Buy
                    if (currentTotalPlushies >= item.cost) {
                        console.log("Buying", item.name); purchasedItems[item.id] = true;
                        try { localStorage.setItem(item.id, 'true'); } catch (e) { console.warn("LS save purchase fail:", e); }
                        console.log("Purchased!", item.name); costToReturn = item.cost; // Set cost to return
                    } else { console.log("Not enough TP for", item.name); shakeTime = 10; }
                }
                break; // Exit loop once button is handled
            }
            itemY += storeButtonSpacing; // Increment Y for the next item row
        }
        return itemHandled ? costToReturn : false; // Return cost if purchase, 0 if handled otherwise, false if nothing hit

    } catch (e) { console.error("Error handling store input:", e); return false; }
}

// --- Load Purchases, Gacha Collection, and Equipped Items ---
// Uses the global storeItems list from items.js
function loadItems() {
    console.log("Loading items...");
    purchasedItems = {}; collectedGachaItems = {}; // Initialize
    equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null };

    if (typeof storeItems === 'undefined') { console.error("CRITICAL: storeItems missing during loadItems!"); return; }
    // Ensure helper functions are available
    if (typeof isItemOwned !== 'function' || typeof getColorValueById !== 'function') { console.error("CRITICAL: Helper functions missing during loadItems!"); return; }


    // Load saved purchase/collection status
    storeItems.forEach(item => {
        try {
            let isPurchased = localStorage.getItem(item.id) === 'true';
            let isCollected = localStorage.getItem(`gacha_${item.id}`) === 'true'; // Prefix gacha items
            if (isPurchased) { purchasedItems[item.id] = true; }
            if (isCollected) { collectedGachaItems[item.id] = true; }
        } catch (e) { console.warn(`LS load fail for ${item.id}:`, e); }
    });

    // Load equipped items status
    for (let type in equippedItems) {
        try {
            let equippedId = localStorage.getItem(`equipped_${type}`);
            if (equippedId && isItemOwned(equippedId)) { // Use helper
                equippedItems[type] = equippedId; console.log(`- Equipped ${type}: ${equippedId}`);
                 if (type === 'kitty_color') { kittyColor = getColorValueById(equippedId); console.log("Loaded color:", equippedId); } // Set initial color
            } else { // Default if not owned or not saved
                equippedItems[type] = null; localStorage.removeItem(`equipped_${type}`);
                 if (type === 'kitty_color') { kittyColor = getColorValueById(null); console.log("Default color loaded."); } // Default pink
            }
        } catch (e) {
             console.warn(`LS equip load fail ${type}:`, e); equippedItems[type] = null;
             if(type === 'kitty_color') { kittyColor = getColorValueById(null); } // Default pink on error
         }
    }
    // Final check for kittyColor if it somehow failed above
    if (typeof kittyColor === 'undefined' || kittyColor === null) {
         console.warn("kittyColor was undefined after load, setting default.");
         kittyColor = getColorValueById(null);
     }

    console.log("Item loading complete.");
}

// --- Helper to check if item is owned (either bought OR collected) ---
function isItemOwned(itemId) {
    if (itemId === 'default') return true;
    // Ensure collections are initialized
    if (typeof purchasedItems === 'undefined' || typeof collectedGachaItems === 'undefined') {
         console.warn("isItemOwned check failed: collections not ready.");
         return false;
     }
    return (purchasedItems[itemId] === true) || (collectedGachaItems[itemId] === true);
}

// --- Helper to check if item was bought from store ---
function isItemPurchased(itemId) {
     if (typeof purchasedItems === 'undefined') { return false; }
     return purchasedItems[itemId] === true;
}

// --- Helper to check if item was won from Gacha ---
function isItemCollected(itemId) {
     if (typeof collectedGachaItems === 'undefined') { return false; }
    return collectedGachaItems[itemId] === true;
}


// --- Helper to get equipped status ---
function getEquippedItem(itemType) {
    if (typeof equippedItems === 'undefined' || typeof equippedItems[itemType] === 'undefined') { console.warn(`equippedItems/type ${itemType} missing!`); return null; }
    return equippedItems[itemType];
}

// --- Helper to Equip/Unequip Items (Updates global kittyColor) ---
function equipItem(itemType, itemId) {
    if (!itemType || typeof equippedItems === 'undefined') { console.warn("Cannot equip: Invalid type/equippedItems missing."); return; }
    if (typeof getColorValueById !== 'function' || typeof kittyColor === 'undefined') { console.error("Cannot equip color: Helper function or global var missing!"); return; }

    equippedItems[itemType] = itemId; // null to unequip

    try { // Save to localStorage
        if (itemId) { localStorage.setItem(`equipped_${itemType}`, itemId); console.log(`Saved equipped ${itemType}: ${itemId}`); }
        else { localStorage.removeItem(`equipped_${itemType}`); console.log(`Saved unequipped ${itemType}`); }
    } catch (e) { console.warn(`LS save equipped ${itemType} fail:`, e); }

    // --- Update global kittyColor immediately ---
    if (itemType === 'kitty_color') {
         kittyColor = getColorValueById(itemId); // Get p5 color
         console.log("Equipped color changed, updated global kittyColor.");
    }
}