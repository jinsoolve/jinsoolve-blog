---
slug: PoisonedRAG
title: PoisonedRAG 논문 리뷰
description: "PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generationof Large Language Models 에 관한 논문 리뷰"
thumbnail: ./cover.png
categories:
  - paper
tags: 
createdAt: 2025/01/14
updatedAt: 
featured: true
locale:
---
위 글은 [PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generationof Large Language Models](https://arxiv.org/pdf/2402.07867) 논문을 리뷰한 글이다.
<Callout type="danger">
이 글은 공부를 하면서 작성한 글이므로 잘못된 부분이 있을 수 있습니다.
</Callout>

# Abstract
LLM은 정말 좋은 성능을 보였지만, 여전히 최신 지식 부족이나 Hallucination 같은 한계가 존재했는데 이를 해결하기 위해서 RAG(Retrieval Augmented Generation) 기법을 사용하였다.

RAG는 외부 지식 데이터베이스에서 검색한 결과를 기반으로 답변을 생성하는 기술이다. 지금까지 논문들은 이러한 RAG의 효율성 및 정확도를 높이기 위해 노력했지만 RAG의 보안적인 측면은 거의 탐구되지 않았고 위 논문은 RAG의 보안 측면을 탐구하는 논문이다.

RAG 시스템이 외부 지식 데이터베이스를 참고하여 답변을 한다는 점을 이용하여 이 지식 데이터베이스에 소수의 악성 텍스트를 삽입하여 공격자가 하는 특정 질문(target question)에 대해 LLM이 공격자가 원하는 특정 답변(target answer)를 생성하도록 유도할 수 있음을 발견하였다. 이러한 RAG 시스템에 대한 지식 손상 공격(Knowledge Corruption Attack)은 **PoisonedRAG**이다.

위 논문은 이러한 지식 손상 공격을 최적화 문제로 보고 공식화시킨다. 이 최적화 문제의 답은 **malicious text(악성 텍스트)** 의 집합이다. 

RAG 시스템에 대해서 Attacker가 알고 있느냐 모르냐로 white-box와 black-box의 경우로 나눠서 2가지 최적화 문제를 제시하고 이를 해결하였다.
결과적으로 5개의 악성텍스트를 제공했을 때 거대한 지식 데이터베이스를 기반으로 RAG를 한 LLM에 대해 90%의 attack success의 결과를 얻을 수 있었다.

또한 위 공격들에 대해 몇 가지 방어기법을 적용해보고 그 결과를 살펴보았을 때, PoisonedRAG를 막기에는 부족하다는 것을 보여줄 수 있었다.
# 1 Introduction
Abstract에서 설명한 바와 같이 LLM은 hallucination을 극복하고 특정 도메인에서의 지식 차이나 최신 지식을 얻기 위해서 RAG 기법을 사용한다.
![](https://i.imgur.com/vcv6DhR.png)
RAG는 총 3가지로 구분할 수 있는데,

- Knowledge Database
- Retriever
- LLM

먼저 Knowledge Database(위키피디아, 기사 등에서 갖고옴)에서 Retriver를 통해서 관련있는 정보를 추출한 후에 LLM에게 context로써 제공한다.
그러면 LLM은 제공된 정보를 가지고 답변을 생성하게 된다.

이러다 보니 결국 LLM은 Knowledge Database라는 새로운 attack surface를 제공하게 되었고 이를 통해 공격받을 수 있게 되었다.

현재까지의 RAG에 관련된 논문은 이 RAG의 정확도나 효율성을 올리기 위한 작업들이었지만 보안적인 취약점을 위한 논문은 존재하지 않았고 위 논문은 보안적 취약점을 이야기하는 바이다.

#### Knowledge database as a new and practical attack surface
Attacker는 이러한 Knowledge Database를 공격한다.
예를 들면, 위키피디아의 내용에 malicious texts(악성 텍스트)를 넣는 방식으로 진행한다.
혹은, 가짜 뉴스를 포스팅한다던가 악성 웹사이트를 호스팅하여 인터넷을 통한 정보 수집을 공격하는 방식으로 해볼 수 있다.

#### Threat model
PoisonedRAG에서는 Target Question을 넣으면 Target Answer를 LLM이 생성하게 되도록 하는 것이 목표다. 말 그대로 LLM이 말도 안 되는 말을 하도록 하는 것이다.
이렇게 되면 LLM을 다양한 분야에 사용하기 어려움이 많이 생긴다.

위 논문에서는 knowledge database의 텍스트에 접근할 수 없고, LLM에 접근하거나 질문할 수 없음을 가정한다. 공격자는 retriever를 알 수도 있고, 모를 수도 있다. 이에 따라 2개의 세팅, **white-box setting**과 **black-box setting**으로 나눈다.

쉽게 얘기하면 knowledge database나 LLM은 아예 못 건드리고 retriever를 건드리냐, 건드리지 않느냐로 나눈다.


#### Overview of PoisonedRAG
PoisonedRAG에 대해서 가볍게 살펴보자.

위 논문에서는 악성 텍스트를 구성하는 것을 최적화 문제라 생각하고 가설을 공식화하였다.
하지마 이 문제를 해결하기는 쉽지 않고 따라서 [heuristic](https://ko.wikipedia.org/wiki/휴리스틱_이론)(경험적으로 느슨하게 그럴 거라 대충 생각한다? 정도의 의미)하게 생각하였을 때 **retrieval condition**과 **generation condition**으로 나눠서 생각하자.

**retrieval condition**이란, target question이 들어왔을 때 retriever가 악성텍스트를 잘 뽑아내는 지의 여부이다.
**generation condition**은 이러한 악성텍스트가 LLM이 target answer을 생성하게 하는 지를 의미한다.

위 논문에서는 **이 2 조건을 각각 성공시킬 수 있는 2개의 sub-text으로 악성텍스트를 decompose**한다. 그리고 이 2개의 **sub-text**를 합쳐서 동시에 2개의 조건을 성공시킬 수 있도록 하는 것이 주요한 아이디어이다.
#### Evaluation of PoisonedRAG
위 논문에서는 Attack Success Rate (ASR)을 평가 지표로 사용하고, 여기서 ASR은 target question에 대해서 target answer가 나왔는 지의 여부를 사용한다.

다음과 같은 결과를 얻을 수 있었다고 한다.
1. PoisonedRAG는 적은 양의 악성 텍스트로도 높은 ASR을 달성할 수 있었다.
2. SOTA(State-of-the-art) baseline(기본 모델) 즉, 현재 최고 수준의 성능을 보이는 기존방법에 대해서도 우수한 성능을 보였다.
3.  Ablation Studies(특정 요소의 중요성을 평가하기 위해 그 요소를 제거하나 변경하면서 성능 미치는 영향을 분석하는 방법) 결과로, 다양한 하이퍼-파라미터 설정에서도 안정적이고 일관된 성능을 보여준다.

#### Defending against PoisonedRAG
몇 가지 defenses 기법에 대해서도, PoisonedRAG를 적용하였을 때 이를 막기에는 역부족이었음을 확인할 수 있었다.
(여기서 말하는 defense 기법에는 paraphrasing과 perplexity-based detection이 있었다.)

<Callout type="">
**Paraphrasing**이란, 같은 내용을 다른 단어로 바꿔서 말하는 것.
주로 문자의 표현을 다양화하건, 더 간단하고 명확하게 전달하고자 할 때 사용됨.
</Callout>

<Callout type="">
**Perplexity-based detection**이란, (쉽게 말하면) 
문장을 듣고 "이건 정말 사람이 쓴 말 같다" 또는 "이거 뭔가 이상한데?"라고 판단하는 모델의 직감 같은 것.

텍스트가 얼마나 예측 가능한지(혹은 자연스러운지)를 측정하는데 사용.
</Callout>

위와 같은 Defense 기법에도 PoisonedRAG는 여전히 효과가 굉장했다!

# 2 Background and Related Work
추후에 계속...

## 2.1 Background on RAG

## 2.2 Existing Attacks to LLMs

## 2.3 Existing Data Poisoning Attacks




# 3 Problem Formulation

## 3.1 Threat Model

## 3.2 Knowledge Corruption Attack to RAG





# 4 Design of PoisonedRAG

## 4.1 Deriving Two Necessary Conditions for an Effective Knowledge Corruption Attack

## 4.2 Crafting Malicious Texts to Achieve the Two Derived Conditions
### 4.2.1 Crafting $I$ to Achieve Generation Condition
### 4.2.2 Crafting $S$ to Achieve Retrieval Condition



# 5 Evaluation
## 5.1 Experimental Setup
## 5.2 Main Results
## 5.3 Ablation Study
### 5.3.1 Impact of Hyperparameters in RAG
### 5.3.2 Impact of Hyperparameters in PoisonedRAG



# 6 Evaluation for Real-world Applications
## 6.1 Advanced RAG Schemes
## 6.2 Wikipedia-based ChatBot
## 6.3 LLM Agent



# 7 Defenses
## 7.1 Paraphrasing
## 7.2 Perplexity-based Detection
## 7.3 Duplicate Text Filtering
## 7.4 Knowledge Expansion



# 8 Discussion and Limitation


# 9 Conclusion and Future Work


