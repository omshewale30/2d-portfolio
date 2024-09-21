import {k} from "./kaboom.Ctx.js";
import {scale_factor,dialogueData} from "./constant.js";
import {displayDialog, setCamScale} from "./utils.js";

k.loadSprite("spritesheet", "public/spritesheet.png", {
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

k.loadSprite("map", "public/map.png");
k.setBackground(k.Color.fromHex("#311047"));

k.scene("main", async () => {
    const mapData = await (await fetch("public/map.json")).json()
    const layers = mapData.layers;

    const map = k.add([
        k.sprite("map"),
        k.pos(0),
        k.scale(scale_factor),
    ])

    const player = k.make([
        k.sprite("spritesheet", {anim: "idle-down"}),
        k.area({
            shape : new k.Rect(k.vec2(0,3),10,10)
        }),
        k.body(),
        k.anchor("center"),
        k.pos(),
        k.scale(scale_factor),
        {
           speed: 250,
           direction: "down",
           isInDialog: false,
        },
        "player",
    ]);

    for (const layer of layers) {
        if (layer.name === "boundaries") {
            for (const boundary of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                    }),
                    k.body({isStatic: true}),
                    k.pos(boundary.x, boundary.y),
                    boundary.name,
                ]);
                if (boundary.name){
                    player.onCollide(boundary.name,() =>{
                        player.isInDialogue = true;
                        displayDialog(dialogueData[boundary.name], ()=> player.isInDialogue = false)
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
    k.onResize(() => {
        setCamScale(k);
    });

    k.onUpdate(() => {
        k.camPos(player.pos.x, player.pos.y+100);
    });

    k.onMouseDown((mouseBtn) => {
        if (mouseBtn!=="left" ||  player.isInDialogue) return;
        const worldMouse = k.toWorld(k.mousePos());
        player.moveTo(worldMouse, player.speed);
        const mouseAngle = player.pos.angle(worldMouse);
        const lowerBound = 50;
        const upperBound = 125;
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
    });

    k.onMouseRelease(() => {
        if (player.direction === "down") player.play("idle-down");
        if(player.direction==="up") player.play("idle-up");
        if (player.direction === "right") player.play("idle-side");
        if (player.direction === "left") player.play("idle-side");
    });
});

k.go("main")
