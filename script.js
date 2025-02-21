"use strict";
const { PI: π, E: e, sin, cos, pow, abs } = Math;
let c, ctx, W, H;

let paused = false;
let fc = 0; // frame count
let fid = 0; // frame id

let r = 0;
let θ = 0;
let scf = 30; // scale factor

let x = 0;
let y = 0;

let tempx = 0;
let tempy = 0;

let infoBtn;

const setup = () => {
    c = document.getElementById("Canvas");
    ctx = c.getContext("2d");
    // canvas --> full screen & hd
    [W, H] = setSize(c, ctx);
    // add event handlers
    window.onresize = () => {
        [W, H] = setSize(c, ctx);
        fc = 0;
    }
    
    infoBtn = document.getElementById("Info");
    infoBtn.onclick = () => alert("Parametric butterfly.\n\n1) Click anywhere on canvas to pause / unpause.\n2) Double click to clear canvas.\n3) Change scale factor to change the size of the butterfly curve.\n\nI found this equation in wolfram's polar plot calculator, it's beautiful!\nFor more information check top of js tab.");

    // pause / unpause animation
    c.onclick = () => {
        paused ? window.requestAnimationFrame(animate) : window.cancelAnimationFrame(fid);
        paused = !paused;
    }

    c.ondblclick = () => {
        clear(ctx);
        fc = 0;
    }

    // begin animation
    window.requestAnimationFrame(animate);
};

const animate = () => {
    // color
    ctx.fillStyle = ctx.strokeStyle = `rgb(
        ${abs(sin(fc / 360)) * 255},
        ${abs(sin(fc / 360 + π / 6)) * 255}, 
        ${abs(sin(fc / 360 - π / 6)) * 255}
    )`;
    
    ctx.save();
        // bring (0, 0) to center of canvas
        ctx.translate(W / 2, H / 2);

        tempx = x;
        tempy = y;

        // r = e^sinθ - 2cos(4θ) + sin^5((2θ - π) / 24)
        r = pow(e, sin(θ)) - 2 * cos(4 * θ) + pow(sin((2 * θ - π) / 24), 5);
        r *= scf; // scale r by the scale factor to make butterfly clearly visible
        x = r * cos(θ);
        y = -r * sin(θ); // y-axis is inverted so we "uninvert" it with negative sign
        
        line(ctx, x, y, tempx, tempy);
    ctx.restore();

    // angular velocity
    θ = fc / 60;

    fc++;
    // call animation function again
    fid = window.requestAnimationFrame(animate);
};

// utility functions
const clear = (ctx = CanvasRenderingContext2D, color = "rgba(0, 0, 0, 1)", w = window.innerWidth, h = window.innerHeight) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
};

const line = (ctx = CanvasRenderingContext2D, x1 = 0, y1 = 0, x2 = 100, y2 = 100) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const setSize = (c = HTMLCanvasElement, ctx = CanvasRenderingContext2D, w = window.innerWidth, h = window.innerHeight, pd = devicePixelRatio) => {
    // canvas apparent size
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    
    // canvas actual size
    c.width = w * pd;
    c.height = h * pd;
    
    // normalise coordinates
    ctx.scale(pd, pd);

    return [w, h];
};

// make sure js starts after everything is loaded
window.onload = setup;