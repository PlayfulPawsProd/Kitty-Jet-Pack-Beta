// ~~~ store.js ~~~ //
// Magic spells for the Plushie Store! Nya~! (Rainbow Trail ACTUALLY Enabled!)

// --- Store Data ---
const storeItems = [
    { id: 'kitty_bow_pink', name: 'Pink Bow', cost: 1, description: 'A cute bow for kitty!', type: 'kitty_accessory', implemented: true },
    { id: 'jetpack_rainbow', name: 'Rainbow Trail FX', cost: 250, description: 'Leave a sparkly rainbow trail!', type: 'jetpack_fx', implemented: true }, // NOW IMPLEMENTED!

    // WIP Items
    { id: 'kitty_color_black', name: 'Shadow Kitty', cost: 100, description: 'A sleek, mysterious look!', type: 'kitty_color', implemented: false },
    { id: 'kitty_color_orange', name: 'Ginger Kitty', cost: 100, description: 'A classic marmalade friend!', type: 'kitty_color', implemented: false },
    { id: 'plushie_magnet', name: 'Plushie Magnet', cost: 500, description: 'Attract nearby plushies!', type: 'power_up', implemented: false }
];

let purchasedItems = {}; // { 'itemId': true/false }
let equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null };

let storeButtonHeight = 60; let storeButtonSpacing = 75;
let buyButtonWidth; let buyButtonHeight = 40;
let storeItemYStart; let storeBackButton;

// --- Calculate dynamic store layout elements ---
function setupStoreLayout(canvasW, canvasH) { /* ... same ... */ buyButtonWidth = canvasW * 0.25; storeItemYStart = canvasH * 0.20; storeBackButton = { x: 15, y: canvasH - 55, w: 100, h: 40 }; console.log("Store layout calculated!"); }

// --- Store Display Function ---
function displayStore(currentTotalPlushies) { /* ... same ... */ if (!width || !height) return; background(50, 50, 70, 220); fill(textColor); stroke(textStrokeColor); strokeWeight(3); textSize(min(width, height) * 0.08); text("Plushie Store!", width / 2, height * 0.1); textSize(min(width, height) * 0.05); strokeWeight(2); text(`Total Plushies: ${currentTotalPlushies}`, width / 2, height * 0.18); noStroke(); let itemY = storeItemYStart; storeItems.forEach((item, index) => { if (typeof purchasedItems[item.id] === 'undefined') { purchasedItems[item.id] = false; } fill(100, 100, 120, 200); rectMode(CORNER); rect(width * 0.05, itemY, width * 0.9, storeButtonHeight, 5); fill(textColor); textAlign(LEFT, TOP); textSize(min(width, height) * 0.035); stroke(textStrokeColor); strokeWeight(1); text(`${item.name}`, width * 0.08, itemY + 8); textSize(min(width, height) * 0.025); noStroke(); text(item.description, width * 0.08, itemY + 32); let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03); let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2; rectMode(CORNER); noStroke(); textSize(min(width, height) * 0.03); textAlign(CENTER, CENTER); let buttonText = ""; let buttonColor = color(150); let buttonTextColor = color(80); let isClickable = item.implemented; if (!item.implemented) { buttonText = "Soon!"; isClickable = false; } else if (purchasedItems[item.id]) { buttonColor = color(100, 150, 200); buttonTextColor = color(255); if (equippedItems[item.type] === item.id) { buttonText = "Unequip"; buttonColor = color(200, 100, 100); } else { buttonText = "Equip"; } } else { if (currentTotalPlushies >= item.cost) { buttonColor = color(100, 200, 100); buttonTextColor = color(0); } else { buttonColor = color(150); buttonTextColor = color(80); isClickable = false; } buttonText = `Buy (${item.cost})`; } if (!isClickable) { buttonColor = color(120); buttonTextColor = color(70); } fill(buttonColor); rect(buttonX, buttonTopY, buyButtonWidth, buyButtonHeight, 3); fill(buttonTextColor); stroke(textStrokeColor); strokeWeight(1); text(buttonText, buttonX + buyButtonWidth / 2, buttonTopY + buyButtonHeight / 2); itemY += storeButtonSpacing; }); if (storeBackButton) { fill(backButtonColor); rectMode(CORNER); noStroke(); rect(storeBackButton.x, storeBackButton.y, storeBackButton.w, storeBackButton.h, 5); fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER); stroke(textStrokeColor); strokeWeight(1.5); text("Back", storeBackButton.x + storeBackButton.w / 2, storeBackButton.y + storeBackButton.h / 2); } textAlign(CENTER, CENTER); noStroke(); }

// --- Store Input Handler ---
function handleStoreInput(px, py, currentTotalPlushies) { /* ... same logic ... */ if (!audioStarted) return false; if (storeBackButton && px >= storeBackButton.x && px <= storeBackButton.x + storeBackButton.w && py >= storeBackButton.y && py <= storeBackButton.y + storeBackButton.h) { gameState = 'start'; console.log("Exiting Store"); return true; } let itemY = storeItemYStart; let itemHandled = false; for (let item of storeItems) { let buttonX = width * 0.95 - buyButtonWidth - (width * 0.03); let buttonTopY = itemY + (storeButtonHeight - buyButtonHeight) / 2; if (px >= buttonX && px <= buttonX + buyButtonWidth && py >= buttonTopY && py <= buttonTopY + buyButtonHeight) { if (!item.implemented) { console.log("Clicked button for WIP item:", item.name); shakeTime = 8; itemHandled = true; break; } console.log("Clicked button for:", item.name); if (purchasedItems[item.id]) { if (equippedItems[item.type] === item.id) { equippedItems[item.type] = null; localStorage.removeItem(`equipped_${item.type}`); console.log(`Unequipped ${item.name}`); } else { equippedItems[item.type] = item.id; localStorage.setItem(`equipped_${item.type}`, item.id); console.log(`Equipped ${item.name}`); } itemHandled = true; break; } else { if (currentTotalPlushies >= item.cost) { console.log("Attempting to buy", item.name); purchasedItems[item.id] = true; try { localStorage.setItem(item.id, 'true'); } catch (e) { console.warn("Failed to save purchase:", e);} console.log("Purchased!", item.name); return item.cost; } else { console.log("Not enough plushies to buy", item.name); shakeTime = 10; itemHandled = true; break; } } } itemY += storeButtonSpacing; } return itemHandled; }

// --- Load Purchases and Equipped Items ---
function loadItems() { /* ... same ... */ console.log("Loading items..."); purchasedItems = {}; equippedItems = { kitty_accessory: null, kitty_color: null, jetpack_fx: null }; storeItems.forEach(item => { try { purchasedItems[item.id] = localStorage.getItem(item.id) === 'true'; } catch (e) { console.warn(`Could not load purchase status for ${item.id}:`, e); purchasedItems[item.id] = false; } }); for (let type in equippedItems) { try { let equippedId = localStorage.getItem(`equipped_${type}`); if (equippedId && purchasedItems[equippedId]) { equippedItems[type] = equippedId; console.log(`- Equipped ${type}: ${equippedId}`); } else { equippedItems[type] = null; localStorage.removeItem(`equipped_${type}`); } } catch (e) { console.warn(`Could not load equipped status for ${type}:`, e); equippedItems[type] = null; } } console.log("Item loading complete."); }

// --- Helper to check purchase status ---
function isItemPurchased(itemId) { return purchasedItems[itemId] === true; }

// --- Helper to check equipped status ---
function getEquippedItem(itemType) { return equippedItems[itemType]; }