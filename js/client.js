window.onload = function () {
    var worker = new Worker('js/webworker.js')
    var canvas = document.getElementById("myCanvas");
    var img = document.getElementById("scream");
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    x = document.getElementById("x");
    for (var row = 0; row < canvas.height; row += 16) {
        for (var col = 0; col < canvas.width; col += 16) {
            worker.postMessage({
                type: "getTile",
                payload: ctx.getImageData(row, 0, 16, 16),
                cordinates: {
                    x: row,
                    y: col
                }
            });
        }
    }
    worker.onmessage = function (event) {
        idata = new ImageData(16, 16)
        idata.data.set(event.data.iData)
        console.log(idata)
        ctx.putImageData(idata, event.data.cordinates.x, event.data.cordinates.y);
    }
}