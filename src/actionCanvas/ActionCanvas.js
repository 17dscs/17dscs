import Ball from "./Ball";
import { randomRadius, randomX, randomY, randomDx, randomDy, distance } from "./utils";
import data from "../datas/data";

export default function actionCanvas(canvas) {
  // data.run();
  let ctx = canvas.getContext("2d");

  let objArray = [];
  let paused = false;
  let bumped = false;

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

  function ballCollision2() {
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

          let dx1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.cos(phi) +
            v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
          let dy1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2)) * Math.sin(phi) +
            v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
          let dx2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.cos(phi) +
            v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
          let dy2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2)) * Math.sin(phi) +
            v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

          ob1.dx = dx1F;
          ob1.dy = dy1F;
          ob2.dx = dx2F;
          ob2.dy = dy2F;
          // ob1.dx *= -1;
          // ob1.dy *= -1;
          // ob2.dx *= -1;
          // ob2.dy *= -1;

          staticCollision(ob1, ob2);
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

  function logger() {
    // log stuff
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
