import {k} from "./kaboom.Ctx.js";
import {scale_factor,dialogueData} from "./constant.js";
import {displayDialog, setCamScale} from "./utils.js";

k.loadSprite("spritesheet", "spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "idle-side": 975,
        "idle-up": 1014,
        "walk-down": {from: 936, to: 939,loop: true, speed: 8},
        "walk-side": {from: 975, to: 978,loop: true, speed: 8},
        "walk-up": {from: 1014, to: 1017,loop: true, speed: 8},
    }
});

k.loadSprite("map", "map.png");
k.setBackground(k.Color.fromHex("#654520"));

k.loadSound("bg", "Blues.mp3");

k.scene("main", async () => {
    const mapData = await (await fetch("map.json")).json() // load the map data
    const layers = mapData.layers; // get the layers from the map data
    const map = k.add([ // add the map to the scene
        k.sprite("map"),
        k.pos(0),
        k.scale(scale_factor),
    ])
    const music = k.play("bg", {
        volume: 0.8,
        loop: true
    })
    music.play();




    const player = k.make([   // create the player
        k.sprite("spritesheet", {anim: "idle-down"}), // set the sprite to the idle-down animation
        k.area({ // add an area component to the player
            shape : new k.Rect(k.vec2(0,3),10,10) // set the shape of the area component
        }),
        k.body(), // add a body component to the player
        k.anchor("center"), // set the anchor of the player to the center
        k.pos(),
        k.scale(scale_factor),
        {
           speed: 150,
           direction: "down",
           isInDialog: false,
        },
        "player",
    ]);

    for (const layer of layers) {  // loop through the layers
        if (layer.name === "boundaries") {  // if the layer is the boundaries layer
            for (const boundary of layer.objects) { // loop through the objects in the layer
                map.add([  // add the boundary to the map
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),  // set the shape of the area component
                    }),
                    k.body({isStatic: true}),  // add a static body component to the boundary
                    k.pos(boundary.x, boundary.y),  // set the position of the boundary
                    boundary.name,
                ]);
                if (boundary.name){ // if the boundary has a name
                    player.onCollide(boundary.name,() =>{ // add a collision event to the player
                        player.isInDialogue = true; // set the player's isInDialogue property to true
                        displayDialog(dialogueData[boundary.name], ()=> player.isInDialogue = false) // display the dialogue
                    });
                }
            }
            continue;

        }
        if (layer.name === "spawnpoints") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = k.vec2(
                        ( map.pos.x+ entity.x) *scale_factor,
                        ( map.pos.y+ entity.y) *scale_factor
                    );
                    k.add(player);
                    continue;
                }
            }
        }
    }

    setCamScale(k);
    k.onResize(() => { // add an event listener for the resize event
        setCamScale(k);
    });

    k.onUpdate(() => { // add an update event
        k.camPos(player.pos.x, player.pos.y+100);
    });

    k.onMouseDown((mouseBtn) => {  // add an event listener for the mouse down event
        if (mouseBtn!=="left" ||  player.isInDialogue) return; // if the mouse button is not the left button or the player is in dialogue, return
        const worldMouse = k.toWorld(k.mousePos()); // get the world position of the mouse
        player.moveTo(worldMouse, player.speed);  // move the player to the mouse position
        const mouseAngle = player.pos.angle(worldMouse);  // get the angle between the player and the mouse
        const lowerBound = 50;
        const upperBound = 125;

        // set the player's animation based on the angle between the player and the mouse
        if (mouseAngle <-lowerBound && mouseAngle > -upperBound && player.curAnim() !== "walk-down") {
            player.play("walk-down");
            player.direction = "down";
            return;
        }
        if (Math.abs(mouseAngle) > upperBound) {
            player.flipX=false;
            if (player.curAnim()!=="walk-side") player.play("walk-side");
            player.direction = "right";
            return;
        }
        if (Math.abs(mouseAngle)<lowerBound){
            player.flipX =true;
            if (player.curAnim()!=="walk-side") player.play("walk-side");
            player.direction='left';
            return;
        }
        else {
            if (player.curAnim() !== "walk-up") player.play("walk-up");
            player.direction = "up";
        }
    });

    // add an event listener for the mouse release event
    k.onMouseRelease(() => {
        if (player.direction === "down") player.play("idle-down");
        if(player.direction==="up") player.play("idle-up");
        if (player.direction === "right") player.play("idle-side");
        if (player.direction === "left") player.play("idle-side");
    });
});

k.go("main") // start the main scene
