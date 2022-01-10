# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなりました。

そこで、preload.jsでrequireを使って、それをcontextBridgeという方法で、renderer.jsから間接的に使います。

ここにあるソースは、preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。まだ試作中で、効率が悪いかもしれません。


renderer.jsにはp5jsのコードがあります。
osc送信するには、preload.jsにある関数を間接的に呼び出して使います。
osc受信するには、OSC受信時に呼ばれる関数がpreload.jsにあるので、そこからrenderer.jsに受信したメッセージを送ります。このとき、「container」とID名のついたエレメントを指定して、renderer.jsにアクセスしていますが、このID名のついたDIVタグがindex.htmlの中にあります。（少し散漫なのでもう少し改善したいです）

<img src = "screen_capture_1.png"></img>

実行すると、自分自身で、OSCサーバーとクライアントをつくります。
画面にマウスについてくる円が表示されますが、
これはOSCで送信したマウスの座標を、自分で受けとって円の座標にしています。

## OSCデータを送信する場合
### renderer.jsから、preload.jsへ送信する
contextBridge経由で、「oscAPI」の「send」を呼び出す。

<strong>preload.js</strong>

~~~javascript:preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld(
  "oscAPI", {
  send: (_address, _data) => {
    const message = new Message(_address);
    for (let i = 0; i < _data.length; i++) {
      message.append(_data[i]);
    }
    client.send(message);
  },

~~省略~~

})
~~~

## OSCデータを受信する場合
### preload.jsから、renderer.jsへ送信する
こちらはcontextBridgeではなく、node-oscのOSC受信時で呼ばれる関数で、renderer.jsへ値を渡しています。
preload.js、renderer.js、index.htmlの3つのファイルが関係しています。

preload.js
~~~javascript:preload.js
// OSC受信時に呼ばれる関数
oscServer.on('message', function (msg) {

  // 「container」に、カスタムイベントを発火する
  // カスタムイベントには、oscで受信したメッセージを追加しておく
  const targetElement = document.getElementById('container')
  targetElement.dispatchEvent(new CustomEvent("osc_rcv", {
    detail: { oscMsg: msg }
  }));

});
~~~

renderer.js
~~~javascript:renderer.js

const s = (p) => {

    ~~省略~~

    // OSCデータを受信する
    p.oscReceive = (msg) => {
        let data = oscAPI.receive("/test", msg);
        x = data[0];
        y = data[1];
        // console.log(data);
    }
}

// ID名'container'のエレメントを取得して、
// p5jsインスタンスを'container'にいれる
const container = document.getElementById('container');
const app = new p5(s, container);

// OSC受信イベントがあったとき、
// p5js内の「oscReceive」関数に、oscMsgを引数として渡す
container.addEventListener("osc_rcv", (event) => {
    app.oscReceive(event.detail.oscMsg);
});

~~~

### p5jsインスタンスを「container」に追加しておく

index.htmlで、bodyのdivタグにID名「container」とつけてあります。

index.html
~~~html:index.html
<body>
  <div id='container'></div>

  ~~省略~~

</body>
~~~

