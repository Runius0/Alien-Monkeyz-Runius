const root = document.querySelector(":root")
const world = createElm(1, "div", null, document.body, null, "world");

const path = [];

const spriteScale = 5;

const worldLength = 20;
const worldHeight = 10;

const infoTxt = createElm(1, "p", null, world, null, "info-txt", null);
infoTxt.style.height = `${(16 * spriteScale) * worldHeight}px`;

root.style.setProperty("--sprite-scale", spriteScale);
world.style.width = `${(16 * spriteScale) * worldLength}px`;
world.style.height = `${(16 * spriteScale) * worldHeight}px`;

createWorld(worldLength * worldHeight, 16 * spriteScale, worldLength);
addPath(worldLength, worldHeight, generateStructures);