    var worker = new Worker('js/webworker.js')
    var tc = document.getElementById("tc");
    var canvas = document.getElementById("dropZone");
    var tctx = tc.getContext("2d");
    var ctx = canvas.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.fillText("Drop Your File Here", (canvas.width - 240), (canvas.height / 2));

    function dragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        event.target.style.opacity = 0.5
    }

    function onDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        event.target.style.opacity = 1;
        var file = event.dataTransfer.files[0];
        validateFileandDraw(file);
    }

    //Sending Image Data to Worker For Calculating Average And Getting Tile From Server
    function makeImageMosiac() {
        for (var row = 0; row <= canvas.height; row += 16) {
            for (var col = 0; col <= canvas.width; col += 16) {
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

    }

    // Get Tile As A Blob Url and Draw It to Temp Canvas For Copying it.
    worker.onmessage = function (event) {
        draw(event.data);
    }

    // Draw Recieved Tiles from Server To Canvas
    function draw(data) {
        var tempimg = new Image();
        var cordinates = data.cordinates;
        tempimg.src = data.payload;
        tempimg.onload = function () {
        tctx.drawImage(tempimg, 0, 0);
        ctx.putImageData(tctx.getImageData(0, 0, 16, 16), cordinates.x, cordinates.y)
        }
    }

    function handleFiles(files) {
        validateFileandDraw(files[0])
    }

    function validateFileandDraw(file) {
        //Validating Image Files
        if(file === undefined) return;
        if (file.type.indexOf('image') == -1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillText("Please Use A Image File", (canvas.width - 250), (canvas.height / 2));
            return;
        }
        //Drawing Dropped Image On Canvas
        createImageBitmap(file).then(function (response) {
            canvas.width = response.width;
            canvas.height = response.height;
            ctx.drawImage(response, 0, 0)
        });
    }