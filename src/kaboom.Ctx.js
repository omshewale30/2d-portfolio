import kaboom from "kaboom";

export const k = kaboom({ // initialize kaboom
    global:false,
    touchToMouse:true,
    canvas:document.getElementById("game"),
});