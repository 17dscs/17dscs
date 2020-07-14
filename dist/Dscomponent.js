function randomColor(bigBalls) {
  let red = Math.floor(Math.random() * 3) * 127;
  let green = Math.floor(Math.random() * 3) * 127;
  let blue = Math.floor(Math.random() * 3) * 127;

  // dim down the small balls
  if (!bigBalls) {
    red *= 0.65;
    green *= 0.65;
    blue *= 0.65;
  }

  let rc = "rgb(" + red + ", " + green + ", " + blue + ")";
  return rc;
}

function randomX(canvas) {
  let x = Math.floor(Math.random() * canvas.width);
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
    let r = Math.ceil(Math.random() * 2 + 2);
    //let r = 5;
    return r;
  }
}

function randomDx() {
  let r = Math.floor(Math.random() * 10 - 4);
  return r;
}

function randomDy() {
  let r = Math.floor(Math.random() * 10 - 3);
  return r;
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
    this.color = randomColor(bigBalls);
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

function actionCanvas(canvas) {
  let ctx = canvas.getContext("2d");

  let objArray = [];

  let bigBalls = false;

  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

  let numStartingSmallBalls = 20;
  let numStartingBigBalls = 2;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function canvasBackground() {
    canvas.style.backgroundColor = "rgb(215, 235, 240)";
  }

  function wallCollision(ball) {
    if (ball.x - ball.radius + ball.dx < 0 || ball.x + ball.radius + ball.dx > canvas.width) {
      ball.dx *= -1;
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
        let ob1 = objArray[i];
        let ob2 = objArray[j];
        let dist = distance(ob1, ob2);

        if (dist < ob1.radius + ob2.radius) {
          let theta1 = ob1.angle();
          let theta2 = ob2.angle();
          let phi = Math.atan2(ob2.y - ob1.y, ob2.x - ob1.x);
          let m1 = ob1.mass;
          let m2 = ob2.mass;
          let v1 = ob1.speed();
          let v2 = ob2.speed();

          let dx1F = ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
          let dy1F = ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
          let dx2F = ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
          let dy2F = ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

          ob1.dx = dx1F;
          ob1.dy = dy1F;
          ob2.dx = dx2F;
          ob2.dy = dy2F;

          staticCollision(ob1, ob2);
        }
      }
      wallCollision(objArray[i]);
    }

    if (objArray.length > 0) wallCollision(objArray[objArray.length - 1]);
  }

  function staticCollision(ob1, ob2, emergency = false) {
    let overlap = ob1.radius + ob2.radius - distance(ob1, ob2);
    let smallerObject = ob1.radius < ob2.radius ? ob1 : ob2;
    let biggerObject = ob1.radius > ob2.radius ? ob1 : ob2;

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
    dt *= 10;

    clearCanvas();
    canvasBackground();

    {
      moveObjects();
      ballCollision();
    }

    drawObjects();

    //logger();

    lastTime = currentTime;
    window.requestAnimationFrame(draw);
  }

  // spawn the initial small thingies.
  for (i = 0; i < numStartingSmallBalls; i++) {
    objArray[objArray.length] = new Ball(randomX(canvas), randomY(canvas), randomRadius(bigBalls), bigBalls);
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

  draw();
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

class Simulation4 {
  $parent;
  $target;
  constructor(parent) {
    this.$parent = parent;
    this.$target = document.createElement("div");

    this.render(this.$parent, this.$target);

    this.$target.style.height = "100px";
    this.$target.style.backgroundColor = "blue";
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
