---
slug: descending-order-binary-search
title: c++에서 내림차순에 대한 lower_bound와 upper_bound하기
description: 
thumbnail: 
categories:
  - short
tags: []
createdAt: 2025/02/10
updatedAt: 
featured: false
locale:
---
내림차순 정렬이 되어있을 때의 lower_bound와 upper_bound 사용법

```cpp
lower_bound(v.begin(), v.end(), num, greater<int>());
```
- `lower_bound` := `num`과 같거나 작은 원소들 중 첫번째 원소
- `upper_bound` := `num`보다 작은 원소들 중 첫번째 원소


