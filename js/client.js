window.onload = function () {
    var worker = new Worker('js/webworker.js')
    var canvas = document.getElementById("myCanvas");
    var img = document.getElementById("scream");

    var target = document.getElementById("target");
    var tc = document.getElementById("tc");
    var tctx = tc.getContext("2d");
    var ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    x = document.getElementById("x");
    for (var row = 0; row < canvas.height;row += 8) {
        for (var col = 0; col < canvas.width; col += 8) {
            //console.log(ctx.getImageData(row, col, 8, 8).data)
            worker.postMessage({
                type: "getTile",
                payload: ctx.getImageData(row, col, 8, 8),
                cordinates: {
                    x: row,
                    y: col
                }
            });
        }
    }
    var tempimg = new Image(8,8);
    
    worker.onmessage = function (event) {
        tempimg.src = event.data.iData;
        tempimg.onload = function(){
            tctx.drawImage(tempimg,0,0,8,8)
            ctx.putImageData(tctx.getImageData(0,0,7,7),parseInt(event.data.cordinates.x),parseInt(event.data.cordinates.y),0,0,7,7)
        }
    }
}