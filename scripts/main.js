const myImage = document.querySelector("img");

myImage.onclick = () => {
    const mySrc = myImage.getAttribute("src");
    if (mySrc === "images/cloud-256x256.jpg") {
        myImage.setAttribute("src", "images/dinosaur-256x256.jpg");
    } else {
        myImage.setAttribute("src", "images/cloud-256x256.jpg");
    }
};

let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

function setUserName() {
    const myName = prompt("告诉我你叫什么");
    if (!myName) {
        setUserName();
    } else {
        localStorage.setItem("name", myName);
        myHeading.textContent = `欢迎, ${myName}`;
    }
}

if (!localStorage.getItem("name")) {
    setUserName();
} else {
    const storedName = localStorage.getItem("name");
    myHeading.textContent = `欢迎, ${storedName}`;
}

myButton.onclick = function () {
    setUserName();
};