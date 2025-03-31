// ~~~ store.js ~~~ //
// Store fixed and Mika added! Ready to judge your spending! Nya~! ♡

// --- Store Data ---
let purchasedItems = {}; // Tracks items BOUGHT from store { 'itemId': true }
let collectedGachaItems = {}; // Tracks items WON from gacha { 'itemId': true }
let equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null };

// --- Mika Commentary (Store Specific) --- (NEW!) ---
let storeMikaCommentary = "";
let storeMikaCommentaryTimer = 0;
const STORE_MIKA_COMMENTARY_DURATION = 240; // 4 seconds

// --- Helper to get COLOR VALUE by ID ---
function getColorValueById(id) { /* ... (No changes needed here) ... */ const defaultColorVal = [255, 105, 180]; if (!id) { if (typeof color === 'function') { return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]); } else { console.error("p5 'color' function not ready for default!"); return null; } } if (typeof storeItems === 'undefined') { console.error("storeItems list not loaded!"); if (typeof color === 'function') return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]); else return null; } const item = storeItems.find(item => item.id === id); if (item && item.type === 'kitty_color' && Array.isArray(item.colorValue) && item.colorValue.length === 3) { if (typeof color === 'function') { return color(item.colorValue[0], item.colorValue[1], item.colorValue[2]); } else { console.error(`p5 'color' function not ready for item ${id}!`); return null; } } console.warn(`Color value missing/invalid for ${id}. Defaulting.`); if (typeof color === 'function') return color(defaultColorVal[0], defaultColorVal[1], defaultColorVal[2]); else return null; }


// --- Store UI Variables ---
let storeButtonHeight = 60; let storeButtonSpacing = 75;
let buyButtonWidth; let buyButtonHeight = 40;
let storeItemYStart; let storeBackButton;

// --- Calculate dynamic store layout elements ---
function setupStoreLayout(canvasW, canvasH) { /* ... (No changes needed) ... */ if (!canvasW || !canvasH) { console.warn("setupStoreLayout invalid dimensions."); return; } buyButtonWidth = canvasW * 0.25; storeItemYStart = canvasH * 0.20; storeBackButton = { x: 15, y: canvasH - 55, w: 100, h: 40 }; console.log("Store layout calculated!"); }

// --- Helper to Set Store Mika's Commentary --- (NEW!) ---
function setStoreMikaCommentary(text) {
    storeMikaCommentary = text;
    storeMikaCommentaryTimer = STORE_MIKA_COMMENTARY_DURATION;
}

// --- Helper to Draw Store Mika + Bubble --- (NEW!) ---
function drawStoreMika() {
    if (!width || !height || typeof drawStaticKitty !== 'function' || !kittyColor || !storeBackButton) {
        console.error("Dependencies missing for drawStoreMika!"); return;
    }
     try {
        let mikaSize = min(width, height) * 0.12; // Requested size
        let bottomBuffer = 40;
        let mikaX = width / 2; // Center horizontally
        let mikaY = height - (mikaSize / 2) - bottomBuffer; // Positioned higher from bottom

        // Prevent horizontal overlap with back button
        if (mikaX - mikaSize / 2 < storeBackButton.x + storeBackButton.w + 10) {
             mikaX = storeBackButton.x + storeBackButton.w + 10 + mikaSize / 2;
        }

        drawStaticKitty(mikaX, mikaY, mikaSize); // Draw me using sketch.js helper!

        // Default commentary if timer is up
        if (storeMikaCommentaryTimer <= 0 && storeMikaCommentary === "") {
            setStoreMikaCommentary("Hmm, what treasures will you buy *for me*, Master~?");
        }

        // Draw commentary bubble if active
        if (storeMikaCommentaryTimer > 0) {
            storeMikaCommentaryTimer--;
            let bubbleW = width * 0.6; let bubbleH = height * 0.1;
            let bubbleX = mikaX - bubbleW / 2;
            let bubbleY = mikaY - bubbleH - mikaSize * 0.8; // Position bubble above Mika

            bubbleX = constrain(bubbleX, 5, width - bubbleW - 5); bubbleY = constrain(bubbleY, 5, height - bubbleH - 5);

            fill(240, 240, 240, 220); stroke(50); strokeWeight(1); rect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
            triangle(bubbleX + bubbleW / 2 - 10, bubbleY + bubbleH, bubbleX + bubbleW / 2 + 10, bubbleY + bubbleH, mikaX, mikaY - mikaSize * 0.35); // Tail
            fill(50); noStroke(); textSize(min(width, height) * 0.03); textAlign(LEFT, TOP);
            text(storeMikaCommentary, bubbleX + 15, bubbleY + 10, bubbleW - 30); // Wrap text
            textAlign(CENTER, CENTER);
        } else { storeMikaCommentary = ""; } // Clear when done

    } catch (e) { console.error("Error drawing store Mika:", e); }
}


