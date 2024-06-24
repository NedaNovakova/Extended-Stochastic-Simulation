class point {
    constructor(x, y, i, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.i = i;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, 2.5, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}