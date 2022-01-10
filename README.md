# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなりました。

そこで、preload.jsでrequireを使って、それをcontextBridgeという方法で、renderer.jsから間接的に使います。

ここにあるソースは、preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。まだ試作中で、効率が悪いかもしれません。


