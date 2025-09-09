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
function createElm(amnt, type, clas, parent, source, id_, txt){
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

            startWave(10);

            strucGenFunc(100, "assets/tree.svg", 27);
            strucGenFunc(25, "assets/small-rock.svg", 29);
            strucGenFunc(10, "assets/big-rock.svg", 29);
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
        destoryStructures("axe", "hl-tree", e.target, 10, 27, "log");
        destoryStructures("pickaxe", "hl-small-rock", e.target, 10, 29, "stone");
        destoryStructures("pickaxe", "hl-big-rock", e.target, 10, 29, "stone");

        placeDownItems("log", e.target);
        placeDownItems("stone", e.target);
        
        pickUpItems("hl-log", e.target);
        pickUpItems("hl-stone", e.target);
    });    
 
    window.addEventListener("mousemove", function(e){
        cursorX = e.clientX; cursorY = e.clientY;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        outlineAdder("tree", e.target, 10);
        outlineAdder("small-rock", e.target, 10);
        outlineAdder("big-rock", e.target, 10);

        outlineAdder("log", e.target, rndmNumb(1, 5));
        outlineAdder("stone", e.target, rndmNumb(1, 5));

        outlineAdder("enemy", e.target, parseInt(e.target.dataset.amount))
    });
}
function outlineAdder(struc, e, maxHp){
    if(e.parentNode.parentNode == inventory) return; 

    const baseSrc = `assets/${struc}.svg`;
    const hlSrc = `assets/hl-${struc}.svg`;
    const src = e.getAttribute("src");

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
        if(!e.dataset.redrop){
            if(e.dataset.drop != 0){
                if(e.dataset.destroyed === undefined) infoTxt.textContent = `Hp ${maxHp}`;
                else infoTxt.textContent = `Hp ${Math.abs(e.dataset.destroyed - maxHp)}`;
            } else {
                e.dataset.drop = maxHp;
                infoTxt.textContent = `Amnt ${maxHp}`;
            }
            if(e.dataset.drop > 0) infoTxt.textContent = `Amnt ${e.dataset.drop}`;
        }else{
            infoTxt.textContent = `Amnt ${e.dataset.redrop}`;
        }
        //
        if(e.dataset.amount != 0){
            if(e.dataset.amount === undefined) infoTxt.textContent = `Hp ${maxHp}`;
            else infoTxt.textContent = `Hp ${Math.abs(e.dataset.drop - maxHp)}`;
        } else {
            e.dataset.amount = maxHp;
            infoTxt.textContent = `Amnt ${maxHp}`;
        }
        if(e.dataset.amount > 0) infoTxt.textContent = `Amnt ${e.dataset.amount}`;
        //
        infoTxt.classList.add("active");
    }
}
function destoryStructures(tool, struc, e, maxHp, spriteSize, drop) {
    let destroyAnim;
    let iteration = 0;
    let last = performance.now();
    let speed = 96;

    if (
        inventory.children[activeSlot].children.length != 0 && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${tool}.svg` &&
        e.getAttribute("src") == `assets/${struc}.svg`) {
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
                        else e.src = `assets/ground.svg`;

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
function crafting(e){
    
}
function findFreeSlot(inventory, targetSrc) {
    const slots = Array.from(inventory.children);

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
function inventoryHandler(inv){
    // CREATING ITEMS ON STARTUP
    createElm(1, "img", "item", inv.children[0], "assets/axe.svg");
    createElm(1, "p", "amount", inv.children[0], null, null, "10");
    //
    createElm(1, "img", "item", inv.children[1], "assets/pickaxe.svg");
    createElm(1, "p", "amount", inv.children[1], null, null, "10");
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
        slot.addEventListener("click", function(){
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
function enemySpawner(enemyIndex){
    let indx = -1;
    //
    enemyPositions[enemyIndex] = null;
    //
    const enemySpawnInterval = setInterval(() => {
        indx++;
        if(indx + 1 <= path.length){
            world.children[path[indx][0]].src = "assets/enemy.svg";   
            //
            enemyPositions[enemyIndex] = path[indx][0];
            world.children[path[indx][0]].dataset.amount = enemyPositions.filter(num => num === path[indx][0]).length;
        }
        else{
            enemyPositions[enemyIndex] = null;      
            let lastCount = enemyPositions.filter(num => num === path[indx - 1][0]).length;
            world.children[path[indx - 1][0]].dataset.amount = lastCount;

            if (lastCount) {
                world.children[path[indx - 1][0]].src = path[indx - 1][1];
            }

            clearInterval(enemySpawnInterval); // ENEMY REACHES THE FINAL TILE
        }

        // GET RID OF THE PREVIOUS TILE
        if(indx != 0){
            const prevTileIndex = path[indx - 1][0];

            let prevCount = enemyPositions.filter(num => num === prevTileIndex).length;
            world.children[prevTileIndex].dataset.amount = prevCount;

            if (prevCount == 0) {
                world.children[prevTileIndex].src = path[indx - 1][1];
            }
        }
        //
    }, rndmNumb(750, 750));   
}
function startWave(enmyAmnt){
    for (let i = 0; i < enmyAmnt; i++) {
        enemySpawner(i);
    }
}