---
slug: intro-to-nlp-9
title: Attention
description: 
thumbnail: 
categories:
  - ML
tags: 
createdAt: 2025/04/27
updatedAt: 
featured: false
locale:
---
기존 RNN의 병목 현상을 해결하기 위해 Attention이 등장했다.

# Attention
Decoder에서 한 단어를 예상할 때, 해당 단어와 특별히 관련되어 있는 Encoder의 특정 단어를 Direct Connection으로 연결하는 방식이라 할 수 있다.

먼저 basic한 아이디어는 병목 현상을 완화하기 위해 마지막 vector를 쓰는 게 아니라 평균 값을 내서 전달하면 좀 낫지 않겠느냐 라는 아이디어이다.
![](https://i.imgur.com/TW1oOZ9.png)

이걸 바탕으로 attention은 **weighted averaging**을 사용한다.
![](https://i.imgur.com/f7M4S53.png)
attention은 다음과 같이 이뤄진다.
1. query와 key 간의 유사도 점수를 계산하고, 이 점수를 softmax를 이용해서 확률로 만든다.
2. 각 확률을 value들에 곱해서 합한다 (가중 평균)
3. 이 결과가 output이 된다.

lookup table은 특정 쿼리에 알맞는 key를 골라서 해당 output을 그대로 출력한다.

![](https://i.imgur.com/eJsOrXJ.png)
이런 식으로 유사도 점수를 계산할 때는 
1. 맞추고자 하는 decoder의 한 단어의 hidden state와 encoder의 모든 hidden state들을 내적해서 attention score를 구한다.
2. 해당 attention score를 softmax를 해서 확률 분포를 얻는다.
3. 해당 확률 분포를 이용해서 가중평균한 결과를 얻는다. 
4. 그리고 해당 attention output과 decoder 의 한 단어의 hidden state를 concat 해준다.

위 내용에 대한 슬라이드이다.
![](https://i.imgur.com/MaIzjoI.png)


## Attention의 장점

병렬 계산이 가능하고, 모든 단어를 한 번에 볼 수 있어서 멀리 떨어진 단어 간 관계도 쉽게 배운다.

어텐션은 NMT의 성능을 끌어올렸고, 병목현상도 해결하고, 좀 더 사람처럼 번역해주고, gradient 소실 문제도 해결하고, 심지어는 어디에 attention 되어 있는 지를 알려주면서 해석 가능성도 주었다.

다만 하나 단점이 있다면 cost가 $(\text{sequence length})^2$ 이라서 시퀀스가 길어지면 느려진다.

## Attention의 일반화

어텐션을 좀 더 general하게 생각해보면 value들과 query가 주어졌을 때 query에 가장 연관이 있는 값을 산출해 내는 매커니즘이라 볼 수 있다.
즉, 값들 중 필요한 것만 뽑아서 요약하는 것이라고도 볼 수 있다.

포인터처럼 필요한 정보를 가리키고 메모리 조회처럼 필요한 걸 가져오는 범용 방버이라 할 수 있을 것이다.
