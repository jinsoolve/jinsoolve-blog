---
slug: intro-to-nlp-8
title: Fancy RNN
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
[이전 포스트](https://www.jinsoolve.com/posts/intro-to-nlp-7/)에서 RNN에서 Vanishing Gradient로 인해 장기 의존성 문제가 있다는 사실을 이야기했다.

이런 Vanishing Gradient를 해결하기 위해 크게 2가지 아이디어를 마지막에 언급했었다.
1. 메모리셀에 저장해서 이걸 전달하는 방식 → LSTM
2. 직접 연결해서 정보를 넘겨주는 방식 → ResNet(Skip Connection), Attention 등...

한 번 알아보자.

# Long Short-Term Memory RNNs (LSTMs)
기존 hidden state $h^t$가 단기 메모리라면, cell state $c^t$를 만들어서 여기에 장기 메모리를 저장해 놓는 방식이다.

이 cell state에서는 정보를 읽고, 지우고, 쓸 수 있다. 이러한 동작은 3개의 각각의 Gate들에 의해서 제어된다.

## LSTM의 구조
$h^t$가 n 길이의 벡터로 정보를 저장하고 있다면, 이 gate들도 마찬가지로 n 길이의 벡터를 저장하고 있다.
각 값은 0 ~ 1의 값으로 1은 open, 0은 close를 의미한다.
![](https://i.imgur.com/NlsXhgQ.png)

이걸 예시를 통해서 이해해보자. chatgpt의 설명이 마음에 들어서 갖고 와 보았다.

<Callout type="">
### ✏️ 비유: “비밀 일기장”
우리는 매일매일 비밀 일기장을 쓰는 사람이야.
그런데 일기를 쓸 때 3가지 질문을 먼저 해.
#### 🛑 1. Forget Gate = “지우기 질문”
“오늘 쓸 때, 지난 일기 중에서 어떤 걸 지워야 할까?”
(예를 들어, 어제 짜증났던 일은 잊어버리고 싶어!)
→ Cell state에서 과거 기억을 일부 지워줘.
#### 🖋️ 2. Input Gate = “새 기록 질문”
“오늘 무슨 새 일을 추가해서 일기에 쓸까?”
(오늘 좋은 일은 기록하고 싶지!)
→ New cell content를 얼마나 받아들일지 결정해.

#### 📚 3. New Cell Content = “새로 쓸 내용 초안”
“오늘 있었던 일들을 일단 초안으로 적어봤어.”
(다 쓸 필요는 없고, 좋은 것만 고를 수도 있어.)
→ 오늘의 새 사건들 목록. 아직 확정은 아님.

#### 📓 4. Cell State = “진짜 일기장”
“이제 지울 건 지우고, 새로 쓸 건 골라서
진짜로 일기장에 남긴 기록!”
→ 과거 기억 + 새 내용이 합쳐진 업데이트된 메모리.

#### 📢 5. Output Gate = “말하기 질문”
“일기장을 다 보관해도,
오늘 다른 사람한테 보여줄 내용은 뭘까?”**
(다 보여주는 건 아니고 일부만 얘기할 수도 있어.)
→ 이걸 통해 만든 게 바로 Hidden state야.
(= 외부에 드러내는, “내가 기억하고 있는 것처럼 보이는” 정보)



</Callout>




시각적으로 표현하면 아래와 같다.
![](https://i.imgur.com/7PNH0Ox.png)


이런 식으로 LSTM은 cell을 통해 이전 정보를 넘겨주기 때문에 오래 전의 단어도 기억을 잘 할 수 있게 된다.

## vanishing/exploding gradient 문제는 RNN만의 문제가 아니다
모델이 깊기만 하다면(feed-forward나 CNN 같이) 깊은 신경망들은 모두 이런 장기 의존증 문제를 갖고 있다.

이걸 해결하기 위핸 다른 방법들도 있다.

### Skip-Connection 
ResNet의 skip connection이 대표적이다.
![](https://i.imgur.com/nv0WpAg.png)
변화 없이 정보 그대로를 다음으로 넘겨준다.

### DenseNet
![](https://i.imgur.com/xvJiEnP.png)
모든 레이어를 이후 모든 레이어에 직접 연결하는 방식

### Highway Connection
![](https://i.imgur.com/fvPu45w.png)
Skip Connection과 유사하지만 어떤 비율로 정보(Identity)를 통과시킬지를 gate가 결정한다.
(LSTM의 영향을 받았다.)


# Bidirectional and Multi-layer RNN
근데 생각해보면 문맥이라는 건 왼쪽에만 있는 것이 아니라, 오른쪽에도 있다.
즉,오른쪽의 문맥 또한 확인해야 하는 것이다.

이를 바탕으로 다음과 같은 모델이 나왔다.

## Bidirectionial RNNs
![](https://i.imgur.com/LTiHX3y.png)
이름 그대로 양방향으로 확인하여 오른쪽 문맥까지 확인하는 것이다.

총 2개의 RNN을 만들어서 분리해서 관리한다.
![](https://i.imgur.com/tf0k2Fh.png)
하나는 정방향, 다른 하나는 양방향으로 설정해서 이 2개를 concat하는 방식이다.

### 한계
그러나 그 다음 단어를 생성해야 하는 Language Model의 특성 상, 오른쪽 문맥을 미리 확인할 수가 없다.

그러나, 양방향은 그 자체만으로도 강력하기 때문에 만약 전체 corpus를 접근할 수  있는 경우라면 매우 잘 사용할 수 있다.
예를 들어, BERT(Bidirectional Encoder Representations from Transformers)는 transformer기반이고, 양방향으로 확인하면서 문장 이해력을 높였다.

## Multi-layer RNNs
이번에는 여러 개의 층을 쌓아서 RNN의 능력을 높여보자.

![](https://i.imgur.com/vufuFms.png)
낮은 층은 low-level feature를 계산하고, 높은 층은 high-level feature를 계산한다.

너무 깊게 쌓으면 skip-connection이나 dense-connection 같은 것이 필요하다.

# Machine Translation (기계 번역)
## Neural Machine Translation (NMT) : Seq2Seq
기계 번역에서 획기적 발전 중 하나가 Seq2Seq 모델이다.

![](https://i.imgur.com/ev80vCW.png)
이런 식으로 encoder-decoder 모델이다

입력 언어 문장을 하나의 벡터로 압축한 후, 해당 벡터로 decoder에 넣어서 출력 언어 문장으로 내보내는 구조이다.
seq2seq는 conditional language model 이라 말할 수 있는데, 원래 문장을 조건으로 디코더가 다음 단어를 예측하기 때문이다.


![](https://i.imgur.com/zWJHvdY.png)

이런 NMT는 말 그대로 번역 쌍 데이터를 많이 확보해서 훈련해야 한다.

![](https://i.imgur.com/ApJSsfn.png)
이런 식으로 손실함수를 평균 내서 계산한다.

### 한계
하지만 이런 방식은 아무래도 하나의 벡터로 압축하기 때문에 이런 병목 현상에서 데이터의 유실이 일어날 수 있다.

또한 RNN의 특징인 장기 의존증 문제 또한 있다.

그리고 Multi layer RNN의 구조상, 이전 정보를 받아야 하므로 병렬적으로 수행하지 못 하기 때문에 시간이 오래 걸린다.