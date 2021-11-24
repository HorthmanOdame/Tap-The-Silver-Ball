
const spaces = document.querySelectorAll('.space');
const scoreBoard = document.querySelector('.score');
const balls = document.querySelectorAll('.ball');
let lastSpace = 0;
let timeUp = false;
let score = 0;

// Extra feature: high score board!
const hiscores = JSON.parse(localStorage.getItem('hiscores')) || [];
const scoreList = document.querySelector('.scoretable');

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(spaces) {
  const index = Math.floor(Math.random() * spaces.length);
  const space = spaces[index];
  if (space === lastSpace) {
    return randomHole(spaces);
  }
  lastSpace = space;
  return space;
}

function show() {
  const time = randomTime(200, 1000);
  const space = randomHole(spaces);
  space.classList.add('up');
  setTimeout(() => {
    space.classList.remove('up');
    if (!timeUp) {
      show();
    } else {
      checkScore();
    }
  }, time);
}

function refresh(){
  window.location.reload("reload")
}

function startGame() {
  score = 0;
  scoreBoard.textContent = 0;
  timeUp = false;
  show();
  setTimeout(() => timeUp = true, 10000);
}
const clicker = window.prompt(` What's your name?`);

function tap(e) {
  if(!e.isTrusted) return; // cheater!
  score++;
  this.classList.remove('up');
  scoreBoard.textContent = score;
}

function populateTable() {
  scoreList.innerHTML = hiscores.map((row) => {
    return `<tr><td>${row.clicker}</td><td>${row.score}</tr>`;
  }).join('');
}

function checkScore() {
  let worstScore = 0;
  if (hiscores.length > 4) {
    worstScore = hiscores[hiscores.length - 1].score;
  }

  if (score > worstScore) {
    window.alert (`You've scored ${score} points.`)
    hiscores.push({score, clicker});    
  }
  hiscores.sort((a, b) => a.score > b.score ? -1 : 1);
if (score <  6){
  window.alert (`Try to get a higher score . `)
}
  // Remove the worst score when table too long
  if (hiscores.length > 5) {
    hiscores.pop();
  }

  populateTable();
  localStorage.setItem('hiscores', JSON.stringify(hiscores));
}

function clearScores() {
  hiscores.splice(0, hiscores.length);
  localStorage.setItem('hiscores', JSON.stringify(hiscores));
  populateTable(hiscores, scoreList);
}

balls.forEach(ball => ball.addEventListener('click', tap));

populateTable();