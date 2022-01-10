# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなりました。

そこで、preload.jsでrequireを使って、それをcontextBridgeという方法で、renderer.jsから間接的に使います。

ここにあるソースは、preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。まだ試作中で、効率が悪いかもしれません。


## renderer.jsから、preload.jsへ送信する場合
contextBridge

## preload.jsから、renderer.jsへ送信する場合
node-oscのOSC受信で呼ばれる関数に、
CustomEventを定義し、
そのイベントに受信したメッセージを追加し、
dispatchEventで、「contaner」という名前のエレメントに、
イベントを発動させます。

「container」エレメントはindex.htmにあるdivタグに名前をつけてあり、rendered.jsでp5jsのインスタンスを登録してあります。

