import { Mob1 } from "./Mob";
import paper from "paper";
import { paths } from "./MobPaths";
import { moveMobInBezierCurve } from "./MobPaths";


// object's position depending on the relative position of fish
const userState = { isObstacle: false, velX: 0, velY: 0, speed: 5, friction: 0.98, keys: {} };


function startyMovementHandler (event) {

    event.preventDefault();


    if (event.type === "keydown") {
        userState.keys[event.key] = true;
    }

    if (event.type === "keyup") {
        userState.keys[event.key] = false;

    }

    return;
}


function getMatrix (x1, y1, x2, y2) {
    return { tx: x1 - x2, ty: y1 - y2 };
}



let prevPath = 0;

function drawPath (path, color, currentPath) {
    let testFish = { x: 2972, y: 0, speed: 0.01, t: 0 };

    path.forEach(function (points, index) {

        points.forEach(function (point) {
            const pointDot = new paper.Path.Circle([point.x, point.y], 3);
            pointDot.fillColor = "black";
            pointDot.selected = true;
            const coordinate = new paper.PointText([point.x, point.y - 10]);
            coordinate.content = `[${ point.x },${ point.y }]`;
            coordinate.fillColor = "black";
            coordinate.justification = "center";
            coordinate.fontSize = 20;
            coordinate.fontWeight = 5;
        });

        let currentPoints = points;
        while (testFish.t < 1) {
            let prevBall = Object.assign({}, testFish);

            testFish = moveMobInBezierCurve(currentPoints, testFish);

            if (prevPath !== currentPath) {
                prevPath = currentPath;
                prevBall = Object.assign({}, testFish);
            }

            const line = new paper.Path([prevBall.x, prevBall.y], [testFish.x, testFish.y]);
            line.strokeWidth = 2;
            line.strokeColor = color;
        }
        prevPath = currentPath;
        testFish.t = 0;
    });

}




