//Executed On Message Recieve
self.onmessage = function (e) {
	//Geting Actions and Performing Function
    switch (e.data.type) {
        case "getTile":
            fetchTile(calculateAverageColor(e.data.payload),e.data.cordinates);
            break;
        default:
            console.log("Default")
            break;
    }
}

self.calculateAverageColor = function (data) {
    var r = 0,
        g = 0,
        b = 0;
    for (var i = 0; i < data.data.length; i += 4) {
        r += data.data[i];
        g += data.data[i+1];
        b += data.data[i+2];
    }
    r = Math.floor(r / (data.data.length / 4)).toString(16) ;
    g = Math.floor(g / (data.data.length / 4)).toString(16);
    b = Math.floor(b / (data.data.length / 4)).toString(16);
    return r + g + b + "ff";
}

//Fetching Tile from Server Using Fetch API
self.fetchTile = function (hexcolor,cordinates) {
    fetch('http://localhost:3000/color/' + hexcolor)
        .then(function (response) {
            response.blob().then(function (data) {
				//Getting Image As Blob and Converting it to image url.
                postMessage({type:'ImageData',payload:URL.createObjectURL(data),cordinates:cordinates});  
            });
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}
