//Define all variables to be used:
var weather = JSON.parse(localStorage.getItem("weather")) || [];
var cityCodes = JSON.parse(localStorage.getItem("cityCodes")) || [];
var button;
var currentDay;
var buttonClickData;
var now = moment();
//Define the variable for the entire form - use the ID from the form itself to select it. 
var searchForm = document.querySelector('#form');
var clear = document.querySelector("#clear");

//Use the moment function to create the current day:
currentDay = now.format("(MMM DD, YYYY)");
//Hide City data on start:
document.querySelector("#featuredCity").style.display = "none";
//Create the list items to the page for the current weather. 
//Want these outsise the function so they aren't added multiple times and instead the ext content is just replaced.

    var ulElement = document.querySelector("#weather_list");

    var tempLI = document.createElement("li");
    tempLI.setAttribute("id", "tempListItem");

    var humidLI = document.createElement("li");
    humidLI.setAttribute("id", "humidListItem");

    var windLI = document.createElement("li");
    windLI.setAttribute("id", "windListItem");

    var uviLI = document.createElement("li");
    uviLI.setAttribute("id", "uviListItem");

    var uviDIV = document.createElement("div");
    uviDIV.setAttribute("id", "uviDIV");

    //Create and append the five day forecast cards to the page:
    var fiveDayContainer = document.querySelector("#five_day_container");

    for(i=0; i < 5; i++){
        var card_i = document.createElement("div");
        card_i.setAttribute("id", "card"+i);
        card_i.setAttribute("class", "five_day_cards");
        fiveDayContainer.appendChild(card_i);

        var date_i = document.createElement("div");
        date_i.setAttribute("id", "date"+i);
        date_i.setAttribute("class", "todays_date");
        card_i.appendChild(date_i);

        var emoji_i = document.createElement("img");
        emoji_i.setAttribute("id", "emo"+i);
        emoji_i.setAttribute("class", "emoji");
        card_i.appendChild(emoji_i);

        var temp_i = document.createElement("div");
        temp_i.setAttribute("id", "t"+i);
        // console.log("ID");
        // console.log(temp_i);
        temp_i.setAttribute("class", "temp");
        card_i.appendChild(temp_i);

        var hum_i = document.createElement("div");
        hum_i.setAttribute("id", "humi"+i);
        hum_i.setAttribute("class", "humidity");
        card_i.appendChild(hum_i);
    }



//Create the function that will run on search button click:
function searchSubmit(event) {
  event.preventDefault();
  document.querySelector("#featuredCity").style.display = "block";

  var searchInput = document.querySelector('#searchBar').value;
  //Use geocoding API to convert city name into coordinates:
  var geocodeapiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + '&appid=4e9dab74dadddaa9b893280c60fbd5eb';

  fetch(geocodeapiURL).then(function(response){
      if(response.ok){
          response.json().then(function(geocode){
              console.log(geocode);
              //Push the needed data to an array:
              cityCodes.push({city: geocode[0].name, latitude: geocode[0].lat, longitude: geocode[0].lon});

              //Set array into local storage:
               window.localStorage.setItem("cityCodes", JSON.stringify(cityCodes));

               //Set the longitude and latitude variables and then call the weather function:
               var lat = geocode[0].lat;
               var long = geocode[0].lon;
               getCurrentWeather(searchInput, lat, long);
          });
      }
  });

  

  if(searchInput){
    //Set search bar back to default:
    document.querySelector('#searchBar').value = '';

    // Create the button function
    createButton(searchInput);
  }
};

