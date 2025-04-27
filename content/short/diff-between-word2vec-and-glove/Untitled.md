---
slug: diff-between-word2vec-and-glove
title: Word2Vec과 GloVe의 차이는 무엇일까?
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
그래서 Word2Vec과 GloVe의 차이는 대체 뭘까? 

개인적으로 매우 헷갈리는 topic이라서 내 개인 이해를 정리해 보았다.

먼저 standard한 Word2Vec과 GloVe라 가정하자.
# Word2Vec
Word2Vec은
1. **Stochastic GD** → 매번마다 모델 업데이트
2. **Negative Sampling** → 특정 중심단어에 대해서 틀린 주변단어 k개를 뽑고 올바른 주변단어가 알맞다고 모델이 예측하도록 한다.
3. **skip gram** → 중심단어를 보고 주변단어를 예측
   그 반대) **CBOW(Continuous Bag of Words)** → '여러 주변단어를 보고 중심단어를 예측' 하는 방식도 존재
을 사용한다고 가정
# GloVe
Glove는
1. corpus를 읽고 각 단어에 대해서 window 안에서 동시 등장 횟수(co-occurrence)를 센다. → 이를 토대로 **co-occurrence matrix** 를 생성
2. **word vector의 내적값이 co-occurrence의 log 값과 비슷해지도록 학습**.
   손실함수를 단어벡터(혹은 편향값)의 관점으로 편미분해서 해당 방향으로 각 단어벡터(혹은 편향값)으로 업데이트

# Word2Vec과 GloVe의 차이?
간단히 요약하자면,
- Word2Vec은 중심단어가 주어졌을 때, 알맞은 주변단어가 나올 확률이 최대가 되도록 학습하는 모델이다. 
- GloVe는 전체 Corpus에서 특정 단어 2개가 몇 번 같이 나왔는지를 맞춘다.

예를 들면,
- Word2Vec은 
  "A랑 B가 친구인가? (예/아니오)"를 맞추는 문제 → **Binary 문제를 해결하면서 학습(얘가 주변에 오는 게 맞아?)**
- GloVe는
  "A랑 B가 총 몇 번 같이 놀았어? (숫자)"를 맞추는 문제 → **Regression 문제를 해결하면서 학습(얘가 얘 주변에 몇 번이나 나왔어?)**
