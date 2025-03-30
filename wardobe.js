// ~~~ wardrobe.js ~~~ //
// Mika's Super Cute Wardrobe! For admiring MY collection! Nya~! ♡

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

// --- Data (Needs to be populated/accessed) ---
// Example: We'll need a way to get owned colors, maybe from store.js or elsewhere
let ownedColorItems = []; // We'll populate this later! Assume it's an array of objects like { id: 'kitty_color_orange', name: 'Ginger Kitty' }

// --- Calculate dynamic Wardrobe layout elements ---
function setupWardrobeLayout(canvasW, canvasH) {
    console.log("Calculating Wardrobe layout...");
    wardrobeBackButton = { x: 15, y: canvasH - 65, w: 100, h: 40 }; // Same as Gacha back button Y

    wardrobeTitleY = canvasH * 0.07;
    shelvesY = canvasH * 0.15; // Y position for shelf tabs/labels

    // Define shelf tab areas (simple example)
    let tabWidth = canvasW / 4;
    let tabHeight = 40;
    shelfTabs.colors = { x: canvasW/2 - tabWidth*1.5 - 10, y: shelvesY, w: tabWidth, h: tabHeight, label: "Kitty Colors" };
    shelfTabs.plushies = { x: canvasW/2 - tabWidth/2, y: shelvesY, w: tabWidth, h: tabHeight, label: "Plushies (Soon!)" };
    shelfTabs.upgrades = { x: canvasW/2 + tabWidth/2 + 10, y: shelvesY, w: tabWidth, h: tabHeight, label: "Upgrades (Soon!)" };

    // Define item display area
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
}

// --- Display Wardrobe Screen ---
function displayWardrobe() {
    if (!width || !height) return;

    // --- Background ---
    fill(60, 50, 70, 230); // Slightly different color? Purplish-grey?
    rectMode(CORNER); rect(0, 0, width, height);

    // --- Title ---
    fill(textColor); stroke(textStrokeColor); strokeWeight(3);
    textSize(min(width, height) * 0.07); textAlign(CENTER, CENTER);
    text("Mika's Wardrobe~♡", width / 2, wardrobeTitleY);

    // --- Draw Shelf Tabs/Labels ---
    textSize(min(width, height) * 0.035); strokeWeight(1.5);
    for (const key in shelfTabs) {
        let tab = shelfTabs[key];
        if (currentShelf === key) {
            fill(180, 150, 200); // Highlight active tab
            stroke(textColor);
        } else {
            fill(100, 80, 120); // Inactive tab color
            stroke(180);
        }
        rect(tab.x, tab.y, tab.w, tab.h, 5, 5, 0, 0); // Top rounded corners

        fill(currentShelf === key ? textColor : 200); // Text color
        noStroke();
        text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
    }

    // --- Draw Items for Current Shelf ---
    noStroke();
    fill(40, 30, 50, 180); // Background for item area
    rect(itemDisplayArea.x, itemDisplayArea.y, itemDisplayArea.w, itemDisplayArea.h, 5);

    drawShelfItems(); // Call helper to draw items

    // --- Draw Arrows ---
    drawWardrobeArrows();

    // --- Draw Back Button ---
    drawWardrobeBackButton(); // Renamed to avoid conflict

    // --- Draw Mika? ---
    // Maybe later, let's get the shelves working first! Nya!

    textAlign(CENTER, CENTER); noStroke(); // Reset
}