//Create the current weather funtion for the API call:
var getCurrentWeather = function(searchInput, lat, long){
    //passing in city, which will be the user input when this function is called in the search submit function.
    //Parameters are the long and lat from geocode API, excluded data, units = imperial, and the individual API key code.
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat+ '&lon=' + long + '&exclude=minutely,hourly,alerts&units=imperial&appid=4e9dab74dadddaa9b893280c60fbd5eb';

    fetch(apiURL).then(function(response){ //fetching the API with a promise.
       if(response.ok){
           response.json().then(function(data){ //Response promise was okay, so running the display function for current weather. 
               //displayCurrentWeather(data, city);
            //    console.log("API CALL WORKING");
            //    console.log(data); //data is the name of the array that is returned from the API object.
            //    //All of these are working!:
            //    console.log("CITY NAME:");
            //    console.log(data.name);
            //    console.log(data.main.temp);
            //    console.log(data.wind.speed);

                //Create the date elements to be readable for the five day forecast:
                var day_1 = data.daily[1].dt;
                var time_milli_1 = day_1 * 1000;
                var date_obj_1 = new Date(time_milli_1);
                var date_string1 = date_obj_1.toDateString();

                var day_2 = data.daily[2].dt;
                var time_milli_2 = day_2 * 1000;
                var date_obj_2 = new Date(time_milli_2);
                var date_string2 = date_obj_2.toDateString();

                var day_3 = data.daily[3].dt;
                var time_milli_3 = day_3 * 1000;
                var date_obj_3 = new Date(time_milli_3);
                var date_string3 = date_obj_3.toDateString();

                var day_4 = data.daily[4].dt;
                var time_milli_4 = day_4 * 1000;
                var date_obj_4 = new Date(time_milli_4);
                var date_string4 = date_obj_4.toDateString();

                var day_5 = data.daily[5].dt;
                var time_milli_5 = day_5 * 1000;
                var date_obj_5 = new Date(time_milli_5);
                var date_string5 = date_obj_5.toDateString();

                //Push the needed data to an array:
                weather.push({city: searchInput, emojiIcon: data.current.weather[0].icon, temperature: "Temperature: " + data.current.temp + " °F", 
                humid: "Humidity: " + data.current.humidity + " %", windspd: "Wind Speed: " + data.current.wind_speed + " MPH", 
                UV: data.current.uvi, 
                0: {date: date_string1, emoji: data.daily[1].weather[0].icon, tempCard: "Temperature: "+data.daily[1].temp.day+" °F", humidCard:"Humidity: "+ data.daily[1].humidity+" %"},
                1: {date: date_string2, emoji: data.daily[2].weather[0].icon, tempCard: "Temperature: "+data.daily[2].temp.day+" °F", humidCard:"Humidity: "+ data.daily[2].humidity+" %"},
                2: {date: date_string3, emoji: data.daily[3].weather[0].icon, tempCard: "Temperature: "+data.daily[3].temp.day+" °F", humidCard:"Humidity: "+ data.daily[3].humidity+" %"},
                3: {date: date_string4, emoji: data.daily[4].weather[0].icon, tempCard: "Temperature: "+data.daily[4].temp.day+" °F", humidCard:"Humidity: "+ data.daily[4].humidity+" %"},
                4: {date: date_string5, emoji: data.daily[5].weather[0].icon, tempCard: "Temperature: "+data.daily[5].temp.day+" °F", humidCard:"Humidity: "+ data.daily[5].humidity+" %"}});

                //Set array into local storage:
                 window.localStorage.setItem("weather", JSON.stringify(weather));

                //Run the display function:
                displayCurrentWeather(searchInput, data);
                
           });
       } 
    });
};


//Create the function to display the current weather in the first DIV element block. Commented out console.logs used for testing:
function displayCurrentWeather(searchInput, array){
    //Create the City Name heading:
    var cityName = searchInput + " " + currentDay;
    var curEmoji = array.current.weather[0].icon;
    // console.log(cityName);
    document.querySelector("#city").textContent = cityName;
    document.querySelector("#mainEmoji").setAttribute("src", "https://openweathermap.org/img/wn/" + curEmoji + "@2x.png");

    //Create the temp variable and dynamically add it to the page:
    let temp = "Temperature: " + array.current.temp + " °F";
    // console.log("TEMP!")
    // console.log(temp);
    tempLI.textContent = temp;
    ulElement.appendChild(tempLI);

    //Create the humidity variable and dynamically append it to the page:
    let humidity = "Humidity: " + array.current.humidity + "%";
    // console.log(humidity);
    humidLI.textContent = humidity;
    ulElement.append(humidLI); 

    //Create the wind variable and dynamically append it to the page:
    let wind = "Wind Speed: " + array.current.wind_speed + " MPH";
    // console.log(wind);
    windLI.textContent = wind;
    ulElement.appendChild(windLI);

    //Create the UV Index variable and append to the page:
    let uvHeading = "UV Index: ";
    uviLI.textContent = uvHeading;
    let uvi = array.current.uvi;
    uviDIV.textContent = uvi;
    ulElement.appendChild(uviLI);
    ulElement.append(uviDIV);

    //Create if statement to change UV background color based on severity:
    var uvIndex = array.current.uvi;
    if(uvIndex <= 2){
        uviDIV.setAttribute("id", "low");
    }
    if(2 < uvIndex && uvIndex < 5){
        uviDIV.setAttribute("id", "moderate");
    }
    if(5 < uvIndex && uvIndex< 8){
        uviDIV.setAttribute("id", "high");        
    }
    if(8 < uvIndex){
        uviDIV.setAttribute("id", "severe");        
    }

    //Create the text content for the five day forecast cards:
    for(j=1, i=0; j<6, i <5; i++, j++){
        let day_j = array.daily[j].dt; 
        let emoj_j = array.daily[j].weather[0].icon;
        let temperature_j =array.daily[j].temp.day;
        let humid_j = array.daily[j].humidity;

        //Convert date to readable date:
        let time_milli_j = day_j * 1000;
        let date_obj_j = new Date(time_milli_j);
        // console.log(date_obj_j);
        let date_string = date_obj_j.toDateString();
        // console.log(date_string);

        //Convert weather ICON to an image using:
        //https://openweathermap.org/img/wn/10d@2x.png
        // console.log(humid_i);
        document.getElementById("date"+i).textContent = date_string;
        document.getElementById("emo"+i).setAttribute("src", "https://openweathermap.org/img/wn/" + emoj_j + "@2x.png");
        document.getElementById("t"+i).textContent = "Temperature: " + temperature_j +" °F";
        document.getElementById("humi"+i).textContent = "Humidity: " + humid_j + "%";
    }
};

