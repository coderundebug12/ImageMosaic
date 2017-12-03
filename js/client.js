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
    //console.log(canvas.width,canvas.height)

    //Send Tile Info TO Worker for Calculating the average
    for (var row = 0; row <= canvas.width - 80; row += 80) {
        for (var col = 0; col <= canvas.width - 80; col += 80) {
            //tctx.putImageData(ctx.getImageData(row, col, 80, 80), 0, 0)
            worker.postMessage({
                type: "getTile",
                payload: ctx.getImageData(row, col, 80, 80),
                cordinates: {
                    x: row,
                    y: col
                }
            });
        }
    }
    var tempimg = new Image();
    worker.onmessage = function (event) {
        tempimg.src = event.data.payload;
        setTimeout(()=>{
            tctx.drawImage(tempimg,0,0)
            for(var row = 0; row < 400 ; row +=16){
                for(var col = 0; col < 400 ; col +=16){
                  ctx.putImageData(tctx.getImageData(0,0,16,16),row,col)
            }
        }
        },500)
   }
}
