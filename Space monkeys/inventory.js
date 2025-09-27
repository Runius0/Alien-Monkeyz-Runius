const inventory = createElm(1, "div", null, world, null, "inventory");
createElm(10, "div", "slot", inventory,);
let activeSlot = inventoryHandler(inventory);

addItemToInventory(0, "stone-pickaxe", 15);
addItemToInventory(1, "stone-axe", 15);
addItemToInventory(2, "mover", 100);
addItemToInventory(3, "rotater", 100);
addItemToInventory(4, "delayer", 100);
addItemToInventory(5, "activator", 100);

addItemToInventory(9, "workbench", 1);

cursor.src = inventory.children[activeSlot].children[0].getAttribute("src")