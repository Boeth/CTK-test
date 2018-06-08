var URL = 'https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48'
var lat1 = 55.410307
var lon1 = 37.902451

function fetchApi(URL) {
    fetch(URL)
        .then(res => res.json())
        .then(result => onResult(result));
}

fetchApi(URL)

setInterval(function () {
    fetchApi(URL)
}, 5000);

function onResult(json) {
    var arr = [];
    Object.entries(json).forEach(
        ([key, value]) => value.constructor === Array ? arr.push(newArray(value)) : console.log(key, value)
    );
    arr.sort(sortByDistance);    
    buildTable(arr);
}

/* Создаем новый массив из ответа, индексы:
1 - Долгота, 2 - Широта, 3 - Курс, 4 - Высота полета, 5 - Скорость,
11 - Аэропорт вылета, 12- Аэропорт назначения, 13 - Номер рейса,
14 - добавляем расчет расстояния по координатам */
function newArray(value) {
    filterIndex = [1, 2, 3, 4, 5, 11, 12, 13];
    var newArray = filterIndex.map((item) => value[item]);
    newArray[4] = Math.round(newArray[4] * 1.852);
    newArray.push(getDistanceFromLatLonInKm(lat1, lon1, newArray[0], newArray[1]))
    return newArray;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return Math.round(d);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function sortByDistance(a, b) {
    if (a[8] === b[8]) {
        return 0;
    }
    else {
        return (a[8] < b[8]) ? -1 : 1;
    }
}

function buildTable(arr) {
    var table = document.getElementsByClassName("body")[0];
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    for (var i = 0, maxi = arr.length; i < maxi; ++i) {
        var tr = document.createElement('tr').cloneNode(false);
        for (var j = 0; j < 9; ++j) {
            var td = document.createElement('td').cloneNode(false);
            cellValue = arr[i][j]
            td.appendChild(document.createTextNode(arr[i][j]));
            tr.appendChild(td);

        }
        table.appendChild(tr);
    }
    return table;
}