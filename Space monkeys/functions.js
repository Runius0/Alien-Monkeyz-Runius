function createWorld(amnt, sprite_size, world_length){
    let currRow = 0;
    let currCol = 0;
    for (let i = 0; i < amnt; i++) {
        const tileParent = document.createElement("span");
        tileParent.dataset.index = i;
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
        world.appendChild(tileParent);
        tileParent.appendChild(tile);
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
let runningPaths = 0;
function addPath(row_size, height_size){
    runningPaths++;

    return new Promise(resolve => {
        let startTile = rndmNumb(2, row_size - 1);
        world.children[startTile].children[0].src = "assets/path.svg";
        
        let rndmPathHeight = rndmNumb(1, 3);
        let rndmPathWidth = rndmNumb(-row_size+2, row_size-2);

        let currPathHeight = -1;
        let currPathWidth = 0;

        let currTile;

        // ADD THE INITIAL PATH TILE VALUES
        path.push([startTile, "assets/path.svg"])

        const curveInterval = setInterval(() => {
            // ADD PATH INDEXES TO AN ARRAY
            if(currPathHeight != rndmPathHeight - 1){
                currPathHeight++;
                currTile = ((startTile + row_size) + row_size * currPathHeight);
		if(currPathHeight == rndmPathHeight - 1){
			world.children[currTile].children[0].src = "assets/path-c.svg";
                }else{
			world.children[currTile].children[0].src = "assets/path.svg";
		}
            }else if(currPathWidth != rndmPathWidth){
                currPathWidth+= Math.sign(rndmPathWidth);
                currTile = ((startTile + row_size) + row_size * currPathHeight) + currPathWidth;
		if (currTile % row_size == 0 && Math.sign(rndmPathWidth) == 1) {
			currPathHeight -= 1;
			rndmPathHeight -= 1;
		}else if (currTile % row_size == 1  && Math.sign(rndmPathWidth) == -1) {
			currPathHeight += 1;
			rndmPathHeight += 1;
		}		
		
                // ONE EXCEPTION WHEN THE PATH IS IN THE BOTTOM LEFT CORNER MAKE THE TILE VERTICAL
                if(currTile == (row_size * height_size) - row_size + 1 || currPathWidth == rndmPathWidth)
                    world.children[currTile].children[0].src = "assets/path-c.svg";
                else
                    world.children[currTile].children[0].src = "assets/path-r.svg";
            }
            if(currPathWidth == rndmPathWidth && currPathHeight == rndmPathHeight - 1){
                startTile = currTile;
                //
                currPathHeight = -1;
                rndmPathHeight =  rndmNumb(2, 5);
                currPathWidth = 0;
                rndmPathWidth = rndmNumb(-row_size+2, row_size-2);
            }		
            // ADD THE REST PATH TILE VALUES
            path.push([currTile, world.children[currTile].children[0].src]);

            // STOP CREATING THE PATH WHEN WE GO ONTO THE LAST ROW OF THE WORLD
            if(currTile >= (row_size * height_size) - row_size + 1){
                clearInterval(curveInterval);

                runningPaths--;

                resolve(); 
            } 
        }, 1);
    });
}
function generateStructures(amnt, source, struc_size){
    return new Promise(resolve => {
        let rndmTile;
        let counter = 0;
        const strucGenInterval = setInterval(() => {
            counter++;
            rndmTile = rndmNumb(1, world.children.length - 3);
            if(world.children[rndmTile].children[0].getAttribute("src") == "assets/path.svg" ||
            world.children[rndmTile].children[0].getAttribute("src") == "assets/path-r.svg" ||
            world.children[rndmTile].children[0].getAttribute("src") == "assets/path-c.svg")
            {       
                world.children[rndmTile].children[0].style.transform = `translateY(${0}px)`;
            }
            else if(world.children[rndmTile].children[0].nodeName.toLowerCase() == "img" && world.children[rndmTile].children[0].getAttribute("src") == "assets/ground.svg"){
                world.children[rndmTile].children[0].src = source;
                world.children[rndmTile].children[0].style.transform = `translateY(-${struc_size * 2}px)`;
            }
            if(counter == amnt){
                clearInterval(strucGenInterval);
                resolve();
            }
        }, 0);
    });
}
function cursorHandler(){
    let cursorX;
    let cursorY;

    window.addEventListener("mousedown", function(e){
        destroyStructures("axe", "hl-tree", e.target, 10, 27, 96);
        destroyStructures("stone-axe", "hl-tree", e.target, 10, 27, 60);
        destroyStructures("iron-axe", "hl-tree", e.target, 10, 27, 30);

        destroyStructures("pickaxe", "hl-big-rock", e.target, 10, 29, 96);
        destroyStructures("stone-pickaxe", "hl-big-rock", e.target, 10, 29, 60);
        destroyStructures("iron-pickaxe", "hl-big-rock", e.target, 10, 29, 30);
        
        destroyStructures("stone-pickaxe", "hl-iron-ore", e.target, 15, 21, 60);
        destroyStructures("iron-pickaxe", "hl-iron-ore", e.target, 15, 21, 30);
        
        destroyStructures("pickaxe", "hl-furnace", e.target, 1, 0, 96);
        destroyStructures("stone-pickaxe", "hl-furnace", e.target, 1, 0, 60);
        destroyStructures("iron-pickaxe", "hl-furnace", e.target, 1, 0, 30);
        
        destroyStructures("axe", "hl-workbench", e.target, 1, 0, 96);
        destroyStructures("stone-axe", "hl-workbench", e.target, 1, 0, 60);
        destroyStructures("iron-axe", "hl-workbench", e.target, 1, 0, 30);

        destroyStructures("stone-pickaxe", "hl-rotater", e.target, 1, 0, 60);
        destroyStructures("stone-pickaxe", "hl-mover", e.target, 1, 0, 60);
        destroyStructures("stone-pickaxe", "hl-delayer", e.target, 1, 0, 60);
        destroyStructures("stone-pickaxe", "hl-activator", e.target, 1, 0, 60);

        destroyStructures("iron-pickaxe", "hl-rotater", e.target, 1, 0, 30);
        destroyStructures("iron-pickaxe", "hl-mover", e.target, 1, 0, 30);
        destroyStructures("iron-pickaxe", "hl-delayer", e.target, 1, 0, 30);
        destroyStructures("iron-pickaxe", "hl-activator", e.target, 1, 0, 30);

        destroyStructures("stone-pickaxe", "hl-sunsaw-body", e.target, 1, 0, 60, 1);
        destroyStructures("stone-pickaxe", "hl-clawmachine-body", e.target, 1, 0, 60, 1);
        destroyStructures("stone-pickaxe", "hl-shooter-body", e.target, 1, 0, 60, 1);

        destroyStructures("iron-pickaxe", "hl-sunsaw-body", e.target, 1, 0, 30, 1);
        destroyStructures("iron-pickaxe", "hl-clawmachine-body", e.target, 1, 0, 30, 1);
        destroyStructures("iron-pickaxe", "hl-shooter-body", e.target, 1, 0, 30, 1);

        placeDownItems("log", e.target);
        placeDownItems("stone", e.target);
        placeDownItems("sapling", e.target);
        placeDownItems("raw-iron", e.target);
        placeDownItems("iron", e.target);

        placeDownItems("pickaxe", e.target)
        placeDownItems("axe", e.target)
        placeDownItems("stone-pickaxe", e.target);
        placeDownItems("stone-axe", e.target);
        placeDownItems("iron-pickaxe", e.target);
        placeDownItems("iron-axe", e.target);

        placeDownItems("gear", e.target);

        placeDownItems("rotater", e.target, 1);
        placeDownItems("mover", e.target, 1);
        placeDownItems("delayer", e.target, 1);
        placeDownItems("activator", e.target, 1);

        placeDownMachines("sunsaw-body", e.target);
        placeDownMachines("clawmachine-body", e.target);
        placeDownMachines("shooter-body", e.target);

        placeDownItems("workbench", e.target);
        placeDownItems("furnace", e.target);
        recipeMenu(e.target, cursorX, cursorY);
        
        pickUpItems("hl-log", e.target);
        pickUpItems("hl-stone", e.target);
        pickUpItems("hl-sapling", e.target);
        pickUpItems("hl-raw-iron", e.target);
        pickUpItems("hl-iron", e.target);

        pickUpItems("hl-gear", e.target);

        pickUpItems("hl-pickaxe", e.target)
        pickUpItems("hl-axe", e.target)
        pickUpItems("hl-stone-pickaxe", e.target);
        pickUpItems("hl-stone-axe", e.target);
        pickUpItems("hl-iron-pickaxe", e.target);
        pickUpItems("hl-iron-axe", e.target);
        
        smelt(e.target, "raw-iron", "iron");
        smelt(e.target, "axe", "log");
        smelt(e.target, "sapling", "log");
        upgradeMachines(e.target);
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
        outlineAdder("furnace", e.target, [["stone", 10], ["log", 5]]);

        outlineAdder("gear", e.target, [["iron", 5]]);

        outlineAdder("rotater", e.target, [["iron", 10]]);
        outlineAdder("ac-rotater", e.target, [["iron", 10]]);
        outlineAdder("mover", e.target, [["iron", 10]]);
        outlineAdder("ac-mover", e.target, [["iron", 10]]);
        outlineAdder("delayer", e.target, [["iron", 10]]);
        outlineAdder("ac-delayer", e.target, [["iron", 10]]);
        outlineAdder("activator", e.target, [["iron", 10]]);
        outlineAdder("ac-activator", e.target, [["iron", 10]]);

        outlineAdder("log", e.target, rndmNumb(1, 5));
        outlineAdder("stone", e.target, rndmNumb(1, 5));
        outlineAdder("raw-iron", e.target, rndmNumb(1, 5));
        outlineAdder("iron", e.target, rndmNumb(1, 10));

        outlineAdder("sunsaw-body", e.target, [["iron", 10]]);
        outlineAdder("ac-sunsaw-body", e.target, [["iron", 10]]);
        outlineAdder("clawmachine-body", e.target, [["iron", 10]]);
        outlineAdder("shooter-body", e.target, [["iron", 10]]);
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
	let infoText = struc + "\n";
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
            if(e.dataset.drop == undefined){
                if(e.dataset.destroyed === undefined) infoText += `Hp ${maxHp}`;
                else infoText += `Hp ${Math.abs(e.dataset.destroyed - maxHp)}`;
            } else {
                //e.dataset.drop = maxHp;
                //infoText += `Amnt ${maxHp}`;
            }
            if(e.dataset.drop > 0) infoText += `Amnt ${e.dataset.drop}`;
        }
        if(e.dataset.redrop){
            infoText += `Amnt ${e.dataset.redrop}`;
        }
        if(e.classList.contains("recipe")){
            for (let i = 0; i < maxHp.length; i++) 
                infoTxtVal += `${maxHp[i].toString().replace(",", " ")} \n`;

            infoText += infoTxtVal;
        }
        infoTxt.textContent = infoText;
        infoTxt.classList.add("active");
    }
}
function destroyStructures(tool, struc, e, maxHp, spriteSize, _speed, isMachine) {
    if(e.parentNode.parentNode == recpeMnu) return; 

    let destroyAnim;
    let iteration = 0;
    let last = performance.now();
    let speed = _speed;
    let drop = drops[struc];
    if (
        inventory.children[activeSlot].children.length != 0 && 
        inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${tool}.svg` &&
        e.getAttribute("src") == `assets/${struc}.svg`
    ) {
	if (drop) {
        	drop = (drop.length > 1) ? drop[rndmNumb(0, drop.length - 1)] : drop[0];
	}
	console.log(drop)
        if (e.destroyAnimRunning) return; 
        e.destroyAnimRunning = true; 

        function step(now) {
            if (!destroyAnim) return;

            if (now - last >= speed) {
                last = now;

                let currentHp = parseInt(e.dataset.destroyed || 0) + 1;
                if (currentHp > maxHp) currentHp = maxHp;
                e.dataset.destroyed = currentHp;

                if (currentHp >= maxHp) {
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
                    e.destroyAnimRunning = false;

                    if(drop) {
                        e.src = `assets/${drop[0]}.svg`;
                        e.dataset.drop = drop[1]
                        if(isMachine != undefined){
                            e.parentNode.children[1].remove();
                            delete e.dataset.redrop;
                        }
                    }  
                    else {
                        collectItem(e, 1);
                        // HIDE RECIPE MENU WHEN THE DESTROYED STRUC IS THE WORKBENCH
                        if(struc == "hl-workbench") {
                            recpeMnu.classList.remove("active")
                            delete e.dataset.redrop;
                        }
                        
                        e.dataset.destroyed = 0;
                        e.src = `assets/ground.svg`;
                        if(isMachine != undefined)
                            e.parentNode.children[1].remove();
                    }
                    
                    e.style.transform = "translateY(0)";
                    infoTxt.classList.remove("active");
                    return;
                }

                iteration++;
                if (currentHp != maxHp) {
                    let rndmAngle;
                    if (iteration % 2 == 0) rndmAngle = rndmNumb(-5, -7.5, true);
                    else rndmAngle = rndmNumb(5, 7.5, true);

                    e.style.transform = `translate(0, -${spriteSize * 2}px) rotate(${rndmAngle}deg)`;
                }

                infoTxt.textContent = `Hp ${Math.abs(currentHp - maxHp)}`;
            }

            destroyAnim = requestAnimationFrame(step);
        }

        destroyAnim = requestAnimationFrame(step);

        e.addEventListener("mouseup", () => {
            if(destroyAnim) cancelAnimationFrame(destroyAnim);
            destroyAnim = null;
            e.destroyAnimRunning = false;
        });
    }
}
function pickUpItems(itm, e){
    if(e.parentNode.parentNode == recpeMnu) return;

    if (e.getAttribute("src") == `assets/${itm}.svg`){
        infoTxt.classList.remove("active");
        let stackableStatus = (unstackables.includes(itm.slice(3))) ? false : true;
        let slot = findFreeSlot(inventory, `assets/${itm.slice(3)}.svg`, stackableStatus);
        
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
function placeDownItems(itm, e, isMachine){
    if(inventory.children[activeSlot].children[0] && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${itm}.svg` &&
    e.getAttribute("src") == "assets/ground.svg"){
        e.src = `assets/${itm}.svg`;

        if(!unstackables.includes(itm)){
            e.dataset.redrop = 1;
        }else{
            delete e.dataset.redrop;
            e.dataset.drop = inventory.children[activeSlot].children[1].innerText;
        }

        if(inventory.children[activeSlot].children[1].innerText != 1 && !unstackables.includes(itm))
            inventory.children[activeSlot].children[1].innerText = parseInt(inventory.children[activeSlot].children[1].innerText) - 1;
        else{
            inventory.children[activeSlot].children[0].remove();
            inventory.children[activeSlot].children[0].remove();
            cursor.src = "assets/empty.svg";
        }

        if(isMachine) machines.push(e);
    }
}
function placeDownMachines(struc, e){
    if(inventory.children[activeSlot].children[0] && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${struc}.svg` &&
    e.getAttribute("src") == "assets/ground.svg"){
        const machine = createElm(1, "span", 'machine', e.parentNode);
        const armR = createElm(1, "img", 'arm', machine, `assets/${struc.replace("body", "arm")}.svg`);
        const armL = createElm(1, "img", 'arm', machine, `assets/${struc.replace("body", "arm")}.svg`);
        const armU = createElm(1, "img", 'arm', machine, `assets/${struc.replace("body", "arm")}.svg`);
        const armD = createElm(1, "img", 'arm', machine, `assets/${struc.replace("body", "arm")}.svg`);
        
        machine.style.left = e.style.left;
        machine.style.top = e.style.top;

        let rndmSide = rndmNumb(0, 3);
        Array.from(machine.children).forEach(function(arm, i){
            arm.style.display = (i == rndmSide) ? "block" : "none";
        });
        //
        armR.classList.add("right");
        //
        armL.classList.add("left");
        //
        armU.classList.add("down");
        //
        armD.classList.add("up");
      
        if(inventory.children[activeSlot].children[1].innerText != 1)
            inventory.children[activeSlot].children[1].innerText = parseInt(inventory.children[activeSlot].children[1].innerText) - 1;
        else{
            inventory.children[activeSlot].children[0].remove();
            inventory.children[activeSlot].children[0].remove();
            cursor.src = "assets/empty.svg";
        }
        e.dataset.redrop = 1;
        e.src = `assets/${struc}.svg`;
        machines.push(e);
    }
}
function upgradeMachines(e){
    if(inventory.children[activeSlot].children.length != 0 && inventory.children[activeSlot].children[0].getAttribute("src") == "assets/gear.svg" && e.parentNode.children[1].classList.contains("machine")){
        const hiddenArms = Array.from(e.parentNode.children[1].children).filter(arm =>{ return arm.style.display === "none" });
        let rndmSide = rndmNumb(0, hiddenArms.length - 1);
        hiddenArms.forEach(function(arm, i){
            console.log(hiddenArms.length - 1);
            if(i == rndmSide)
            {
                arm.style.display = "block";
                return;
            }
        });
        
        if(hiddenArms.length - 1 > 0){
            if(inventory.children[activeSlot].children[1].innerText != 1)
                inventory.children[activeSlot].children[1].innerText = parseInt(inventory.children[activeSlot].children[1].innerText) - 1;
            else{
                inventory.children[activeSlot].children[0].remove();
                inventory.children[activeSlot].children[0].remove();
                cursor.src = "assets/empty.svg";
            }
        }
    }
}
function machinesAbility() {
    Array.from(machines).forEach(function (machine) {
        let position = Number(machine.parentNode.dataset.index) + 1;

       const isMachine = (el, machineSrc, machinesArr) => {
            const src = el.children[0].getAttribute("src");

            // no array: single machine
            if (!machinesArr) {
                if (
                    src === `assets/ac-${machineSrc}.svg` ||
                    src === `assets/hl-ac-${machineSrc}.svg`
                ) {
                    return src; // ✅ return the matched src
                }
                return null;
            }

            // array: multiple machine types
            const matched = machinesArr.find(type =>
                src === `assets/ac-${type}.svg` ||
                src === `assets/hl-ac-${type}.svg`
            );

            return matched ? src.replace("hl-", "") : null; // ✅ return src if any match, else null
        };
        if (machine.getAttribute("src") === "assets/mover.svg") {

            world.children[position].children[0].src = "assets/ac-mover.svg";

            function runMover() {
                // NORMAL TICK SPEED 
                let nextDelay = 500;

                const neighbors = [
                    position + 1,          
                    position - 1,          
                    position - worldLength,
                    position + worldLength 
                ];

                const hasDelayerNearby = neighbors.some(idx =>
                    world.children[idx] && isMachine(world.children[idx], "delayer")
                );

                if (hasDelayerNearby) nextDelay = 2000;

                setTimeout(() => {
                    const hasRotaterNearby =
                        (position % worldLength !== 0 && isMachine(world.children[position + 1], "rotater")) ||
                        (position % worldLength - 1 !== 0 && isMachine(world.children[position - 1], "rotater")) ||
                        (position >= worldLength && isMachine(world.children[position - worldLength], "rotater")) ||
                        (position - 1 <= (worldLength * worldHeight) - worldLength && isMachine(world.children[position + worldLength], "rotater"));

                    if (hasRotaterNearby) {
                        if (!world.children[position].children[0].dataset.rot || world.children[position].children[0].dataset.rot == 4)
                            world.children[position].children[0].dataset.rot = 0;

                        world.children[position].children[0].dataset.rot =
                            Number(world.children[position].children[0].dataset.rot) + 1;
                        world.children[position].children[0].style.transform =
                            `rotate(-${Number(world.children[position].children[0].dataset.rot) * 90}deg)`;
                    }

                    // PUSHABLE MACHINES
                    if (isMachine(world.children[position + 1], "", pushableMachines) && (position + 1) % worldLength != 0 && world.children[position + 2].children[0].getAttribute("src") == "assets/ground.svg" &&
                    world.children[position].children[0].dataset.rot == undefined || world.children[position].children[0].dataset.rot == "4") {
                        if(isMachine(world.children[position + 1], "", pushableMachines) != null) {
                            if(world.children[position + 1].children.length == 1){
                                world.children[position + 2].children[0].src = isMachine(world.children[position + 1], "", pushableMachines);
        
                                world.children[position + 1].children[0].src = "assets/ground.svg";
                                delete world.children[position + 1].children[0].dataset.redrop;
                                
                                world.children[position + 2].children[0].dataset.redrop = 1;
                            }else{
                                //
                                setTimeout(() => {
                                    world.children[position + 2].appendChild(world.children[position + 1].children[1]);

                                    world.children[position + 2].children[1].style.left = world.children[position + 2].children[0].style.left;
                                    world.children[position + 2].children[1].style.top = world.children[position + 2].children[0].style.top; 
                                }, nextDelay);
                            }
                        }
                    }
                    if (isMachine(world.children[position - 1], "", pushableMachines) && (position - 2) % worldLength != 0 && world.children[position - 2].children[0].getAttribute("src") == "assets/ground.svg" &&
                    world.children[position].children[0].dataset.rot == "2") {
                        if(isMachine(world.children[position - 1], "", pushableMachines) != null) {
                            if(world.children[position - 1].children.length == 1){
                                world.children[position - 2].children[0].src = isMachine(world.children[position - 1], "", pushableMachines);
        
                                world.children[position - 1].children[0].src = "assets/ground.svg";
                                delete world.children[position - 1].children[0].dataset.redrop;
        
                                world.children[position - 2].children[0].dataset.redrop = 1;
                            }else{
                                //
                                setTimeout(() => {
                                    world.children[position - 2].appendChild(world.children[position - 1].children[1]);

                                    world.children[position - 2].children[1].style.left = world.children[position - 2].children[0].style.left;
                                    world.children[position - 2].children[1].style.top = world.children[position - 2].children[0].style.top;
                                }, nextDelay);
                            }
                        }
                    }
                    if (isMachine(world.children[position - worldLength], "", pushableMachines) && position - worldLength >= worldLength && world.children[position - (worldLength * 2)].children[0].getAttribute("src") == "assets/ground.svg" &&
                    world.children[position].children[0].dataset.rot == "1") 
                    {
                        if(isMachine(world.children[position - worldLength], "", pushableMachines) != null) {
                            if(world.children[position - worldLength].children.length == 1){
                                world.children[position - (worldLength * 2)].children[0].src = isMachine(world.children[position  - worldLength], "", pushableMachines);
                                
                                world.children[position - worldLength].children[0].src = "assets/ground.svg";
                                delete world.children[position - worldLength].children[0].dataset.redrop;
    
                                world.children[position - (worldLength * 2)].children[0].dataset.redrop = 1;
                            }else{
                                //
                                setTimeout(() => {
                                    world.children[position - (worldLength * 2)].appendChild(world.children[position - worldLength].children[1]);

                                    world.children[position - (worldLength * 2)].children[1].style.left = world.children[position - (worldLength * 2)].children[0].style.left;
                                    world.children[position - (worldLength * 2)].children[1].style.top = world.children[position - (worldLength * 2)].children[0].style.top;
                                }, nextDelay);                                
                            }
                        }
                    }
                    if (isMachine(world.children[position + worldLength], "", pushableMachines) && position + worldLength <= (worldLength * worldHeight) - worldLength && world.children[position + (worldLength * 2)].children[0].getAttribute("src") == "assets/ground.svg" &&
                    world.children[position].children[0].dataset.rot == "3") 
                    {
                        if(isMachine(world.children[position + worldLength], "", pushableMachines) != null) {
                            if(world.children[position + worldLength].children.length == 1){
                                world.children[position + (worldLength * 2)].children[0].src = isMachine(world.children[position + worldLength], "", pushableMachines);
                                
                                world.children[position + worldLength].children[0].src = "assets/ground.svg";
                                delete world.children[position + worldLength].children[0].dataset.redrop;

                                world.children[position + (worldLength * 2)].children[0].dataset.redrop = 1;
                            }else{
                                //
                                setTimeout(() => {
                                    world.children[position + (worldLength * 2)].appendChild(world.children[position + worldLength].children[1]);

                                    world.children[position + (worldLength * 2)].children[1].style.left = world.children[position + (worldLength * 2)].children[0].style.left;
                                    world.children[position + (worldLength * 2)].children[1].style.top = world.children[position + (worldLength * 2)].children[0].style.top;
                                }, nextDelay); 
                            }
                        }
                    }
                    //

                    switch (world.children[position].children[0].dataset.rot) {
                        case undefined:
                            if (position % worldLength != 0 &&
                                world.children[position + 1].children[0].getAttribute("src") == "assets/ground.svg") {
                                position++;
                                world.children[position - 1].children[0].src = "assets/ground.svg";
                                delete world.children[position - 1].children[0].dataset.redrop;

                                world.children[position].children[0].src = "assets/ac-mover.svg";
                                world.children[position].children[0].dataset.redrop = 1;
                            }
                            break;

                        case "2":
                            if (position % worldLength - 1 != 0 &&
                                world.children[position - 1].children[0].getAttribute("src") == "assets/ground.svg") {
                                position--;
                                world.children[position + 1].children[0].src = "assets/ground.svg";
                                delete world.children[position + 1].children[0].dataset.redrop;

                                world.children[position].children[0].dataset.rot =
                                    world.children[position + 1].children[0].dataset.rot;
                                world.children[position].children[0].style.transform =
                                    `rotate(-${Number(world.children[position].children[0].dataset.rot) * 90}deg)`;
                                delete world.children[position + 1].children[0].dataset.rot;
                                world.children[position + 1].children[0].style.transform = `rotate(0)`;

                                world.children[position].children[0].src = "assets/ac-mover.svg";
                                world.children[position].children[0].dataset.redrop = 1;
                            }
                            break;

                        case "1":
                            if (position >= worldLength &&
                                world.children[position - worldLength].children[0].getAttribute("src") == "assets/ground.svg") {
                                position -= worldLength;
                                world.children[position + worldLength].children[0].src = "assets/ground.svg";
                                delete world.children[position + worldLength].children[0].dataset.redrop;

                                world.children[position].children[0].dataset.rot =
                                    world.children[position + worldLength].children[0].dataset.rot;
                                world.children[position].children[0].style.transform =
                                    `rotate(-${Number(world.children[position].children[0].dataset.rot) * 90}deg)`;
                                delete world.children[position + worldLength].children[0].dataset.rot;
                                world.children[position + worldLength].children[0].style.transform = `rotate(0)`;

                                world.children[position].children[0].src = "assets/ac-mover.svg";
                                world.children[position].children[0].dataset.redrop = 1;
                            }
                            break;

                        case "4":
                            if (position % worldLength != 0 &&
                                world.children[position + 1].children[0].getAttribute("src") == "assets/ground.svg") {
                                position++;
                                world.children[position - 1].children[0].src = "assets/ground.svg";
                                delete world.children[position - 1].children[0].dataset.redrop;

                                world.children[position].children[0].dataset.rot =
                                    world.children[position - 1].children[0].dataset.rot;
                                world.children[position].children[0].style.transform =
                                    `rotate(-${Number(world.children[position].children[0].dataset.rot) * 90}deg)`;
                                delete world.children[position - 1].children[0].dataset.rot;
                                world.children[position - 1].children[0].style.transform = `rotate(0)`;

                                world.children[position].children[0].src = "assets/ac-mover.svg";
                                world.children[position].children[0].dataset.redrop = 1;
                            }
                            break;

                        case "3":
                            if (position - 1 <= (worldLength * worldHeight) - worldLength &&
                                world.children[position + worldLength].children[0].getAttribute("src") == "assets/ground.svg") {
                                position += worldLength;
                                world.children[position - worldLength].children[0].src = "assets/ground.svg";
                                delete world.children[position - worldLength].children[0].dataset.redrop;

                                world.children[position].children[0].dataset.rot =
                                    world.children[position - worldLength].children[0].dataset.rot;
                                world.children[position].children[0].style.transform =
                                    `rotate(-${Number(world.children[position].children[0].dataset.rot) * 90}deg)`;
                                delete world.children[position - worldLength].children[0].dataset.rot;
                                world.children[position - worldLength].children[0].style.transform = `rotate(0)`;

                                world.children[position].children[0].src = "assets/ac-mover.svg";
                                world.children[position].children[0].dataset.redrop = 1;
                            }
                            break;
                    }

                runMover();
                }, nextDelay);
            }

            runMover();
        }

        if (machine.getAttribute("src") === "assets/rotater.svg") {
            world.children[position].children[0].src = "assets/ac-rotater.svg";
        }
        if (machine.getAttribute("src") === "assets/delayer.svg") {
            world.children[position].children[0].src = "assets/ac-delayer.svg";
        }
        if (machine.getAttribute("src") === "assets/activator.svg") {
            world.children[position].children[0].src = "assets/ac-activator.svg";
        }
        if (machine.getAttribute("src") === "assets/sunsaw-body.svg") {
            world.children[position].children[0].src = "assets/ac-sunsaw-body.svg";
        }
    });
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
        else inventory.children[craftedItmSlot.index].children[1].innerText = parseInt(inventory.children[craftedItmSlot.index].children[1].innerText) + parseInt(amnt);
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
    if(!isNaN(active_slot) && active_slot <= inv.children.length){
        if(active_slot != 0)
            activeSlot = active_slot - 1;
        else
            activeSlot = inv.children.length - 1;

        //
        inv.children[activeSlot].classList.add("active");
        for (let i = 0; i < inv.children.length; i++) {
            if(i == activeSlot) continue;
            inv.children[i].classList.remove("active");
        }
        // CHANGE CURSOR TO HELD ITEM
        if(inv.children[activeSlot].children.length != 0){
            cursor.src = inv.children[activeSlot].children[0].getAttribute("src");
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

let destroyAnim;
function smelt(e, input, output){
    let iteration = 0;

    if(e.dataset.smelting == 2){
        e.style.transform = `rotate(${0}deg)`;
        e.dataset.smelting = 0;  
        iteration = 0;  
        
        collectItem(null, e.dataset.output_amnt, `assets/hl-${e.dataset.output}.svg`)

        delete e.dataset.input;
        delete e.dataset.output;
        delete e.dataset.output_amnt;
    }
    if(inventory.children[activeSlot].children.length != 0 && e.getAttribute("src") == "assets/hl-furnace.svg" && inventory.children[activeSlot].children[0].getAttribute("src").includes("pickaxe") 
    && e.dataset.smelting == 1){
        if (destroyAnim) cancelAnimationFrame(destroyAnim);

        e.style.transform = `rotate(${0}deg)`;
        e.dataset.smelting = 0;
        iteration = 0;

        collectItem(null, e.dataset.output_amnt, `assets/hl-${e.dataset.input}.svg`)

        delete e.dataset.input;
        delete e.dataset.output;
        delete e.dataset.output_amnt;
    }
    if(inventory.children[activeSlot].children.length != 0 && e.getAttribute("src") == "assets/hl-furnace.svg" 
    && inventory.children[activeSlot].children[0].getAttribute("src") == `assets/${input}.svg` && e.dataset.smelting != 1){
        let currentAmnt = inventory.children[activeSlot].children[1].innerText;
        e.dataset.smelting = 1;   
        e.dataset.input = input; 
        e.dataset.output = output; 

        if(!unstackables.includes(input)){
            e.dataset.output_amnt = 1; 
            if(currentAmnt != 1) inventory.children[activeSlot].children[1].innerText = parseInt(currentAmnt) - 1; 
            else{
                inventory.children[activeSlot].children[0].remove();
                inventory.children[activeSlot].children[0].remove();
    
                cursor.src = 'assets/empty.svg';
            }
        }
        if(unstackables.includes(input)){
            e.dataset.output_amnt = currentAmnt;

            inventory.children[activeSlot].children[0].remove();
            inventory.children[activeSlot].children[0].remove();
    
            cursor.src = 'assets/empty.svg';
        }

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
function startWave(startBtn){
    startBtn.addEventListener("click", function(){
        startBtn.classList.remove("active");

        machinesAbility();
    });
}