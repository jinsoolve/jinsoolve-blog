---
slug: Quantized Side Tuning
title: Quantized Side Tuning 논문 리뷰
description: "Quantized Side Tuning: Fast and Memory-Efficient Tuning ofQuantized Large Language Models 논문에 대한 리뷰를 작성한 글입니다."
thumbnail: cover.png
categories:
  - paper
tags: 
createdAt: 2025/03/11
updatedAt: 
featured: true
locale:
---
위 포스트는 [Quantized Side Tuning: Fast and Memory-Efficient Tuning ofQuantized Large Language Models](https://arxiv.org/abs/2401.07159) 논문에 대한 리뷰를 작성한 글입니다.

<Callout type="danger">
이 글은 공부를 하면서 작성한 글이므로 잘못된 부분이 있을 수 있습니다.
</Callout>

# Abstract

# 1 Introduction


# 2 Related Work

## 2.1 Parameter-Efficient Finetuning
LLM을 특정 도메인에 최적화시키기 위해 우리는 finetuning을 한다.
하지만 LLM 크기가 점차 커지면서, 전체 모델을 finetuning하는 건 비싸졌고 이를 줄이기 위해 **PERT(Parmeter-Efficient Fine-Tuning)**을 사용하고자 했다.

PERT는 **전체 가중치를 조정하지 않고 일부 파라미터만 조정하여 특정 작업에 맞게 Finetuning 하는 방법**을 의미한다.

<Callout type="info">
PERT에는 여러 종류가 있다.

- 입력 테스트 또는 어텐션 앞에 학습 가능한 프롬프트 임베딩을 추가하는 방식
- 특정 작업에 특화된 새로운 파라미터를 Transformer 층 내부에 삽입하는 방식
- low-rank decomposition을 활용하여 LLM 가중치에 삽입할 수 있는 학습 가능한 파라키터를 구성하는 방식(LoRA)
- 등등...
</Callout>

이런 PERT로 학습 가능한 파라미터 수를 최소화하면서 모델 성능을 최적화할 수 있게 되었다.
그러나 **학습 가능한 파라미터 수를 줄이는 것이 반드시 메모리 점유율 감소로 이어지는 것은 아니다.**

## 2.2 Memory-Efficient Training and Finetuning

### 기억 신경망

기존 신경망은 역전파를 수행하기 위해서 순전파 과정에서 나온 모든 중간 결과(Activation 값)을 저장해야 한다. 이때의 메모리 사용량이 높기 때문에 이를 해결하기 위해 기억 신경망이라는 개념이 나왔다.

![](https://i.imgur.com/IDABPHd.png)

**기억 신경망(Reversible Neural Networks)** 은 순전파와 역전파가 서로 반대로 수행할 수 있도록 설계된 모델로, 순전파에서의 출력을 사용하여 역전파 과정에서 입력을 복원할 수 있는 신경망이다.

위 그림은 기억 신경망의 대표적인 예시인 RevNet(ResNet을 기반으로 한 신경망)이다.
Adder-Split 구조로, 네트워크의 입력 X를 두 개의 부분으로 나누고 서로를 활용하여 출력을 계산하는 방식이다.

이런 식으로 하면 입력을 다시 복원할 수 있으므로 역전파를 수행할 때 추가 메모리를 사용할 필요 없이 효율적으로 학습이 가능하다.

### 네트워크 압축

또 다른 방법으로는 **네트워크 압축(Network Compression)** 이라는 것이 있다.
이는 원래 LLM을 더 작은 형태로 축소하여 훈련 및 추론 과정 모두에서 계산 효율성을 높인다.
예시로는 Network Pruning 이나 Knowledge Distillation이 있다.
<Callout type="info">
- Network Pruning: 개별 파라미터의 중요도를 평가한 후 중요도가 낮은 파라미터를 제거해서 모델 간소화
- Knowle Distillation: 교사-학생 모델. 학생 네트워크가 특정 데이터셋에서 교사 네트워크의 출력 분포를 근사하도록 훈련하는 방식
</Callout>

PERT는 소수의 학습 가능한 파라미터만 업데이트해서 기존 LLM 능력은 유지하면서 특정 작업에 대한 성능을 극대화시키지만 네트워크 압축은 모델 크기를 줄이고 추론 속도를 높이지만, 원래 모델의 복잡한 표현력을 일부 잃을 가능성이 있다.

### QLoRA
QLoRA는 LLM을 4비트로 양자화 한 후, LoRA를 추가하여 양자화된 LLM을 Finetuning 하는 방식이다.

<Callout type="">
여기서, 양자화란?
양자화라는 단어 때문에 어렵게 느껴지는 데 사실 별 거 없다.
16비트(혹은 32비트) 수를 4비트로 표현하기 위해 압축하는 것이다. 
특정 범위의 수를 예를 들어 0 ~ 9의 수는 0으로, 10~19의 수는 1로 이런 식으로 압축하는 방식이다.
좀 나이브하게 설명했는데, 자세한 방법은 나중에 설명하겠다.
</Callout>

QLoRA는 full finetuning 과 비교하여 가중치와 Optimizer의 메모리 점유율을 크게 줄이면서도 유사한 성능을 유지할 수 있다.
하지만 QLoRA는 중간 활성화 값의 메모리 점유율을 고려하지 않기 때문에, 큰 배치 크기로 LLM을 finetuning하는 경우 훈련 시간이 길어지는 문제가 발생.

### Side Network
Side Network를 도입하여 Side Network의 특징 상 역전파 과정이 불필요 하므로 증간 활성화 값과 관련된 메모리 점유율을 줄이는 역할을 한다.

하지만 Side Network를 도입하더라도 LLM 자체의 모델 크기(즉, 가중치의 메모리 점유율)는 여전히 계산 비용 문제를 야기한다. 이러한 방법들은 30억개 미만의 파리미터를 가진 모델에만 적용될 수 있으며, 더 큰 모델을 finetuning하는데에는 실패한다.

<Callout type="">
Side Network란?
Finetuning의 일종으로, 기존 LLM은 그대로 두고 작은 side network를 추가하여 해당 network에 대해서만 학습 시키는 방식.
메모리 사용량을 줄이면서도 성능 유지 가능.
</Callout>

<Callout type="">
Side Network(Side Tuning)이 안 되는 이유?
1. 대형 모델에서는 큰 효과가 없기 때문
	- 작은 모델은 원래 표현력이 부족하기 때문에 side network의 영향이 커서 side network를 학습한 것만으로도 충분히 학습이 가능함.
	- 그러나 대형 모델의 경우, 기존 모델의 표현력이 너무 강력해서, side network로는 역부족이다.
2. 대형 모델은 더 많은 데이터를 필요로 하는데, side network만으로는 역부족
	- 대형 모델은 이미 거대한 데이터로 학습됨.
	- side network가 새로운 데이터로 아무리 학습해도  기존 모델이 업데이트가 되지 않기 때문에 한계가 있음
3. 중간 활성화 값 메모리 문제
	- 대형 모델은 층의 개수가 많고, 활성화 값의 크기도 크다.
	- Side Network만 학습하기 때문에 기존 모델의 활성화 값도 저장해야 한다. 따라서 메모리 사용량 증가.
	- 애초에 메모리를 절약하려고 만든 방법인데 큰 모델에서는 오히려 메모리 사용량이 증가할 수도 있음
</Callout>

# 3 Quantized Side Tuning

## 3.1 4-bit Quantization
아까 위에서 잠깐 언급한 4비트 양자화의 방법에 대해서 다시 한 번 설명해 보겠다.
$$
X^{4bit} = \text{round} \left( \frac{M_{4bit}}{\text{Absmax}(X^{16bit})} X^{16bit} \right)
\\[5pt]
= \text{round} \left( c^{16bit} \cdot X^{16bit} \right)
$$
위 공식은 쉽게 말하면 16비트의 범위의 수를 4비트의 범위 수로 근사화시키는 것이다. 
(이때 $\text{Absmax}(X^{16bit})$ 는 X의 값들 중 절댓값이 가장 큰 애의 값이고, $M_{4bit}$은 4비트에서 가질 수 있는 최대값이다.) 
참고로 여기서 $c^{16bit}$는 양자화 상수이다. 우리는 이 양자화 상수를 기억하면 된다.

반대로 역양자화(De-quantization)은 다음과 같다.
$$
\text{dequant}(c_{16bit}, X_{4bit}) = \frac{X_{4bit}}{c_{16bit}} = X_{16bit}
$$

위와 같은 공식을 통해 16비트 수를 4비트 수로 나타낼 수 있다.

하지만 저런 식으로 양자화를 시켜버리면 당연히 복구 했을 때 왜곡되는 경우가 나타날 것이다.
특히 다른 값들에 비해 매우 큰 값이 포함되어 있을 때(즉, 이상치(outlier)문제일 때) 왜곡이 심하다. 다음과 같은 예시를 살펴보자.
$X_{16bit} = [-5, -3, -1, 1, 3, 5, 100]$ 이런 경우 4비트로 양자화하면 $X_{4bit} = \text{round} (7 \times X_{\text{norm}}) = [0, 0, 0, 0, 0, 0, 7]$ 이런 식으로 되어버리므로 왜곡이 생긴다.

이를 해결하기 위해, 입력 텐서($X$)를 개별 블록으로 나누어 묶고 각 블록을 독립적으로 양자화하는 방식을 사용한다. ($X \in \mathbb{R}^{b \times h}$)
예를 들어, 각 블록이 B개의 요소를 포함한다고 하자. X를 1차원 배열($b \times  h$)로 변환한 후에 B개씩 묶어보면 총 n개($= \frac{b \times h}{B}$)가 나온다. 이렇게 블록들을 만들고 각 블록들에 대해 독립적으로 양자화한다면 왜곡을 완화시킬 수 있다.
블록 크기를 작게 할수록 양자화 오차가 줄어들지만, 블록크기가 너무 작으면 각 블록마다 양자화 상수를 저장해야 하므로 메모리 사용량이 증가할 수도 있기 때문에 적절한 블록 크기를 설정하는 것이 중요하다.

그럼에도 불구하고 양자화 상수가 16비트이고 블록이 늘어날 수록 양자화 상수 또한 많이 저장해야 하므로 메모리 오버헤드가 발생한다. 따라서 해당 논문에서는 양자화 상수의 메모리 점유율을 줄이기 위해 기존과 동일한 양자화 전략을 적용하여 **양자화 상수 자체를 다시 양자화** 하는 전략을 취했다.
위 논문에서는 8비트 수를 이용하여 양자화 상수를 양자화한다. 따라서 순전파(Forward Pass)는 다음과 같이 정의된다.

$$
Y_{16bit} = \text{dequant}(\text{dequant}(c_{16bit}^{2}, c_{8bit}^{1}), W_{4bit}) X_{16bit}
$$
즉, 8비트인 \[양자화 상수의 양자화 상수\]를 이용해 \[양자화 상수\]를 복원시킨 후에, 얻은 양자화 상수로 원래 16비트 수를 복원시킨다.

이처럼 4비트 양자화는 가중치의 메모리 점유율을 크게 줄여서 LLM의 저장 및 배포를 용이하게 만든다. 또한 저정밀 소수연산은 GPU 같은 최신 가속기에서 더 빠르게 실행될 수 있어서 좋다.

그럼에도 불구하고, **양자화 과정에서 고정밀 데이터 타입에서 저정밀 데이터 타입으로 변환할 때 정보 손실이 발생**하며, 이는 정확도 저하의 원인이 될 수 있다.

## 3.2 Side Tuning
이제 **LLM 훈련 과정에서의 메모리 점유율(memory footprint)을 분석한 후**, 양자화 과정에서 발생하는 정보 손실을 줄이고 정확도 감소를 최소화하는 **측면 네트워크(side network)의 신경망 아키텍처**를 소개하겠다.

### 훈련 단계에서의 메모리 점유율

주어진 LLM이 N개의 층을 가지고 있다고 할 때, $y_i = f_i(W_i, x_i)$는 LLM의 i번째 Transformer 층을 나타낸다.
• 여기서, $x_i$는 i번째 층의 입력이며, 이전 층의 출력값과 동일하다. 즉, $x_i = y_{i-1}$이다.

LLM의 훈련 과정에서 필요한 메모리는 **세 가지 주요 요소**로 구성된다.

1. $M_1$ **- LLM의 가중치(Weights)** $\{W_i\}_{i=1}^{N}$
	• 모델이 학습해야 하는 기본적인 파라미터.
2. $M_2$ **- 옵티마이저 상태(Optimizer State)**
	• **Adam 옵티마이저**(Kingma & Ba, 2014)를 사용할 경우, **훈련 가능한 파라미터 크기의 3배**의 메모리를 필요로 한다.
		• (1) 그래디언트(gradient) 저장
		• (2) 1차 모멘트(moment) 저장
		• (3) 2차 모멘트(moment) 저장
3. $M_3$ **- 중간 활성화 값(Intermediate Activations)** $\{y{\prime}i\}{i=1}^{N}$
	• **모델의 깊이(depth), 너비(width), 배치 크기(batch size), 시퀀스 길이(sequence length)** 등의 훈련 설정에 따라 메모리 점유율이 결정됨.

### QLoRA의 한계
• QLoRA는 LLM의 가중치($M_1$) 및 옵티마이저 상태($M_2$)의 메모리 점유율을 줄이는 데 성공했지만, 중간 활성화 값($M_3$)을 줄이는 데 실패했다.
• 따라서 큰 배치 크기(batch size) 또는 긴 시퀀스 길이(sequence length) 를 사용하는 경우, QLoRA의 메모리 점유율이 급격히 증가한다.
• 반대로, 배치 크기를 줄이면 메모리 사용량은 감소하지만, 훈련 시간이 길어지는 단점이 발생한다.

### 기존 연구의 한계
• Sung et al. (2022)는 중간 활성화 값($M_3$)의 메모리 점유율만 줄이는 방법을 제안했지만,
• 30억(3B) 개 이상의 파라미터를 가진 모델을 미세 조정하는 데 어려움을 겪는다.