    var worker = new Worker('js/webworker.js')
    var canvas = document.getElementById("dropZone");
    var progress = document.getElementById("progress");
    var ctx = canvas.getContext("2d");
    var TilesSent = 0,
        TilesRecieved = 0;
    var rows = {}
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
        progress.classList.toggle('hide');
        for (var row = 0; row <= canvas.height; row += TILE_HEIGHT) {
            for (var col = 0; col <= canvas.width; col += TILE_WIDTH) {
                rows[row] = [];
                TilesSent++;
                worker.postMessage({
                    type: "getTile",
                    payload: ctx.getImageData(col, row, TILE_WIDTH, TILE_HEIGHT),
                    cordinates: {
                        x: col,
                        y: row
                    }
                });
            }
        }

    }

    // Get Tile As A ImageBitmap Store in HashMap And Drawing Row By Row.
    worker.onmessage = function (event) {
        /* UnComment Below To See the Traditional Rendering */
        //ctx.drawImage(event.data.payload,event.data.cordinates.x,event.data.cordinates.y,TILE_HEIGHT,TILE_WIDTH);
        TilesRecieved++;
        rows[event.data.cordinates.y].push(event.data.payload)
        if (TilesSent == TilesRecieved) {
            drawRow(rows)
        }
    }

    function drawRow(data) {
        for (rownumber in data) {
            var xstart = -16;
            //Drawing One Row At A time to Prevent Jagged Effect
            for(columnnumber in data[rownumber]){
                xstart+=16;
                ctx.drawImage(data[rownumber][columnnumber],xstart,rownumber,TILE_HEIGHT,TILE_WIDTH)
            }
        }
        progress.classList.toggle('hide');
    }

    function handleFiles(files) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        validateFileandDraw(files[0]);
    }

    function validateFileandDraw(file) {
        //Validating Image Files
        if (file === undefined) return;
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