// --- Helper to Draw Shelf Items (Placeholder) ---
function drawShelfItems() {
    let itemsToShow = [];
    let scrollIndex = 0;
    let itemType = ''; // To check equipped status

    // Determine which items and scroll index to use
    if (currentShelf === 'colors') {
        // TODO: Get actual owned colors dynamically!
        // TEMPORARY: Create dummy data based on storeItems
        ownedColorItems = storeItems.filter(item => item.type === 'kitty_color' && (purchasedItems[item.id] || item.id === 'default')); // Include default
         // Add a default color option if needed
        if (!ownedColorItems.some(item => item.id === 'default')) {
             ownedColorItems.unshift({ id: 'default', name: 'Default Pink', type: 'kitty_color', implemented: true});
        }

        itemsToShow = ownedColorItems;
        scrollIndex = scrollIndexColors;
        itemType = 'kitty_color'; // Match the type used in equippedItems
    } else if (currentShelf === 'plushies') {
        // itemsToShow = ownedPlushieItems; // Later
        // scrollIndex = scrollIndexPlushies;
        // itemType = 'plushie_design'; // Example type
        textSize(min(width, height)*0.04); fill(150);
        text("Plushie shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
        return; // Don't draw items yet
    } else if (currentShelf === 'upgrades') {
        // itemsToShow = ownedUpgradeItems; // Later
        // scrollIndex = scrollIndexUpgrades;
        // itemType = 'power_up'; // Example type
         textSize(min(width, height)*0.04); fill(150);
        text("Upgrade shelf coming soon, nya~!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
        return; // Don't draw items yet
    }

    if (!itemsToShow || itemsToShow.length === 0) {
         textSize(min(width, height)*0.04); fill(150);
        text("Nothing here yet, Master! Go get me stuff!", itemDisplayArea.x + itemDisplayArea.w/2, itemDisplayArea.y + itemDisplayArea.h/2);
        return;
    }


    let displayStartX = itemDisplayArea.x + 20;
    let displayStartY = itemDisplayArea.y + 20;
    let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1), itemDisplayArea.h * 0.6); // Size of item preview
    let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;

    let equippedItemId = null;
    if (typeof getEquippedItem === 'function') {
        equippedItemId = getEquippedItem(itemType);
         // Handle null case for default color
         if (itemType === 'kitty_color' && equippedItemId === null) {
             equippedItemId = 'default';
         }
    }


    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        let itemIndex = scrollIndex + i;
        if (itemIndex >= itemsToShow.length) break; // Stop if we run out of items

        let item = itemsToShow[itemIndex];
        let itemX = displayStartX + i * itemSpacing + (itemSpacing / 2) - (itemSize / 2); // Center item in its slot space
        let itemY = displayStartY + itemDisplayArea.h*0.2; // Y position for items

        // Draw Item Placeholder (e.g., colored square for colors)
        if (item.type === 'kitty_color') {
            let c;
            if(item.id === 'default') c = color(255, 105, 180); // Default pink
            // TODO: Add other color definitions here as they are added to storeItems/gacha
            else if (item.id === 'kitty_color_black') c = color(50);
            else if (item.id === 'kitty_color_orange') c = color(255, 165, 0);
            else c = color(128); // Fallback grey

            fill(c);
            stroke(50); strokeWeight(2);
            rect(itemX, itemY, itemSize, itemSize, 5);
        } else {
            // Placeholder for other item types
            fill(100); stroke(50); strokeWeight(2);
            rect(itemX, itemY, itemSize, itemSize, 5);
            fill(200); noStroke(); textSize(itemSize * 0.5);
            text("?", itemX + itemSize/2, itemY + itemSize/2);
        }

        // Draw Item Name
        fill(textColor); noStroke(); textSize(min(width, height) * 0.025);
        text(item.name, itemX + itemSize / 2, itemY + itemSize + 15);

        // Indicate if Equipped (use a heart! ♡)
        if (equippedItemId === item.id) {
            fill(heartColor); // Red heart
            textSize(itemSize * 0.3);
            text("♥", itemX + itemSize / 2, itemY - 10); // Heart above item
        }
    }
}

// --- Helper to Draw Arrows ---
function drawWardrobeArrows() {
    let items = [];
    let index = 0;
    if (currentShelf === 'colors') { items = ownedColorItems; index = scrollIndexColors; }
    // Add other shelves later

    // Left Arrow
    fill(150, 150, 180, (index > 0) ? 220 : 80); // Dim if inactive
    noStroke();
    triangle(leftArrowButton.x + leftArrowButton.w, leftArrowButton.y,
             leftArrowButton.x + leftArrowButton.w, leftArrowButton.y + leftArrowButton.h,
             leftArrowButton.x, leftArrowButton.y + leftArrowButton.h / 2);

    // Right Arrow
    let canScrollRight = (index + ITEMS_PER_PAGE < items.length);
    fill(150, 150, 180, canScrollRight ? 220 : 80); // Dim if inactive
    noStroke();
    triangle(rightArrowButton.x, rightArrowButton.y,
             rightArrowButton.x, rightArrowButton.y + rightArrowButton.h,
             rightArrowButton.x + rightArrowButton.w, rightArrowButton.y + rightArrowButton.h / 2);
}


// --- Helper to Draw Back Button ---
function drawWardrobeBackButton() {
    if (!wardrobeBackButton) return;
    fill(backButtonColor); // Use the same color defined in sketch.js
    rectMode(CORNER); noStroke();
    rect(wardrobeBackButton.x, wardrobeBackButton.y, wardrobeBackButton.w, wardrobeBackButton.h, 5);
    fill(textColor); textSize(min(width, height) * 0.04); textAlign(CENTER, CENTER);
    stroke(textStrokeColor); strokeWeight(1.5);
    text("Back", wardrobeBackButton.x + wardrobeBackButton.w / 2, wardrobeBackButton.y + wardrobeBackButton.h / 2);
    noStroke();
}


