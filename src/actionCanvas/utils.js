export function randomColor(bigBalls) {
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
  // return rc;
  return "white";
}

export function randomX(canvas) {
  let x = Math.floor(Math.random() * canvas.width + canvas.width / 2);
  if (x < 30) {
    x = 30;
  } else if (x + 30 > canvas.width) {
    x = canvas.width - 30;
  }
  return x;
}

export function randomY(canvas) {
  let y = Math.floor(Math.random() * canvas.height);
  if (y < 30) {
    y = 30;
  } else if (y + 30 > canvas.height) {
    y = canvas.height - 30;
  }
  return y;
}

export function randomRadius(bigBalls) {
  if (bigBalls) {
    let r = Math.ceil(Math.random() * 10 + 20);
    return r;
  } else {
    // let r = Math.ceil(Math.random() * 2 + 2);
    let r = 5;
    return r;
  }
}

export function randomDx() {
  const dxs = [2, -2];
  let r = Math.floor(Math.random() * 2);
  return dxs[r];
  // let r = Math.floor(Math.random() * 10 - 4);
  // return r;
}

export function randomDy() {
  const dys = [2, -2];
  let r = Math.floor(Math.random() * 2);
  return dys[r];
  // let r = Math.floor(Math.random() * 10 - 3);
  // return r;
}

export function distanceNextFrame(a, b) {
  return Math.sqrt((a.x + a.dx - b.x - b.dx) ** 2 + (a.y + a.dy - b.y - b.dy) ** 2) - a.radius - b.radius;
}

export function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
