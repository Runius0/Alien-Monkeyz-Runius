function createWorld(amnt, sprite_size, world_length){
    let currRow = 0;
    let currCol = 0;
    for (let i = 0; i < amnt; i++) {
        const tile = document.createElement("img");        
        tile.src = "assets/ground.svg";
        tile.classList.add('ground');
        //
        if(i % world_length == 0 && i > world_length - 1){
            currRow++; 
            currCol = i * sprite_size;
        }
        tile.style.left = `${(i * sprite_size) - currCol}px`;
        tile.style.top = `${currRow * sprite_size}px`;
        //
        world.appendChild(tile);
    }
}
function createElm(amnt, type, clas, parent, source, id_, txt, itmAmnt){
    let elm; 
    for (let i = 0; i < amnt; i++) {
        elm = document.createElement(type);
        if(clas)
            elm.classList.add(clas);
        if(type == "img")
            elm.src = source;
        if(id_)
            elm.id = id_;
        if(txt)
            elm.textContent = txt;
        if(itmAmnt)
            elm.dataset.amnt = itmAmnt;
        
        parent.appendChild(elm);
    }
    return elm;
}
function rndmNumb(min, max, float){
    if(float == undefined)
        return Math.floor(Math.random() * (max - min + 1)) + min
    else
        return Math.random() * (max - min + 1) + min
}
function addPath(row_size, height_size, strucGenFunc){
    let startTile = rndmNumb(0, (row_size / 2) - 1);
    world.children[startTile].src = "assets/path.svg";
    
    let rndmPathHeight = rndmNumb(1, height_size - 2);
    let rndmPathWidth = rndmNumb(1, row_size);

    let currPathHeight = -1;
    let currPathWidth = 0;

    let currTile;

    // ADD THE INITIAL PATH TILE VALUES
    path.push([startTile, "assets/path.svg"])

    const curveInterval = setInterval(() => {
        // ADD PATH INDEXES TO AN ARRAY
        if(currPathHeight != rndmPathHeight - 1){
            currPathHeight++;
            currTile = ((startTile * 2 + (row_size - startTile)) + row_size * currPathHeight);
            world.children[currTile].src = "assets/path.svg";
        }else if(currPathWidth != rndmPathWidth){
            currPathWidth++;
            currTile = ((startTile * 2 + (row_size - startTile)) + row_size * currPathHeight) + currPathWidth;

            // ONE EXCEPTION WHEN THE PATH IS IN THE BOTTOM LEFT CORNER MAKE THE TILE VERTICAL
            if(currTile == (row_size * height_size) - row_size + 1)
                world.children[currTile].src = "assets/path.svg";
            else
                world.children[currTile].src = "assets/path-r.svg";
        }
        if(currPathWidth == rndmPathWidth && currPathHeight == rndmPathHeight - 1){
            startTile = currTile;
            //
            currPathHeight = -1;
            rndmPathHeight =  rndmNumb(1, height_size - 2);
            currPathWidth = 0;
            rndmPathWidth = rndmNumb(1, row_size);
        }
        // STOP CREATING THE PATH WHEN WE GO ONTO THE LAST ROW OF THE WORLD
        if(currTile >= (row_size * height_size) - row_size + 1){
            clearInterval(curveInterval);

            strucGenFunc(100, "assets/tree.svg", 27);
            strucGenFunc(10, "assets/big-rock.svg", 29);
            strucGenFunc(10, "assets/iron-ore.svg", 21);
        } 
        // ADD THE REST PATH TILE VALUES
        path.push([currTile, world.children[currTile].src])
    }, 50);
}
function generateStructures(amnt, source, struc_size){
    let rndmTile;
    let counter = 0;
    const strucGenInterval = setInterval(() => {
        counter++;
        rndmTile = rndmNumb(0, world.children.length - 1);
        if(world.children[rndmTile].getAttribute("src") == "assets/path.svg" ||
        world.children[rndmTile].getAttribute("src") == "assets/path-r.svg")
        {
            if(world.children[rndmTile].getAttribute("src") == "assets/path.svg")
                world.children[rndmTile].src = "assets/path.svg";
            if(world.children[rndmTile].getAttribute("src") == "assets/path-r.svg")
                world.children[rndmTile].src = "assets/path-r.svg";
                
            world.children[rndmTile].style.transform = `translateY(${0}px)`;
        }
        else if(world.children[rndmTile].nodeName.toLowerCase() == "img"){
            world.children[rndmTile].src = source;
            world.children[rndmTile].style.transform = `translateY(-${struc_size * 2}px)`;
        }
        if(counter == amnt){
            clearInterval(strucGenInterval);
        }
    }, 1);
}
function cursorHandler(){
    let cursorX;
    let cursorY;

    window.addEventListener("mousedown", function(e){
        destoryStructures("axe", "hl-tree", e.target, 10, 27, ["log", "log", "log", "sapling"], 96);
        destoryStructures("stone-axe", "hl-tree", e.target, 10, 27, ["log", "log", "log", "sapling"], 60);
        destoryStructures("iron-axe", "hl-tree", e.target, 10, 27, ["log", "log", "log", "sapling"], 35);

        destoryStructures("pickaxe", "hl-big-rock", e.target, 10, 29, ["stone"], 96);
        destoryStructures("stone-pickaxe", "hl-big-rock", e.target, 10, 29, ["stone"], 60);
        destoryStructures("iron-pickaxe", "hl-big-rock", e.target, 10, 29, ["stone"], 35);
        
        destoryStructures("stone-pickaxe", "hl-iron-ore", e.target, 15, 21, ["raw-iron"], 60);
        destoryStructures("iron-pickaxe", "hl-iron-ore", e.target, 15, 21, ["raw-iron"], 30);
        
        destoryStructures("pickaxe", "hl-furnace", e.target, 2, 0, [], 96);
        destoryStructures("stone-pickaxe", "hl-furnace", e.target, 2, 0, [], 60);
        destoryStructures("iron-pickaxe", "hl-furnace", e.target, 2, 0, [], 30);
        
        destoryStructures("axe", "hl-workbench", e.target, 2, 0, [], 96);
        destoryStructures("stone-axe", "hl-workbench", e.target, 2, 0, [], 60);
        destoryStructures("pickaxe-axe", "hl-workbench", e.target, 2, 0, [], 30);

        placeDownItems("log", e.target);
        placeDownItems("stone", e.target);
        placeDownItems("sapling", e.target);
        placeDownItems("raw-iron", e.target);
        placeDownItems("iron", e.target);

        placeDownItems("workbench", e.target);
        placeDownItems("furnace", e.target);
        recipeMenu(e.target, cursorX, cursorY);
        
        pickUpItems("hl-log", e.target);
        pickUpItems("hl-stone", e.target);
        pickUpItems("hl-sapling", e.target);
        pickUpItems("hl-raw-iron", e.target);
        pickUpItems("hl-iron", e.target);

        smelt(e.target);
    });    
 
    window.addEventListener("mousemove", function(e){
        cursorX = e.clientX; cursorY = e.clientY;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        outlineAdder("tree", e.target, 10);
        outlineAdder("big-rock", e.target, 10);
        outlineAdder("iron-ore", e.target, 15);

        outlineAdder("workbench", e.target, 1);

        outlineAdder("sapling", e.target, 1);

        outlineAdder("axe", e.target, [["log", 10]]);
        outlineAdder("pickaxe", e.target, [["log", 10]]);
        outlineAdder("stone-axe", e.target, [["log", 10], ["stone", 5]]);
        outlineAdder("stone-pickaxe", e.target, [["log", 10], ["stone", 5]]);
        outlineAdder("iron-pickaxe", e.target, [["log", 10], ["iron", 5]]);
        outlineAdder("iron-axe", e.target, [["log", 10], ["iron", 5]]);
        outlineAdder("gear", e.target, [["iron", 5]]);
        outlineAdder("furnace", e.target, [["stone", 10], ["log", 5]]);

        outlineAdder("log", e.target, rndmNumb(1, 5));
        outlineAdder("stone", e.target, rndmNumb(1, 5));
        outlineAdder("raw-iron", e.target, rndmNumb(1, 5));
        outlineAdder("iron", e.target);
    });
}
function outlineAdder(struc, e, maxHp){
    if(e.parentNode.parentNode == inventory) return; 
    
    const baseSrc = `assets/${struc}.svg`;
    const hlSrc = `assets/hl-${struc}.svg`;
    const src = e.getAttribute("src");

    infoTxtVal = "";
    
    if(src && (src === baseSrc || src.includes(`assets/${struc}`))){
        e.src = hlSrc;

        if(!e._hasLeaveHandler){
            e.addEventListener("mouseleave", function(){
                if(e.getAttribute("src").startsWith("assets/hl-")){
                    e.src = e.getAttribute("src").replace("assets/hl-", "assets/");
                }
                infoTxt.classList.remove("active");
            });
            e._hasLeaveHandler = true;
        }
        if(!e.dataset.redrop || !e.classList.contains("recipe")){
            if(e.dataset.drop != 0){
                if(e.dataset.destroyed === undefined) infoTxt.textContent = `Hp ${maxHp}`;
                else infoTxt.textContent = `Hp ${Math.abs(e.dataset.destroyed - maxHp)}`;
            } else {
                e.dataset.drop = maxHp;
                infoTxt.textContent = `Amnt ${maxHp}`;
            }
            if(e.dataset.drop > 0) infoTxt.textContent = `Amnt ${e.dataset.drop}`;
        }
        if(e.dataset.redrop){
            infoTxt.textContent = `Amnt ${e.dataset.redrop}`;
        }
        if(e.classList.contains("recipe")){
            for (let i = 0; i < maxHp.length; i++) 
                infoTxtVal += `${maxHp[i].toString().replace(",", " ")} \n`;

            infoTxt.textContent = infoTxtVal;
        }
        //
        infoTxt.classList.add("active");
    }
}
function destoryStructures(tool, struc, e, maxHp, spriteSize, drop, _speed) {
    if(e.parentNode.parentNode == recpeMnu) return; 

    let destroyAnim;
    let iteration = 0;
    let last = performance.now();
    let speed = _speed;

    if (
        inventory.children[activeSlot].children.length != 0 && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${tool}.svg` &&
        e.getAttribute("src") == `assets/${struc}.svg`) {

        drop = (drop.length > 1) ? drop[rndmNumb(0, drop.length - 1)] : drop[0];

        function step(now) {
            if (!destroyAnim) return;

            if (now - last >= speed) {
                last = now;

                if (e.dataset.destroyed === undefined) e.dataset.destroyed = 1;
                else {
                    e.dataset.destroyed = parseInt(e.dataset.destroyed) + 1;
                    if (e.dataset.destroyed == maxHp) {
                        // TOOL LOSE DURABILITY
                        if(inventory.children[activeSlot].children[1].innerText != 1)
                            inventory.children[activeSlot].children[1].innerText -= 1;
                        else{
                            inventory.children[activeSlot].children[0].remove();
                            inventory.children[activeSlot].children[0].remove();
                            cursor.src = "assets/empty.svg";
                        }
                        //
                        cancelAnimationFrame(destroyAnim);
                        destroyAnim = null;
                        //
                        if(drop) {
                            e.dataset.drop = 0
                            e.src = `assets/${drop}.svg`;
                        }  
                        else {
                            collectItem(e, 1);

                            // HIDE RECIPE MENU WHEN THE DESTROYED STRUC IS THE WORKBENCH
                            if(struc == "hl-workbench") recpeMnu.classList.remove("active");
                            
                            e.dataset.destroyed = 0;
                            e.src = `assets/ground.svg`;
                        }

                        e.style.transform = "translateY(0)";
                        infoTxt.classList.remove("active");
                        return;
                    }
                }

                iteration++;
                if (e.dataset.destroyed != maxHp) {
                    let rndmAngle;
                    if (iteration % 2 == 0) rndmAngle = rndmNumb(-5, -7.5, true);
                    else rndmAngle = rndmNumb(5, 7.5, true);

                    e.style.transform = `translate(0, -${spriteSize * 2}px) rotate(${rndmAngle}deg)`;
                }

                infoTxt.textContent = `Hp ${Math.abs(e.dataset.destroyed - maxHp)}`;
            }

            destroyAnim = requestAnimationFrame(step);
        }

        destroyAnim = requestAnimationFrame(step);

        e.addEventListener("mouseup", () => {
            cancelAnimationFrame(destroyAnim);
            destroyAnim = null;
        });
    }
}
function pickUpItems(itm, e){
    if (e.getAttribute("src") == `assets/${itm}.svg`){
        infoTxt.classList.remove("active");
        let slot = findFreeSlot(inventory, `assets/${itm.slice(3)}.svg`);
        
        if(!slot.found){
            createElm(1, "img", "item", inventory.children[slot.index], `assets/${itm.slice(3)}.svg`);
            if(!e.dataset.redrop)
                createElm(1, "p", "amount", inventory.children[slot.index], null, null, e.dataset.drop);
            else
                createElm(1, "p", "amount", inventory.children[slot.index], null, null, 1);
            //
            if(slot.index == activeSlot)
                cursor.src = `assets/${itm.slice(3)}.svg`;
        }
        else {
            if(!e.dataset.redrop)
                inventory.children[slot.index].children[1].innerText = parseInt(inventory.children[slot.index].children[1].innerText) + parseInt(e.dataset.drop);
            else    
                inventory.children[slot.index].children[1].innerText = parseInt(inventory.children[slot.index].children[1].innerText) + 1;
        }

        e.dataset.drop = 0;
        e.src = "assets/ground.svg";
    }
}
function placeDownItems(itm, e){
    if(inventory.children[activeSlot].children[0] && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${itm}.svg` &&
    e.getAttribute("src") == "assets/ground.svg"){
        e.src = `assets/${itm}.svg`;
        if(inventory.children[activeSlot].children[1].innerText != 1)
            inventory.children[activeSlot].children[1].innerText = parseInt(inventory.children[activeSlot].children[1].innerText) - 1;
        else{
            inventory.children[activeSlot].children[0].remove();
            inventory.children[activeSlot].children[0].remove();
            cursor.src = "assets/empty.svg";
            //
        }
        e.dataset.redrop = 1;
    }
}
function findFreeSlot(inventory, targetSrc, unstackable) {
    const slots = Array.from(inventory.children);

    if(unstackable != 0){
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].children.length > 0) {
            const child = slots[i].children[0];
                if (child.getAttribute("src") === targetSrc) {
                    return {
                        found: true,
                        index: i
                    };
                }
            }
        }
    }

    for (let i = 0; i < slots.length; i++) {
        if (slots[i].children.length == 0) {
            return {
                found: false,
                index: i
            };
        }
    }

    return {
        found: false,
        index: -1
    };
}
function addItemToInventory(slot, src, amnt){
    createElm(1, "img", "item", inventory.children[slot], `assets/${src}.svg`);
    createElm(1, "p", "amount", inventory.children[slot], null, null, amnt);
}
function collectItem(e, amnt, oneSrc){
    const fullSrc = (!oneSrc) ? e.getAttribute("src") : oneSrc;
    const srcStart = fullSrc.indexOf("hl-") + 3;
    const srcEnd = fullSrc.indexOf(".");
    const shortSrc = fullSrc.substring(srcStart, srcEnd);

    let stackableStatus = (unstackables.includes(shortSrc)) ? 1 : 0;

    if(stackableStatus){
        let craftedItmSlot = findFreeSlot(inventory, null, stackableStatus);
        createElm(1, "img", "item", inventory.children[craftedItmSlot.index], `assets/${shortSrc}.svg`);
        createElm(1, "p", "amount", inventory.children[craftedItmSlot.index], null, null, amnt);
        if (activeSlot == craftedItmSlot.index) cursor.src = `assets/${shortSrc}.svg`;
    }else{
        let craftedItmSlot = findFreeSlot(inventory, fullSrc.replace("hl-", ""));
        if(inventory.children[craftedItmSlot.index].children.length < 1) {
            createElm(1, "img", "item", inventory.children[craftedItmSlot.index], `assets/${shortSrc}.svg`);
            createElm(1, "p", "amount", inventory.children[craftedItmSlot.index], null, null, amnt);
            if (activeSlot == craftedItmSlot.index) cursor.src = `assets/${shortSrc}.svg`;
        }
        else inventory.children[craftedItmSlot.index].children[1].innerText = parseInt(inventory.children[craftedItmSlot.index].children[1].innerText) + 1;
    }
}
function inventoryHandler(inv){
    // SET FIRST SLOT ACTIVE BY DEFAULT
    inv.children[0].classList.add("active");
    // CHANGE CURSOR TO HELD ITEM INITIALLY 
    if(inv.children[0].children.length != 0) { cursor.src = inv.children[0].children[0].getAttribute("src"); } else cursor.src = "assets/empty.svg";
    //
    window.addEventListener("keypress", function(e){
        activeSlotSelecter(e.key, inv);
        return e.key;
    });
    Array.from(inv.children).forEach(function(slot, i) {
        slot.addEventListener("mousedown", function(){
           activeSlotSelecter(i + 1, inv);
           return i + 1;
        })
    });
    return 0;
}
function activeSlotSelecter(active_slot, inv){
    if(!isNaN(active_slot) && active_slot <= inv.children.length && active_slot != 0){
        activeSlot = active_slot - 1;
        //
        inv.children[active_slot - 1].classList.add("active");
        for (let i = 0; i < inv.children.length; i++) {
            if(i == active_slot - 1) continue;
            inv.children[i].classList.remove("active");
        }
        // CHANGE CURSOR TO HELD ITEM
        if(inv.children[active_slot - 1].children.length != 0){
            cursor.src = inv.children[active_slot - 1].children[0].getAttribute("src");
        }else
            cursor.src = "assets/empty.svg";
    }
}
function recipeMenu(e, mouseX, mouseY){ 
    if(!cursor.getAttribute("src").includes("axe") || cursor.getAttribute("src").includes("pickaxe")){
        if(e.getAttribute("src") == 'assets/hl-workbench.svg'){
            recpeMnu.style.left = `${mouseX}px`;
            recpeMnu.style.top = `${mouseY}px`;
            recpeMnu.classList.add("active");
        }
        if (e.classList.contains("recipe")) {
            const infoTxtLines = infoTxt.innerText
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0);
    
            const requirements = infoTxtLines.map(line => {
                const mat = line.match(/[^\d]+/g)?.join('').trim();
                const amntArray = line.match(/\d+/g)?.map(Number) || [];
                const amnt = amntArray[0];
                return [mat, amnt];
            });
    
            const materialSlots = requirements.map(req => {
                return findFreeSlot(inventory, `assets/${req[0]}.svg`);
            });
    
            if (materialSlots.some(slot => !slot.found)) return;
    
            const allEnough = requirements.every((req, i) => {
                const slot = materialSlots[i];
                const currentAmount = parseInt(inventory.children[slot.index].children[1].innerText);
                return currentAmount >= req[1];
            });
    
            if (!allEnough) return;
    
            requirements.forEach((req, i) => {
                const slot = materialSlots[i];
                const currentAmount = parseInt(inventory.children[slot.index].children[1].innerText);
                const newAmount = currentAmount - req[1];
    
                if (newAmount > 0) {
                    inventory.children[slot.index].children[1].innerText = newAmount;
                } else {
                    inventory.children[slot.index].children[0].remove();
                    inventory.children[slot.index].children[0].remove();
                    cursor.src = "assets/empty.svg";
                }
            });
    
            // CRAFT THE ITEM
            collectItem(e, e.dataset.amnt)
        }
    
    }
    if(e == recpeMnuExitBtn){
        recpeMnu.classList.remove("active");
    }
}
function smelt(e){
    let iteration = 0;

    if(e.dataset.smelting == 2){
        e.style.transform = `rotate(${0}deg)`;
        e.dataset.smelting = 0;  
        iteration = 0;  
        
        collectItem(null, 1, "assets/hl-iron.svg")
    }

    if(inventory.children[activeSlot].children.length != 0 && e.getAttribute("src") == "assets/hl-furnace.svg" 
    && inventory.children[activeSlot].children[0].getAttribute("src") == "assets/raw-iron.svg" && e.dataset.smelting != 1){
        let currentAmnt = inventory.children[activeSlot].children[1].innerText;
        e.dataset.smelting = 1;    

        if(currentAmnt != 1){
            inventory.children[activeSlot].children[1].innerText = parseInt(currentAmnt) - 1; 
        }else{
            inventory.children[activeSlot].children[0].remove();
            inventory.children[activeSlot].children[0].remove();

            cursor.src = 'assets/empty.svg';
        }
        let destroyAnim;
        let last = performance.now();

        function step(now) {
            if (!destroyAnim) return;

            if (now - last >= 96) {
                last = now;

                iteration++;
                let rndmAngle;
                if (iteration % 2 == 0) rndmAngle = rndmNumb(-5, -7.5, true);
                else rndmAngle = rndmNumb(5, 7.5, true);

                e.style.transform = `rotate(${rndmAngle}deg)`;
            }
            destroyAnim = requestAnimationFrame(step);

            if(iteration == 10){
                cancelAnimationFrame(destroyAnim);      
                e.dataset.smelting = 2;
            }
        }
        destroyAnim = requestAnimationFrame(step);
    }
}