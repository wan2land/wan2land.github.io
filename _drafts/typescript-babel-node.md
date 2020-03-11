
Typescript와 Babel을 이용하여 Node.js 개발 환경을 만드는 방법에 대해서 이야기 해봅시다.

Babel을 이용하여 typescript를 빌드했을 때의 이점은 babel의 유연한 설정을 그대로 사용가능하다는 점이다. babel-preset-env는 node뿐 아니라, 브라우저에서 타입스크립트를 사용한다고 했을 때, 더 다양한 환경에 대응이 가능하다.

예를들어, String.padLeft같은 함수를 사용한다고 치면, Typescript를 빌드하고 바로 해야하지만, babel을 사용한다면 core-js를 바로 사용가능하기때문에..

Typescript에도 tslib라는 녀석이 있지만,, 뭔가 별로다. 어차피 나중에는 Babel의 힘들 빌려야 한다.



단점도 있다. 바로 Decorator. typescript는 JAvascript의 Superset이라고 하지만, 현재 Ecma에서 나온 Decorator 표준안은 Typescript의 Decorator의 표준안과는 확실히 달라져있다.

이때문에 Decorator쪽은 아직도 버그가 무쟈게 많다.

tsconfig.json 

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "moduleResolution": "node",
    "lib": [
      "es2017",
      "esnext.asynciterable"
    ],
    "emitDeclarationOnly": true,
    "declaration": true,
    "pretty": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "noImplicitReturns": true,
    "experimentalDecorators": true
  }
}
```


.babelrc

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "maintained node versions",
      "useBuiltIns": "usage",
      "corejs": 3
    }],
    "@babel/typescript"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }], // 이 부분은 고민 필요
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/proposal-nullish-coalescing-operator", // 새로운 기능!
  ]
}
```

