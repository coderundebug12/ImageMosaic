window.onload = function () {
    var worker = new Worker('js/webworker.js')
    var canvas = document.getElementById("myCanvas");
    var img = document.getElementById("scream");
    var target = document.getElementById("target");
    var tc = document.getElementById("tc");
    var tctx = tc.getContext("2d");
    var ctx = canvas.getContext("2d");
    var tempimg = new Image();
    var blobArray = [];
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    //Send Tile Info TO Worker for Calculating the average 
    for (var row = 0; row <= canvas.width - 80; row += 80) {
        for (var col = 0; col <= canvas.width - 80; col += 80) {
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

    // blobArray.forEach(function(key,value){
    //     console.log(key)
    // })
    console.log(blobArray)
    // Get Tile from Server in Blob Format
    worker.onmessage = function (event) {
        //tempimg.src = event.data.payload;
        blobArray.push(event.data)
        // setTimeout(()=>{
        //     tctx.drawImage(tempimg,0,0)
        //     for(var row = 0; row <= 320 ; row += 80){
        //         for(var col = 0; col <= 320 ; col +=80){
        //           ctx.putImageData(tctx.getImageData(0,0,80,80),event.data.cordinates.x,event.data.cordinates.y)
        //     }
        // }
        // },500)
    }

    

    
} //End Of Window Onload