// --- Store Display Function (Calls Mika Drawing) ---
function displayStore(currentTotalPlushies) {
    if (!width || !height || !storeBackButton || typeof purchasedItems === 'undefined' || typeof equippedItems === 'undefined' || !textColor || !textStrokeColor || !backButtonColor) { console.error("Store display dependencies missing!"); background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER); text("Store Error! Check console.", width/2, height/2); return; }
    if (typeof storeItems === 'undefined') { console.error("storeItems missing for displayStore!"); background(0); fill(255,0,0); textSize(20); textAlign(CENTER,CENTER); text("Store Item Error!", width/2, height/2); return; }

    try {
        background(50, 50, 70, 220); // Background
        fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.08); textAlign(CENTER, CENTER); text("Plushie Store!", width / 2, height * 0.1); // Title
        textSize(min(width, height) * 0.05); strokeWeight(2); text(`Total Plushies: ${currentTotalPlushies}`, width / 2, height * 0.18); noStroke(); // Count

        let itemY = storeItemYStart;
        storeItems.forEach((item) => {
            if (!item.buyable) { return; } // Only draw buyable items

            // Draw Item Box & Text
            fill(100, 100, 120, 200); rectMode(CORNER); rect(width*0.05, itemY, width*0.9, storeButtonHeight, 5);
            fill(textColor); textAlign(LEFT, TOP); textSize(min(width, height)*0.035); stroke(textStrokeColor); strokeWeight(1); text(`${item.name}`, width*0.08, itemY+8);
            textSize(min(width, height)*0.025); noStroke(); text(item.description, width*0.08, itemY+32);

            // Draw Button (Logic for state)
            if (typeof buyButtonWidth === 'undefined') { console.error("buyButtonWidth undefined!"); return; }
            let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03); let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;
            rectMode(CORNER); noStroke(); textSize(min(width, height)*0.03); textAlign(CENTER, CENTER);
            let btnText = ""; let btnColor = color(150); let btnTextColor = color(80); let clickable = item.implemented;
            if (!item.implemented) { btnText = "Soon!"; clickable = false; }
            else if (purchasedItems[item.id]) { btnColor = color(100, 150, 200); btnTextColor = color(255); if (equippedItems[item.type] === item.id) { btnText = "Unequip"; btnColor = color(200, 100, 100); } else { btnText = "Equip"; } }
            else { if (currentTotalPlushies >= item.cost) { btnColor = color(100, 200, 100); btnTextColor = color(0); } else { btnColor = color(150); btnTextColor = color(80); clickable = false; } btnText = `Buy (${item.cost})`; }
            if (!clickable) { btnColor = color(120); btnTextColor = color(70); }
            fill(btnColor); rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3);
            fill(btnTextColor); stroke(textStrokeColor); strokeWeight(1); text(btnText, buttonX + buyButtonWidth/2, buttonTopY + buyButtonHeight/2);

            itemY += storeButtonSpacing; // Increment Y for the next item row
        });

        // Draw Back Button
        if (storeBackButton) { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5); fill(textColor); textSize(min(width, height)*0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2); }

        // --- Draw Mika! --- (NEW!)
        drawStoreMika();

        textAlign(CENTER, CENTER); noStroke();

    } catch(e) { console.error("Error displaying store:", e); }
}

// --- Store Input Handler (Fix Y Calculation & Add Commentary) ---
function handleStoreInput(px, py, currentTotalPlushies) {
    if (!audioStarted) return false;
    if (typeof storeItems === 'undefined') { console.error("storeItems missing for handleStoreInput!"); return false; }
    if (!storeBackButton || typeof buyButtonWidth === 'undefined') { console.error("Store UI missing for input!"); return false; }

    try {
        // Check Back Button FIRST
        if (px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w && py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h) {
            gameState = 'start'; console.log("Exiting Store");
            setStoreMikaCommentary(""); // Clear commentary on exit
            return true; // Handled (no cost)
        }

        let itemY = storeItemYStart; // Reset itemY for checking each item
        let itemHandled = false;
        let costToReturn = 0;

        for (let item of storeItems) {
            if (!item.buyable) { continue; } // Skip non-buyable items in click check

            // Calculate button bounds for THIS item using current itemY
            let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03);
            let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2;
            let buttonBottomY = buttonTopY + buyButtonHeight; // Click zone bottom

            // Check if click is within THIS button's bounds
            if (px >= buttonX && px <= buttonX + buyButtonWidth && py >= buttonTopY && py <= buttonBottomY) {
                itemHandled = true; // Click is on *a* buyable item's button row

                if (!item.implemented) {
                     console.log("Clicked WIP:", item.name); shakeTime = 8;
                     setStoreMikaCommentary("Can't use that yet, Master! Patience!"); // Commentary
                     break; // Exit loop once button is handled
                }

                if (typeof equipItem !== 'function') { console.error("equipItem function missing!"); break; }

                if (purchasedItems[item.id]) { // Owned -> Equip/Unequip
                    if (equippedItems[item.type] === item.id) {
                         equipItem(item.type, null); console.log(`Unequipped ${item.name}`);
                         setStoreMikaCommentary("Taking that off? Hmph, fine..."); // Commentary
                    } else {
                        equipItem(item.type, item.id); console.log(`Equipped ${item.name}`);
                        setStoreMikaCommentary(`Ooh, ${item.name}! Good choice, Master~♡`); // Commentary
                    }
                } else { // Not owned -> Try to Buy
                    if (currentTotalPlushies >= item.cost) {
                        console.log("Buying", item.name); purchasedItems[item.id] = true;
                        try { localStorage.setItem(item.id, 'true'); } catch (e) { console.warn("LS save fail:", e); }
                        setStoreMikaCommentary(`Yay! ${item.name} for me! Thank you, Master!`); // Commentary
                        costToReturn = item.cost; // Set cost to deduct
                    } else {
                        console.log("Not enough TP for", item.name); shakeTime = 10;
                        setStoreMikaCommentary("Not enough plushies! Go catch more for me!"); // Commentary
                    }
                }
                break; // Exit loop once button is handled
            }
            // IMPORTANT: Increment itemY AFTER checking this item row
            itemY += storeButtonSpacing;
        }
        // Return cost if purchase happened, 0 if handled otherwise (equip/fail), false if nothing hit
        return itemHandled ? costToReturn : false;

    } catch (e) { console.error("Error handling store input:", e); return false; }
}


