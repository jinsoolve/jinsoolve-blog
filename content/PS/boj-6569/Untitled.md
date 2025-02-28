---
slug: boj-6569
title: 백준 6569 - 몬드리안의 꿈
description: 
thumbnail: 
categories:
  - PS
tags:
  - 다이나믹-프로그래밍
  - 비트마스킹
createdAt: 2025/02/28
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 6569 - 몬드리안의 꿈](https://www.acmicpc.net/problem/6569)에 대한 해설입니다.


# 풀이

| ... | ... | ... | ... |  ...  | ... | ... | ... |
| :-: | :-: | :-: | :-: | :---: | :-: | :-: | :-: |
| 채워짐 | 채워짐 | 채워짐 | 채워짐 |  채워짐  | 채워짐 | 채워짐 | 채워짐 |
| 채워짐 | 채워짐 | 채워짐 | 채워짐 |  w-1  | ... | ... | ... |
| ... |  2  |  1  |  0  | (h,w) |     |     |     |


위와 같이 큰 직사각형이 존재한다고 하자.
`dp[h][w][bit] := bit상태일 때, (h,w)부터 끝까지 큰 직사각형을 2x1 직사각형으로 채우는 경우의 수`라 하자. (이때 (0,0) ~ (h-1,w-1) 영역은 모두 채워져 있음을 가정한다.)

여기서 bit는 w개의 bit로 이루어져 있는데, 이는  <u>(w-1) (w-2) ... (2) (1) (0)</u> 을 의미한다. 
각 비트는 채워진 여부를 의미한다. 0이면 비어있고 1이면 채워져 있다.


이때 다음과 같이 풀면 된다.

1. (h-1,w)가 빈 경우,
   이 경우 (h,w)에서 세로로 세워진 2x1 직사각형을 놓치 않으면 (h-1,w)을 채울 방법이 앞으로 더 이상 없으므로 무조건 채워주어야 하므로 무조건 세로로 직사각형을 놓는다.
2. Else
	아래 1,2 경우를 더 해준다.
	1. 현재 칸에 아무런 직사각형을 놓치 않는다.
	2. (h,w-1)가 빈 경우, 눕혀진 직사각형 1x2 직사각형을 놓는다.
3. 끝까지 도달한 경우 마지막 행이 채워졌는지의 여부를 갖고 있는 bit가 모두 1로 이루어져 있는지 확인하여 모두 1이라면 1을, 아니라면 0을 반환해준다.
# 코드
```cpp
#include <bits/stdc++.h>

#define endl "\n"
#define all(v) (v).begin(), (v).end()
#define all1(v) (v).begin()+1, (v).end()
#define For(i, a, b) for(int i=(a); i<(b); i++)
#define FOR(i, a, b) for(int i=(a); i<=(b); i++)
#define Bor(i, a, b) for(int i=(a)-1; i>=(b); i--)
#define BOR(i, a, b) for(int i=(a); i>=(b); i--)
#define ft first
#define sd second

using namespace std;
using ll = long long;
using lll = __int128_t;
using ulll = __uint128_t;
using ull = unsigned long long;
using ld = long double;
using pii = pair<int, int>;
using pll = pair<ll, ll>;
using ti3 = tuple<int, int, int>;
using tl3 = tuple<ll, ll, ll>;

template<typename T> using ve = vector<T>;
template<typename T> using vve = vector<vector<T>>;

template<class T> bool ckmin(T& a, const T& b) { return b < a ? a = b, 1 : 0; }
template<class T> bool ckmax(T& a, const T& b) { return a < b ? a = b, 1 : 0; }

const int INF = 987654321;
const int INF0 = numeric_limits<int>::max();
const ll LNF = 987654321987654321;
const ll LNF0 = numeric_limits<ll>::max();

int H, W;
ll dp[11][11][1<<11];

ll sol(int h, int w, int bit) {
    if(h==H) return (bit == ((1<<W)-1));
    ll &ret = dp[h][w][bit];
    if(ret != -1) return ret;
    int nh = h, nw = w+1;
    if(nw == W) nh++, nw=0;
    if(h!=0 and (bit & (1<<(W-1))) == 0) return ret = sol(nh,nw,(bit*2+1)%(1<<W));
    ret = sol(nh,nw,(bit*2)%(1<<W));
    if(w!=0 and (bit & 1) == 0) ret += sol(nh,nw,((bit+1)*2+1)%(1<<W));
    return ret;
}

int main(void) {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    while(true) {
        cin >> H >> W;
        if(H==0 and W==0) break;
        memset(dp, -1, sizeof dp);
        cout << sol(0,0,0) << endl;
    }


    return 0;
}
```