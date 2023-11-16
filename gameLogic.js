//         KAO INSPIRACIJU KORISTIO SAM PRIMJER IZ PREDAVANJA !

// dimenzije asteroida i igrača
let asteroidDimensions = (window.innerWidth - 120) * 0.03;

// Broj asteroida: easy - 6, medium - 9, hard - 13, extreme - 16
// Mijenja se s obzirom na odabir u meniju igre
var asteroideCount = 6;

// Globalne varijable
var myGamePiece;
let asteroids = [];
var ship;
var startTime;
var currentResult;

// Funkcija koja stvara objekte asteroida i igrača, prikazuje trenutni Highscore,
// pokreće stvaranje Canvasa sa myGameArea.start();
// Inspiracija preuzeta sa primjera iz predavanja
function startGame(highscore) {
  getHighScore(highscore);
  startTime = Date.now();
  for (i = 0; i < asteroideCount; i++) {
    var spawnCoordinates = spawnFunction();
    asteroids[i] = new asteroid(
      asteroidDimensions,
      asteroidDimensions,
      spawnCoordinates[0],
      spawnCoordinates[1],
      randomNumber(11, true) - 5,
      randomNumber(11, true) - 5
    );
  }
  ship = new starShip(
    asteroidDimensions,
    asteroidDimensions,
    "red",
    window.innerWidth * 0.45,
    window.innerHeight * 0.45
  );
  ship.speed_x = 0;
  ship.speed_y = 0;
  console.log(asteroids);
  console.log(ship);
  myGameArea.start();
}

// Funkcija koja stvara, konfigurira i dodaje canvas na stranicu.
// Inspiracija preuzeta sa primjera iz predavanja
var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.id = "myGameCanvas";
    this.canvas.width = window.innerWidth - 22;
    this.canvas.height = window.innerHeight - 22;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

// Objekt asteroida
// funkcija newPos() onemogućava asteroidu da izađe iz canvasa
// Inspiracija preuzeta sa primjera iz predavanja
function asteroid(width, height, x, y, speed_x, speed_y) {
  // width == height == variable asteroidDimensions
  this.width = width;
  this.height = height;
  // Random broj [-5, 5], bez 0.
  this.speed_x = speed_x;
  this.speed_y = speed_y;
  // Koordinate objekta na Canvasu, kod inicijalizacije uz sami rub Canvasa
  this.x = x;
  this.y = y;

  this.color = randomGrayShade();
  // Prikazuje objekt na Canvasu
  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  };
  // Pozcija objekta se mijenja za speed_x i speed_y.
  // Onemogućava asteroidu da izađe iz canvasa.
  this.newPos = function () {
    if (this.x < 0) this.speed_x = -this.speed_x;
    else if (this.x + this.width >= myGameArea.context.canvas.width)
      this.speed_x = -this.speed_x;
    if (this.y < 0) this.speed_y = -this.speed_y;
    else if (this.y + this.height >= myGameArea.context.canvas.height)
      this.speed_y = -this.speed_y;
    this.x += this.speed_x;
    this.y -= this.speed_y;
  };
}

// Objekt igrača, jednako kao i objekt Asteroid, samo bez predodređene brzine.
// Funkcija newPos() omogućava igraču da kad izađe s jedne starne Canvasa, uđe s druge strane.
// Inspiracija preuzeta sa primjera iz predavanja
function starShip(width, height, color, x, y) {
  // width == height == variable asteroidDimensions
  this.width = width;
  this.height = height;
  // speed_x == speed_y == 10, određeno u keyPressEvents.js
  var speed_x;
  var speed_y;
  // Koordinate igrača na Canvasu, kod inicijalizacije na sredini Canvasa
  this.x = x;
  this.y = y;
  // Prikazuje objekt na Canvasu
  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.shadowBlur = 5;
    ctx.shadowColor = "black";
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  };
  // Ažurira koordinate igrača.
  // Omogućava igraču da kad izađe s jedne starne Canvasa, uđe s druge strane.
  this.newPos = function () {
    if (this.x + this.width <= 0) this.x = myGameArea.context.canvas.width;
    else if (this.x >= myGameArea.context.canvas.width) this.x = -ship.width;
    if (this.y + this.height <= 0) this.y = myGameArea.context.canvas.height;
    else if (this.y >= myGameArea.context.canvas.height) this.y = -ship.height;
    this.x += this.speed_x;
    this.y -= this.speed_y;
  };
}

