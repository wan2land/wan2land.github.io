

람다의 최대 용량 제한이 있어서 줄여야 합니다. 기본 nuxt안에는 불필요한. nuxt-start에는 프로그램이 동작하는데 필요한 패키지만 들어있고, 빌드와 관련된 기본 패키지는 devDependencies로 바꿉시다.

```bash
npm install nuxt-start
npm install nuxt -D
```

보통 웹페이지 용량의 주범은 static 파일드입니다.

배포할 때 이 파일들을 S3로 올립시다. S3에 올렸으면 CDN에 올립시다.
