# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなりました。

そこで、preload.jsでrequireを使って、それをcontextBridgeという方法で、renderer.jsから間接的に使います。

ここにあるソースは、preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。まだ試作中で、効率が悪いかもしれません。

<img src = "screen_capture_1.png"></img>

実行すると、自分自身で、OSCサーバーとクライアントをつくります。
画面にマウスについてくる円が表示されますが、
これはOSCで送信したマウスの座標を、自分で受けとって円の座標にしています。

## OSCデータを送信する場合
### renderer.jsから、preload.jsへ送信する
contextBridge経由で、「oscAPI」の「send」を呼び出す。

preload.js
~~~preload.js
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

CustomEventを定義し、そのCustomイベントに受信したメッセージを追加します。そのあと、dispatchEventで、「contaner」という名前のエレメントに、イベントを発動させます。

「container」エレメントはindex.htmにあるdivタグに名前をつけてあり、rendered.jsでp5jsのインスタンスを登録してあります。

