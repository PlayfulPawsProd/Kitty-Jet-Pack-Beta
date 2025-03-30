// --- Inside handlePressStart() in sketch.js, in the 'gacha' state block ---
else if (gameState === 'gacha') {
    if (typeof handleGachaInput === 'function' && typeof GACHA_COST !== 'undefined') { // Check if cost is defined
        let gachaAction = handleGachaInput(pressX, py, totalPlushiesCollected);

        // LATER: Check if the action requires cost deduction
        if (gachaAction === 'start_pull' && GACHA_COST > 0) { // Only deduct if cost > 0
            console.log(`Deducting ${GACHA_COST} plushies for gacha.`);
            totalPlushiesCollected -= GACHA_COST;
             try { localStorage.setItem('kittyTotalPlushies', totalPlushiesCollected); }
             catch(e){ console.warn("Failed to save total plushies after gacha pull:", e); }
        } else if (gachaAction === 'pull_fail_cost') {
            // Maybe trigger shake from here if handleGachaInput doesn't do it
            // shakeTime = 10;
        }
        // 'back' action is handled internally by handleGachaInput changing gameState

    } else {
        console.warn("handleGachaInput or GACHA_COST not found! Switching back to start.");
        gameState = 'start';
    }
    return; // Handled gacha input or navigation
}