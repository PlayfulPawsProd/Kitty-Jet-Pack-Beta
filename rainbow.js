// ~~~ rainbow.js ~~~ //
// Rainbow Trail FX Magic! (More Sparkles Edition!) Nya~!

let rainbowTrail = [];
let rainbowHue = 0;

function spawnRainbowParticle() {
    if (!kitty) return;

    // --- MORE PARTICLES! ---
    // Spawn multiple particles per call for a denser trail
    let particlesToSpawn = 3; // Increased from 1

    for (let i = 0; i < particlesToSpawn; i++) {
        // Spawn near jetpack nozzles, slight random spread
        let spawnX = kitty.x + random(-kitty.size * 0.25, kitty.size * 0.25); // Slightly wider spawn
        let spawnY = kitty.y + kitty.size * 0.5 + random(10); // Slightly further down

        // --- SLIGHTLY BIGGER & VARIED SIZE ---
        let particleSize = random(kitty.size * 0.08, kitty.size * 0.20); // Increased max size

        let particle = {
            x: spawnX,
            y: spawnY,
            vx: random(-0.6, 0.6), // Slightly more horizontal drift potential
            vy: random(0.8, 2.0),  // Slightly faster initial fall
            hue: (rainbowHue + random(-10, 10)) % 360, // Add slight hue variation
            alpha: 1.0,
            size: particleSize,
            life: 1.0 + random(0.2) // Base life + slight random variation longer life overall
        };
        rainbowTrail.push(particle);
    }

    rainbowHue += 8; // Cycle hue slightly faster for more color change
}

function updateAndDrawRainbowTrail(scrollSpeed) {
    noStroke();
    push();
    colorMode(HSB, 360, 100, 100, 1); // Set HSB for drawing

    for (let i = rainbowTrail.length - 1; i >= 0; i--) {
        let p = rainbowTrail[i];

        // Update position
        p.y += p.vy + scrollSpeed;
        p.x += p.vx;

        // Update drift and life
        p.vx += random(-0.15, 0.15); // More erratic drift?
        p.vx *= 0.97; // Slightly less dampening
        p.life -= 0.015; // Particles last slightly longer (decrease life slower)

        // Remove if faded or off screen
        if (p.life <= 0 || p.y > height + p.size) {
            rainbowTrail.splice(i, 1);
        } else {
            // Draw particle
            fill(p.hue, 90, 100, p.life * 0.8); // Keep bright, maybe slightly more alpha
            ellipse(p.x, p.y, p.size * p.life); // Size shrinks
        }
    }

    pop(); // Restore RGB color mode
}