# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなりました。

そこで、preload.jsでrequireを使って、それをcontextBridgeという方法で、renderer.jsから間接的に使います。

ここにあるソースは、preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。まだ試作中で、効率が悪いかもしれません。

<img src = "screen_capture_1.png"></img>

実行すると、自分自身で、OSCサーバーとクライアントをつくります。
画面にマウスについてくる円が表示されますが、
これはOSCで送信したマウスの座標を、自分で受けとって円の座標にしています。

## renderer.jsから、preload.jsへ送信する場合
contextBridge経由で、「oscAPI」の「send」を呼び出す。

## preload.jsから、renderer.jsへ送信する場合
こちらはcontextBridgeではなく、node-oscのOSC受信時で呼ばれる関数で、renderer.jsへ値を渡しています。

CustomEventを定義し、そのCustomイベントに受信したメッセージを追加します。そのあと、dispatchEventで、「contaner」という名前のエレメントに、イベントを発動させます。

「container」エレメントはindex.htmにあるdivタグに名前をつけてあり、rendered.jsでp5jsのインスタンスを登録してあります。

