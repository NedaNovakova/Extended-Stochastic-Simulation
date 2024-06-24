// Helper function to calculate factorial
function factorial(num) {
    if (num < 0) return -1;
    if (num === 0) return 1;
    let result = 1;
    for (let i = num; i > 1; i--) {
        result *= i;
    }
    return result;
}

// Function to calculate n choose k
function nChooseK(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k); // Take advantage of symmetry
    let c = 1;
    for (let i = 0; i < k; i++) {
        c = c * (n - i) / (i + 1);
    }
    return c;
}