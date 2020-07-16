function randomColor(bigBalls) {
  // return rc;
  return "pink";
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

function randomRadius(bigBalls) {
  if (bigBalls) {
    let r = Math.ceil(Math.random() * 10 + 20);
    return r;
  } else {
    // let r = Math.ceil(Math.random() * 2 + 2);
    let r = 5;
    return r;
  }
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
    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.stroke();
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

class Data {
  constructor() {
    this.affectedLearner = 999014;
    this.pastAffectedLearner = 0;
    this.totalLearner = this.affectedLearner * 1000;
    this.covidData = {
      "0216": 1,
      "0301": 17.1,
      "0316": 44,
      "0401": 91.3,
    };
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
  run() {
    const interval = setInterval(() => {
      if (this.affectedLearner > this.totalLearner) {
        clearInterval(interval);
      }
      this.pastAffectedLearner = this.affectedLearner;
      this.affectedLearner *= 1.5;
    }, 1000);
  }
}

const data = new Data();

function actionCanvas(canvas) {
  // data.run();
  let ctx = canvas.getContext("2d");

  let objArray = [];
  let paused = false;

  let mouseon = false;
  let offsetX = 0;
  let offsetY = 0;
  let mousePosition = false;

  let gravityOn = false;

  let clearCanv = true;

  let bigBalls = false;

  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

  let numStartingSmallBalls = data.getTotalLearner();
  let numStartingBigBalls = 0;

  document.addEventListener("keydown", keyDownHandler);

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function canvasBackground() {
    if (mousePosition === "right") {
      canvas.style.backgroundColor = "black";
    } else {
      canvas.style.backgroundColor = "rgb(215, 235, 240)";
    }
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width / 2, canvas.height);
    if (mousePosition === "left") {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "red";
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

  function ballCollision() {
    for (let i = 0; i < objArray.length - 1; i++) {
      for (let j = i + 1; j < objArray.length; j++) {
        let obj1 = objArray[i];
        let obj2 = objArray[j];
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
      wallCollision(objArray[i]);
    }

    if (objArray.length > 0) wallCollision(objArray[objArray.length - 1]);
  }

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

  function keyDownHandler(event) {
    if (event.keyCode == 67) {
      // c
      objArray[objArray.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
    } else if (event.keyCode == 80) {
      // p
      paused = !paused;
    } else if (event.keyCode == 71) {
      // g
      // This feature WAS taken out
      // because of a bug where
      // balls "merge" with each other
      // when under a lot of pressure.

      // putting back in

      gravityOn = !gravityOn;
    } else if (event.keyCode == 65) {
      // A
      leftHeld = true;
    } else if (event.keyCode == 87) {
      // W
      upHeld = true;
    } else if (event.keyCode == 68) {
      // D
      rightHeld = true;
    } else if (event.keyCode == 83) {
      // S
      downHeld = true;
    } else if (event.keyCode == 82) {
      // r
      objArray = [];
    } else if (event.keyCode == 75) {
      // k
      clearCanv = !clearCanv;
    } else if (event.keyCode == 88) {
      // x
      bigBalls = !bigBalls;
    }
  }

  function applyGravity() {
    for (let obj in objArray) {
      let ob = objArray[obj];
      if (ob.onGround() == false) {
        ob.dy += 0.29;
      }

      // apply basic drag
      ob.dx *= 0.99;
      ob.dy *= 0.975;
    }
  }

  function moveObjects() {
    for (let i = 0; i < objArray.length; i++) {
      let ob = objArray[i];
      ob.x += ob.dx * dt;
      ob.y += ob.dy * dt;
    }
  }

  function drawObjects() {
    for (let obj in objArray) {
      objArray[obj].draw(ctx);
    }
  }

  function draw() {
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000; // delta time in seconds

    // dirty and lazy solution
    // instead of scaling up every velocity vector the program
    // we increase the speed of time
    dt *= 20;

    if (clearCanv) clearCanvas();
    canvasBackground();

    if (!paused) {
      if (gravityOn) {
        applyGravity(); // (and drag)
      }
      moveObjects();
      ballCollision();
    }

    drawObjects();

    if (mouseon) {
      // The size of the emoji is set with the font
      ctx.font = "20px serif";
      // use these alignment properties for "better" positioning
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // draw the emoji
      ctx.fillText("☁️", offsetX, offsetY);
    }

    //logger();

    lastTime = currentTime;
    window.requestAnimationFrame(draw);
  }

  // spawn the initial small thingies.
  for (i = 0; i < numStartingSmallBalls; i++) {
    objArray[objArray.length] = new Ball(randomX(canvas), randomY(canvas), 5, bigBalls);
  }

  // manually spawn the few large ones that
  // start with no velocity. (lazy code)
  bigBalls = true;
  for (i = 0; i < numStartingBigBalls; i++) {
    let temp = new Ball(randomX(canvas), randomY(canvas), randomRadius(bigBalls), bigBalls);
    temp.dx = randomDx() / 8;
    temp.dy = randomDy() / 12;
    objArray[objArray.length] = temp;
  }

  setTimeout(() => {
    const interval = setInterval(() => {
      objArray.splice(0, 1);
      objArray[objArray.length] = new Ball(30, randomY(canvas), 5, bigBalls);
      // if (data.getAffectedLearner() > data.getTotalLearner()) clearInterval(interval);
      // // console.log(data.getAffectedLearner(), data.getSubtractAffectedLearner(), data.getTotalLearner());
      // // console.log(objArray.length);
      // for (let j = 0; j < data.getSubtractAffectedLearner(); j++) {
      //   if (objArray[i].x > canvas.width / 2) {
      //     console.log(data.getAffectedLearner(), data.getTotalLearner());
      //     objArray.splice(i, 1);
      //     objArray[objArray.length] = new Ball(30, randomY(canvas), 5, bigBalls);
      //     break;
      //   }
      // }
    }, 100);
  }, 5000);

  draw();

  canvas.addEventListener("mousemove", onMouseMove, false);
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

  const entries = Object.entries(covidData);

  // setInterval(() => {
  //   data.push(11);
  // }, 1000);

  drawTempChart();
  drawChart();

  function drawAxis() {
    let yPlot = 90;
    let pop = 0;

    tempCtx.beginPath();
    tempCtx.strokeStyle = "black";
    tempCtx.moveTo(50, 20);
    tempCtx.lineTo(50, 80);
    tempCtx.lineTo(380, 80);
    tempCtx.lineTo(380, 20);
    tempCtx.lineTo(50, 20);
    tempCtx.moveTo(50, 80);

    for (let i = 0; i < 2; i++) {
      tempCtx.strokeText(pop, 20, yPlot);
      pop += 100;
      yPlot -= 70;
    }
    tempCtx.stroke();
  }

  function drawTempChart() {
    drawAxis();
    tempCtx.beginPath();
    tempCtx.strokeStyle = "black";
    tempCtx.moveTo(50, 80);
    tempCtx.font = "bold normal 10px Verdana";

    var xPlot = 100;

    for (const [key, value] of entries) {
      var valueInBlocks = 100;
      var valueY = (60 * (100 - value)) / 100 + 20;
      tempCtx.fillText("(" + key + ")", xPlot, valueInBlocks - 5);
      tempCtx.lineTo(xPlot, valueY);
      xPlot += 50;
    }
    tempCtx.stroke();
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
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000; // delta time in seconds

    // dirty and lazy solution
    // instead of scaling up every velocity vector the program
    // we increase the speed of time
    dt *= 20;
    if (currentTime - lastTime < 20000) {
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      putImageData(ctx, imageData, 0, 0, 0, 0, dt, canvas.height);

      requestAnimationFrame(drawChart);
    } else {
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
    this.$target.width = "400";
    this.$target.height = "100";

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
