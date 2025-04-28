---
slug: intro-to-nlp-10
title: Transformers
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
Seq2Seq에서 RNN을 아예 빼버리고 attention으로 구성해보면 어떨까? → Transformer의 구조

# Self-Attention
![](https://i.imgur.com/7Q1srIQ.png)

전에 seq2seq에서 decoder의 query와 encoder의 key/value를 보았다면
이젠 스스로의 query에서 스스로의 key/value를 보는 구조라고 생각하면 된다.

## 순서 문제
근데 여기서 문제가 이렇게 되면 글의 순서를 모른다는 점이다.
따라서 단어 벡터에다가 위치 정보를 더해 준다.
![](https://i.imgur.com/5HZaAow.png)

Position Representation은 여러 가지 방식이 있다.

### Sinusoidal Position Representations
![](https://i.imgur.com/XC8zJQG.png)
sin, cos 함수를 이용해서 주기적으로 반복해서 위치 정보를 만든다.
여기서 주기적이기 때문에, 값이 커져도 주기성으로 인해 해당 값에 대해서도 예상이 가능하다.(extrapolation)

하지만, 학습이 불가능하다보니 실제로 extrapolation이 잘 안 된다.

### Learned absolute position represtations
말 그대로 p 벡터를 학습 가능한 파라미터로써, 학습시켜서 값을 얻겠다는 생각이다.

학습 가능하다보니, 유연하다. 하지만 주기성이 없어서 extrapolate할 수 없다. 범위를 나가버리면 정의할 수 없다.

### RoPE (Rotary Position Embedding)

![](https://i.imgur.com/kbtvX7Q.png)
i와 j의 차이에만 집중하고 i, j 각각의 값은 신경 쓰지 않겠다는 방식이다. 

![](https://i.imgur.com/DHIi8HN.png)
내적은 회전시켜도 값이 그대로인 것을 이용해서 위치를 회전을 통해서 반영시키는 방식이다.

## 비선형성이 없는 문제
![](https://i.imgur.com/r8iy0cn.png)
그냥 Feed-forward network(은닉층이 1개인 신경망, MLP(Multi-Layer Perceptron)) 을 넣어서 해결한다.

## 미래 못 본다...
언어 모델은 오른쪽 Context를 실제로 보지 못 하는데 이걸 어떻게 반영할 것이냐의 문제.
![](https://i.imgur.com/XCxxGjZ.png)
attention score를 $-\infty$로 설정하면 exp 했을 때 0이 되므로 해당 단어를 무시하게 된다.
이런 식으로 오른쪽 context의 단어를 무시하게 만든다.

## 개선된 최종 self-attention block
![](https://i.imgur.com/ja3v6Vw.png)

# Transformer
그래서 transformer는 어떻게 생겼는지를 보자.

## Transformer Decoder
먼저 transformer의 decoder를 한 번 보자.
![](https://i.imgur.com/j9Vymds.png)
오른쪽이 transformer decoder, 왼쪽이 개선된 self-attention이다.
약 3가지 정도가 다르다.
1. multi-head attention을 썼다.
2. Residual connection을 썼다
3. Normalization를 해 줬다.

### Multi-headed attention
head가 여러 개라는 것은 글을 여러 개의 관점으로 바라본다. 즉, 각자 집중해서 보는 게 다르다는 의미다.

![](https://i.imgur.com/EWnN27H.png)

이떄 각 head는 독립적으로 계산하고 계산 효율을 위해 기존 d 차원을 나눠써 쓰기만 하다보니 결과적으로 cost는 크게 변하지 않는다.

![](https://i.imgur.com/VrHYyhO.png)
이런 식으로 덩어리만 나눈 것이 된다.

이때 d가 커지면 dot product가 너무 켜지게 될 수 있다.
![](https://i.imgur.com/5DYWsD8.png)
dot product는 softmax의 입력인데, softmax 그래프 특징 상 입력값이 너무 크면 gradient가 0에 수렴한다. 따라서 업데이트가 잘 안 된다.
다르게 보면 결과가 마치 one-hot vector처럼 되어버려서 업데이트가 안 된다고도 생각해 볼 수 있다.

이걸 해결하기 위해 $\sqrt{ \frac{d}{h} }$로 나눠준다.

### Residual Connections
![](https://i.imgur.com/AFGBvob.png)
이전 입력을 더해주면서 다음과 같은 효과를 지닌다.
![](https://i.imgur.com/9MyjU3g.png)

### Layer Normalization
정규화의 효과는 워낙 유명하다.
데이터를 안정화시켜 주기 때문에(너무 크거나 작은 걸 막아줌) 학습이 잘 된다.

### Transformer Decoder의 구조
![](https://i.imgur.com/9Q6I50T.png)
결론적으로 이런 식의 구조를 Transformer Decorder는 갖는다.

## Transformer Encoder
![](https://i.imgur.com/TwiiDbA.png)
Transformer Encoder는 사실 Transformer Decoder에서 masking 여부만 하지 않는 차이다.

이때 Decoder에서는 앞뒤 문맥을 모두 확인하고 싶을 때, Encoder에게 정보를 참고해서 생성하게 된다.

### Transformer Encoder-Decoder

![](https://i.imgur.com/KfH0oxe.png)

이런 식으로 Encoder는 bi-directional 하게 양방향의 context를 모두 알고 있고, Decoder는 uni-directional하게 생성하고 있다. 이때 decoder는 미래를 알 수 없어서 오른쪽 context를 모르고 있지만 encoder는 알고 있다. 따라서 encoder의 출력을 보고 decoder가 필요한 정보를 attend해서 갖고 온다.
위 decoder가 encoder에게서부터 갖고 오는 것을 Cross-Attention이라 한다.

### Cross-attention
![](https://i.imgur.com/Ov5Gol4.png)

쉽게 말하면 디코더의 query가 encoder의 key / value를 차고해서 decoder 값을 출력하는 방식이라는 의미다.

## Transformer의 한계
### Self-Attention의 계산량
- **Self-attention**의 계산량이 **sequence 길이의 제곱(𝑂(n²))** 에 비례한다는 문제.
- RNN은 **선형(𝑂(n))** 이라서 긴 문장 처리에 유리한데, Transformer는 길어질수록 계산량이 급증한다.
![](https://i.imgur.com/WKdOmCx.png)

- Attention을 할 때는 **모든 토큰쌍** (query-key)을 계산해야 해서,
    - 계산량이 𝑂(n²d) (n: 시퀀스 길이, d: hidden 차원)이다.
- 예를 들면 n=30이면 900번 계산이지만,
    - n=512, 혹은 n=50,000이 되면 계산량이 엄청나게 커진다.
### Pre-Norm vs Post-Norm
![](https://i.imgur.com/6bSUqDt.png)

- **Layer Normalization**을 **Self-Attention 앞에 넣느냐(Pre-Norm)**, **뒤에 넣느냐(Post-Norm)** 에 따라 학습 안정성 차이가 난다.

### RNN의 부활
![](https://i.imgur.com/5iZuXfd.jpeg)

- 긴 문맥(long context)이 필요할 때는 다시 RNN류 모델(RWKV, Mamba 등)이 뜨고 있다.
- 왜냐하면 **RNN은 𝑂(n)** 만의 연산량으로 가능하기 때문.

## Transformer를 개선하기 위한 노력들...
### Quadratic cost를 꼭 줄여야 할까?
- 실제 대규모 Transformer는 여전히 **quadratic self-attention**을 쓴다.
- 연산량 최적화 기법 (예: FlashAttention)이 등장했지만,
- “Attention을 근본적으로 바꾸는 것”은 scaling up에 큰 도움은 못 준 경우가 많았다. 
	- 즉, transformer 모델을 가볍게 하면 소규모에서는 괜찮은데 진짜 큰 모델에서는 원래 Transformer 구조가 더 잘 작동한다는 거다.
### Transformer 구조 변경이 효과 있을까?

- 결론: **대부분 구조 변경은 성능을 “의미 있게” 올려주지 못했다**.    
- Transformer 기본 구조 자체가 이미 매우 강력하다.

## 정리
### ✅ 장점 (Advantages)

1. **긴 거리(long-range) 의존성을 쉽게 잡는다**
    
    - Self-attention은 **모든 단어 쌍** 사이에 연결을 만든다.
        
    - 예를 들어, 첫 번째 단어랑 100번째 단어 사이 관계도 바로 연결할 수 있어.
        
    - RNN처럼 순서대로 거쳐야 하지 않으니까 **멀리 떨어진 관계**도 **바로 포착 가능**.
        
    
2. **병렬화가 쉽다 (Easier to parallelize)**
    
    - RNN은 시퀀스를 **순서대로** 처리해야 해서 한 번에 여러 작업을 못했어.
        
    - Transformer는 **모든 단어를 동시에** 처리할 수 있어서,
        
        → GPU 같은 병렬 장비에서 **엄청 빠르게 학습**할 수 있어.
        
    

---

### ❗ 단점 (Drawbacks)

1. **위치 정보(Positional Information)를 충분히 담을 수 있나?**
    
    - 기본 self-attention은 **순서**를 고려하지 않고 “집합(set)“처럼 데이터를 본다.
        
    - 그래서 **positional encoding**(위치 정보를 넣는 방법)이 꼭 필요하다.
        
    - → 만약 positional encoding이 약하면 **문장의 순서**를 모델이 잘 이해 못할 수도 있음.
        
    
2. **Self-attention은 계산량이 Quadratic (𝑂(n²))이다**
    
    - 모든 단어 쌍을 비교해야 해서, 문장 길이(n)가 길어지면 **n²만큼 계산량이 늘어남**.
        
    - → 문장이 길어지면 **매우 느려진다**.
        
    - 예를 들어, n이 10배 길어지면 연산량은 100배 늘어나는 거야.