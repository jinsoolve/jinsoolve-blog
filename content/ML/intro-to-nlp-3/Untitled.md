---
slug: intro-to-nlp-3
title: Word Vectors
description: 
thumbnail: cover.png
categories:
  - ML
tags: 
createdAt: 2025/04/25
updatedAt: 
featured: true
locale:
---

이번 포스트에서는 Word Vector에 대해서 알아보자.

먼저 아래와 같은 고민을 해보자.
우리는 **어떻게 컴퓨터에게 단어의 뜻을 이해시킬 수 있을까?**

# 어떤 노력들이 있었을까...
## WordNet?
![](https://i.imgur.com/6GU7crk.png)

예전에 WordNet라는 단어들 간의 관계에 대한 데이터셋이 있었는데, 같은 의미이거나 상위적인 의미이거나 이런 걸 표현했다.
근데 이런 WordNet은 미묘한 뉘앙스를 이해하지 못하거나, 정적 데이터이다 보니 계속해서 변화하는 자연어의 의미를 반영하지 못 했다. 또한 주관적이기도 하고, 인간 자체 노동이 필요했다. 
이런 방식이다보니, 정확한 단어의 유사도를 얻기 어려웠다.

## Representing words as discrete symbols?
예전 NLP에서 단어를 컴퓨터에게 이해시킬 때 one-hot vector 방식을 채택해서 discrete한 값을 갖게 되었다.
![](https://i.imgur.com/c1Hq3o5.png)
매우 유사한 단어지만, 그 유사성이나 관계를 제대로 표현하지 못 했다.
## Distributional Semantics
> "You shall know a word by the company it keeps" (J. R. Firth 1957: 11)

그러다가 **"결국 단어는 그 문맥으로 이해할 수 있는 거 아니야?"** 라는 생각을 누군가가 하게 된다.
즉, 비슷한 단어들과 함께 등장하는 2개의 단어가 있다면 그 두 단어는 서로 유사하다 라는 말로 이해할 수 있을 것이다.
위 아이디어에서 **Word Vector** 가 등장하게 된다.

# Word Vector
사실, Word Vector는 말 그대로 **단어를 실수값들로 이루어진 벡터로 표현**한 것 뿐이다.
![](https://i.imgur.com/zuUWcz6.png)

이처럼 비슷한 단어라면 그 값 또한 비슷할 거다. distributed하게(=분산해서) 표현하다보니 이런 유사성을 표현할 수도 있었다.
![](https://i.imgur.com/uFDzqX6.png)
비슷한 단어라면 비슷하게 뭉쳐 있을 것이다.

# Word2Vec
그럼 이 word vector들을 어떻게 구할 수 있을까?
Word2Vec은 이 word vector값이 무엇인지 구하게 해주는 Framework(즉, skeleton code 같은 것. 미리 짜여진 무언가)이다.
![](https://i.imgur.com/tJ5Dpvy.png)
이런 Center word에 대해서 앞뒤로 문맥을 살펴보면서 어떤 단어가 나타나는 지를 보고 학습하여 word vector를 구하는 방식이다.

여기서 $P(w_{t+j} | w_{t})$는 $w_t$의 앞뒤로 (window size 안쪽으로) $w_{t+j}$가 나올 확률을 의미한다.
모델이 학습하게 될 많은 자연어들, 문장들에서 어떤 단어 A 앞뒤로 어떤 단어 B가 자주 등장할수록 모델은 A  앞뒤로 단어 B가 나오는게 자연스럽다를 학습하게 될 것이다. 가장 자연스럽게 되도록 단어 A에 대한 word vector 값이 정해지게 된다.
## $P(w_{t+j},t_{j})$는 어떻게 구하나?
그럼 이때 $P(w_{t+j},t_{j})$는 어떻게 구하는 지 살펴보자.

먼저 우리는 각 단어의 word vector들을 작은 랜덤값으로 초기화한다.
이제 이걸 토대로 다음과 같이 계산한다.

$$
P(o|c) = \frac{\exp(u_{o}^T v_{c})}{\sum_{w \in V} \exp(u_{w}^T v_{c})}
$$
여기서 $v_{w}$ := `단어 w가 중심 단어에 있을 때의 word vector`이고,  $u_{w}$ := `단어 w가 context word에 있을 때의 word vector`이다.

이런 식으로 벡터곱을 해주고, softmax를 해주면 단어 c의 주변에 단어 o가 오게 될 확률을 구할 수 있다.

### 여기서 $u_{o}^T \cdot v_{c}$는 뭘 의미하는 걸까?
말 그대로 벡터끼리의 내적(dot product)이다.
![](https://i.imgur.com/C2bONmV.png)

$$
\vec{u} \cdot \vec{v} = \sum_{i=1}^{n} u_i v_i = \|u\| \cdot \|v\| \cdot \cos(\theta)
$$

단어 c의 앞뒤로 o가 나오는게 자연스럽다면 이 값이 당연히 커질 것이다.

## Word2Vec의 Loss 함수
그럼 이제 어떻게 Loss 함수를 정해야 하는 지를 보자.

![](https://i.imgur.com/nyBQaAM.png)
Likelihood. 쉽게 말하면, '얼마나 그럴 듯 한 지'를 수치로 표현한 것이다.
어떤 문장이 주어졌을 때, 각 중심 단어에 대해서 앞뒤 문맥이 자연스러운지를 표현한 확률을 모두 곱하면 그게 해당 문장이 그럴듯한지에 대한 지표가 된다.

이제 이걸 negative log likelihood를 취해서 손실함수로 만들자.
![](https://i.imgur.com/7bVB2jT.png)
이 손실함수를 최소화시키도록 학습하면 된다.

## Word2Vec의 프로세스 정리
$\theta$는 모든 word vector를 하나에 모은 거대한 벡터라 하자.
단어가 총 $|V|$ 개 라면, 각 단어마다 word vector가 2개($v_{w}$, $u_{w}$) 이므로 총 $2|V|$가 된다.
그리고 각 word vector의 차원은 d. 즉, d개의 실수들을 가진 벡터로 표현한다고 하자.

1. 모든 word vector들을 작은 랜덤값으로 초기화
2. $P(w_{t+j},t_{j})$를 구하고 이 값들을 이용해서 $J(\theta)$도 구해준다.
3. $J(\theta)$가 최소가 되는 방향으로 Gradient Descent를 해준다. → Optimization
4. 최적화가 완료되면 모든 word vector들이 잘 완성되어 있을 것이다.

## Optimization
그런데 손실함수 계산할 때 이 단어들을 모두 학습시키면 너무 오래 걸린다. 이 window들이 너무나도 많기 때문이다. 
그래서 Stochastic GD나 mini-batch GD를 사용한다.

예시를 통해서 이해해보자.

> the cat sits on the mat

위와 같은 문장이 있다고 하자. 이때 window 크기 m = 2 이라 하자. 그럼 다음과 같은 18개의 window들이 생길 수 있다.

```text
(The → cat)
(The → sits)
(cat → The)
(cat → sits)
(cat → on)
(sits → The)
(sits → cat)
(sits → on)
(sits → the)
(on → cat)
(on → sits)
(on → the)
(on → mat)
(the → sits)
(the → on)
(the → mat)
(mat → on)
(mat → the)
```

### Batch GD
1. 모든 18개의 윈도우 쌍에 대한 loss들을 계산
2. loss 미분해서 각 윈도우 쌍 마다의 gradient를 계산
3. 모든 Gradient들의 평균을 계산
4. 평균 Gradient로 모든 단어벡터에 대해서 업데이트

→ 1 epoch에 대해서 1번 업데이트
<Callout type="info">
1 epoch란?
전체 훈련 데이터를 다 사용해서 학습하는 과정
</Callout>
### Stochastic GD
다음 같이 이루어짐.
Step 1:
  (The → cat) → loss 계산 → 업데이트
Step 2:
  (The → sits) → loss 계산 → 업데이트
Step 3:
  (cat → The) → loss 계산 → 업데이트
...
Step 18:
  (mat → the) → loss 계산 → 업데이트

→ 1 epoch에 대해서 18번 업데이트

### Mini-batch GD
batch size = 4라 가정하자.

1. (The → cat), (The → sits), (cat → The), (cat → sits) → 평균 loss 계산 → gradient 계산 → 업데이트
2. (cat → on), (sits → The), (sits → cat), (sits → on) → 평균 loss 계산 → 업데이트
3. ...
4. ...
5. ...

위와 같이 업데이트 된다. → 1 epoch에 대해서 5번 업데이트

> 참고로, loss들을 평균내서 미분해서 gradient를 얻어낸 것과 
> loss들을 각각 미분해서 gradient를 얻어낸 후 gradient를 평균낸 것은 수학적으로 동일하다고 한다.

