


// Variable for saving chosen cities from input form to local storage
var citiesArray = JSON.parse(localStorage.getItem("cityNames")) || [];

// Variable for today's date from Moment.js
var date = moment().format('L');

// Function definition for function to create a button depending on input forms content
function renderButtons() {

    
    $("#cityBtns").empty();

    

    
    for (var i = 0; i < citiesArray.length; i++) {

      
      var a = $("<button>");
      
      a.addClass("cityBtn");
     
      a.attr("data-name", citiesArray[i]);
      
      a.text(citiesArray[i]);
     
      $("#cityBtns").append(a);
    }
  }

  // Function definition for displaying that day's WX and five day forecast
  function displayCityWX() {

    var city = $(this).attr("data-name");
    var APIKey = "4195eb80fa4084612ad2a6cce9f59945";

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    

    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {

      $(".todaysWX").empty();

        console.log(response);

      
        
      var todayWXHeader = $("<h1>").text(city + " (" + date + ")");

      todayWXHeader.addClass("todayHeader");

      

      $(".todaysWX").append(todayWXHeader);

      var wxImage = $("<img>");

      var icon = response.weather[0].icon;

      var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      $(wxImage).attr('src', iconURL);

      $(wxImage).addClass("weather-img");

      $(".todaysWX").append(wxImage);

      var tempF = response.main.temp;

      var tempP = $("<p>").text("Temperature (Fahrenheit): " + tempF.toFixed(0));

      tempP.addClass("todayTemp");

      $(".todaysWX").append(tempP);


      var humidity = response.main.humidity;

      var humidP = $("<p>").text("Humidity: " + humidity + "%");

      humidP.addClass("todayHumid");

      $(".todaysWX").append(humidP);



      var windSpeed = response.wind.speed;

      var windSpeedP = $("<p>").text("Wind Speed: " + windSpeed + " MPH");

      windSpeedP.addClass("todayWind");

      $(".todaysWX").append(windSpeedP);

      var cityLat = response.coord.lat;

      var cityLon = response.coord.lon;

      

      getUVIndex(APIKey, cityLat, cityLon);

      getFiveDayForecast(cityLat, cityLon, APIKey);


    });

    


  }

// Function definition to find UV Index for chosen city  
function getUVIndex(key, lat, lon) {

  var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + lon;

  $.ajax({
    url: uvURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);

    var indexUV = response.value;

    var indexP = $("<p>").text("UV Index: " + indexUV.toFixed(2));

    indexP.addClass("todayUV");

    if (indexUV > -1 && indexUV < 2.5) {
      indexP.addClass("lowUV");
    }

    if (indexUV > 2.5 && indexUV < 5.5) {
      indexP.addClass("moderateUV");
    }

    if (indexUV > 5.5 && indexUV < 7.5) {
      indexP.addClass("highUV");
    }

    if (indexUV > 7.5 && indexUV < 15) {
      indexP.addClass("severeUV");
    }
    

    $(".todaysWX").append(indexP);



});

}

// Function definition to get five day forecast for chosen city
function getFiveDayForecast(lat, lon, key) {

  var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + key;

  $.ajax({
    url: fiveDayURL,
    method: "GET"
  }).then(function(response) {
      console.log(response);

      $(".fiveDayForecast").empty();

      for (var i = 5; i < 38; i = i + 8) {

        var dayOneDiv = $("<div>");

        dayOneDiv.addClass("dailyForecast");

        var dayOneDate = moment(response.list[i].dt_txt).format('L');

        var dayOneDateP = $("<p>").text(dayOneDate);
        
        dayOneDateP.css("padding-top", "5px");

        dayOneDateP.css("font-size", "25px");

        $(dayOneDiv).append(dayOneDateP);


        var wxDailyImage = $("<img>");

        var dayOneIcon = response.list[i].weather[0].icon;

        var dailyIconURL = "https://openweathermap.org/img/wn/" + dayOneIcon + ".png";

        $(wxDailyImage).attr('src', dailyIconURL);

        wxDailyImage.css("padding-top", "5px");

        $(dayOneDiv).append(wxDailyImage);



        var dayOneTemp = response.list[i].main.temp;

        var dayOneTempP = $("<p>").text("Temp (Fahrenheit): " + dayOneTemp.toFixed(0));

        dayOneTempP.css("padding-top", "30px");

        $(dayOneDiv).append(dayOneTempP);



        var dayOneHumid = response.list[i].main.humidity;

        var dayOneHumidP = $("<p>").text("Humidity: " + dayOneHumid + "%");

        dayOneHumidP.css("padding-top", "5px");

        $(dayOneDiv).append(dayOneHumidP);


        var dayOneWind = response.list[i].wind.speed;

        var dayOneWindP = $("<p>").text("Wind: " + dayOneWind + " MPH");

        dayOneWindP.css("padding-top", "5px");

        $(dayOneDiv).append(dayOneWindP);

        $(".fiveDayForecast").append(dayOneDiv);
        
      }

  });
}

// Submit button
$("#submit-btn").on("click", function(event) {
    event.preventDefault();
    
    var cityName = $("#city-input").val().trim();

    
    citiesArray.push(cityName);

    localStorage.setItem("cityNames", JSON.stringify(citiesArray));

    $('#cityForm').children('input').val('')

    
    renderButtons();
});


// Clear History button
$(".clearBtn").on("click", function(event) {
  event.preventDefault();

  $("#cityBtns").empty();

  $(".todaysWX").empty();

  $(".fiveDayForecast").empty();

  citiesArray = [];

  localStorage.setItem("cityNames", JSON.stringify(citiesArray));


})

// Render Buttons funcation call
renderButtons();


// City buttons (when created)
$(document).on("click", ".cityBtn", displayCityWX);