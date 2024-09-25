export function displayDialog(text, onDisplayEnd) {
    const dialogUI = document.getElementById("textbox-container");
    const dialogText = document.getElementById("dialogue");
    dialogUI.style.display = "block"; // display the dialog
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) { // add the next character to the current text
            currentText += text[index];
            dialogText.innerHTML = currentText; // set the dialog text
            index++;
            return;
        }
        clearInterval(intervalRef);  // clear the interval
    }, 1);

    //logic for onClose button
    const closeBtn = document.getElementById("close"); // get the close button
    function onCloseBtn() { // function to close the dialog
        onDisplayEnd();  // call the onDisplayEnd function
        dialogUI.style.display = "none"; // hide the dialog
        dialogText.innerHTML = ""; // clear the dialog text
        clearInterval(intervalRef);
        closeBtn.removeEventListener("click", onCloseBtn); // remove the event listener
    }
    closeBtn.addEventListener("click", onCloseBtn); // add an event listener to the close button


    addEventListener("keypress", (key) => { // add an event listener for the enter key
        if (key.code === "Enter") {
            closeBtn.click(); // simulate a click on the close button
        }
    });

}
export function setCamScale(k){    // set the camera scale based on the aspect ratio of the screen
    const resize_factor = k.width()/k.height();
    if (resize_factor < 1){  // if the aspect ratio is less than 1
        k.camScale(k.vec2(1)); // set the camera scale to 1
        return;
    }
    k.camScale(k.vec2(1.5)); // set the camera scale to 1.5
}


