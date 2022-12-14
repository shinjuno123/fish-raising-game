import React, { useEffect, useRef, useState } from "react";
import { Starty } from "./Characters";
import "./css/game.css";
import { gameStart } from "./CharactersEvent";
import testMap from "./Maps";
import videoSetting from "./videoSetting";
import paper from "paper";

function Game () {
    const video = useRef(null);
    const cameraOptions = useRef(null);
    const mode = window.location.href.split('/').at(-1);
    const canvas = useRef(null);
    const prevScreenSize = {width:0,height:0};

    function handleCameraSelection (event) {
        const selectedIndex = event.target.selectedIndex;
        videoSetting(video, cameraOptions, selectedIndex);
    }


    function canvasSetup () {
        // Setup canvas
        paper.setup(canvas.current);

        // Call map
        const { mapSize, obstacles, attackers, hiders } = testMap();

        // Call user character
        const starty = new Starty({ x: window.screen.availWidth / 2, y: window.screen.availHeight / 2 }, false, 80);

        // Game start
        gameStart(mode, video, starty, mapSize, [], obstacles, attackers, hiders);

        // Initialize view position 
        paper.view.translate([-(window.screen.availWidth - window.innerWidth)/2,-(window.screen.availHeight - window.innerHeight)/2]);

        prevScreenSize.width = window.innerWidth;
        prevScreenSize.height = window.innerHeight;
    }

    function handleResize(){
        const resizedWidth = prevScreenSize.width - window.innerWidth;
        const resizedHeight =prevScreenSize.height - window.innerHeight;

        paper.view.translate([-resizedWidth / 2,-resizedHeight / 2]);
       
        prevScreenSize.width = window.innerWidth;
        prevScreenSize.height = window.innerHeight;


    }

    useEffect(() => {
        if (mode === "exercise") {
            videoSetting(video, cameraOptions, 0);
        }
        canvasSetup();


        window.addEventListener("resize",()=>handleResize())
    });

    return (
        <div style={ { width: window.screen.availWidth + "px", height: window.screen.availHeight + 40 + "px" } } className="game" >
            <canvas id="game-canvas" ref={ canvas } ></canvas>
            <video ref={ video } autoPlay></video>
            <select onChange={ handleCameraSelection } ref={ cameraOptions } />
        </div>
    );
}

export default Game;