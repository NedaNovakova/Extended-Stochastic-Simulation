function addCursePoint(group) {
    // If the end of the canvas has been reached, delete the earliest point and shift all remaining points to the left
    if(cursePoints[cursePoints.length - 1].x >= canvas.width - 7.5) {
        cursePoints.shift();
        cursePoints.forEach(element => element.x -= 10);
    }

    // Define the new point's coordinates based on the last day 
    let x = cursePoints[cursePoints.length - 1].x + 10; // x coordinate on the canvas
    let y = -1; // y coordinate on the canvas (to be determined)

    if(!strategiesActive) {
        // Define a list of probabilities to go from (s, r) to (s + j, r)
        let probabilities = [];

        // Use the values from the transition matrix definition
        for (let j = 0; j <= n; j++) {
            if(j > (s + m)) {
                probabilities.push(0);
            }
            else{
                probabilities.push(
                    nChooseK(Math.min(s, n + m - s - r), j) * Math.pow(p, j) * Math.pow(1 - p, Math.min(s, n + m - s - r) - (j))
                );
            }
        }

        // Find the highest probability
        let max = 0;

        probabilities.forEach(element => {
            if(element > max) max = element;
        });

        // Repeat until a valid number of newly cursed wizards is chosen
        while(y == -1) {
            // Choose a random value for the number of wizards to curse
            let k = Math.floor(Math.random() * (n + 1));
            // Choose a random probability with which to accept the chosen value
            let t = Math.random();

            // If the chosen value of k is accepted, add a new datapoint
            if(t < probabilities[k] / max){
                y = (n - (s - k)) * ((canvas.height - 6) / (n)) + 2.5; // Calculate y coordinate from the number of cursed wizards
                cursePoints.push(new point(x, y, s - k, 'orange'));
                curse(k, group); // Update the status of the cursed wizards

                // Return the new value of s, so it can be updated for the next day
                return s - k;
            }
        }
    }
    else {
        // Number of successful curses
        let successes = 0;
        // Cast the appropriate number of spells
        for (let i = 0; i < Math.min(s, n + m - s - r); i++) {
            // Find a susceptible wizard
            let k;
            do {
                k = Math.floor(Math.random() * (n + 1));
            } while (group.members[k] != 0);
            
            // Choose probability for the curse to succeed
            let t = Math.random();

            // If the right conditions are met, curse the wizard
            if((group.resistant[k] && t < p / 2) || (!group.resistant[k] && t < p)) {
                group.members[k] = 1;
                group.cursed[k] = dayCount; // keep track of the day on which the wizard is cursed
                successes++;
            }
        }

        y = (n - (s - successes)) * ((canvas.height - 6) / (n)) + 2.5; // Calculate y coordinate from the number of cursed wizards
        cursePoints.push(new point(x, y, s - successes, 'orange'));

        // Return the new value of s, so it can be updated for the next day
        return s - successes;
    }
}

function curse(k, group) {
    while(k > 0) {
        let x = Math.floor(Math.random() * (n + 1));
        if (group.members[x] == 0) {
            group.members[x] = 1;
            group.cursed[x] = dayCount;
            k--;
        }
    }
}

function addRecoverPoint(group) {

    // If the end of the canvas has been reached, delete the earliest point and shift all remaining points to the left
    if(recoverPoints[recoverPoints.length - 1].x >= canvas.width - 7.5) {
        recoverPoints.shift();
        recoverPoints.forEach(element => element.x -= 10);
    }

    // Define the new point's coordinates based on the last day 
    let x = recoverPoints[recoverPoints.length - 1].x + 10; // x coordinate on the canvas
    let y = -1; // y coordinate on the canvas (to be determined)

    // Define a list of probabilities to go from (s, r) to (s, r + j)
    let probabilities = [];

    // Use the values from the transition matrix definition
    for (let j = 0; j <= n; j++) {
        if(j > (n - s - r)) {
            probabilities.push(0);
        }
        else{
            probabilities.push(
                nChooseK(n - s - r, j) * Math.pow(q, j) * Math.pow(1 - q, n - s - r - j)
            );
        }
    }

    // Find the highest probability
    let max = 0;

    probabilities.forEach(element => {
        if(element > max) max = element;
    });

    // Repeat until a valid number of newly recovered wizards is chosen
    while(y == -1) {
        // Choose a random value for the number of wizards to recover
        let k = Math.floor(Math.random() * (n + 1));
        // Choose a random probability with which to accept the chosen value
        let t = Math.random();

        // If the chosen value of k is accepted, add a new datapoint
        if(t < probabilities[k] / max){
            y = (n - (r + k)) * ((canvas.height - 6) / (n)) + 2.5; // Calculate y coordinate from the number of cursed wizards
            recoverPoints.push(new point(x, y, r + k, 'purple'));
            recover(k, group); // Update the status of the newly recovered wizards

            // Return the new value of r, so it can be updated for the next day
            return r + k;
        }
    }
}

function recover(k, group) {
    while(k > 0) {
        let x = Math.floor(Math.random() * (n + 1));
        if (group.members[x] == 1) {
            group.members[x] = 2;
            group.recovered[x] = dayCount;
            k--;
        }
    }
}


function simulate(group) {

    // Security measures
    if (strategiesActive) {
        m = 0;
        for (let i = 0; i < initialM; i++) {
            let x = Math.random();
            if(x > se) m++;
        }
    }
    else {
        m = initialM;
    }

    // Add the new data points and collect the new values of s and r
    let newS = addCursePoint(group);
    let newR = addRecoverPoint(group);

    // Update s and r if necessary
    if(s != 0) s = newS;
    if(r != n) r = newR;

    // Update the current day
    dayCount++;
    if (n - s - r > mostCursed) mostCursed = n - s - r;
}

// Compute average recovery time
function computeAverage(group) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < group.n; i++) {
        if(group.members[i] == 2) {
            sum += group.recovered[i] - group.cursed[i];
            count++;
        }
    }

    if(sum == 0) return "-";
    return (sum / count).toFixed(2);
}

// Compute how many resistant wizards are cursed
function typeCursed(group) {
    let count = 0;

    for (let i = 0; i < group.n; i++) {
        if(group.resistant[i] && group.members[i] == 1) {
            count++;
        }
    }

    return count;
}