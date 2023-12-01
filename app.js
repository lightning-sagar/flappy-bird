const bird = document.querySelector('.bird');
const gameDisplay = document.querySelector('.game-container');
const ground = document.querySelector('.ground-moving');
const h2 = document.querySelector('h2');

let birdLeft = 220;
let birdBottom = 280;
let gravity = 2; 
let isGameOver = false;
let gap;

const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');

if (difficulty === 'easy') {
    gap = 500;
} else if (difficulty === 'medium') {
    gap = 450;
} else if (difficulty === 'hard') {
    gap = 400;
}

let gameTimerId;

function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';

    if (birdBottom < 119.9) {
        console.log("gameover");
        clearInterval(gameTimerId);
        obstacleTimerIds.forEach((id) => clearInterval(id));
        gameOver();
    }
}

function control(e) {
    if (e.keyCode === 32 || e.keyCode === 18 || e.keyCode === 13 || e.keyCode === 38) {
        jump();
    } else {
        console.log(e.keyCode);
    }
}

function jump() {
    if (birdBottom < 570) birdBottom += 50;
    bird.style.bottom = birdBottom + 'px';
    console.log(birdBottom);
}

document.addEventListener('keyup', control);

let obstacleTimerIds = [];

function generateObstacle() {
    let obstacleLeft = 1200;
    let randomHeight = Math.random() * 40;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement('div');
    const topObstacle = document.createElement('div');

    if (!isGameOver) {
        obstacle.classList.add('obstacle');
        topObstacle.classList.add('topObstacle');
    }

    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);

    obstacle.style.left = obstacleLeft + 'px';
    topObstacle.style.left = obstacleLeft + 'px';

    obstacle.style.bottom = obstacleBottom + 'px';
    topObstacle.style.bottom = obstacleBottom + gap + 'px';

    function moveObstacle() {
        obstacleLeft -= 2;
        obstacle.style.left = obstacleLeft + 'px';
        topObstacle.style.left = obstacleLeft + 'px';

        if (obstacleLeft === -60) {
            clearInterval(timerId);
            gameDisplay.removeChild(topObstacle);
            gameDisplay.removeChild(obstacle);
        }

        if (
            obstacleLeft > 200 &&
            obstacleLeft < 280 &&
            birdLeft > obstacleLeft - 90 &&
            birdLeft < obstacleLeft + 60 &&
            (birdBottom < obstacleBottom + 300 || birdBottom > obstacleBottom + gap)
        ) {
            console.log("Collision Detected!");
            gameOver();
        }
    }

    let timerId = setInterval(moveObstacle, 20);
    obstacleTimerIds.push(timerId);
    if (!isGameOver) setTimeout(generateObstacle, 3000);
}

function gameOver() {
    console.log("Game Over");
    isGameOver = true;
    clearInterval(gameTimerId);
    obstacleTimerIds.forEach((id) => clearInterval(id));

    let counter = 5; // Initial counter value
    h2.innerText = `Game Over. Restarting in ${counter} seconds...`;

    const countdownInterval = setInterval(() => {
        counter--;

        if (counter > 0) {
            h2.innerText = `Game Over. Restarting in ${counter} seconds...`;
        } else {
            h2.innerText = ""; 
            clearInterval(countdownInterval);
            restartGame();
        }
    }, 1000); 
}

function restartGame() {
    const obstacles = document.querySelectorAll('.obstacle, .topObstacle');
    obstacles.forEach((obstacle) => obstacle.remove());

     birdBottom = 280;

    isGameOver = false;
    start();

}
function start(){
    gameTimerId = setInterval(startGame, 20);
    generateObstacle();

}
start()
