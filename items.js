// ~~~ items.js ~~~ //
// The Grand Catalog of All Things Mika! (And other stuff...) Nya~! ♡

const storeItems = [
    // --- Accessories ---
    { id: 'kitty_bow_pink', name: 'Pink Bow', cost: 1, description: 'A cute bow for kitty!', type: 'kitty_accessory', rarity: 'common', buyable: true, implemented: true },

    // --- Jetpack FX ---
    { id: 'jetpack_rainbow', name: 'Rainbow Trail FX', cost: 250, description: 'Leave a sparkly rainbow trail!', type: 'jetpack_fx', rarity: 'rare', buyable: true, implemented: true },

    // --- KITTY COLORS ---
    // --- IMPORTANT: colorValue stored as [R, G, B] array for easy use with p5 color() ---
    { id: 'default', name: 'Default Pink', cost: 0, description: 'Your standard adorable pink!', type: 'kitty_color', rarity: 'common', buyable: false, implemented: true, colorValue: [255, 105, 180] }, // Default needs a value here now

    // Common (Buyable in Store / Common Gacha)
    { id: 'kitty_color_black', name: 'Shadow Kitty', cost: 100, description: 'A sleek, mysterious look!', type: 'kitty_color', rarity: 'common', buyable: true, implemented: true, colorValue: [50, 50, 50] }, // Let's mark these as implemented now
    { id: 'kitty_color_orange', name: 'Ginger Kitty', cost: 100, description: 'A classic marmalade friend!', type: 'kitty_color', rarity: 'common', buyable: true, implemented: true, colorValue: [255, 165, 0] },
    { id: 'kitty_color_grey', name: 'Ash Kitty', cost: 100, description: 'Cool and sophisticated grey!', type: 'kitty_color', rarity: 'common', buyable: true, implemented: true, colorValue: [150, 150, 150] },

    // Uncommon (Gacha Only)
    { id: 'kitty_color_white', name: 'Snow Kitty', cost: 0, description: 'Pure and fluffy white!', type: 'kitty_color', rarity: 'uncommon', buyable: false, implemented: true, colorValue: [245, 245, 245] }, // Mark as implemented
    { id: 'kitty_color_tabby', name: 'Tabby Cat', cost: 0, description: 'Stripes are always in style!', type: 'kitty_color', rarity: 'uncommon', buyable: false, implemented: false, colorValue: [160, 120, 90] }, // Needs pattern logic LATER

    // Rare (Gacha Only)
    { id: 'kitty_color_calico', name: 'Calico Cutie', cost: 0, description: 'A lucky mix of colors!', type: 'kitty_color', rarity: 'rare', buyable: false, implemented: false, colorValue: [230, 150, 50] }, // Needs pattern logic LATER
    { id: 'kitty_color_tuxedo', name: 'Dapper Tuxedo', cost: 0, description: 'Always dressed to impress!', type: 'kitty_color', rarity: 'rare', buyable: false, implemented: false, colorValue: [40, 40, 40] }, // Needs pattern logic LATER

    // Super Rare (Gacha Only)
    { id: 'kitty_color_galaxy', name: 'Galaxy Star Kitty', cost: 0, description: 'Shining with cosmic power!', type: 'kitty_color', rarity: 'super_rare', buyable: false, implemented: false, colorValue: [20, 0, 60] }, // Needs special draw logic LATER
    { id: 'kitty_color_gold', name: 'Golden Idol Kitty', cost: 0, description: 'Gleaming and precious!', type: 'kitty_color', rarity: 'super_rare', buyable: false, implemented: true, colorValue: [255, 215, 0] }, // Mark as implemented

    // --- Power Ups (Store / Gacha?) ---
    { id: 'plushie_magnet', name: 'Plushie Magnet', cost: 500, description: 'Attract nearby plushies!', type: 'power_up', rarity: 'rare', buyable: true, implemented: false }

    // Add more items here later! Nya! ♡
];