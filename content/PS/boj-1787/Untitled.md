---
slug: boj-1787
title: 백준 1787 - 문자열의 주기 예측
description: 
thumbnail: 
categories:
  - PS
tags:
  - 다이나믹-프로그래밍
  - 문자열
  - KMP
createdAt: 2025/03/05
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 1787 - 문자열의 주기 예측](https://www.acmicpc.net/problem/1787) 의 해설입니다.

# 핵심 아이디어
결국 부분 문자열에서 가장 짧으면서 일치하는 Prefix와 Suffix를 찾으면 된다. (해당 길이를 전체 부분문자열 길이에서 뺀 것이 정답이다.)
KMP 알고리즘의 Pi 배열을 이용해보자.

`pi[i] := 0~i 부분 문자열에서 prefix와 suffix가 일치하면서 가장 긴 길이`
이때, 우리는 가장 짧은 prefix와 suffix를 찾는데 이를 재귀적으로 해결할 수 있다.

$$
[pre] \dots [suf]
$$
이렇게 있을 때 pre와 suf는 일치한다. 따라서 pre의 pi 배열 길이만큼이 suf의 뒤에서 pi 배열 길이만큼에 일치한다는 사실을 이용해서 재귀적으로 해결할 수 있다.

따라서 재귀적으로 들어가면서 가장 작은 값을 체크해주면 된다.
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

int n;
string s;
ve<int> dp, pi;

vector<int> getPi(string p){
    int m = (int)p.size(), j=0;
    vector<int> ret(m, 0);
    for(int i=1; i<m; i++){
        while(j > 0 && p[i] != p[j]) j = ret[j-1];
        if(p[i] == p[j]) ret[i] = ++j;
    }
    return ret;
}
int sol(int i) {
    if(i<0) return INF;
    int &ret = dp[i];
    if(ret != -1) return ret;
    if(!pi[i]) return ret = INF;
    return ret = min(pi[i], sol(pi[i]-1));
}

void solve() {
    cin >> n >> s;
    pi = getPi(s);
    dp = ve<int>(n, -1);

    ll ans = 0;
    for(int i=0; i<n; i++) {
        ll res = sol(i);
        if(res != INF) ans += i+1 - res;
    }
    cout << ans << endl;
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
https://justicehui.github.io/poi/2020/05/09/BOJ1787/