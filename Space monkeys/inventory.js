const inventory = createElm(1, "div", null, world, null, "inventory");
createElm(10, "div", "slot", inventory,);
let activeSlot = inventoryHandler(inventory);

addItemToInventory(0, "axe", 10);
addItemToInventory(1, "iron-pickaxe", 20);
addItemToInventory(2, "furnace", 10);
addItemToInventory(3, "raw-iron", 10);
addItemToInventory(4, "sapling", 10);
addItemToInventory(5, "axe", 1);
/* addItemToInventory(2, "stone-pickaxe", 15);
addItemToInventory(3, "iron-pickaxe", 20);
addItemToInventory(4, "mover", 100);
addItemToInventory(5, "sunsaw-body", 100);
addItemToInventory(6, "rotater", 100); */

addItemToInventory(9, "workbench", 1);

cursor.src = inventory.children[activeSlot].children[0].getAttribute("src")