// Preventing Global Namespace Pollution
(function () {
    var worker = new Worker('js/webworker.js')
    var canvas = document.getElementById("myCanvas");
    var img = document.getElementById("scream");
    var target = document.getElementById("target");
    var tc = document.getElementById("tc");
    var tctx = tc.getContext("2d");
    var ctx = canvas.getContext("2d");
    var blobArray = [];
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    //Send Tile Info TO Worker for Calculating the average 
    for (var row = 0; row <= img.height; row += 16) {
        for (var col = 0; col <= img.width; col += 16) {
            worker.postMessage({
                type: "getTile",
                payload: ctx.getImageData(col, row, 16, 16),
                cordinates: {
                    x: col,
                    y: row
                }
            });
        }
    }



    // Get Tile from Server in Blob Format
    worker.onmessage = function (event) {
        draw(event.data);
    }

    function draw(data){
        var tempimg = new Image();
        var cordinates = data.cordinates;
        tempimg.src = data.payload;
        tempimg.onload = function () {
            tctx.drawImage(tempimg, 0, 0);
            for (var row = 0; row <= canvas.width; row += 16) {
                for (var col = 0; col <= canvas.height; col += 16) {
                    ctx.putImageData(tctx.getImageData(0, 0, 16, 16), cordinates.x, cordinates.y)
                }
            }
        }
    }
})();