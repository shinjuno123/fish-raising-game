import paper from "paper";
import { v4 as uuidv4 } from "uuid";
import { startyMovementHandler } from "./CharactersEvent";

// Starty(fish character in game) class
function Starty (head, isReverse = false) {
    this.head = head;
    this.starty = new paper.Group();
    this.isReverse = isReverse;
    this.id = uuidv4();

    this.constructor = function () {
        this.starty = new paper.Group();
        const startyBody = this._makeBody(this.isReverse);
        const startyTail = this._makeTail(this.isReverse);
        const startyFin = this._makeFin(this.isReverse);
        const { startyEye, startyPupil } = this._makeEyeAndPupil(this.isReverse);
        const startyMouth = this._makeMouth(this.isReverse);


        this.starty.addChild(startyBody);
        this.starty.addChild(startyTail);
        this.starty.addChild(startyFin);
        this.starty.addChild(startyEye);
        this.starty.addChild(startyPupil);
        this.starty.addChild(startyMouth);
        this._makeBodyFin(this.isReverse);
        this._makeTailFin(this.isReverse);
    };


    this.getPosition = function () {
        return this.starty.position;
    };

    this.setPosition = function (point) {
        this.starty.position.x = point.x;
        this.starty.position.y = point.y;
    };

    this.setSize = function (width, height) {
        this.starty.bounds.width = width;
        this.starty.bounds.height = height;
    };

    this.getSize = function () {
        return this.starty.bounds;
    };

    this.setReverse = function (isReverse = false) {
        this.isReverse = isReverse;
        const previousPosition = this.starty.position;
        this.starty.remove();
        this.constructor();
        this.starty.position = previousPosition;

    };

    this.getReverse = function () {
        return this.isReverse;
    };


    this._makeBody = function (isReverse = false) {
        if (isReverse) {
            const startyBody = new paper.Path([this.head.x + 200, this.head.y], [this.head.x + 40, this.head.y + 10], [this.head.x + 40, this.head.y - 10], [this.head.x + 200, this.head.y]);
            startyBody.curves[0].handle1.y = 45;
            startyBody.curves[0].handle2.y = 15;
            startyBody.curves[2].handle2.y = -45;
            startyBody.curves[2].handle1.y = -15;
            startyBody.fillColor = "#31E1F7";
            startyBody.strokeColor = "black";
            startyBody.strokeWidth = 3;
            startyBody.closed = true;

            return startyBody;

        } else {
            const startyBody = new paper.Path([this.head.x, this.head.y], [this.head.x + 160, this.head.y + 10], [this.head.x + 160, this.head.y - 10], [this.head.x, this.head.y]);
            startyBody.curves[0].handle1.y = 45;
            startyBody.curves[0].handle2.y = 15;
            startyBody.curves[2].handle2.y = -45;
            startyBody.curves[2].handle1.y = -15;
            startyBody.fillColor = "#31E1F7";
            startyBody.strokeColor = "black";
            startyBody.strokeWidth = 3;
            startyBody.closed = true;

            return startyBody;
        }

    };


    this._makeTail = function (isReverse = false) {
        if (isReverse) {
            const startyTail = new paper.Path([this.head.x + 40, this.head.y - 10], [this.head.x, this.head.y - 30], [this.head.x, this.head.y + 30], [this.head.x + 40, this.head.y + 10]);
            startyTail.fillColor = "#D800A6";
            startyTail.strokeColor = "black";
            startyTail.strokeWidth = 3;
            startyTail.closed = true;
            startyTail.curves[0].handle1.y = -5;
            startyTail.curves[2].handle1.y = 5;

            return startyTail;
        }
        else {
            const startyTail = new paper.Path([this.head.x + 160, this.head.y - 10], [this.head.x + 200, this.head.y - 30], [this.head.x + 200, this.head.y + 30], [this.head.x + 160, this.head.y + 10]);
            startyTail.fillColor = "#D800A6";
            startyTail.strokeColor = "black";
            startyTail.strokeWidth = 3;
            startyTail.closed = true;
            startyTail.curves[0].handle1.y = -5;
            startyTail.curves[2].handle1.y = 5;
            return startyTail;
        }

    };

    this._makeFin = function (isReverse = false) {
        if (isReverse) {
            const startyFin = new paper.Path([this.head.x + 155, this.head.y - 26], [this.head.x + 130, this.head.y - 45], [this.head.x + 60, this.head.y - 20], [this.head.x + 155, this.head.y - 26]);
            startyFin.fillColor = "#D800A6";
            startyFin.strokeColor = "black";
            startyFin.strokeWidth = 3;
            startyFin.curves[0].handle2.y = 10;
            startyFin.curves[2].handle1.y = -2;
            startyFin.curves[2].handle2.y = -3;
            return startyFin;
        } else {
            const startyFin = new paper.Path([this.head.x + 45, this.head.y - 26], [this.head.x + 70, this.head.y - 45], [this.head.x + 140, this.head.y - 20], [this.head.x + 45, this.head.y - 26]);
            startyFin.fillColor = "#D800A6";
            startyFin.strokeColor = "black";
            startyFin.strokeWidth = 3;
            startyFin.curves[0].handle2.y = 10;
            startyFin.curves[2].handle1.y = -2;
            startyFin.curves[2].handle2.y = -3;

            return startyFin;
        }

    };

    this._makeEyeAndPupil = function (isReverse = false) {

        // Declare eye and pupil variables
        let startyEye, startyPupil;

        // check if reverse left and right or not
        if (isReverse) {
            startyEye = new paper.Path.Circle([this.head.x + 180, this.head.y - 6], 8);

            startyPupil = new paper.Path([startyEye.position.x - 3, startyEye.position.y + 2], [startyEye.position.x + 3, startyEye.position.y + 2]);
        } else {
            startyEye = new paper.Path.Circle([this.head.x + 20, this.head.y - 6], 8);
            startyPupil = new paper.Path([startyEye.position.x - 3, startyEye.position.y + 2], [startyEye.position.x + 3, startyEye.position.y + 2]);
        }

        // Set up style of eye
        startyEye.fillColor = "white";
        startyEye.strokeColor = "black";
        startyEye.strokeWidth = 3;

        // Set up style of pupil
        startyPupil.strokeColor = "black";
        startyPupil.strokeWidth = 2;
        startyPupil.curves[0].handle1.y = -5;
        startyPupil.curves[0].handle2.y = -5;

        return { startyEye: startyEye, startyPupil: startyPupil };
    };

    this._makeMouth = function (isReverse = false) {
        let startyMouth;
        if (isReverse) {
            startyMouth = new paper.Path([this.head.x + 196.5, this.head.y + 10], [this.head.x + 180, this.head.y + 10], [this.head.x + 188, this.head.y + 17], [this.head.x + 196.5, this.head.y + 10]);
        } else {
            startyMouth = new paper.Path([this.head.x + 3.5, this.head.y + 10], [this.head.x + 20, this.head.y + 10], [this.head.x + 12, this.head.y + 17], [this.head.x + 3.5, this.head.y + 10]);
        }


        startyMouth.curves[2].handle1.y = 2;
        startyMouth.curves[2].handle2.y = 2;
        startyMouth.strokeColor = "black";
        startyMouth.strokeWidth = 2;
        startyMouth.fillColor = "#FF7777";

        return startyMouth;
    };

    this._makeBodyFin = function (isReverse = false) {
        const start = isReverse ? this.head.x + 145 : this.head.x + 55;
        const end = isReverse ? this.head.x + 50 : this.head.x + 150;
        const direction = isReverse ? -20 : 20;

        for (let i = start; isReverse ? i > end : i < end; i += direction) {
            const startyBodyFin = new paper.Path([i, this.head.y - 15], [i, this.head.y - 7], [i, this.head.y], [i, this.head.y + 8], [i, this.head.y + 15]);
            startyBodyFin.curves.forEach(function (curve) {
                curve.handle1.x = isReverse ? -5 : 5;
                curve.handle2.x = isReverse ? -5 : 5;
            });
            startyBodyFin.strokeColor = "black";
            startyBodyFin.strokeWidth = 2;
            this.starty.addChild(startyBodyFin);
        }
    };


    this._makeTailFin = function (isReverse = false) {
        // isReverse = true;
        const point1X = isReverse ? this.head.x + 30 : this.head.x + 170;
        const point2X = isReverse ? this.head.x + 10 : this.head.x + 190;

        for (let i = -10; i <= 10; i += 5) {
            const startyTailFin = new paper.Path([point1X, this.head.y + i], [point2X, this.head.y + i]);
            startyTailFin.strokeWidth = 2;
            startyTailFin.strokeColor = "black";
            startyTailFin.rotate(isReverse ? -i * 2 : i * 2, isReverse ? startyTailFin.bounds.bottomRight : startyTailFin.bounds.bottomLeft);

            this.starty.addChild(startyTailFin);

        }
    };

    this.constructor();

    // Setup character movement handler
    window.addEventListener("keydown", (event) => startyMovementHandler(event, this));
}




export { Starty };