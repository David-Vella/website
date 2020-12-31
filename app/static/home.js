document.getElementById("copy-email").addEventListener("click", function() {
    let input = document.createElement("input");
    
    input.value = "davella@umich.edu";
    document.body.appendChild(input);
    input.select();

    let success;

    try {
        document.execCommand("copy");
        success = true;
    } catch (Error) {
        console.log("Failed to copy email address");
        success = false;
    }
    document.body.removeChild(input);

    if (success) {
        document.querySelector("#copy-email div").innerHTML = "Copied !";
        document.querySelector("#copy-email img").style.display = "none";
        setTimeout(function() {
            document.querySelector("#copy-email div").innerHTML = "Email";
            document.querySelector("#copy-email img").style.display = "flex";
        }, 3000);
    }
});

let timeout;

function show_skill(text) {
    clearTimeout(timeout);
    let title = document.getElementById("interests-title");
    title.innerHTML = text;
    timeout = setTimeout(function() {
        title.innerHTML = "My Skills";
    }, 1000);
}
