import Stone, { SideStone } from "./objects/rock";
import SeaAnemone from "./objects/SeaAnemone";
import Seaweed from "./objects/Seaweed";
import paper from "paper";

function testMap () {
    // map Size setup
    const mapSize = [3072, 1648];

    const obstacles = [];


    const rect = new paper.Path.Rectangle([0, -mapSize[1] / 2], [mapSize[0], mapSize[1]]);

    rect.strokeColor = "black";
    rect.strokeWidth = "3";


    // setup center Stone
    obstacles.push(new Stone(mapSize[0] / 2, 0, 2.5, paper));


    // setup Stones at the 4 egdes of map
    obstacles.push(new SideStone(mapSize[0] / 4, mapSize[1] / 4, 0, false, mapSize, paper));
    obstacles.push(new SideStone(mapSize[0] * 0.75, mapSize[1] / 4, 0, true, mapSize, paper));
    obstacles.push(new SideStone(mapSize[0] / 4, -mapSize[1] / 4, 180, true, mapSize, paper));
    obstacles.push(new SideStone(mapSize[0] * 0.75, -mapSize[1] / 4, 180, false, mapSize, paper));





    const attackers = [];

    // Setup seaAnemons
    attackers.push();
    attackers.push(new SeaAnemone(500, 610, 1.5, 0));
    attackers.push(new SeaAnemone(300, 550, 1, 0));
    attackers.push(new SeaAnemone(990, 760, 1, 40));
    attackers.push(new SeaAnemone(990, 230, 1, 180));
    attackers.push(new SeaAnemone(550, 20, 0.8, 200));
    attackers.push(new SeaAnemone(2200, 190, 0.8, 160));
    attackers.push(new SeaAnemone(3030, 190, 1.2, 280));
    attackers.push(new SeaAnemone(2550, 600, 2, 10));
    attackers.push(new SeaAnemone(2350, -150, 2, 30));
    attackers.push(new SeaAnemone(2350, -640, 2, 210));
    attackers.push(new SeaAnemone(900, -700, 1.1, 140));
    attackers.push(new SeaAnemone(900, -200, 2, -20));


    const hiders = [];
    hiders.push();

    // Setup seaweeds
    hiders.push(new Seaweed(700, 100, 1.2, 210));
    hiders.push(new Seaweed(800, 650, 1.2, -20));
    hiders.push(new Seaweed(90, 340, 1.2, 70));
    hiders.push(new Seaweed(1600, 250, 1.2, 175));
    hiders.push(new Seaweed(1750, 250, 1.2, 175));
    hiders.push(new Seaweed(1540, 780, 1.5, 0));
    hiders.push(new Seaweed(1540, -860, 1.5, 180));
    hiders.push(new Seaweed(2700, -600, 1.3, 200));
    hiders.push(new Seaweed(2800, 510, 1.3, -10));
    hiders.push(new Seaweed(300, -560, 1.2, 170));
    hiders.push(new Seaweed(660, -660, 1.2, 140));

    return { mapSize: mapSize, obstacles: obstacles, attackers: attackers, hiders: hiders };
}





export default testMap;