---
slug: intro-to-nlp-4
title: Word2Vec
description: 
thumbnail: cover.png
categories:
  - ML
tags: 
createdAt: 2025/04/26
updatedAt: 
featured: true
locale:
---
저번에 [word vector](https://www.jinsoolve.com/posts/intro-to-nlp-3/)에 대해서 알아봤는데, 이번에는 word vector의 프레임워크인 Word2Vec에 대해서 좀 더 알아보자.

# Word2Vec의 계산 방식

먼저 Word2Vec이 어떤 식으로 동작하는 지 가볍게 살펴보자.

![](https://i.imgur.com/MZ8EIAo.png)
각 단어당 2개의 벡터가 있었는데 outside(context)와 center에서의 벡터가 각각 있었음을 기억하자.
위와 같은 방식으로 $v_{4}$의 단어에 대해서 결과를 얻으려면 위와 같이 계산하는 방식이다.

이때 **"Bag of words" (BOW)** 라는 말을 쓰는데,  여기서 BOW란, 단어의 순서나 위치에 상관없이 주변에 존재하는지의 여부만 확인해서 어떤 단어가 주변에 있는지를 확인한다.
Word2Vec은 이전 포스트에서도 봤다시피 순서에 신경쓰지 않았던 것을 확인할 수 있다.


# Word2Vec의 다양한 구현 방식

Word2Vec에서는 2가지 방식을 선택할 수 있다.
1. **Skip-grams (SG)**
	중심 단어를 보고 주변 단어들을 예측
	(이게 우리가 이전 포스트에서 사용했던 방식이다.)
2. **Continuous Bag of Words (CBOW)**
	BOW 단어들(즉, 주변에 있는 단어들)을 보고 중심 단어를 예측

또한 Loss Function에 대해서 다양한 방식들이 있다.

1. **Naive Softmax**
	Naive Softmax 방식은 간단하긴 하지만 수식($P(o|c) = \frac{\exp(u_{o}^T v_{c})}{\sum_{w \in V} \exp(u_{w}^T v_{c})}$)을 보면, 분모를 계산하는 과정에서 모든 단어들에 대해서 계산을 해야 하기 때문에 너무 오래 걸린다. 
2. **Negative Sampling**
	따라서 실제 standard word2vec은 skip-gram과 negative sampling 방식을 채택한다.
	해당 방식을 바로 뒤에서 좀 더 자세히 다루겠다.
3. etc...

## Negative Sampling
Negative Sampling 방식은 거짓 랜덤 샘플 k개를 생성해서, 모델을 진짜 단어가 올 확률을 높이고, 가짜 단어가 올 확률을 낮추는 방향으로 모델을 학습시킨다.

손실함수는 다음과 같다.
$$
J_{\text{neg-sample}}(\mathbf{u}_o, \mathbf{v}_c, U) = -\log \sigma(\mathbf{u}_o^T \mathbf{v}c) - \sum_{k \in \{K\text{ sampled indices}\}} \log \sigma(-\mathbf{u}_k^T \mathbf{v}_c)
$$

### 거짓 샘플은 어떻게 생성하는 걸까?
$$
P(w) = \frac{U(w)^{3/4}}{Z}
$$
$U(w)$는 unigram distribution. 즉, 단어 등장 확률 분포이다. $Z$는 정규화 상수로 정규 분포로 만들어준다는 의미다.
$U(w)$에 $\frac{3}{4}$ 제곱을 함으로써, 기존 단어집에서 자주 등장하는 단어는 덜 뽑히고 덜 등장하는 단어는 약간 더 자주 뽑히도록 샘플링한다.


### Negative Sampling 방식으로 Gradient Descent 하기
그래서 위 방식대로 Stochastic GD를 한다면, 한 번에 하나의 윈도우만 보고 gradient를 계산하는데 한 윈도우 안에는 $2m + 1 + 2km$ (m: 윈도우 크기, k: negative 샘플 수) 개의 단어 정도만 있게 된다.

따라서 전체 단어 $2|V| \times  d$에 비해 업데이트해야 하는 단어 수가 매우 적어진다. 즉, 매우 Sparse하게 된다.

이 Sparse 함을 이용해서 우리는 계산을 좀 더 효율적으로 해볼 수 있을 것이다!
아래 같은 방식들이 있을 수 있다.
- sparse matrix 
  활성화하고 싶은 값에만 활성화하고 나머지는 0으로 해서 특정 행만 업데이트 시킨다.
- hash 테이블


# 그냥 같이 등장한 횟수만 쓰면 되지 않을까?
word2vec을 쓰려면 코퍼스를 계속 반복하면서 학습해야 word vector를 얻을 수 있다.
굳이 word2vec을 써야 하는 걸까?

그냥 같은 문장에서 얼마나 자주 같이 등장했는지의 횟수만 쓰면 안 되는 걸까?

즉, co-occurence counts를 쓰면 되지 않을까?
![](https://i.imgur.com/1xtL0wc.png)
이런 식으로 같이 등장한 횟수를 세는 것이다.
근데 이 행렬은 보다시피 sparse matrix이기 때문에, 이를 적은 수의 dense vector로 쪼개보자.

선대의 꽃(?)인 **Singular Value Decomposition (SVD)** 를 쓰자. (~~또 당신입니까...~~)
$$
X = U \sum V^{T}
$$
SVD를 이용해서 쪼개버린다면 우리는 적은 수의 dense vector만 저장하면 된다.

## 하지만 그냥 raw count 데이터를 쓰면 안 된다...
그냥 쓰면 효과가 적다.
우리는 the, he, has 같은 쓸데(?)없지만 자주 등장하는 단어들(function word)이 있음을 상기해보자. 이런 단어들은 자주는 등장하지만 의미에 큰 영향을 주지 않는다. 따라서 이런 단어들을 제거해줄 필요가 있다.
- frequency에 log를 취하기
- 특정 값 t에 대해서, t보다 크면 다 t로 만들어버리기 = $min(X,t)$
- 그냥 function word들 전부 무시해버리기

이런 식으로 데이터를 정제해준 후에 SVD를 하는 것이 좋다.

## GloVe
위 논문에서는 단어의 의미를 **벡터의 차이**로 표현하자는 제안을 한다.
그래서 위에서 구한 co-occurence probability의 비율을 벡터 공간의 선형 구조로 표현하고자 한다.
→ Log-bilinear model로 벡터 차이 값을 표현한다.

![](https://i.imgur.com/xha8lcM.png)
이런 식으로 표현할 수 있다.
즉, **단어 벡터들의 내적**이 **log(co-occurrence count)** 와 비슷하도록 만든다.
등장 빈도 비율을 맞추도록 최적화.

![](https://i.imgur.com/3ymulNi.png)
이렇게 loss 함수를 설정하면 Word2Vec과 비교해서 빠르게 훈련이 가능하고 거대한 코퍼스에 대해서도 가능하다.
# 하나의 단어에는 여러 개의 의미가 있는데...
하지만 하나의 단어에는 여러 개의 의미가 있다.

예를 들어, "pike" 라는 단어에는 다음과 같은 뜻들이 존재한다.
![](https://i.imgur.com/1CFSysP.png)

이런 걸 어떻게 구분할 수 있을까?

우리는 위 뜻들의 pike들이 벡터로 표현돼서 결국 하나의 벡터로 합쳐지게 된다. 그걸 수식으로 하면 다음과 같다.

$$
v_{\text{pike}} = a_1 v_{\text{pike}1} + a_2 v{\text{pike}2} + a_3 v{\text{pike}_3} + \dots
$$
근데 놀랍게도! 이 단어들은 서로 구분이 된다.

그 이유는 대다수의 경우, 하나의 문장에는 하나의 의미로써 쓰이지.. 같은 단어임에도 서로 다른 의미로 해당 단어를 쓰는 문장은 거의 없다. 
그러다보니 저 $a_{1}, a_{2} , \dots$ 들이 sparse 하게 되어서 자동으로 분리가 되어버린다.


# Named Entity Recognition(NER)
![](https://i.imgur.com/LjeYqC1.png)

근데 이름 같은 고유명사 같은 경우는 이게 사람 이름인지 지명 이름인지 헷갈릴 때가 존재할 수 있다.
이건 어떻게 해결해야  할까?

Simple NER에서는 수작업으로 데이터들을 라벨링해서 supervised learning을 했다고 한다.
binary logistic classifier로 학습했다. (물론 실제로는 multi-class softmax를 쓴다.)
yes or no로 학습.

전통적인 softmax 분류기는 선형 구분 밖에 못하지만, 신경망으로는 비선형적인 분류 또한 가능하다
![](https://i.imgur.com/2r0Qs7l.png)

