var clamped = undefined;
self.onmessage = function (e) {
    switch (e.data.type) {
        case "getTile":
            getTile(calcAvg(e.data.payload));
            self.setTimeout(function () {
                postMessage({iData:self.clamped,cordinates:e.data.cordinates});
            }, 500)
            break;
        default:
            console.log("Default")
            break;
    }
}

self.calcAvg = function (data) {
    var r = 0,
        g = 0,
        b = 0;
    for (var i = 0; i < data.data.length; i += 4) {
        r += data.data[i];
        g += data.data[i+1];
        b += data.data[i+2];
    }
    r = Math.floor(r / (data.data.length / 4)).toString(16);
    g = Math.floor(g / (data.data.length / 4)).toString(16);
    b = Math.floor(b / (data.data.length / 4)).toString(16);
    return r + g + b + "ff";
}

self.getTile = function (hexcolor) {
    fetch('http://localhost:3000/color/' + hexcolor)
        .then(function (response) {
            response.blob().then(function (data) {
                var objectURL = URL.createObjectURL(data);
                self.clamped=objectURL;
            });
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}