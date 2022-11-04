"use strict"


 const WEATHER_APP = {
    initialiseApp(){
            const submitBtn = document.querySelector(".inputter__btn");
            submitBtn.addEventListener("click", WEATHER_APP.submitInput);
            document.querySelector(".addBtn").addEventListener("click", this.addPanel);
    },
    addPanel(){
        const list = document.querySelector(".inputter__list");
        const newPanel = document.createElement("li");
        newPanel.className = "inputter__item";
        newPanel.innerHTML = "<div class=\"inputter__item-container\">\n" +
            "                     Широта <input class=\"inputter-item__field\">\n" +
            "                </div>\n" +
            "                <div class=\"inputter__item-container\">\n" +
            "                     Долгота <input class=\"inputter-item__field\">\n" +
            "                </div>\n" +
            "                <div class = \"inputter__map\">\n" +
            "                </div>\n" +
            "                <button class=\"inputter__btn\">Показать погоду</button>" +
            "                 <div class = \"inputter__img\">\n" +
            "                    <img src=\"img/unknown.png\" alt=\"погода\">\n" +
            "                 </div>";
        newPanel.querySelector(".inputter__btn").addEventListener("click", WEATHER_APP.submitInput)
        list.append(newPanel);
    },
    submitInput(){
        const inputList = this.parentNode.querySelectorAll(".inputter-item__field");
        const latitudeValueInput = parseFloat(inputList[0].value);
        const longitudeValueInput = parseFloat(inputList[1].value);
        if(isNaN(latitudeValueInput) || isNaN(longitudeValueInput)
            || latitudeValueInput > 90 || latitudeValueInput < -90
            || longitudeValueInput > 180 || longitudeValueInput < -180) {
            alert("Неверные данные!")
            return;
        }
        let panel = WEATHER_APP.addMap.apply(this,[latitudeValueInput,longitudeValueInput]);
        WEATHER_APP.setWidgets(latitudeValueInput, longitudeValueInput, panel);
    },
     addMap(lat, long){
        const panelList = this.parentNode.parentNode.querySelectorAll("li");
        let suitablePanel = null;
        let index = 0;
         for (; index < panelList.length; index++) {
             if(panelList[index].querySelector(".inputter__btn") === this) {
                 suitablePanel = panelList[index];
                 break;
             }
         }
         if(suitablePanel.querySelector(".inputter__item-widget") === null) {
             ymaps.ready(() => {
                let map =  new ymaps.Map(suitablePanel.querySelector(".inputter__map"),
                    {
                        center: [lat, long],
                        zoom: 7
                    });
                 WEATHER_APP.mapsList[index] = map;
             });
         }
         else
             WEATHER_APP.mapsList[index].setCenter([lat,long]);

         return suitablePanel;
     },
     async setWidgets(lat,long, panel){
         let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=e3c3c6c51e17dd13ce9b1c3bc6747697&units=metric`);
         let result = await response.json();
         let temperature = `Температура воздуха: ${result.main.temp} °C`;
         let windSpeed = `Скорость ветра: ${result.wind.speed} м/c`;
         let humidity = `Влажность: ${result.main.humidity}%`;
         let hasWidget = panel.querySelector(".inputter__item-widget") !== null;
         panel.querySelector(".inputter__img").innerHTML = `<img src="img/${result.weather[0].icon}.png" alt="погода">`
         if(!hasWidget) {
             let temperatureTag = WEATHER_APP.createWidgetTag(temperature,"inputter__item-widget", "p");
             let windSpeedTag = WEATHER_APP.createWidgetTag(windSpeed,"inputter__item-widget", "p");
             let humidityTag = WEATHER_APP.createWidgetTag(humidity,"inputter__item-widget", "p");
             panel.append(temperatureTag);
             panel.append(windSpeedTag);
             panel.append(humidityTag);
         }
         else {
             let tagArr = panel.querySelectorAll(".inputter__item-widget");
             tagArr[0].innerHTML = temperature;
             tagArr[1].innerHTML = windSpeed;
             tagArr[2].innerHTML = humidity;
         }
     },
     createWidgetTag(text, className, tagName){
        let newTag = document.createElement(tagName);
        newTag.className = className;
        newTag.innerHTML = text;
        return newTag;
     },
     mapsList : []
}

WEATHER_APP.initialiseApp();

