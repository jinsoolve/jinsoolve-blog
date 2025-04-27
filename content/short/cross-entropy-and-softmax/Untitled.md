---
slug: cross-entropy-and-softmax
title: Cross Entropy와 Softmax
description: 
thumbnail: 
categories:
  - short
tags: 
createdAt: 2025/04/27
updatedAt: 
featured: false
locale:
---
Cross-entropy와 Softmax가 자꾸 헷갈려서 정리를 한 번 해보자. 
+) 추가로 sigmoid와 tanh 도 보자.



# Softmax
$$
\text{Softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$
$z_{i}$는 i번째 클래스의 점수이다.

이 점수들을 Softmax를 이용해서 0 ~ 1 사이의 확률값으로 만들어 버린다.

# Cross-entropy
예측한 확률 분포와 정답 분포가 얼마나 다른지를 측정하는 지표이다.

$$
\text{Cross-entropy} = -\sum_{i} p_i \log q_i
$$
$p_{i}$는 정답(라벨)이고, $q_{i}$는 모델이 예측한 (Softmax 결과) 확률이다.

식을 살펴보면, $-\log{q_{i}}$가 있는 걸 확인할 수 있다. 이걸 그래프로 보자.
![](https://i.imgur.com/2B50z1v.png)

모델이 예측한 결과인 $q_{i}$는 0 ~ 1 사이의 값임을 기억하자. 즉 $-\log{q_{i}}$는 양수가 되고, $q_{i}$가 0에 가깝다면 $\infty$가 되고, 1에 가깝다면 0이 된다.

만약 정답인 $p_{i}$가 1인데 $q_{i}$가 0이라면 값이 $\infty$가 되어서 값이 커지게 된다. 이걸 이용해서 cross-entropy를 손실함수에 사용한다.

# Sigmoid와 tanh
시그모이드와 tanh 모두 비선형성을 추가하기 위해 주로 hidden state 값을 계산할 때 사용한다. (softmax는 output을 출력할 때 사용한다.)
![](https://i.imgur.com/egcQZB5.png)


