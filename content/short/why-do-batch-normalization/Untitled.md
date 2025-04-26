---
slug: why-do-batch-normalization
title: Batch Normalization을 하는 이유는 뭘까?
description: 
thumbnail: 
categories:
  - short
tags: 
createdAt: 2025/04/25
updatedAt: 
featured: false
locale:
---

- 각 batch 데이터마다 분포가 다르게 되면 모델의 학습이 어렵다.
- 즉, 전에는 0 ~ 20 데이터가 들어와서 그거대로 학습했는데, 이번 batch에는 2000 ~ 4000 데이터가 들어와버리면 앞 batch에서의 영향을 거의 못 받아 버린다.
- 마치 늘 새로운 걸 배우는 것처럼 되어버린다.

근데 여기서 의문인 건, 어쨌든 같은 데이터셋에 있던 데이터들이니깐, 20하고 4000은 그 만큼 큰 차이로 받아들어야 하는 거 아닌가 하는 의문이 들었다.

- BatchNorm은 20과 4000을 동일한 의미로 만드는 게 아니라 조건을 일정하게 만들어주는 것.
- batch 내의 평균과 분산을 맞춰주되, 스케일 & 시프트 파라미터 ($\gamma$, $\beta$)로 원래 차이를 표현 가능하게 한다고 한다.