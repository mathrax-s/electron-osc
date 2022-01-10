# electron-osc

Electron v12 からセキュリティが安全になった代わりに、rendered.jsで、requireなどが使えなくなり、preload.jsでrequireを使って、それをcontextBridgeという方法で間接的に使うようになりました。

preload.jsで動作するnode-oscを、renderer.jsで使えるようにしたものです。

まだ試作中で、効率が悪いかもしれません。


## License

[CC0 1.0 (Public Domain)](LICENSE.md)
