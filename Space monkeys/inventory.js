const inventory = createElm(1, "div", null, world, null, "inventory");
createElm(10, "div", "slot", inventory,);
let activeSlot = inventoryHandler(inventory);

addItemToInventory(0, "axe", 10);
addItemToInventory(1, "pickaxe", 10);

addItemToInventory(9, "workbench", 1);

cursor.src = inventory.children[activeSlot].children[0].getAttribute("src")