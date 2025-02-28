---
slug: boj-1646
title: 백준 1646 - 피이보나치 트리
description: 
thumbnail: 
categories:
  - PS
tags:
  - 다이나믹-프로그래밍
  - 트리
  - 재귀
createdAt: 2025/02/26
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 1646 - 피이보나치 트리](https://www.acmicpc.net/problem/1646) 문제에 대한 해설입니다.

# 관찰
## 관찰1
n번 피이보나치 트리의 루트의 왼쪽 서브트리는 **n-2번 째 피이보나치 트리**이고, 오른쪽 서브트리는 **n-1번 째 피이보나치 트리**이다.

그리고 번호는 pre-order로 정해지므로 
- root가 1번이면,
- 2번 부터 Size(n-2 피이보나치 트리)+1번까지 n-2번 째 피이보나치 트리가 차지하고
- n-1번째 피이보나치 서브트리가 Size(n-2 피이보나치 트리)+2 번부터를 차지한다.

## 관찰2
n번째 피이보나치 트리에서 시작점 from과 도착점 to를 찾아서 이동 경로를 찾아야 하는데 이걸 위에서 재귀적으로 찾아들어간다고 생각해보자.

총 3가지 경우가 생길 수 있다.
1. from과 to 둘 중 하나가 현재 트리의 root일 때,
2. from과 to가 서로 같은 서브트리(왼쪽 혹은 오른쪽)에 속할 때
3. from과 to가 다른 서브트리에 속할 때

위 3가지 경우에 대해서 재귀적으로 해결해주면 된다.

## 관찰3
**n번째 피이보아치 트리에서 root에서 dst 번호의 노드까지의 이동경로를 구하는 재귀함수**를 구하면 매우 편하다.

먼저 dst번호가 1이라면 현재 위치이므로 **\"\"** 을 return 해준다.

관찰1에서 말한 것처럼 dst 노드가 왼쪽 서브트리인지 오른쪽 서브트리인지 알기 위해서는 pre-order 번호로 판단할 수 있다.
- 왼쪽 서브트리라면 n-2번째 피이보나치 트리에서 dst-1번 노드를 찾으면 된다.
- 반대로 오른쪽 서브트리라면, n-1번째 피이보나치 트리에서 dst - (Size(n-2번 피이보나치 트리)+1) 번 노드를 찾으면 된다.

이를 코드로 정리해보면 다음과 같다.

```cpp
string go(int n, ll dst) {
    if(dst == 1) return "";
    if(dst <= fibo(n-2)+1) return "L" + go(n-2, dst-1);
    else return "R" + go(n-1, dst - (fibo(n-2)+1));
}
```


# 풀이
관찰2에서 말한 것처럼, 재귀적으로 들어가면서 해결하면 된다.

1. from과 to 둘 중 하나가 현재 트리의 root일 때,
	1. from이 현재 root일 때, go(n,to)을 그냥 반환하면 된다.
	2. to가 현재 root일 때, go(n,from)에서 해당 길이만큼 올라오기만 하면 되므로 해당 길이의 "U"를 반복시킨 문자열을 반환.
2. from과 to가 서로 같은 서브트리(왼쪽 혹은 오른쪽)에 속할 때, 
   속해 있는 서브트리 쪽으로 재귀적으로 이동한다.
3. from과 to가 다른 서브트리에 속할 때
	1. go(n,from) 길이만큼의 "U"를 반복시키고
	2. go(n,to)을 그 뒤에다가 붙여주면 그것이 정답이 된다.


# 코드
위 내용을 코드로 작성해보면 아래와 같다.

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

ll fibo_cache[51];

ll fibo(int n) {
    if(n==0 or n==1) return 1;
    ll &ret = fibo_cache[n];
    if(ret != -1) return ret;
    return ret = 1 + fibo(n-2) + fibo(n-1);
}
string go(int n, ll dst) {
    if(dst == 1) return "";
    if(dst <= fibo(n-2)+1) return "L" + go(n-2, dst-1);
    else return "R" + go(n-1, dst - (fibo(n-2)+1));
}
string sol(int n, ll from, ll to) {
    // from, to 둘 중 하나가 root일 때
    if(from == 1) return go(n,to);
    if(to == 1) {
        string res = go(n, from);
        return string(res.length(), 'U');
    }

    // from, to가 같은 쪽일 때
    if(from <= fibo(n-2)+1 and to <= fibo(n-2)+1) {
        return sol(n-2, from-1, to-1);
    }
    if(from > fibo(n-2)+1 and to > fibo(n-2)+1) {
        return sol(n-1, from - (fibo(n-2)+1), to - (fibo(n-2)+1));
    }

    // from, to가 다른 쪽일 때
    string res = go(n,from);
    string from_to_root = string(res.length(), 'U');
    string root_to_to = go(n,to);
    return from_to_root + root_to_to;
}

void solve() {
    int n; cin >> n;
    ll from, to; cin >> from >> to;
    cout << sol(n,from,to) << endl;
}

int main(void) {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    memset(fibo_cache, -1, sizeof fibo_cache);

    int TC=1;
//    cin >> TC;
    FOR(tc, 1, TC) {
//        cout << "Case #" << tc << ": ";
        solve();
    }


    return 0;
}
```