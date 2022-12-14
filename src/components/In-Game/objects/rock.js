import paper from "paper";

function Stone (x, y, size) {
    this.group = new paper.Group();
    this.stonePath = new paper.Path([x - 387.975, y + 24.385], [x - 377.975, y - 22.651], [x - 37.975, y - 125.651], [x + 362.025, y - 35.651], [x + 342.025, y + 74.349], [x - 32.975, y + 124.349], [x - 387.975, y + 24.385]);

    // Setup the design and size of stone
    this.constructor = function () {
        this.stonePath.strokeColor = "#595260";
        this.stonePath.strokeWidth = 10;
        this.stonePath.strokeCap = "round";
        this.stonePath.smooth();
        this.stonePath.fillColor = "#B2B1B9";
        this.stonePath.scale(size);
        this.group.addChild(this.stonePath);
    };

    this.constructor();
}


function SideStone (x, y, degree, reverse, mapSize) {
    this.group = new paper.Group();
    this.stonePath = new paper.Path([0, mapSize[1] / 2], [0, 0], [20, 40], [70, 200], [100, 250], [130, 400], [200, 500], [300, 520], [500, 580], [600, 580], [700, 650], [800, 650], [900, 660], [1200, 800], [mapSize[0] / 2, mapSize[1] / 2]);


    // Setup design and position and etc...
    this.constructor = function () {
        // Set color and stroke color and weight of storke
        this.stonePath.fillColor = "#B2B1B9";
        this.stonePath.strokeColor = "#595260";
        this.stonePath.strokeWidth = 10;

        // Connect the last point to first point
        this.stonePath.closed = true;

        // Make all points smooth
        this.stonePath.smooth();

        // Control the overscreen curves
        this.controlOverscreenCurves();

        // set rotate
        this.stonePath.rotate(degree, 0);

        // set poisition
        this.stonePath.position.x = x;
        this.stonePath.position.y = y;


        // flip horizontally
        if (reverse) {
            this.stonePath.scale(-1, 1);
        }

        // Add Path to Group
        this.group.addChild(this.stonePath);

    };

    // Setup curves of stones
    this.controlOverscreenCurves = function () {


        this.stonePath.curves[0].handle1.y = 0;
        this.stonePath.curves[0].handle2.y = 0;
        this.stonePath.curves[0].handle1.x = 0;
        this.stonePath.curves[0].handle2.x = 0;
        this.stonePath.curves[1].handle1.y = 10;
        this.stonePath.curves[1].handle2.y = 5;
        this.stonePath.curves[1].handle1.x = 5;
        this.stonePath.curves[1].handle2.x = 0;
        this.stonePath.curves[2].handle1.x = 70;
        this.stonePath.curves[this.stonePath.curves.length - 2].handle1.x = 0;
        this.stonePath.curves[this.stonePath.curves.length - 2].handle1.y = 0;
        this.stonePath.curves[this.stonePath.curves.length - 2].handle2.x = 0;
        this.stonePath.curves[this.stonePath.curves.length - 2].handle2.y = 0;
        this.stonePath.curves[this.stonePath.curves.length - 1].handle1.x = 0;
        this.stonePath.curves[this.stonePath.curves.length - 1].handle1.y = 0;
        this.stonePath.curves[this.stonePath.curves.length - 1].handle2.x = 0;
        this.stonePath.curves[this.stonePath.curves.length - 1].handle2.y = 0;

    };



    this.constructor();


}


export default Stone;
export { SideStone };