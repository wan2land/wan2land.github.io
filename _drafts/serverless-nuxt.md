---
title: "Nuxt 프로젝트 서버리스로 운영하기 완벽가이드"
summary: "AWS Cloud Development Kit를 이용하여 Lambda위에 간단한 Typescript 앱을 올려봅시다."
date: 2020-01-23 18:28:04 +09:00
tags: ["serverless", "nuxt", "awslambda", "vue"]
---

https://github.com/wan2land/serverless-nuxt

라는 패키지를 만들어서 운영중인데, 자주 오는 질문들을 토대로. Nuxt 프로젝트를 운영..


Nuxt 프로젝트를 서버에서 PM2를 통해서 운영하는 경우가 일반적인데, Serverless 프레임워크를 통해서도 운영가능합니다.

일반적으로 AWS라면 EC2위에서 운영하고, 최소 T3 Micro 이상은 사용해야합니다. (그 이하는 빌드가 안되어요.)
또한 무중단 배포를 구성하는 것도 꽤나 어렵습니다.

(nuxt deploy hot migration) 첨부

회사에서 많은 프론트앤드 프로덕트를 Serverless로 운영하면서, 모든 내용을 정리해보려고 합니다.


1. 개발환경 / 개발서버환경 / 실서버환경 분리하기
2.  
