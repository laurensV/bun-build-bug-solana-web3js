Many packages run just fine when using bun directly, but when trying to use `bun build` it gives this error `TypeError: The superclass is not a constructor.`

I created a small example repo:
First install the package, for example `@solana/web3.js`
```
bun install @solana/web3.js
```
create file `index.js` that uses the package:
```
import * as web3 from '@solana/web3.js';
console.log(web3);
```

Running this file directly with `bun index.js` works fine, but when trying to build first and then run it (or when using `--compile` flag to put it into one executable), it fails:
```
bun build ./index.js --outdir ./build --target=bun && bun build/index.js
```
```
13821 | var fetchImpl = typeof globalThis.fetch === "function" ? globalThis.fetch : async function(input, init) {
13822 |   const processedInput = typeof input === "string" && input.slice(0, 2) === "//" ? "https:" + input : input;
13823 |   return await nodeFetch.default(processedInput, init);
13824 | };
13825 | 
13826 | class RpcWebSocketClient extends client.default {
        ^
TypeError: The superclass is not a constructor.
      at /$bunfs/root/test:13826:1
```
Seen this behaviour in multiple packages now..

Track this issue here: https://github.com/oven-sh/bun/issues/8925