async function gameStart (mode, video, myCharacter, mapSize, mobs, obstacles, responsePoints, attackers, hiders) {


    let isGameOver = false;
    let hideTime = 0;
    let prevTime = -10001;
    const worker = new Worker(process.env.PUBLIC_URL + '/worker.js');
    const tmpCanvas = document.createElement("canvas");
    const imageSize = { width: 320, height: 240 };
    let receievedKeyPoints;
    let isExecuted = false;
    let firstPosition = 0;
    let movement = "";
    const screen1 = new paper.PointText();
    const state = { left: false, right: false };
    let countWalk = 0;
    let isReverse = false;
    const { motionFrame, down, straight, up, leftReverse, rightReverse } = (mode === "exercise") ? createMotionFrame() : { motionFrame: null, down: null, straight: null, up: null, leftReverse: null, rightReverse: null };
    const { leftKnee, rightKnee } = (mode === "exercise") ? createMotion() : { leftKnee: null, rightKnee: null };


    let colors = ["red", "blue", "yellow", "lightgreen", "black"];
    /*  Test Making path using Bezier curve*/
    paths.forEach(function (path, index) {
        drawPath(path, colors[index], index);
    });


    window.requestAnimationFrame((time) => {
        update(time, mobs);
    });


    async function videoUpdate (isExecuted) {
        const ctx = tmpCanvas.getContext('2d');
        ctx.drawImage(video.current, 0, 0);
        const contents = {
            image: ctx.getImageData(0, 0, imageSize.width, imageSize.height),
            isExecuted: isExecuted,
        };


        worker.postMessage(contents);

    }

    function createMotionFrame () {
        const motionFrame = new paper.Path.Rectangle(paper.view.bounds.width - imageSize.width, paper.view.bounds.height - imageSize.height, imageSize.width, imageSize.height);
        motionFrame.fillColor = "white";
        const size = [120, 80];


        const down = new paper.Path.Rectangle([motionFrame.bounds.x, motionFrame.bounds.y + 35], size);
        down.fillColor = "red";

        const straight = new paper.Path.Rectangle([motionFrame.bounds.x + motionFrame.bounds.width / 3 + 10, motionFrame.bounds.y + 35], [size[0] - 20, size[1]]);
        straight.fillColor = "green";

        const up = new paper.Path.Rectangle([motionFrame.bounds.x + motionFrame.bounds.width * (2 / 3), motionFrame.bounds.y + 35], size);
        up.fillColor = "blue";

        const leftReverse = new paper.Path.Rectangle([motionFrame.bounds.x, motionFrame.bounds.y], [30, 240]);
        leftReverse.fillColor = "yellow";

        const rightReverse = new paper.Path.Rectangle([motionFrame.bounds.x + motionFrame.bounds.width - 30, motionFrame.bounds.y], [30, 240]);
        rightReverse.fillColor = "pink";



        return { motionFrame: motionFrame, down: down, straight: straight, up: up, leftReverse: leftReverse, rightReverse: rightReverse };
    }


    function createMotion () {

        const leftKnee = paper.Path.Circle([motionFrame.bounds.centerX, motionFrame.bounds.centerY], 3);
        leftKnee.selected = true;


        const rightKnee = paper.Path.Circle([motionFrame.bounds.centerX, motionFrame.bounds.centerY], 3);
        rightKnee.selected = true;



        return {
            leftKnee: leftKnee, rightKnee: rightKnee
        };
    }





    worker.onmessage = (event) => {
        receievedKeyPoints = event.data;
        if (receievedKeyPoints) {
            // keyboard == false

            leftKnee.bounds.centerX = motionFrame.bounds.x + (imageSize.width - receievedKeyPoints.keypoints[13].x);
            leftKnee.bounds.centerY = motionFrame.bounds.y + receievedKeyPoints.keypoints[13].y + 20;

            rightKnee.bounds.centerX = motionFrame.bounds.x + (imageSize.width - receievedKeyPoints.keypoints[14].x);
            rightKnee.bounds.centerY = motionFrame.bounds.y + receievedKeyPoints.keypoints[14].y + 20;


            if (firstPosition === 0) {
                firstPosition = leftKnee.bounds.centerY;
            }

            if (up.intersects(leftKnee) || up.contains(leftKnee) || up.isInside(leftKnee)) {
                movement = "up";
                state.left = true;
            }
            if (straight.intersects(leftKnee) || straight.contains(leftKnee) || straight.isInside(leftKnee)) {
                movement = "straight";
                state.left = true;
            }
            if (down.intersects(leftKnee) || down.contains(leftKnee) || down.isInside(leftKnee)) {
                movement = "down";
                state.left = true;
            }

            if (up.intersects(rightKnee) || up.contains(rightKnee) || up.isInside(rightKnee)) {
                state.right = true;
            }
            if (straight.intersects(rightKnee) || straight.contains(rightKnee) || straight.isInside(rightKnee)) {
                state.right = true;
            }
            if (down.intersects(rightKnee) || down.contains(rightKnee) || down.isInside(rightKnee)) {
                state.right = true;
            }


            if (leftReverse.intersects(leftKnee) || leftReverse.contains(leftKnee) || leftReverse.isInside(leftKnee)) {
                myCharacter.setReverse(false);
                isReverse = false;
            }

            if (rightReverse.intersects(rightKnee) || rightReverse.contains(rightKnee) || rightKnee.isInside(rightKnee)) {
                myCharacter.setReverse(true);
                isReverse = true;
            }

            if (state.left && state.right) {
                countWalk += 0.5;
                state.left = false;
                state.right = false;
                if (countWalk === 1) {
                    countWalk = 0;
                    // move the fish! keyboard == true
                    if (movement === "up") {
                        if (isReverse) {
                            userState.keys["ArrowUp"] = true;
                            userState.keys["ArrowRight"] = true;
                        } else {
                            userState.keys["ArrowUp"] = true;
                            userState.keys["ArrowLeft"] = true;
                        }

                    } else if (movement === "straight") {
                        if (isReverse) {
                            userState.keys["ArrowRight"] = true;
                        } else {
                            userState.keys["ArrowLeft"] = true;
                        }

                    } else if (movement === "down") {
                        if (isReverse) {
                            userState.keys["ArrowDown"] = true;
                            userState.keys["ArrowRight"] = true;
                        } else {
                            userState.keys["ArrowDown"] = true;
                            userState.keys["ArrowLeft"] = true;
                        }
                    }
                }
            }


            screen1.content = `saying : ${ movement } state : ${ state.left } ${ state.right } walk ${ countWalk }`;
            screen1.fontSize = 40;
            screen1.bounds.center = [mapSize[0] / 4, mapSize[1] / 4];


        }
    };


    async function update (time, mobs) {

        // if (prevTime + 10000 < time && mobs.length <= 100) {
        //     prevTime = time;
        //     console.log("created", mobs.length);

        //     const mobsPoints = responsePoints.mobsResponsePoints;
        //     const randomPlace = Math.floor(Math.random() * mobsPoints.length);
        //     const mob = new Mob1({ x: mobsPoints[randomPlace][0], y: mobsPoints[randomPlace][1] }, true, 70, paper);
        //     mob.selectedPath = randomPlace;
        //     mobs.push(mob);
        // }


        // Move mob fishes following the path made by bezier curves
        mobs = mobs.map(function (mob) {
            if (mob.selectedPath < 2) {
                const mobMovedPosition = moveMobInBezierCurve(paths[mob.selectedPath][mob.currentPoint], { x: mob.group.bounds.centerX, y: mob.group.bounds.centerY, speed: 0.01, t: mob.t });
                mob.t = mobMovedPosition.t;
                mob.group.bounds.centerX = mobMovedPosition.x;
                mob.group.bounds.centerY = mobMovedPosition.y;

                if (mob.t > 1) {
                    mob.t = 0;
                    mob.currentPoint = paths[mob.selectedPath].length - 1 !== mob.currentPoint ? mob.currentPoint + 1 : 0;
                    console.log(mob.currentPoint);
                }
                // console.log(mobMovedPosition);
            }


            return mob;
        });





        if (mode === "exercise") {
            await videoUpdate(isExecuted);
            isExecuted = true;
        }




        // Recognize key board input
        if (userState.keys["ArrowUp"] || userState.keys["w"]) {
            if (userState.velY > -userState.speed) {
                userState.velY--;
            }
        }
        if (userState.keys["ArrowDown"] || userState.keys["s"]) {
            if (userState.velY < userState.speed) {
                userState.velY++;
            }
        }
        if (userState.keys["ArrowRight"] || userState.keys["d"]) {
            myCharacter.setReverse(true);
            if (userState.velX < userState.speed) {
                userState.velX++;
            }
        }
        if (userState.keys["ArrowLeft"] || userState.keys["a"]) {
            myCharacter.setReverse(false);
            if (userState.velX > -userState.speed) {
                userState.velX--;
            }
        }

        const nextPosition = myCharacter.getPosition();


        // move as pressing keyboard arrow buttons
        userState.velY *= userState.friction;
        nextPosition.y += userState.velY;

        userState.velX *= userState.friction;
        nextPosition.x += userState.velX;



        let isXChanged = false;
        let isYChanged = false;



        // when contacting to obstacles, user's fish stops moving toward obstacles
        obstacles = obstacles.map(function (obstacle) {
            for (let pathItem of myCharacter.group.getItems()) {
                const point = obstacle.group.getItem().getIntersections(pathItem)[0];
                if (point) {
                    if (point.point.x - nextPosition.x > 0) {
                        nextPosition.x = nextPosition.x - 2;
                        userState.velX -= 2;
                        isXChanged = true;
                    }
                    if (point.point.x - nextPosition.x < 0) {
                        nextPosition.x = nextPosition.x + 2;
                        userState.velX += 2;
                        isXChanged = true;
                    }

                    if (point.point.y - nextPosition.y > 0) {
                        nextPosition.y = nextPosition.y - 2;
                        userState.velY -= 2;
                        isYChanged = true;
                    }

                    if (point.point.y - nextPosition.y < 0) {
                        nextPosition.y = nextPosition.y + 2;
                        userState.velY += 2;
                        isYChanged = true;
                    }
                }

            }
            return obstacle;

        });







        // move screen when user fish gets a border of virtual Rectangle
        const { tx, ty } = getMatrix(myCharacter.group.bounds.center.x, myCharacter.group.bounds.center.y, myCharacter.rx, myCharacter.ry);
        myCharacter.rx = myCharacter.group.bounds.center.x;
        myCharacter.ry = myCharacter.group.bounds.center.y;
        paper.view.translate([-tx, -ty]);



        if (isXChanged) {
            userState.velX = 0;
        }
        if (isYChanged) {
            userState.velY = 0;
        }


        /* Motion Recognitio Section */

        if (mode === "exercise") {
            // Fix motion frame position to right bottom
            motionFrame.bounds.x = 1600 - paper.view.matrix.tx;
            motionFrame.bounds.y = 840 - paper.view.matrix.ty;
            down.bounds.x = motionFrame.bounds.x;
            down.bounds.y = motionFrame.bounds.y + 35;
            straight.bounds.x = motionFrame.bounds.x + motionFrame.bounds.width / 3 + 10;
            straight.bounds.y = motionFrame.bounds.y + 35;
            up.bounds.x = motionFrame.bounds.x + motionFrame.bounds.width * (2 / 3);
            up.bounds.y = motionFrame.bounds.y + 35;
            leftReverse.bounds.x = motionFrame.bounds.x;
            leftReverse.bounds.y = motionFrame.bounds.y;
            rightReverse.bounds.x = motionFrame.bounds.x + motionFrame.bounds.width - 30;
            rightReverse.bounds.y = motionFrame.bounds.y;
        }







        // If mob is bigger than user's then game over
        // If not user's can eat mob and grow bigger
        mobs = mobs.filter(function (mob) {
            const isIntersects = myCharacter.group.intersects(mob.group);
            if (isIntersects) {
                if (mob.size <= myCharacter.size) {
                    console.log("You can eat!");
                    if (myCharacter.size <= 70) {
                        myCharacter.size += mob.size * 0.05;
                    } else if (70 < myCharacter.size && myCharacter.size <= 100) {
                        myCharacter.size += mob.size * 0.03;
                    } else if (100 < myCharacter.size && myCharacter.size <= 130) {
                        myCharacter.size += mob.size * 0.02;
                    } else if (130 < myCharacter.size && myCharacter.size <= 170) {
                        myCharacter.size += mob.size * 0.015;
                    } else if (170 < myCharacter.size && myCharacter.size) {
                        myCharacter.size += mob.size * 0.005;
                    }
                    mob.group.remove();
                    return;
                } else {
                    mob.size += myCharacter.size * 0.05;
                    myCharacter.group.remove();
                    isGameOver = true;
                    return mob;
                }
            } else {
                return mob;
            }

        });


        // when meeding hiders, for example seaweed where can hide fishes including your fish
        hiders = hiders.map(function (hider) {
            // console.log(myCharacter.group);
            if (hider.group.bounds.contains(myCharacter.group.bounds)) {
                hideTime = time + 0.001;
            }

            for (let mob of mobs) {
                if (hider.group.bounds.contains(mob.group.bounds)) {
                    mob.hideTime = time + 0.001;
                }
            }

            return hider;
        });

        // if user fish just hid
        if (hideTime < time) {
            myCharacter.group.visible = true;
        } else {
            myCharacter.group.visible = false;
        }


        // if mob fish just hid
        mobs = mobs.map(function (mob) {
            if (mob.hideTime < time) {
                mob.group.visible = true;
            } else {
                mob.group.visible = false;
            }

            return mob;
        });


        // when user fish meets attacters like sea anemone, their size is decreased
        attackers.map(function (attacker) {
            if (attacker.group.contains(myCharacter.group.bounds) || attacker.group.intersects(myCharacter.group.bounds)) {
                myCharacter.size -= 0.1;
                userState.velX = userState.velX < userState.speed ? -userState.velX * 1.1 : -userState.velX * 0.9;
                userState.velY = userState.velY < userState.speed ? -userState.velY * 1.1 : -userState.velY * 0.9;
            }
        });

        // Stop movement by motion recognition
        if (mode === "exercise") {
            userState.keys["ArrowDown"] = false;
            userState.keys["ArrowUp"] = false;
            userState.keys["ArrowLeft"] = false;
            userState.keys["ArrowRight"] = false;
        }


        // Check if it is game over or not
        if (isGameOver) {
            window.cancelAnimationFrame((time) => { update(time, mobs); });
        } else {
            window.requestAnimationFrame((time) => { update(time, mobs); });
        }


    }
}









export { startyMovementHandler, gameStart };