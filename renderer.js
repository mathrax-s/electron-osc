// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const s = (p) => {

    // OSCのAPI(preload.jsでcontextBridgeとして定義)
    let oscAPI = window.oscAPI;

    let x = 0;
    let y = 0;

    p.setup = () => {
        p.createCanvas(800, 400);
        p.background(0);
    }
    p.draw = () => {
        p.background(0, 10);

        // OSCデータを送信する
        oscAPI.send('/test', [p.mouseX, p.mouseY]);

        p.fill(255, 100);
        p.noStroke();
        p.ellipse(x, y, 100, 100);
    }

    // OSCデータを受信する
    p.oscReceive = (msg) => {
        let data = oscAPI.receive("/test", msg);
        x = data[0];
        y = data[1];
        // console.log(data);
    }


}

const container = document.getElementById('container');
const app = new p5(s, container);

// OSC受信イベントがあったとき、
// p5js内の「oscReceive」関数に、oscMsgを引数として渡す
container.addEventListener("osc_rcv", (event) => {
    app.oscReceive(event.detail.oscMsg);
});

