function randomColor(bigBalls) {
  // return rc;
  return "white";
}

function randomX(canvas) {
  let x = Math.floor(Math.random() * canvas.width + canvas.width / 2);
  if (x < 30) {
    x = 30;
  } else if (x + 30 > canvas.width) {
    x = canvas.width - 30;
  }
  return x;
}

function randomY(canvas) {
  let y = Math.floor(Math.random() * canvas.height);
  if (y < 30) {
    y = 30;
  } else if (y + 30 > canvas.height) {
    y = canvas.height - 30;
  }
  return y;
}

function randomDx() {
  const dxs = [2, -2];
  let r = Math.floor(Math.random() * 2);
  return dxs[r];
  // let r = Math.floor(Math.random() * 10 - 4);
  // return r;
}

function randomDy() {
  const dys = [2, -2];
  let r = Math.floor(Math.random() * 2);
  return dys[r];
  // let r = Math.floor(Math.random() * 10 - 3);
  // return r;
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

class Ball {
  constructor(x, y, radius, bigBalls) {
    this.radius = radius;
    this.x = x;
    this.y = y;

    this.dx = randomDx();
    this.dy = randomDy();

    // mass is that of a sphere as opposed to circle
    // it *does* make a difference in how realistic it looks
    this.mass = this.radius * this.radius * this.radius;
    this.color = randomColor();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    // ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    // ctx.stroke();
    ctx.closePath();
  }

  speed() {
    // magnitude of velocity vector
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }
  angle() {
    // velocity's angle with the x axis
    return Math.atan2(this.dy, this.dx);
  }
  onGround() {
    return this.y + this.radius >= canvas.height;
  }
}

const covidDataChart = ["1(0216)", "2(0301)", "3(0316)", "4(0401)", "5(0503)", "6(future)", "7(future)", "8(last)"];

let time = 0;
let offset = 2428;
let timepass = false;

class Data {
  constructor() {
    this.affectedLearner = 999014;
    this.pastAffectedLearner = 0;
    this.totalLearner = this.affectedLearner * 1000;
    this.isDrawed = false;
    this.chartInterval = 0;
    this.covidDataDiff = 0;
    this.covidData = {
      "1(0216)": 0,
      "2(0301)": 17.1,
      "3(0316)": 44,
      "4(0401)": 91.3,
      "5(0503)": 73.4,
      "6(future)": 72,
      "7(future)": 71,
      "8(last)": 69,
    };

    const interval = setInterval(() => {
      time += 200;
      if (time > 17000) clearInterval(interval);
      if (time > 0 && time < offset) {
        this.covidDataDiff += (this.covidData[covidDataChart[1]] - this.covidData[covidDataChart[0]]) / 11.7;
      }
      if (time > offset && time < offset * 2) {
        this.covidDataDiff += (this.covidData[covidDataChart[2]] - this.covidData[covidDataChart[1]]) / 11.7;
      }
      if (time > offset * 2 && time < offset * 3) {
        this.covidDataDiff += (this.covidData[covidDataChart[3]] - this.covidData[covidDataChart[2]]) / 11.7;
      }
      if (time > offset * 3 && time < offset * 4) {
        this.covidDataDiff += (this.covidData[covidDataChart[4]] - this.covidData[covidDataChart[3]]) / 11.7;
      }
      if (time > offset * 4 && time < offset * 5) {
        timepass = true;
        this.covidDataDiff += (this.covidData[covidDataChart[5]] - this.covidData[covidDataChart[4]]) / 11.7;
      }
      if (time > offset * 5 && time < offset * 6) {
        this.covidDataDiff += (this.covidData[covidDataChart[6]] - this.covidData[covidDataChart[5]]) / 11.7;
      }
      if (time > offset * 6 && time < offset * 7) {
        this.covidDataDiff += (this.covidData[covidDataChart[7]] - this.covidData[covidDataChart[6]]) / 11.7;
      }
    }, 200);
  }

  getSubtractAffectedLearner() {
    return Math.floor(this.affectedLearner / 10000000) - Math.floor(this.pastAffectedLearner / 10000000);
  }
  getAffectedLearner() {
    return Math.floor(this.affectedLearner / 10000000);
  }
  getTotalLearner() {
    return Math.floor(this.totalLearner / 10000000);
  }
  updateFutureData() {
    if (timepass) {
      if (time > offset * 4 && time < offset * 5) {
        this.covidData[covidDataChart[5]] -= 0.8;
        this.covidData[covidDataChart[6]] -= 0.8;
        this.covidData[covidDataChart[7]] -= 0.8;
      }
      if (time > offset * 5 && time < offset * 6) {
        this.covidData[covidDataChart[6]] -= 0.8;
        this.covidData[covidDataChart[7]] -= 0.8;
      }
      if (time > offset * 6 && time < offset * 7) {
        this.covidData[covidDataChart[7]] -= 0.8;
      }
    }
  }
}

const data = new Data();

function actionCanvas(canvas) {
  // data.run();
  let ctx = canvas.getContext("2d");

  let leftBalls = [];
  let rightBalls = [];

  let mouseon = false;
  let offsetX = 0;
  let offsetY = 0;
  let mousePosition = false;

  let bigBalls = false;

  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

  // let numStartingSmallBalls = data.getTotalLearner();
  // let numStartingBigBalls = 0;
  let numStartingLeftBalls = 100;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function canvasBackground() {
    if (mousePosition === "right") {
      canvas.style.backgroundColor = "black";
    } else {
      canvas.style.backgroundColor = "#136A9F";
    }
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width / 2, canvas.height);
    if (mousePosition === "left") {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "#8F1838";
    }
    ctx.fill();
  }

  function wallCollision(ball) {
    // console.log(ball);
    if (ball.x < canvas.width / 2 - ball.radius) {
      if (ball.x - ball.radius + ball.dx < 0 || ball.x + ball.radius + ball.dx > canvas.width / 2) {
        ball.dx *= -1;
      }
    }
    if (ball.x > canvas.width / 2 + ball.radius) {
      if (ball.x - ball.radius + ball.dx < canvas.width / 2 || ball.x + ball.radius + ball.dx > canvas.width) {
        ball.dx *= -1;
      }
    }
    if (ball.y - ball.radius + ball.dy < 0 || ball.y + ball.radius + ball.dy > canvas.height) {
      ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
    }
    if (ball.x + ball.radius > canvas.width) {
      ball.x = canvas.width - ball.radius;
    }
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
    }
  }

  function ballCollision(balls) {
    for (let i = 0; i < balls.length - 1; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        let obj1 = balls[i];
        let obj2 = balls[j];
        let dist = distance(obj1, obj2);
        if (dist < obj1.radius + obj2.radius) {
          let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
          let _distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
          let vCollisionNorm = { x: vCollision.x / _distance, y: vCollision.y / _distance };
          let vRelativeVelocity = { x: obj1.dx - obj2.dx, y: obj1.dy - obj2.dy };
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

          obj1.dx -= speed * vCollisionNorm.x;
          obj1.dy -= speed * vCollisionNorm.y;
          obj2.dx += speed * vCollisionNorm.x;
          obj2.dy += speed * vCollisionNorm.y;
          staticCollision(obj1, obj2);
        }
      }
      wallCollision(balls[i]);
    }

    if (balls.length > 0) wallCollision(balls[balls.length - 1]);
  }

  // function ballCollision2() {
  //   for (let i = 0; i < leftBalls.length - 1; i++) {
  //     for (let j = i + 1; j < leftBalls.length; j++) {
  //       let ob1 = leftBalls[i];
  //       let ob2 = leftBalls[j];
  //       let dist = distance(ob1, ob2);

  //       if (dist < ob1.radius + ob2.radius) {
  //         let theta1 = ob1.angle();
  //         let theta2 = ob2.angle();
  //         let phi = Math.atan2(ob2.y - ob1.y, ob2.x - ob1.x);
  //         let m1 = ob1.mass;
  //         let m2 = ob2.mass;
  //         let v1 = ob1.speed();
  //         let v2 = ob2.speed();

  //         let dx1F =
  //           ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.cos(phi) +
  //           v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
  //         let dy1F =
  //           ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.sin(phi) +
  //           v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
  //         let dx2F =
  //           ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.cos(phi) +
  //           v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
  //         let dy2F =
  //           ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.sin(phi) +
  //           v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

  //         ob1.dx = dx1F;
  //         ob1.dy = dy1F;
  //         ob2.dx = dx2F;
  //         ob2.dy = dy2F;
  //         // ob1.dx *= -1;
  //         // ob1.dy *= -1;
  //         // ob2.dx *= -1;
  //         // ob2.dy *= -1;

  //         staticCollision(ob1, ob2);
  //       }
  //     }
  //     wallCollision(leftBalls[i]);
  //   }

  //   if (leftBalls.length > 0) wallCollision(leftBalls[leftBalls.length - 1]);
  // }

  function staticCollision(ob1, ob2, emergency = false) {
    let overlap = ob1.radius + ob2.radius - distance(ob1, ob2);
    // let smallerObject = ob1.radius < ob2.radius ? ob1 : ob2;
    // let biggerObject = ob1.radius > ob2.radius ? ob1 : ob2;
    let smallerObject = ob1;
    let biggerObject = ob2;

    // When things go normally, this line does not execute.
    // "Emergency" is when staticCollision has run, but the collision
    // still hasn't been resolved. Which implies that one of the objects
    // is likely being jammed against a corner, so we must now move the OTHER one instead.
    // in other words: this line basically swaps the "little guy" role, because
    // the actual little guy can't be moved away due to being blocked by the wall.
    if (emergency) [smallerObject, biggerObject] = [biggerObject, smallerObject];

    let theta = Math.atan2(biggerObject.y - smallerObject.y, biggerObject.x - smallerObject.x);
    smallerObject.x -= overlap * Math.cos(theta);
    smallerObject.y -= overlap * Math.sin(theta);

    if (distance(ob1, ob2) < ob1.radius + ob2.radius) {
      // we don't want to be stuck in an infinite emergency.
      // so if we have already run one emergency round; just ignore the problem.
      if (!emergency) staticCollision(ob1, ob2, true);
    }
  }

  // function keyDownHandler(event) {
  //   if (event.keyCode == 67) {
  //     // c
  //     leftBalls[leftBalls.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
  //   } else if (event.keyCode == 80) {
  //     // p
  //     paused = !paused;
  //   } else if (event.keyCode == 71) {
  //     // g
  //     // This feature WAS taken out
  //     // because of a bug where
  //     // balls "merge" with each other
  //     // when under a lot of pressure.

  //     // putting back in

  //     gravityOn = !gravityOn;
  //   } else if (event.keyCode == 65) {
  //     // A
  //     leftHeld = true;
  //   } else if (event.keyCode == 87) {
  //     // W
  //     upHeld = true;
  //   } else if (event.keyCode == 68) {
  //     // D
  //     rightHeld = true;
  //   } else if (event.keyCode == 83) {
  //     // S
  //     downHeld = true;
  //   } else if (event.keyCode == 82) {
  //     // r
  //     leftBalls = [];
  //   } else if (event.keyCode == 75) {
  //     // k
  //     clearCanv = !clearCanv;
  //   } else if (event.keyCode == 88) {
  //     // x
  //     bigBalls = !bigBalls;
  //   }
  // }

  // function applyGravity() {
  //   for (let obj in leftBalls) {
  //     let ob = leftBalls[obj];
  //     if (ob.onGround() == false) {
  //       ob.dy += 0.29;
  //     }

  //     // apply basic drag
  //     ob.dx *= 0.99;
  //     ob.dy *= 0.975;
  //   }
  // }

  function moveObjects(balls) {
    for (let i = 0; i < balls.length; i++) {
      let ob = balls[i];
      ob.x += ob.dx * dt;
      ob.y += ob.dy * dt;
    }
  }

  function drawObjects(balls) {
    for (let obj in balls) {
      balls[obj].draw(ctx);
    }
  }

  function draw() {
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000; // delta time in seconds

    // dirty and lazy solution
    // instead of scaling up every velocity vector the program
    // we increase the speed of time
    dt *= 20;

    clearCanvas();
    canvasBackground();

    {
      moveObjects(leftBalls);
      moveObjects(rightBalls);
      ballCollision(leftBalls);
      ballCollision(rightBalls);
    }

    drawObjects(leftBalls);
    drawObjects(rightBalls);

    if (mouseon) {
      // The size of the emoji is set with the font
      ctx.font = "16px serif";
      // use these alignment properties for "better" positioning
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      // draw the emoji
      if (mousePosition === "left") {
        ctx.fillText("🌐ONLINE EDU", offsetX, offsetY);
      }
      if (mousePosition === "right") {
        ctx.fillText("🏫GOOD FACILITY", offsetX, offsetY);
      }
    }

    //logger();

    lastTime = currentTime;
    window.requestAnimationFrame(draw);
  }

  // spawn the initial small thingies.
  for (i = 0; i < numStartingLeftBalls; i++) {
    leftBalls[leftBalls.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
  }

  // // manually spawn the few large ones that
  // // start with no velocity. (lazy code)
  // bigBalls = true;
  // for (i = 0; i < numStartingBigBalls; i++) {
  //   let temp = new Ball(randomX(canvas), randomY(canvas), randomRadius(bigBalls), bigBalls);
  //   temp.dx = randomDx() / 8;
  //   temp.dy = randomDy() / 12;
  //   leftBalls[leftBalls.length] = temp;
  // }

  let prevData = 0;
  let currentData = 0;
  let time = 0;
  const interval = setInterval(() => {
    time += 200;
    if (time > 17000) clearInterval(interval);
    const covidRate = data.covidDataDiff;
    currentData = covidRate;
    let diff = currentData - prevData;
    if (diff > 0) {
      for (let i = 0; i < Math.round(diff); i++) {
        leftBalls.splice(0, 1);
        rightBalls[rightBalls.length] = new Ball(30, randomY(canvas), 5, bigBalls);
      }
    } else {
      if (mouseon) {
        for (let i = 0; i < Math.round(Math.abs(diff) + 0.3); i++) {
          rightBalls.splice(0, 1);
          leftBalls[leftBalls.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
        }
      } else {
        for (let i = 0; i < Math.round(Math.abs(diff)); i++) {
          rightBalls.splice(0, 1);
          leftBalls[leftBalls.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
        }
      }
    }
    prevData = currentData;
  }, 200);

  draw();

  let tempInterval;

  canvas.addEventListener("mousemove", onMouseMove, false);
  canvas.addEventListener("mouseenter", () => {
    if (!data.isDrawed) {
      tempInterval = setInterval(() => {
        data.updateFutureData();
      }, 100);
    }
  });
  function onMouseMove(e) {
    mouseon = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    if (e.offsetX < canvas.width / 2) {
      mousePosition = "left";
    } else {
      mousePosition = "right";
    }
  }
  canvas.addEventListener(
    "mouseleave",
    () => {
      mouseon = false;
      mousePosition = false;
      clearInterval(tempInterval);
    },
    false,
  );
}

class Canvas4 {
  $parent;
  $target;
  $actionCanvas;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$actionCanvas = document.createElement("canvas");
    this.$actionCanvas.id = "test-canvas";
    this.$actionCanvas.width = "400";
    this.$actionCanvas.height = "200";

    this.render(this.$parent, this.$target);
    this.render(this.$target, this.$actionCanvas);

    this.$target.style.height = "200px";
    this.$target.style.display = "flex";
    this.$target.style.justifyContent = "center";
    this.$target.style.alignItems = "center";
    actionCanvas(this.$actionCanvas);
  }

  render($parent, element) {
    $parent.append(element);
  }
}

function chart(canvas) {
  const covidData = data.covidData;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 400;
  tempCanvas.height = 100;
  const tempCtx = tempCanvas.getContext("2d");
  var ctx = canvas.getContext("2d");

  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

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

class Simulation4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("canvas");
    this.$target.id = "test-canvas2";
    this.$target.width = 400;
    this.$target.height = 100;

    this.render(this.$parent, this.$target);

    chart(this.$target);
  }

  render($parent, element) {
    $parent.append(element);
  }
}

class Dsc4 {
  $parent;
  $target;
  $simulationComp;
  $canvasComp;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");
    this.$simulationComp = new Simulation4(this.$target);
    this.$canvasComp = new Canvas4(this.$target);

    this.render(this.$parent, this.$target);

    this.$target.style.display = "flex";
    this.$target.style.flexDirection = "column";
  }

  render($parent, element) {
    $parent.append(element);
  }
}

class Dscomponent {
  $container;
  $target;
  constructor(name) {
    const $container = document.getElementById(`${name}`);
    this.$container = $container;
    this.$target = null;

    if ($container) this.$target = new Dsc4(this.$container);
  }
}
