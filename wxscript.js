




var citiesArray = JSON.parse(localStorage.getItem("cityNames")) || [];

var date = moment().format('L');

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

      var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

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

function getUVIndex(key, lat, lon) {

  var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + key + "&lat=" + lat + "&lon=" + lon;

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

    if (indexUV > 7.5 && indexUV < 11) {
      indexP.addClass("severeUV");
    }
    

    $(".todaysWX").append(indexP);



});

}


function getFiveDayForecast(lat, lon, key) {

  var fiveDayURL = "api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key;

  $.ajax({
    url: fiveDayURL,
    method: "GET"
  }).then(function(response) {
      console.log(response);



  });
}


$("#submit-btn").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var cityName = $("#city-input").val().trim();

    // Adding movie from the textbox to our array
    citiesArray.push(cityName);

    localStorage.setItem("cityNames", JSON.stringify(citiesArray));

    $('#cityForm').children('input').val('')

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
});

$(".clearBtn").on("click", function(event) {
  event.preventDefault();

  $("#cityBtns").empty();

  $(".todaysWX").empty();

  citiesArray = [];

  localStorage.setItem("cityNames", JSON.stringify(citiesArray));


})

renderButtons();

$(document).on("click", ".cityBtn", displayCityWX);