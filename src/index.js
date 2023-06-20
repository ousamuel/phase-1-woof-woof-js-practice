document.addEventListener("DOMContentLoaded", () => {
  console.log("test");
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const dogBtn = document.getElementById("good-dog-filter");
  // const goodDogs = document.createElement("div");

  function goodDog(data) {
    if (data.isGoodDog) {
      addDog(data);
    }
  }

  dogBtn.addEventListener("click", () => {
    toggleBtn();
  });

  function toggleBtn() {
    if (dogBtn.innerText == "Filter good dogs: OFF") {
      dogBtn.innerText = "Filter good dogs: ON";
      dogBar.innerHTML = "";
      //remove BAD DOGS
      fetch(`http://localhost:3000/pups`)
        .then((res) => res.json())
        .then((data) => {
          data.forEach((data) => goodDog(data));
        });
    } else if (dogBtn.innerText == "Filter good dogs: ON") {
      dogBtn.innerText = "Filter good dogs: OFF";
      dogBar.innerHTML = "";
      loadAllDogs();
    }
  }

  function addDog(data) {
    //dog creates the names at the top
    const dog = document.createElement("span");
    dog.innerHTML = data.name;
    // dog.className = "dog";
    dog.id = data.id;
    const img = document.createElement("img");
    const name = document.createElement("h2");
    const isGoodStatus = document.createElement("button");

    //clicking the names at the top will load the name img and good/bad in the center
    dog.addEventListener("click", () => {
      dogInfo.innerHTML = "";
      img.src = data.image;
      name.innerHTML = data.name;
      if (data.isGoodDog == true) {
        isGoodStatus.innerHTML = "Change to bad dog!";
      } else {
        isGoodStatus.innerHTML = "Change to good dog!";
      }
      dogInfo.append(img, name, isGoodStatus);
    });
    dogBar.append(dog);

    isGoodStatus.addEventListener("click", () => {
      const statusData = {
        isGoodDog: !data.isGoodDog,
      };

      const configObject = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(statusData),
      };

      fetch(`http://localhost:3000/pups/${dog.id}`, configObject);
      // .then((res) => res.json())
      // .then((data) => console.log(data.isGoodDog));

      if (isGoodStatus.innerText == "Change to good dog!") {
        isGoodStatus.innerText = "Change to bad dog!";
        if (dogBtn.innerHTML == "Filter good dogs: ON") {
          dogBar.append(dog);
        }
      } else if (isGoodStatus.innerText == "Change to bad dog!") {
        isGoodStatus.innerText = "Change to good dog!";
        if (dogBtn.innerHTML == "Filter good dogs: ON") {
          dogBar.removeChild(document.getElementById(dog.id));
        }
      }
    });
  }

  function loadAllDogs() {
    fetch(`http://localhost:3000/pups`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((data) => addDog(data));
      });
  }
  loadAllDogs();
});
