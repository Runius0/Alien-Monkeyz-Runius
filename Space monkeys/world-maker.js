const root = document.querySelector(":root")
const world = createElm(1, "div", null, document.body, null, "world");

const path = [];

const spriteScale = 5;

const worldLength = 30;
const worldHeight = 15;

const infoTxt = createElm(1, "p", null, world, null, "info-txt", null);
infoTxt.style.height = `${(16 * spriteScale) * worldHeight}px`;

root.style.setProperty("--sprite-scale", spriteScale);
world.style.width = `${(16 * spriteScale) * worldLength}px`;
world.style.height = `${(16 * spriteScale) * worldHeight}px`;

createWorld(worldLength * worldHeight, 16 * spriteScale, worldLength);

Promise.all([
    addPath(worldLength, worldHeight),
]).then(() =>{
    return Promise.all([
        generateStructures(100, "assets/tree.svg", 27),
        generateStructures(100, "assets/tree.svg", 27),
        generateStructures(100, "assets/tree.svg", 27),
        generateStructures(100, "assets/tree.svg", 27),
        //
        generateStructures(20, "assets/big-rock.svg", 29),
        generateStructures(20, "assets/big-rock.svg", 29),
        //
        generateStructures(20, "assets/iron-ore.svg", 21),
        generateStructures(20, "assets/iron-ore.svg", 21),
    ]);
}).then(() =>{
    return waveStartBtn.classList.add("active");
});