// Funkcija koja se izvršava svakih 20ms. Ažurira se vrijeme igre.
// Na canvas se iscrtravaju asteroidi i igrač na novim pozicijama.
function updateGameArea() {
  let timer = Date.now() - startTime;

  currentResult = timer;

  let time = parseTimer(timer);

  let timerSpan = document.getElementById("timerSpan");
  timerSpan.innerText = time;

  myGameArea.clear();
  for (i = 0; i < asteroideCount; i++) {
    asteroids[i].newPos();
    asteroids[i].update();
  }
  ship.newPos();
  ship.update();

  checkForCrashes();
}

// F-ja koja se izvršava svakih 20ms. Provjerava za svaki asteroid potencijalnu koliziju.
function checkForCrashes() {
  for (let i = 0; i < asteroideCount; i++) {
    if (
      asteroids[i].x - asteroids[i].width < ship.x &&
      asteroids[i].x + asteroids[i].width > ship.x &&
      asteroids[i].y - asteroids[i].width < ship.y &&
      asteroids[i].y + asteroids[i].width > ship.y
    ) {
      gameOver();
    }
  }
}

// Zaustavlja igru, prikazuje meni
function gameOver() {
  myGameArea.stop();
  let menuDiv = document.getElementById("menuDivRetry");
  menuDiv.style.visibility = "visible";
  let myTime = document.getElementById("myTime");
  myTime.innerText = document.getElementById("timerSpan").innerText;
  getHighScore(currentResult);
}

// Uklanja meni sa screena te ponovno pokreće igru
function retry(numberOfAsteroids) {
  asteroideCount = numberOfAsteroids;
  let menuDiv = document.getElementById("menuDivRetry");
  menuDiv.style.visibility = "hidden";
  let startMenu = document.getElementById("menuDivStart");
  startMenu.style.visibility = "hidden";
  console.log(currentResult);
  startGame(currentResult);
}

// Dohvaćanje, spremanje i prikazivanje highscorea[ms] iz local storagea
function getHighScore(highscore) {
  if (typeof Storage !== "undefined") {
    if (localStorage.highscore) {
      let oldHS = localStorage.highscore;
      if (highscore != undefined && highscore > oldHS) {
        localStorage.highscore = highscore;
      }
    } else {
      if (highscore == undefined) {
        localStorage.highscore = 0;
      } else if (highscore > oldHS) {
        localStorage.highscore = highscore;
      }
    }
    let hsSpan = document.getElementById("highscoreSpan");
    hsSpan.innerText = parseTimer(localStorage.highscore);
  } else {
    alert("Your browser is outdated. Highscore functionality doesn't work!");
  }
}

// Funkcija koja milisekunde pretvara u string min:s:ms
function parseTimer(timer) {
  let minutes = Math.floor(timer / 1000 / 60);
  let seconds = Math.floor((timer % (1000 * 60)) / 1000);
  let miliseconds = timer % 1000;

  if (miliseconds == NaN || seconds == NaN || minutes == NaN) {
    return 0;
  }

  return `${minutes}:${seconds}:${miliseconds}`;
}

// Funkcija koja vraća random broj [0 - number]
// Ako računamo brzinu, onemogućava da brzina po nekoj osi bude 0
function randomNumber(number, speed = false) {
  if (speed == true) {
    var randomN = 5;
    while (randomN == 5) {
      randomN = Math.floor(Math.random() * number) + 1;
    }
    return randomN;
  }
  return Math.floor(Math.random() * number) + 1;
}

// Funkcija koja određuje koordinate asteroida pri pokretanju igre.
// Budući da je canvas zatvoreni prostor, asteroidi se pojavljuju na samom rubu canvasa, a igrač se pojavljuje na sredini.
function spawnFunction() {
  var xOrY = Math.random() < 0.5;
  var whichSide = Math.random() < 0.5;
  var x, y;

  if (xOrY) {
    if (whichSide) {
      y = 0;
    } else {
      y = window.innerHeight - asteroidDimensions - 25;
    }
    x = randomNumber(window.innerWidth - asteroidDimensions - 25, false);
  } else {
    if (whichSide) {
      x = 0;
    } else {
      x = window.innerWidth - asteroidDimensions - 25;
    }
    y = randomNumber(window.innerHeight - asteroidDimensions - 25, false);
  }
  return [x, y];
}

function randomGrayShade() {
  const shade = Math.floor(Math.random() * 256);
  const color = `rgb(${shade}, ${shade}, ${shade})`;
  return color;
}
