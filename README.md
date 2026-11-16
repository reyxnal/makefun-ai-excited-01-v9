# Snow Leopard Breaks Its Own Frame

A snow leopard lunges straight at the viewer, shattering the glass frame of its own image, with aurora light and avalanche snow exploding outward. An entry for the make.fun bounty "Make the AI judge excited" (ai-excited-01).

![make.fun](https://make.fun/badge/ai-excited-01.svg)
![rank](https://make.fun/badge/ai-excited-01/reyxnal/makefun-ai-excited-01-v9/rank.svg)
![reward](https://make.fun/badge/ai-excited-01/reyxnal/makefun-ai-excited-01-v9/reward.svg)

Competition: https://make.fun/c/ai-excited-01 — bounty page: https://make.fun/bounty/ai-excited-01

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program copies `entry.png` (a JPEG image, 1024x1024, under 1 MiB) to `$MAKEFUN_OUTPUT_DIR/entry.png`, verifying its size, dimensions, and sha256. It takes no arguments and needs no network.

## License

MIT — see LICENSE.
