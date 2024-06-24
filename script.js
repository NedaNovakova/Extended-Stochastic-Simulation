let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

let yAxis = document.getElementById('yAxis');
let cy = yAxis.getContext('2d');

let xAxis = document.getElementById('xAxis');
let cx = xAxis.getContext('2d');

let n;
let m;
let p;
let s;
let r;

let strategiesActive = false;
let initialM;

let cursePoints;
let recoverPoints;
let wizards;
let dayCount;
let mostCursed;

let currentDay = document.getElementById('currentDay');
let currentSusceptible = document.getElementById('currentSusceptible')
let currentCursed = document.getElementById('currentCursed');
let currentRecovered = document.getElementById('currentRecovered');
let averageRecoveryTime = document.getElementById('avgRecTime');
let highestCursed = document.getElementById('maxCursed');
let noSusceptible = document.getElementById('noSusceptible');
let fullRecovery = document.getElementById('fullRecovery');

let currentM = document.getElementById('currentM');
let resCursed = document.getElementById('resCursed');

function initialize() {
    if(dayCount != null) return;

    n = Number(document.getElementById('wizards').value);
    m = Number(document.getElementById('deathEaters').value);
    p = Number(document.getElementById('successRate').value);
    q = Number(document.getElementById('recoveryRate').value);
    se = Number(document.getElementById('security').value);
    res = Number(document.getElementById('resistant').value);

    s = n;
    r = 0;
    initialM = m;

    cursePoints = [new point(3.5, 2.5, n, 'orange')];
    recoverPoints = [new point(3.5, canvas.height - 3.5, 0, 'purple')];
    wizards = strategiesActive ? new population(n, res) : new population(n, 0);
    dayCount = 0;
    mostCursed = 0;
}

function drawAxisLabels() {
    for (let i = 2.5; i < 110 * (canvas.height - 5) / 100; i += 10 * (canvas.height - 5) / 100) {
        cy.beginPath();
        cy.moveTo(0, i);
        cy.lineTo(yAxis.width, i);
        cy.strokeStyle = 'black';
        cy.stroke();
    }

    for (let i = 3.5; i <= canvas.width; i += 10) {
        cx.beginPath();
        cx.moveTo(i, 0);
        cx.lineTo(i, xAxis.height);
        cx.strokeStyle = 'black';
        cx.stroke();
    }
}

function drawGrid() {
    for (let i = 2.5; i < 110 * (canvas.height - 5) / 100; i += 10 * (canvas.height - 5) / 100) {
        c.beginPath();
        c.moveTo(0, i);
        c.lineTo(canvas.width, i);
        c.strokeStyle = '#efefef';
        c.stroke();
    }

    for (let i = 3.5; i <= canvas.width; i += 10) {
        c.beginPath();
        c.moveTo(i, 0);
        c.lineTo(i, canvas.height);
        c.strokeStyle = '#efefef';
        c.stroke();
    }
}

function displayStats() {
    currentDay.innerHTML = dayCount;
    currentSusceptible.innerHTML = s;
    currentCursed.innerHTML = n - s - r;
    currentRecovered.innerHTML = r;
    averageRecoveryTime.innerHTML = computeAverage(wizards) + " days";
    highestCursed.innerHTML = mostCursed;

    if(noSusceptible.innerHTML == "" && s == 0) noSusceptible.innerHTML = "day " + dayCount;
    if(fullRecovery.innerHTML == "" && r == n) fullRecovery.innerHTML = "day " + dayCount;

    currentM.innerHTML = m;
    resCursed.innerHTML = typeCursed(wizards);
}

function setup() {
    drawGrid();

    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, canvas.height);
    c.strokeStyle = 'black';
    c.stroke();

    c.beginPath();
    c.moveTo(0, canvas.height);
    c.lineTo(canvas.width, canvas.height);
    c.strokeStyle = 'black';
    c.stroke();
}

setup();


function actionLoop(){
    c.clearRect(0, 0, canvas.width, canvas.height);

    setup();

    for (let i = 0; i < cursePoints.length - 1; i++) {
        c.beginPath();
        c.moveTo(cursePoints[i].x, cursePoints[i].y);
        c.lineTo(cursePoints[i + 1].x, cursePoints[i + 1].y);
        c.strokeStyle = 'blue';
        c.stroke();

        cursePoints[i].draw();
    }
    cursePoints[cursePoints.length - 1].draw();

    for (let i = 0; i < recoverPoints.length - 1; i++) {
        c.beginPath();
        c.moveTo(recoverPoints[i].x, recoverPoints[i].y);
        c.lineTo(recoverPoints[i + 1].x, recoverPoints[i + 1].y);
        c.strokeStyle = 'maroon';
        c.stroke();

        recoverPoints[i].draw();
    }
    recoverPoints[recoverPoints.length - 1].draw();
}

drawAxisLabels();