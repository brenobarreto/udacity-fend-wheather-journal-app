/* Global Variables */
let description, temp;
let userData = {};

/* Get HTML elements */
let descriptionElement = document.querySelector(".description");
let currenttempElement = document.querySelector(".currenttemp");
let mintempElement = document.querySelector(".mintemp");
let maxtempElement = document.querySelector(".maxtemp");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

//Definitions to assemble the Open Weather URL
const weatherApiKey = "e1e2a60343680eaf88e23b857ca8e869";
const weatherCountryCode = "us";

//Function to get data from Open Weather
const getWeatherData = () =>
  new Promise((resolve, reject) => {
    let zipInputValue = document.getElementById("zip").value;
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${zipInputValue},${weatherCountryCode}&units=metric&appid=`;

    fetch(weatherUrl + weatherApiKey).then((res) => {
      if (res.status != 200) {
        console.log("Looks like there's been a problem.");
        return reject();
      }
      res.json().then((data) => {
        descriptionElement.innerText =
          "Weather: " + data["weather"][0]["description"];
        currenttempElement.innerText =
          "Temperature: " + data["main"]["temp"] + " °C";
        userData.temp = data["main"]["temp"];
        mintempElement.innerText = "Min.: " + data["main"]["temp_min"] + " °C";
        maxtempElement.innerText = "Max.: " + data["main"]["temp_max"] + " °C";

        resolve();
      });
    });
  });

/* ------- */

const getProjectData = () =>
  new Promise((resolve, reject) => {
    let dateReturn = document.getElementById("date");
    let tempReturn = document.getElementById("temp");
    let contentReturn = document.getElementById("content");
    fetch("http://localhost:8080/getProjectData").then((res) => {
      if (res.status != 200) {
        console.log("Looks like there's been a problem.");
        return reject();
      }
      res.json().then((data) => {
        dateReturn.innerText = data[data.length - 2].date;
        tempReturn.innerText = data[data.length - 2].temp;
        contentReturn.innerText = data[data.length - 2].userResponse;

        resolve();
      });
    });
  });

/*---------- Get User Response ---------- */

function getUserResponse() {
  return document.getElementById("feelings").value;
}

/*---------- Post Data to the Server ---------- */

const postProjectData = async (userData) => {
  const rawResponse = await fetch("http://localhost:8080/addData", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const response = await rawResponse.json();
  return response;
};

/*---------- Generate Entry ---------- */

const btn = document.getElementById("generate");
btn.addEventListener("click", generate);

async function generate() {
  await getWeatherData();

  userData.date = newDate;
  userData.userResponse = getUserResponse();

  postProjectData(userData);

  await getProjectData();
}
