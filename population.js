class population {
    constructor(n, fraction) {
        this.n = n;

        this.members = [];
        for (let i = 0; i < n; i++) {
            this.members.push(0);
        }

        this.cursed = [];
        for (let i = 0; i < n; i++) {
            this.cursed.push(0);
        }

        this.recovered = [];
        for (let i = 0; i < n; i++) {
            this.recovered.push(Number.POSITIVE_INFINITY);
        }

        this.resistant = [];
        for (let i = 0; i < n; i++) {
            if(i < n * fraction / 100) {
                this.resistant.push(true);
            }
            else {
                this.resistant.push(false);
            }
        }
    }
}