---
slug: formula-for-the-third-side-of-a-triangle-given-two-sides-and-the-included-angle
title: 삼격형의 두 변의 길이와 사잇각을 알 때, 나머지 한 변의 길이를 구하는 공식
description: 
thumbnail: 
categories:
  - short
tags:
  - 수학-공식
createdAt: 2025/02/20
updatedAt: 
featured: false
locale:
---

![](https://i.imgur.com/SJCydEl.png)


위와 같은 삼각형이 존재할 때, 변의 길이 b, c와 그 사잇각 $\alpha$를 알고 있다고 가정하자. 이때 a의 길이를 구하는 공식은 다음과 같다.

$$
a = \sqrt{ b^2 + c^2 - 2bc\cos \alpha }
$$

# 증명
위와 같이 되는 이유는 아래 그림과 같은 삼각형이 존재한다고 가정할 떄, 선분 AC의 길이는 다음과 같다고 할 수 있다.
![](https://i.imgur.com/aBKANhX.png)

$$
\\[5pt]
\sqrt{ (c \times \sin B)^2 + (a - c \cos B)^2 } \\[5pt]
= \sqrt{ (c \sin B)^2 + a^2 -2ac \cos B + (c \cos B)^2 } \\[5pt]
= \sqrt{ a^2 + c^2(\sin^2 B + \cos^2 B) - 2ac \cos B } \\[5pt]
= \sqrt{ a^2 + c^2 - 2ac \cos B }
$$
위와 같이 유도할 수 있다.