// --- Handle Wardrobe Input ---
function handleWardrobeInput(px, py) {

    // 1. Check Back Button
    if (wardrobeBackButton && px >= wardrobeBackButton.x && px <= wardrobeBackButton.x + wardrobeBackButton.w &&
        py >= wardrobeBackButton.y && py <= wardrobeBackButton.y + wardrobeBackButton.h) {
        console.log("Wardrobe Back button pressed!");
        gameState = 'start'; // Go back to start screen
        return true;
    }

    // 2. Check Shelf Tabs
    for (const key in shelfTabs) {
        let tab = shelfTabs[key];
        if (px >= tab.x && px <= tab.x + tab.w && py >= tab.y && py <= tab.y + tab.h) {
            if (currentShelf !== key) {
                 // Only allow switching to implemented shelves for now
                 if (key === 'colors') { // || key === 'plushies' || key === 'upgrades' -> Add when ready
                    console.log("Switched shelf to:", key);
                    currentShelf = key;
                    // Reset scroll index when switching? Or remember position? Let's remember for now.
                 } else {
                     console.log("Shelf not implemented yet:", key);
                     shakeTime = 8; // Shake if clicking WIP shelf
                 }
            }
            return true; // Handled tab click
        }
    }

    // 3. Check Arrow Buttons
    let items = []; let indexRef = { index: 0 }; // Use object to pass index by reference
    if (currentShelf === 'colors') { items = ownedColorItems; indexRef.index = scrollIndexColors; }
    // Add other shelves later

    // Left Arrow
    if (indexRef.index > 0 && px >= leftArrowButton.x && px <= leftArrowButton.x + leftArrowButton.w &&
        py >= leftArrowButton.y && py <= leftArrowButton.y + leftArrowButton.h) {
        console.log("Scroll left on shelf:", currentShelf);
        indexRef.index = max(0, indexRef.index - ITEMS_PER_PAGE);
         if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
        // Update other scroll indices later
        return true;
    }
    // Right Arrow
    if ((indexRef.index + ITEMS_PER_PAGE < items.length) && px >= rightArrowButton.x && px <= rightArrowButton.x + rightArrowButton.w &&
        py >= rightArrowButton.y && py <= rightArrowButton.y + rightArrowButton.h) {
        console.log("Scroll right on shelf:", currentShelf);
        indexRef.index += ITEMS_PER_PAGE;
         if (currentShelf === 'colors') { scrollIndexColors = indexRef.index; }
        // Update other scroll indices later
        return true;
    }

    // 4. Check Item Clicks (Only for the current shelf)
    let displayStartX = itemDisplayArea.x + 20;
    let displayStartY = itemDisplayArea.y + 20;
    let itemSize = min(itemDisplayArea.w / (ITEMS_PER_PAGE + 1), itemDisplayArea.h * 0.6);
    let itemSpacing = (itemDisplayArea.w - 40) / ITEMS_PER_PAGE;

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        let itemIndex = indexRef.index + i;
        if (itemIndex >= items.length) break;

        let item = items[itemIndex];
        let itemX = displayStartX + i * itemSpacing + (itemSpacing / 2) - (itemSize / 2);
        let itemY = displayStartY + itemDisplayArea.h*0.2;

        if (px >= itemX && px <= itemX + itemSize && py >= itemY && py <= itemY + itemSize) {
            console.log("Clicked item:", item.name);
            // Equip/Unequip Logic (Example for colors)
            if (item.type === 'kitty_color' && typeof equipItem === 'function') { // Check if equip function exists
                let currentEquipped = getEquippedItem('kitty_color');
                // If clicking the equipped item (or default when null), unequip (go back to default)
                if ((currentEquipped === item.id) || (item.id === 'default' && currentEquipped === null)) {
                     console.log("Unequipping color, defaulting to pink.");
                     equipItem('kitty_color', null); // Pass null to unequip/default
                     // Update kittyColor in sketch.js immediately
                     kittyColor = color(255, 105, 180);
                }
                // If clicking a different owned color, equip it
                else {
                    console.log("Equipping color:", item.name);
                    equipItem('kitty_color', item.id);
                     // Update kittyColor in sketch.js immediately
                     // TODO: Need a better way to map ID to color value
                     if(item.id === 'default') kittyColor = color(255, 105, 180);
                     else if (item.id === 'kitty_color_black') kittyColor = color(50);
                     else if (item.id === 'kitty_color_orange') kittyColor = color(255, 165, 0);
                     else kittyColor = color(255, 105, 180); // Fallback
                }

            } else {
                console.log("Cannot equip item type:", item.type, "or equipItem function missing.");
                shakeTime = 8;
            }
             // TODO: Add logic for other item types (plushies, upgrades)
            return true; // Handled item click
        }
    }


    return false; // Click wasn't handled by wardrobe UI
}

// --- Need function to actually equip/save (Likely belongs in store.js or a shared utility file) ---
// This depends on how equippedItems and localStorage saving is structured.
// Let's assume a function exists in store.js called 'equipItem(type, id)'
// and 'getEquippedItem(type)' also exists there.
// We also need store.js to expose 'purchasedItems' or provide a getter.