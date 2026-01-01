const recpeMnu = createElm(1, "div", null, document.body, null, "recipe-menu");
const recpeMnuExitBtn = createElm(1, "div", "btn", recpeMnu, null, null, "x");

const recipes = createElm(1, "div", "recipes", recpeMnu);
createElm(1, "img", "recipe", recipes, "assets/axe.svg", null, "", 10);
createElm(1, "img", "recipe", recipes, "assets/pickaxe.svg", null, "", 10);
createElm(1, "img", "recipe", recipes, "assets/stone-axe.svg", null, "", 15);
createElm(1, "img", "recipe", recipes, "assets/stone-pickaxe.svg", null, "", 15);
createElm(1, "img", "recipe", recipes, "assets/iron-axe.svg", null, "", 20);
createElm(1, "img", "recipe", recipes, "assets/iron-pickaxe.svg", null, "", 20);
createElm(1, "img", "recipe", recipes, "assets/furnace.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/gear.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/rotater.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/mover.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/delayer.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/activator.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/sunsaw-body.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/clawmachine-body.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/shooter-body.svg", null, "", 1);

const recipeReqs = {"assets/hl-axe.svg": [["log", 10]], "assets/hl-pickaxe.svg": [["log", 10]],
"assets/hl-stone-axe.svg": [["log", 10],["stone",5]], "assets/hl-stone-pickaxe.svg": [["log", 10],["stone",5]],
"assets/hl-iron-axe.svg": [["log", 10],["iron",5]], "assets/hl-iron-pickaxe.svg": [["log", 10],["iron",5]],
"assets/hl-furnace.svg": [["stone", 10], ["log", 5]]}