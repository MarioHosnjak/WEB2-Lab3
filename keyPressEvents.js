var pressedKeys = [];

window.addEventListener("keydown", (e) => {
  if (!pressedKeys.includes(e.keyCode)) {
    pressedKeys.push(e.keyCode);
  }
  checkGameKeys();
});

window.addEventListener("keyup", (e) => {
  if (pressedKeys.includes(e.keyCode)) {
    pressedKeys.splice(pressedKeys.indexOf(e.keyCode), 1);
  }
});

function key(x) {
  return pressedKeys.includes(x);
}

function checkGameKeys() {
  const speed = 10;
  if (key(37) || key(65)) {
    // Left Arrow Key
    ship.x -= speed;
  }
  if (key(39) || key(68)) {
    // Right Arrow Key
    ship.x += speed;
  }
  if (key(38) || key(87)) {
    // Up Arrow Key
    ship.y -= speed;
  }
  if (key(40) || key(83)) {
    // Down Arrow Key
    ship.y += speed;
  }
  ship.newPos();
  ship.update();
}
