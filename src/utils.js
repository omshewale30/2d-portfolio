export function displayDialog(text, onDisplayEnd) {
    const dialogUI = document.getElementById("textbox-container");
    const dialogText = document.getElementById("dialogue");
    dialogUI.style.display = "block"; // display the dialog
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index];
            dialogText.innerHTML = currentText;
            index++;
            return;
        }
        clearInterval(intervalRef);
    }, 1);

    //logic for onClose button
    const closeBtn = document.getElementById("close");
    function onCloseBtn() {
        onDisplayEnd();
        dialogUI.style.display = "none";
        dialogText.innerHTML = "";
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtn);
    }
    closeBtn.addEventListener("click", onCloseBtn);


    addEventListener("keypress", (key) => {
        if (key.code === "Enter") {
            closeBtn.click();
        }
    });

}
export function setCamScale(k){    // set the camera scale based on the aspect ratio of the screen
    const resize_factor = k.width()/k.height();
    if (resize_factor < 1){
        k.camScale(k.vec2(1));
        return;
    }
    k.camScale(k.vec2(1.5));
}


