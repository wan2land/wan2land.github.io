---
layout: post
title: "Canvas에 화살표 그리기"
summary: "Canvas에 화살표 ㄱㄹ.."
date: 2020-03-19 22:35:06 +09:00
tags: ["canvas", "javascript"]
---

캔버스 위에 직선, 사각형, 원그리기는 바로바로 가능한데, 특정 도형을 그리는건 귀찮은 일입니다.

<script async src="//jsfiddle.net/wan2land/qwe3ohv7/28/embed/js,html,result/dark/"></script>

```ts
for (const edge of this.$simulator.force<ForceLink<NetworkGraphNode, NetworkGraphEdge>>('link')!.links()) {
  const x1 = (edge.source as NetworkGraphNode).x!
  const y1 = (edge.source as NetworkGraphNode).y!
  const x2 = (edge.target as NetworkGraphNode).x!
  const y2 = (edge.target as NetworkGraphNode).y!

  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const cosX = (x2 - x1) / len
  const sinX = (y2 - y1) / len

  $ctx.beginPath()
  $ctx.moveTo(x1, y1)
  $ctx.lineTo(x2 - (RADIUS + ARROWHEAD_H / 2) * cosX, y2 - (RADIUS + ARROWHEAD_H / 2) * sinX)
  $ctx.lineWidth = 0.5
  $ctx.strokeStyle = '#dddddd'
  $ctx.stroke()
  
  $ctx.beginPath()
  $ctx.moveTo(x2 - RADIUS * cosX, y2 - RADIUS * sinX)
  $ctx.lineTo(x2 - (RADIUS + ARROWHEAD_H) * cosX - ARROWHEAD_W / 2 * sinX, y2 - (RADIUS + ARROWHEAD_H) * sinX + ARROWHEAD_W / 2 * cosX)
  $ctx.lineTo(x2 - (RADIUS + ARROWHEAD_H) * cosX + ARROWHEAD_W / 2 * sinX, y2 - (RADIUS + ARROWHEAD_H) * sinX - ARROWHEAD_W / 2 * cosX)
  $ctx.fillStyle = "#dddddd"
  $ctx.fill()
}
```
