---
slug: intro-to-nlp-2
title: n-gram Language Models
description: 
thumbnail: cover.png
categories:
  - ML
tags:
  - n-gram
  - sampling
  - model-evaluation
  - smoothing
createdAt: 2025/03/10
updatedAt: 
featured: true
locale:
---
**언어 모델**이란, 결국에는 **그 다음으로 어떤 단어가 오는 것이 가장 자연스러운지를 확률로 보고 가장 높은 확률의 단어를 선택해서 문장을 구성**하는 방식이다.

위 포스트에서는 n-gram 모델이 무엇이고 어떤 원리인지를 살펴볼 것이다.
# n-gram 언어모델이란?
**이전의 n-1개의 단어들을 살펴보고 그 다음 n번째로 어떤 단어가 올 확률이 가장 높은 지를 계산해서 문장을 구성하는 방식의 언어모델**이다.
$$
P(w_n | w_1, w_2, …, w_{n-1}) \approx P(w_n | w_{n-N+1}, …, w_{n-1})
$$
모든 단어를 살펴보는 것이 아니라, 최근 n-1개의 단어를 보고 그 다음 n번째 단어를 추정하는 방식.

# Sampling(샘플링)
샘플링이란, **전체 데이터 집단에서 일부 데이터를 선택**하는 과정이다.

위에서 n-gram 방식을 통해서 그 다음에 올 단어들의 확률을 구했다고 가정하자. 그럼 해당 단어들을 어떻게 샘플링 할 것인가에 대해서 얘기해보자.
## Top-k
1 ~ k 등 까지의 단어들을 뽑는 샘플링
## Top-p
상위 누적확률 p 만큼까지의 단어들을 뽑는 샘플링

# Evaluating a language model
**Extrinsic Evaluation**은 실제로 언어모델을 실제상황에 적용하여서 평가하는 방식이다.
그러나 이 방식은 비싸고 시간이 많이 걸린다.
따라서 우리는 모델을 평가하기 위해 주로 **Intrinsic Evaluation**을 사용한다. Train과 Test Dataset을 나누어서 이를 적용해본다.
## Perplexity(ppl)
사전적 의미로는 **혼란도**라는 의미이다. 언어 모델의 평가지표 중 하나로써, 원하는 문장과 생성한 문장이 일치하지 않으면 혼란도는 높을 것이다. 쉽게 생각해보면, 모델의 손실함수와 동일한 의미를 갖는다고 볼 수 있다.
![](https://i.imgur.com/frP0S1z.png)
위와 같이 Cross-entropy 형태로 나타낸다.

<Callout type="info">
Cross-Entroy(교차 엔트로피)란, 두 개의 확률 분포 간의 차이를 측정하는 손실함수이다.
특히 분류 문제에서 모델의 예측이 정답과 얼마나 다른지를 평가하는 데 사용된다.
$$
H(P, Q) = - \sum_{i} P(x_i) \log Q(x_i)
$$
</Callout>

당연히 모델이 정확해질수록(혹은 훈련을 더 많이 할수록) ppl 수치는 낮아질 것이다.

# Smoothing
Smoothing은 **훈련데이터에 없는 단어나 구성이 등장했을 때, 확률을 0으로 두지 않게 하기 위해 적절한 값을 부여하는 기법**이다.

확률을 0으로 설정해버리면, 해당 단어나 조합이 절대 발생하지 않는다고 판단하여 실제로 있는 말임에도 불구하고 언어모델이 해당 말을 생성하지 않는 문제가 발생한다. 이를 해결하기 위해 smoothing 기법을 사용한다.

Smoothing을 하는 방식에도 여러 가지가 있다. 총 3가지 방식이 있다.
- Additive: 약간의 값을 모든 확률에 더하는 방식
- Interpolation: 몇 개의 n-gram들을 결합하는 방식
- Discounting: 관측된 확률에서 약간의 양을 빼내서 새롭게 관측된 애들한테 나눠주는 방식

## Laplace Smoothing (Additive)
확률에 특정 값을 균일하게 더해서 해결하는 방식이다. 흔히, Add-k(혹은 Add-alpha) 기법으로 알려져 있다.
![](https://i.imgur.com/qVSPqnZ.png)

## Linear Interpolation
여러 개의 n-gram의 확률 값을 가중 평균을 이용해서 합쳐서 최종 확률을 계산하는 방식이다.
![](https://i.imgur.com/mZNmTTC.png)

위 그림은 trigram, bigram, unigram의 확률 값을 가중평균을 이용해서 합친 것이다. 위와 같이 처리해주면 확률이 0이 되는 문제점을 해결할 수 있다.

이때 가중평균의 $\lambda$값은 하이퍼 파리미터처럼 valid 데이터셋을 통해서 추정해내자.
## Absolute Discounting
Additive 기법과 반대의 느낌이다.
기존의 단어들과 구성들의 확률값에서 약간의 값을 뺀 후, 새로운 단어나 구성이 들어온다면 거기로 나눠줘서 해결하는 방식이다.
![](https://i.imgur.com/7zNdBpI.jpeg)

위 그림처럼 기존 확률값들에서 0.5씩 빼준 다음, 빼서 얻은 값을 새로운 단어나 구성이 들어온다면 거기로 나눠준다.