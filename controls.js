let actionInterval;
let simulateInterval;

function start(){
    initialize();
    if(actionInterval == null) actionInterval = setInterval(actionLoop, 1);
    if(simulateInterval == null) simulateInterval = setInterval(() => {simulate(wizards); displayStats()}, 500); // number controls simulation speed
}

function stop(){
    clearInterval(actionInterval);
    clearInterval(simulateInterval);

    actionInterval = null;
    simulateInterval = null;
}

function reset() {
    stop();

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

    currentDay.innerHTML = "";
    currentSusceptible.innerHTML = "";
    currentCursed.innerHTML = "";
    currentRecovered.innerHTML = "";
    averageRecoveryTime.innerHTML = "";
    highestCursed.innerHTML = "";

    noSusceptible.innerHTML = "";
    fullRecovery.innerHTML = "";

    currentM.innerHTML = "";
    resCursed.innerHTML = "";

    c.clearRect(0, 0, canvas.width, canvas.height);
    setup();
    drawAxisLabels();
}

function toggleStrategies(button){
    if(button.innerHTML == 'Apply Strategies') {
        button.innerHTML = 'Remove Strategies';
        document.getElementById('strategies').style.display = 'block';
        document.getElementById('advanced').style.display = 'inline';
        strategiesActive = true;
    }
    else {
        button.innerHTML = 'Apply Strategies';
        document.getElementById('strategies').style.display = 'none';
        document.getElementById('advanced').style.display = 'none';
        strategiesActive = false;
    }
}