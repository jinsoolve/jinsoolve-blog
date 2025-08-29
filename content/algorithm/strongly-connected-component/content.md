---
slug: strongly-connected-component
title: 강한 연결 요소 (SCC, Strongly Connected Component)
description: SCC에 대한 알고리즘 포스트입니다.
thumbnail: ./cover.png
categories:
  - algorithm
tags:
createdAt: 2025/08/29
updatedAt:
featured: false
published: true
locale:
---
먼저 **SCC** 즉, **강한 연결 요소**가 무엇인지에 대해서 살펴보자.

> 어떤 컴포넌트가 있는데, 그 컴포넌트 내부의 임의의 노드 u, v가 있다고 하자.
> 이때, **u → v 와 v → u 가 가능한 컴포넌트**를 SCC라고 한다.

SCC 알고리즘은 어떤 그래프가 주어졌을 때, 이 그래프 안에 있는 SCC들을 찾아내는 알고리즘이다.

# 알고리즘
**Tarjan 알고리즘**을 사용한다. 
(코사라주 알고리즘도 존재한다. 하지만 해당 포스트에서는 타잔 알고리즘만을 다루겠다.)

알고리즘은 다음과 같다.
1. 현재 노드에 방문하면 방문순서를 기록한다.
2. 현재 노드를 스택에 push한다.
3. 초기 parent(가장 빠른 방문순서)는 현재 노드의 방문순서로 초기화한다.
4. 현재 노드의 이웃을 반복하여 방문한다.
	1. 이웃이 아직 방문 전이라면, 재귀적으로 Tarjan 알고리즘을 호출한다.
	2. 이웃을 방문은 했지만 아직 처리 전이라면, parent 방문순서만 업데이트해 준다.
5. parent가 현재 노드라면
	1. stack을 pop하면서 scc에 넣어준다.
	2. 이때 넣어진 노드들은 모두 finish 처리 표시해준다.
6. parent 값을 반환한다.

시각적으로 이해를 돕고 싶으면 [동빈나님의 블로그](https://blog.naver.com/ndb796/221236952158)를 참고하면 좋을 듯 하다.

## 시간복잡도
시간복잡도는 $O(V+E)$이다.


# 코드
```cpp
class SCC {  
private:  
    int _id, _scc;  
    vector<int> id; // id[x] := x번 노드의 방문 순서(고유번호)  
    stack<int> st;  
  
    int dfs(int u) {  
        id[u] = _id++; // 방문한 순서를 의미  
        st.push(u);  
  
        int parent = id[u];  
        for(int v : g[u]) {  
            if(id[v] == -1) parent = min(parent, dfs(v));  
            else if(scc[v] == -1) parent = min(parent, id[v]);  
        }  
  
        if(parent == id[u]) {  
            while(true) {  
                int t = st.top(); st.pop();  
                scc[t] = _scc;  
                sccSize[_scc]++;  
                if(t == u) break;  
            }  
            _scc++;  
        }  
  
        // 가장 먼저 방문한 순서를 반환.  
        return parent;  
    }  
  
public:  
    int N;  
  
    // scc[x] := x번 노드의 scc 번호  
    // sccSize[scc_x] := scc_x번의 scc의 집합 크기  
    vector<int> scc, sccSize;  
  
    // g := 기존 그래프  
    // scc_g := scc 끼리의 그래프  
    vector<vector<int>> g, scc_g;  
  
    SCC(int _N) : N(_N), _id(1), _scc(1), id(N+1, -1), scc(N+1, -1), sccSize(N+1,0), g(N+1) {}  
  
    void add_edge(int u, int v) { g[u].emplace_back(v); }  
    void find_scc() {  
        for(int i=1; i<=N; i++)  
            if(id[i] == -1) dfs(i);  
        scc_g.resize(_scc);  
        for(int u=1; u<=N; u++) {  
            for(int v : g[u]) {  
                if(scc[u] != scc[v]) scc_g[scc[u]].emplace_back(scc[v]);  
            }  
        }  
    }  
};
```


# 참고
- https://blog.naver.com/ndb796/221236952158
- https://programing-note.tistory.com/entry/타잔Tarjan-알고리즘
