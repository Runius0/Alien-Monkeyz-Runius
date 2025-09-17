const recpeMnu = createElm(1, "div", null, document.body, null, "recipe-menu");
const recpeMnuExitBtn = createElm(1, "div", "btn", recpeMnu, null, null, "x");

const recipes = createElm(1, "div", "recipes", recpeMnu);
createElm(1, "img", "recipe", recipes, "assets/axe.svg", null, "", 10);
createElm(1, "img", "recipe", recipes, "assets/pickaxe.svg", null, "", 10);
createElm(1, "img", "recipe", recipes, "assets/stone-pickaxe.svg", null, "", 15);
createElm(1, "img", "recipe", recipes, "assets/stone-axe.svg", null, "", 15);
createElm(1, "img", "recipe", recipes, "assets/iron-pickaxe.svg", null, "", 20);
createElm(1, "img", "recipe", recipes, "assets/iron-axe.svg", null, "", 20);
createElm(1, "img", "recipe", recipes, "assets/gear.svg", null, "", 1);
createElm(1, "img", "recipe", recipes, "assets/furnace.svg", null, "", 1);