//Create the button on search input:
function createButton(searchInput){  
    // console.log("Creating Button!")
    button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("id", searchInput);
    // console.log(button.id);
    button.classList = "button_design";
    button.textContent = searchInput;
    document.querySelector("#buttons").appendChild(button);
};

//Create button on page load from saved data in local storage:
//make i a block-scoped variable instead of a global variable with let:
for(i=0; i <weather.length; i++){
    var button_i = document.createElement("button");
    button_i.setAttribute("type", "button");
    button_i.setAttribute("id", weather[i].city);
    // console.log("For loop ONE:")
    // console.log(button_i);
    // console.log(button_i.id);
    button_i.classList = "button_design";
    button_i.textContent = weather[i].city;
    document.querySelector("#buttons").appendChild(button_i);     
}

//Add event listern to the parent element containing all buttons:
var parentButtonContainer = document.querySelector("#buttons")
parentButtonContainer.addEventListener('click', displaySaved);

//e.target is the element we click on
function displaySaved(e){
    document.querySelector("#featuredCity").style.display = "block";
    // console.log("DISPLAYING!");
    //Filter out any clicks that may have originated on the parent element
    if(e.target !== e.currentTarget){
        //Check to see that the button ID matches the element clicked:
        var buttonID = e.target.id;
        console.log(buttonID);
        for(j=0; j < weather.length; j++){
            var cityCompare = weather[j].city;
            if(buttonID == cityCompare){
                // console.log(weather[j]);

                //Create the City Name heading:
                var cityName = weather[j].city + " " + currentDay;
                var curEmoji = weather[j].emojiIcon;
                document.querySelector("#city").textContent = cityName;
                document.querySelector("#mainEmoji").setAttribute("src", "https://openweathermap.org/img/wn/" + curEmoji + "@2x.png");

                //Create the temp variable and dynamically add it to the page:
                let temp = weather[j].temperature; 
                tempLI.textContent = temp;
                ulElement.appendChild(tempLI);

                //Create the humidity variable and dynamically append it to the page:
                let humidity = weather[j].humid;
                humidLI.textContent = humidity;
                ulElement.append(humidLI); 

                //Create the wind variable and dynamically append it to the page:
                let wind =weather[j].windspd;
                windLI.textContent = wind;
                ulElement.appendChild(windLI);

                //Create the UV Index variable and append to the page:
                let uvHeading = "UV Index: ";
                uviLI.textContent = uvHeading;
                let uvi = weather[j].UV;
                uviDIV.textContent = uvi;
                ulElement.appendChild(uviLI);
                ulElement.append(uviDIV);

                 //Create if statement to change UV background color based on severity:
                let uvIndex = weather[j].UV;
                if(uvIndex <= 2){
                    uviDIV.setAttribute("id", "low");
                }
                if(2 < uvIndex && uvIndex < 5){
                    uviDIV.setAttribute("id", "moderate");
                }
                if(5 < uvIndex && uvIndex< 8){
                    uviDIV.setAttribute("id", "high");        
                }
                if(8 < uvIndex){
                    uviDIV.setAttribute("id", "severe");        
                }

                for(p=0, i=0; p<5, i <5; i++, p++){
                    //j is the index for the selected weather array object, and p is the index for the day object within that selected 
                    //weather array object. i is the iterations through each of the five card HTML elements that were created.
                    // console.log(weather[j][p]);
                    let date_string_p = weather[j][p].date; 
                    let emoj_p = weather[j][p].emoji;
                    let temperature_p =weather[j][p].tempCard;
                    let humid_p = weather[j][p].humidCard;
            
                    document.getElementById("date"+i).textContent = date_string_p;
                    document.getElementById("emo"+i).setAttribute("src", "https://openweathermap.org/img/wn/" + emoj_p + "@2x.png");
                    document.getElementById("t"+i).textContent = temperature_p;
                    document.getElementById("humi"+i).textContent = humid_p;
                }
            }
        }
    } 
    //Don't want it to go past the parent element:
    e.stopPropagation();
};

//Button to clear search history:
function clearButton(){
    window.localStorage.clear();
    location.reload(); 
};

//Add Event listner for the submit button in the form and run the function for taking the form input from the user:
searchForm.addEventListener('submit', searchSubmit);
clear.addEventListener('click', clearButton);










