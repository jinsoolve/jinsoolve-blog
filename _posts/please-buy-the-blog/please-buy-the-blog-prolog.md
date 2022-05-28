---
title: '블로그는 사드세요... 제발 프롤로그: 블로그를 만들자'
description: '블로그를 만드는 이유와 개발환경에 대해서'
coverImage: '/assets/blog/please-buy-the-blog/prolog/cover.png'
category: '블로그는 제발 사드세요'
date: '2022/05/28'
path: 'please-buy-the-blog'
---

> `블로그는 사드세요... 제발` 시리즈는 제가 블로그를 **직접** 만들었던 과정과 신경썼던 것들을 기록한 것 입니다. 해당 시리즈는 [승우 아빠](https://www.youtube.com/c/%EC%8A%B9%EC%9A%B0%EC%95%84%EB%B9%A0)님의 `사드세요 시리즈`를 패러디 한 것입니다.

# 다양한 블로그 플랫폼

> 세상엔 수 많은 블로그 플랫폼들이 있고...

![블로그 플랫폼들](/assets/blog/please-buy-the-blog/prolog/5.png)_블로그 플랫폼들_

위와 같이 블로그를 간단하게 만들고 유지할 수 있는 여러 플랫폼들이 있습니다.
해당 블로그 플랫폼들은 우리가 당연하게 생각하는 여러 편의 기능들을 제공해줍니다.
`SEO` 관련 설정들, 포스팅 에디터 제공, 통계 제공, 최적화 등등의 여러 편의 기능들은 우리가 당연하게 생각하고 사용하고 있습니다.


# 그럼에도 불구하고...

> 저는 왜 블로그를 만들었을까요

## 커스터마이징

저는 이미지, 텍스트, 헤더, 푸터, 포스트 카드, TOC(Table of Contents)... 등등의 컴포넌트들 제가 직접 만들고 싶었습니다. 직접 마음에 드는 디자인으로 만들고 싶었기 때문에 블로그를 직접 만들었습니다.

## 나만의 것

저는 프론트엔드 개발자로 인생을 살아갈 것 같은데 나중에 시니어 개발자가 되더라도 개인 블로그 하나쯤은 있어야 하지 않을까? 그리고 그 때 까지 블로그를 운영한다면 꽤나 커져있을 블로그를 상상했는데 그 블로그가 타 플랫폼에 종속되어 있다면 뭔가 아까울 것 같은 느낌이었습니다.

## 희소성

저는 평범한 것을 추구하지 않습니다. 세상에 하나밖에 없는 제 블로그를 만들고 싶었습니다.

## 백업

플랫폼들의 데이터들이 어느 날 갑자기 사라져도 저는 하드디스크와 깃허브에 이중 저장이 되어있습니다..!

## 오너십

만들 때는 정말 귀찮은데 한 번 정말 예쁘게 만들고 나면 내 프로덕트라는 생각에 애정을 많이 쏟게 됩니다.

저는 위와 같은 이유로 블로그를 만든 것 같습니다. 여러분들은 블로그에 대해서 어떤 생각을 가지고 있나요? 단순 지식을 올리는 곳인가요 아니면 나만의 이야기를 기록해가는 소중한 공간인가요?

# 개발환경에 대해서

> 저는 이런식으로 만들었습니다.

## GitHub

![github](/assets/blog/please-buy-the-blog/prolog/1.png)_GitHub_

저는 깃허브를 저장소 및 백업용 그리고 `vercel`에 배포를 하기 위해서 사용합니다.
이 방식을 사용하면 자신이 만든 블로그의 코드가 공개된다는 점(private로 코드를 감출 수 있지만 vercel 배포에 문제가 있습니다.)이 문제가 될 수 있지만, 저는 상관이 없어서 깃허브를 사용했습니다.

## vercel

![vercel](/assets/blog/please-buy-the-blog/prolog/3.png)_vercel_

저는 블로그 배포를 위해서 `vercel`을 사용했습니다. 메인 브랜치에 푸시를 하게 되면 자동적으로 배포를 도와주고, `priview` 배포 사이트 제공, 린트 에러가 있는지 자동적으로 확인과 같은 기능을 제공해주는 `CI/CD`를 제공해주고, 깃허브 레포지토리 한 줄 입력으로 배포를 할 수 있기 때문에 사용했습니다.

## NextJS

![nextjs](/assets/blog/please-buy-the-blog/prolog/2.png)_NextJS_

저는 `vercel`의 `Next.JS`로 여러 프로젝트 템플릿을 제공해주는 [next.js/examples](https://github.com/vercel/next.js/tree/canary/examples)에서 [next.js/examples/blog-starter-typescript](https://github.com/vercel/next.js/tree/canary/examples/blog-starter-typescript)를 참고해서 블로그의 틀을 잡았습니다.

`Next.JS`는 `React.JS`를 사용해서 개발하는 프레임워크입니다. 블로그에서 제일 중요한 `SEO(Search Engine Optimization)`을 쉽게 이룰 수 있도록 도와주는 프레임워크입니다. SEO를 하기 위해서는 포털 사이트의 크롤러들이 우리의 블로그와 관련된 데이터들을 잘 읽어갈 수 있도록 `SSR(Server Side Rendering)`을 지원해야 하는데 `Next.JS`는 `React.JS`를 사용하며, `SSR` 또는 `SSG(Static Site Generation)`을 지원해주고, 이외에도 페이지 자동 라우팅, 이미지 최적화과 같은 여러가지 기능들을 제공해줍니다.

![whatever](/assets/blog/please-buy-the-blog/prolog/4.png)_whatever_

블로그를 만들 때 어떤 기술을 써도 상관 없습니다. 웹을 만들 수 있으면 됩니다. 저는 위에서 언급한 기술들로 블로그를 만들었습니다. 기술이 다르면 신경써야 하는 부분이 조금 다를 수는 있지만 큰 줄기를 기준으로 조금씩만 다르고 결은 비슷하다고 생각합니다.

# 블로그를 만들 때 필요한 것

> 블로그를 만들 때 필요한 것들은...

- 다크모드
- 반응형 디자인
- 댓글 시스템
- 포스팅은 어떤식으로 이루어지나?
- 포스팅에 스타일은 어떤식으로 입히나?
- 각 포털의 search console에 링크 등록
- lighthouse를 참고해 사용성 높이기
- Table of Contents
- Loading Progress bar
- Google Analytics
- rss.xml
- sitesmap.xml
- robots.txt
- meta tag
- open graph
- semantic tag
- ...

벌써 블로그를 사먹고 싶다는 생각이 드셨나요? **정상입니다.**

위의 리스트에는 적용해야 하는 순서는 없으며, 계속해서 개선하고 적용해야 하는 부분들입니다. 

저는 제가 블로그를 만들면서 신경썼던 부분들이나 필요하다고 생각하는 부분들을, 제가 사용한 기술 스택들 기준으로 조금씩 포스팅 할 예정입니다.

다음편에는 **블로그 구색 갖추기**를 주제로 `NextJS` 프로젝트로 어떻게 블로그 포스팅을 하는지에 대한 전체적인 그림을 그릴 것 같습니다.