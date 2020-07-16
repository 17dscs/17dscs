import data from "../datas/data";

export default function chart(canvas) {
  const covidData = data.covidData;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 400;
  tempCanvas.height = 100;
  const tempCtx = tempCanvas.getContext("2d");
  var ctx = canvas.getContext("2d");

  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

  let test = true;

  let entries;

  // setInterval(() => {
  //   data.push(11);
  // }, 1000);

  drawChart();

  // function drawGrid() {
  //   let xGrid = 10;
  //   let yGrid = 10;
  //   let cellSize = 10;
  //   tempCtx.beginPath();
  //   while (xGrid < canvas.height) {
  //     tempCtx.moveTo(0, xGrid);
  //     tempCtx.lineTo(canvas.width, xGrid);
  //     xGrid += cellSize;
  //   }
  //   while (yGrid < canvas.width) {
  //     tempCtx.moveTo(yGrid, 0);
  //     tempCtx.lineTo(yGrid, canvas.height);
  //     yGrid += cellSize;
  //   }
  //   tempCtx.strokeStyle = "#ccc";
  //   tempCtx.stroke();
  // }

  function drawAxis() {
    let yPlot = 90;
    let pop = 0;

    tempCtx.beginPath();
    tempCtx.strokeStyle = "black";
    tempCtx.fillStyle = "#136A9F";
    tempCtx.moveTo(50, 20);
    tempCtx.lineTo(50, 80);
    tempCtx.lineTo(380, 80);
    tempCtx.lineTo(380, 20);
    tempCtx.lineTo(50, 20);
    tempCtx.moveTo(50, 80);
    tempCtx.fill();

    tempCtx.fillStyle = "black";

    for (let i = 0; i < 2; i++) {
      tempCtx.fillText(pop, 20, yPlot);
      pop += 100;
      yPlot -= 70;
    }
    tempCtx.stroke();
  }

  function drawTempChart() {
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.fillStyle = "white";
    tempCtx.rect(0, 0, canvas.width, canvas.height);
    tempCtx.fill();
    drawAxis();
    tempCtx.beginPath();
    tempCtx.strokeStyle = "black";
    tempCtx.moveTo(50, 80);
    tempCtx.font = "bold normal 10px Verdana";

    var xPlot = 50;

    entries = Object.entries(covidData);

    for (const [key, value] of entries) {
      var valueInBlocks = 100;
      var valueY = (60 * (100 - value)) / 100 + 20;
      // tempCtx.fillText("(" + key + ")", xPlot, valueInBlocks - 5);
      if (key === "8(last)") {
        tempCtx.lineTo(380 - 1, valueY);
        continue;
      }
      if (key !== "1(0216)") {
        tempCtx.fillStyle = "#8F1838";
      }
      // tempCtx.arc(xPlot, valueY, 2, 0, Math.PI * 2, true);
      tempCtx.lineTo(xPlot, valueY);
      xPlot += 50;
    }
    tempCtx.lineTo(380, 80);
    tempCtx.fill();
  }

  function putImageData(ctx, imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
    var data = imageData.data;
    var height = imageData.height;
    var width = imageData.width;
    dirtyX = dirtyX || 0;
    dirtyY = dirtyY || 0;
    dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
    dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
    var limitBottom = dirtyY + dirtyHeight;
    var limitRight = dirtyX + dirtyWidth;
    for (var y = dirtyY; y < limitBottom; y++) {
      for (var x = dirtyX; x < limitRight; x++) {
        var pos = y * width + x;
        ctx.fillStyle =
          "rgba(" + data[pos * 4 + 0] + "," + data[pos * 4 + 1] + "," + data[pos * 4 + 2] + "," + data[pos * 4 + 3] / 255 + ")";
        ctx.fillRect(x + dx, y + dy, 1, 1);
      }
    }
  }

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTempChart();
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000; // delta time in seconds

    if (test) {
      test = false;
    }
    // dirty and lazy solution
    // instead of scaling up every velocity vector the program
    // we increase the speed of time
    dt *= 20;
    if (currentTime - lastTime < 16500) {
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fill();
      putImageData(ctx, imageData, 0, 0, 0, 0, 50 + dt, canvas.height);

      requestAnimationFrame(drawChart);
    } else {
      data.isDrawed = true;
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      putImageData(ctx, imageData, 0, 0, 0, 0, canvas.width, canvas.height);
    }
  }
}