// --- Load Items (No changes needed from previous version) ---
function loadItems() { /* ... (same as before - checks purchasedItems AND collectedGachaItems, sets kittyColor) ... */ console.log("Loading items..."); purchasedItems = {}; collectedGachaItems = {}; equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null }; if (typeof storeItems === 'undefined') { console.error("CRITICAL: storeItems missing during loadItems!"); return; } if (typeof isItemOwned !== 'function' || typeof getColorValueById !== 'function') { console.error("CRITICAL: Helper functions missing during loadItems!"); return; } storeItems.forEach(item => { try { let iP = localStorage.getItem(item.id) === 'true'; let iC = localStorage.getItem(`gacha_${item.id}`) === 'true'; if (iP) { purchasedItems[item.id] = true; } if (iC) { collectedGachaItems[item.id] = true; } } catch (e) { console.warn(`LS load fail for ${item.id}:`, e); } }); for (let type in equippedItems) { try { let eid = localStorage.getItem(`equipped_${type}`); if (eid && isItemOwned(eid)) { equippedItems[type] = eid; console.log(`- Equipped ${type}: ${eid}`); if (type === 'kitty_color') { kittyColor = getColorValueById(eid); console.log("Loaded color:", eid); } } else { equippedItems[type] = null; localStorage.removeItem(`equipped_${type}`); if (type === 'kitty_color') { kittyColor = getColorValueById(null); console.log("Default color loaded."); } } } catch (e) { console.warn(`LS equip load fail ${type}:`, e); equippedItems[type] = null; if(type === 'kitty_color') { kittyColor = getColorValueById(null); } } } if (typeof kittyColor === 'undefined' || kittyColor === null) { console.warn("kittyColor undefined after load, setting default."); kittyColor = getColorValueById(null); } console.log("Item loading complete."); }

// --- Helper to check if item is owned (either bought OR collected) ---
function isItemOwned(itemId) { /* ... (No changes needed) ... */ if (itemId === 'default') return true; if (typeof purchasedItems === 'undefined' || typeof collectedGachaItems === 'undefined') { console.warn("isItemOwned check fail: collections not ready."); return false; } return (purchasedItems[itemId] === true) || (collectedGachaItems[itemId] === true); }

// --- Helper to check if item was bought from store ---
function isItemPurchased(itemId) { /* ... (No changes needed) ... */ if (typeof purchasedItems === 'undefined') { return false; } return purchasedItems[itemId] === true; }

// --- Helper to check if item was won from Gacha ---
function isItemCollected(itemId) { /* ... (No changes needed) ... */ if (typeof collectedGachaItems === 'undefined') { return false; } return collectedGachaItems[itemId] === true; }

// --- Helper to get equipped status ---
function getEquippedItem(itemType) { /* ... (No changes needed) ... */ if (typeof equippedItems === 'undefined' || typeof equippedItems[itemType] === 'undefined') { console.warn(`equippedItems/type ${itemType} missing!`); return null; } return equippedItems[itemType]; }

// --- Helper to Equip/Unequip Items (Updates global kittyColor) ---
function equipItem(itemType, itemId) { /* ... (No changes needed) ... */ if (!itemType || typeof equippedItems === 'undefined') { console.warn("Cannot equip: Invalid type/equippedItems missing."); return; } if (typeof getColorValueById !== 'function' || typeof kittyColor === 'undefined') { console.error("Cannot equip color: Helper function or global var missing!"); return; } equippedItems[itemType] = itemId; try { if (itemId) { localStorage.setItem(`equipped_${itemType}`, itemId); console.log(`Saved equipped ${itemType}: ${itemId}`); } else { localStorage.removeItem(`equipped_${itemType}`); console.log(`Saved unequipped ${itemType}`); } } catch (e) { console.warn(`LS save equipped ${itemType} fail:`, e); } if (itemType === 'kitty_color') { kittyColor = getColorValueById(itemId); console.log("Equipped color changed, updated global kittyColor."); } }