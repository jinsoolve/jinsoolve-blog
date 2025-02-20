---
slug: boj-1155
title: 백준 1155 - 변형 하노이
description: 
thumbnail: 
categories:
  - PS
tags:
  - 다이나믹-프로그래밍
  - 애드-혹
createdAt: 2025/02/19
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 1155 - 변형 하노이](https://www.acmicpc.net/problem/1155) 문제의 해셜입니다.

# 핵심 아이디어
## 아이디어 1
A번 폴: n번 디스크
B번 폴: 1 ~ n-1 번 디스크
C번 폴: 빔

위 경우 **n번 디스크는 우선순위와 상관없이 무조건 C번 폴로만 이동 가능**하다.

## 아이디어 2
문제의 조건에 있는 _"동일한 디스크를 연속으로 두 번 옮길 수 없다."_ 라는 말로 인해서,
1 ~ n-1 번 디스크 덩어리를 A번 폴에서 B번 폴로 옮긴 다음 또 옮기는 시도를 할 수 없다.

왜냐하면 1 ~ n-1 번 디스크 덩어리를 옮기려면 어떻게 움직이든 가장 마지막으로 움직이는 디스크는 1번 디스크이다. 그런데 해당 디스크 덩어리를 다시 이동시키려면 가장 먼저 움직여야 하는 디스크는 1번 디스크이다. 따라서 **어떤 디스크 덩어리를 이미 옮겼을 때 연속으로 또 옮기는 시도는 할 수 없다.**

# 풀이
우리는 이 문제를 재귀적으로 해결할 수 있다.
n개의 디스크를 옮긴다고 할 때 n번 디스크와 1 ~ n-1 번 디스크 덩어리를 나눠서 생각하자.
이때, 1 ~ n-1 번 디스크 덩어리는 재귀적으로 해결한다고 가정하자.
## 해설
### n 개의 디스크를 옮기는 법
폴이 from, via, to 가 있다고 가정하자.
또한 1 ~ n 번 디스크 덩어리를 from에서 to로 옮기고 싶다고 하자.

이때 1 ~ n-1 번 디스크 덩어리와 n번 디스크로 나눠서 생각하자. 위 n개의 디스크 덩어리를 from에서 to로 옮기는 방법은 2가지만 존재한다. 
**1 ~ n-1 번 디스크 덩어리를 [from → via 로 먼저 보내는 방법]과, [from → to 로 보내는 방법] 이렇게 2가지만 존재**한다.

#### CASE 1: from → via
먼저, 가장 간단한 방법이다.
1. 1 ~ n-1 번 디스크 덩어리: from → via 
2. n 번 디스크: from → to (by 핵심 아이디어1)
3. 1 ~ n-1 번 디스크 덩어리: via → to

#### CASE 2: from → to
그 다음 방법이다.
1. 1 ~ n-1 번 디스크 덩어리: from → to
2. n 번 디스크: from → via (by 핵심 아이디어1)
3. 1 ~ n-1 번 디스크 덩어리: to → from
4. n 번 디스크: via → to
5. 1 ~ n-1 번 디스크 덩어리: from → to



위 CASE 1, CASE 2 모두 1 ~ n-1 번 디스크 덩어리와 n 번 디스크가 서로 번갈아가면서 옮기고 있는 모습을 확인할 수 있다.(by 핵심아이디어2)

### 우선순위는 그럼 어떻게 적용할까?

그리고 우선순위 같은 경우, 재귀적으로 생각해보면 여러 개의 디스크를 합친 덩어리들은 재귀적으로 해결이 된다고 가정하면, 결국 1개의 디스크를 옮길 때만 적용한다고 생각하면 편하다.
한 개를 옮길 때 문제에서 주어진 우선순위에 따라서"만" 옮길 수 있다.

`hanoi[n][from][to] := from에 위치한 n개의 디스크들을 규칙에 알맞게 to로 옮길 때 필요한 횟수`

그러면 n = 1일 때, hanoi\[1\]\[from\]\[to\] 에서 각 from은 오로지 1개의 to로만 이동할 수 있다.
예를 들어서 from → A번 폴, from → B번 폴 2개 다 존재할 수 없다는 의미이다. 둘 중 우선순위가 낮은 폴로는 갈 수 없다. 
이를 이용해서 초기값을 정한 후 위 hanoi 배열을 채워나가고 n개의 디스크를 옮겼을 때의 결과를 내보낸다.

이떄 **옮겨야 할 디스크의 개수와 이동 우선 순위가 주어진다면 이동 순서와 횟수는 결정**되기 때문에 hanoi[n][0][1]과 hanoi[n][0][2] 중 0이 아닌 값이 정답이 된다. (물론 0,1,2 번 폴이 존재한다고 가정했을 때의 이야기다.)


## 코드

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

void solve() {
    int n;
    ll hanoi[31][3][3]; memset(hanoi, 0, sizeof hanoi);

    cin >> n;
    for(int i=0; i<6; i++) {
        string order; cin >> order;
        int f = order.front()-'A', t = order.back()-'A';
        if(!hanoi[1][f][0] and !hanoi[1][f][1] and !hanoi[1][f][2]) hanoi[1][f][t] = 1;
    }

    for(int i=2; i<=n; i++) {
        for(int f=0; f<3; f++) {
            for(int t=0; t<3; t++) {
                int v = 3-f-t;
                if(hanoi[i-1][f][v] and hanoi[i-1][v][t]) hanoi[i][f][t] = hanoi[i-1][f][v] + hanoi[i-1][v][t] + 1;
                else if(hanoi[i-1][f][t] and hanoi[i-1][t][f]) hanoi[i][f][t] = hanoi[i-1][f][t]*2LL + hanoi[i-1][t][f] + 2;
            }
        }
    }

    cout << (hanoi[n][0][1] ? hanoi[n][0][1] : hanoi[n][0][2]) << endl;
}

int main(void) {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int TC=1;
//    cin >> TC;
    FOR(tc, 1, TC) {
//        cout << "Case #" << tc << ": ";
        solve();
    }


    return 0;
}
```

# 참고
https://velog.io/@frog_slayer/BOJ-1155-변형-하노이