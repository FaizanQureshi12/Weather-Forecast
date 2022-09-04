function weatherForcast() {
    const city = document.querySelector("#city").value;

    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=d25935c8a4a77ab62336ad8df5c8f371&units=metric`)
        .then(function (response) {
            // handle success
            console.log(response);
           
            let dayWise = [];
            let dateOfMonth = null;
            let counter = -1;

            response.data.list.map(eachHour => {
                let tempDateOfMonth = new Date(eachHour.dt_txt).getDate();
                console.log("tempDateOfMonth: ", tempDateOfMonth);

                if (dateOfMonth !== tempDateOfMonth) {
                    counter++;
                    dateOfMonth = tempDateOfMonth
                }
                if (!dayWise[counter]) { dayWise[counter] = [] }
                dayWise[counter].push(eachHour)
            })
            console.log("dayWise: ", dayWise);

            // [From this type w get data then find averge 
            //   [{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],
            //   [{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],
            //   [{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],[{ min:3  }],
            // ]

            dayWise = dayWise.map((eachDay) => {
                return eachDay.reduce((previousEachHour, currentEachHour) => {
                    // console.log(
                    //     previousEachHour.main.temp,
                    //     currentEachHour.main.temp
                    // )

                    let sumTemp = Number(previousEachHour.main.temp) + Number(currentEachHour.main.temp)
                    let sumMinTemp = Number(previousEachHour.main.temp_min) + Number(currentEachHour.main.temp_min)
                    let sumMaxTemp = Number(previousEachHour.main.temp_max) + Number(currentEachHour.main.temp_max)

                    return {
                        main: {
                            temp: sumTemp,
                            temp_min: sumMinTemp,
                            temp_max: sumMaxTemp,
                        },
                        dt_txt: currentEachHour.dt_txt,
                        weather: [{
                            icon: currentEachHour.weather[0].icon,
                            description: currentEachHour.weather[0].description,
                        }],
                        length: eachDay.length
                    }
                }, {
                    main: {
                        temp: 0,
                        temp_min: 0,
                        temp_max: 0,
                    }
                })
            })
            console.log("final: ", dayWise);

            // Inner Html written below by Dom Method You can write this also by Html

            dayWise.map(eachDay => {

                let forcastDiv = document.querySelector("#forcastDiv")
                let forcastCard = document.createElement("div")
                forcastCard.setAttribute("class", "forcastCard");

                let day = document.createElement("div")
                day.setAttribute("class", "day")
                let dayTextNode = document.createTextNode(`${moment(eachDay.dt_txt).format('dddd, MMMM Do YYYY, h:mm: a')}`)
                day.appendChild(dayTextNode)

                let img = document.createElement("img")
                img.setAttribute("class", "img")
                img.setAttribute("src", `http://openweathermap.org/img/wn/${eachDay.weather[0].icon}@2x.png`)

                let description = document.createElement("div")
                description.setAttribute("class", "min")
                let descTextNode = document.createTextNode(`${eachDay.weather[0].description}`)
                description.appendChild(descTextNode)

                let min = document.createElement("div")
                min.setAttribute("class", "min")
                let minTextNode = document.createTextNode(`Min: ${Math.floor(eachDay.main.temp_min / eachDay.length)}`)
                min.appendChild(minTextNode)

                let max = document.createElement("div")
                max.setAttribute("class", "max")
                let maxTextNode = document.createTextNode(`Max: ${Math.floor(eachDay.main.temp_max / eachDay.length)}`)
                max.appendChild(maxTextNode)

                forcastCard.appendChild(day)
                forcastCard.appendChild(img)
                forcastCard.appendChild(description)
                forcastCard.appendChild(min)
                forcastCard.appendChild(max)
                forcastDiv.appendChild(forcastCard)
            })
        })

        .catch(function (error) {
            // handle error
            console.log(error);
        })
}