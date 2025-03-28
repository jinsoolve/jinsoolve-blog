---
slug: boj-28129
title: 백준 28129 - 2022 APC가 어려웠다고요?
description: 
thumbnail: 
categories:
  - PS
tags:
  - 다이나믹-프로그래밍
  - 누적합
  - __PURE__
createdAt: 2025/03/28
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 28129 - 2022 APC가 어려웠다고요?](https://www.acmicpc.net/problem/28129)의 풀이입니다.

# 핵심 아이디어
`dp[i][j] := i번째 수가 j가 되는 경우의 수`

$$
dp[i][j] = \sum_{k=max(j-k,a[i-1])}^{min(j+k,b[i-1])} dp[i-1][k]
$$

위와 같은 dp 식을 누적합으로 $O(N^2)$으로 해결할 수 있다.

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

const int mxn = 3001;
const ll mod = 1e9+7;

void solve() {
    int n, k; cin >> n >> k;
    ve<int> a(n+1), b(n+1);
    for(int i=1; i<=n; i++) cin >> a[i] >> b[i];

    vve<ll> dp(n+1, ve<ll>(mxn, 0));
    vve<ll> psum(n+1, ve<ll>(mxn, 0));
    for(int i=1; i<=n; i++) {
        if(i == 1) {
            for(int j=a[i]; j<=b[i]; j++) {
                dp[i][j] = 1;
            }
        }
        else {
            for(int j=a[i]; j<=b[i]; j++) {
                int l = max(j-k,a[i-1]), r = min(j+k,b[i-1]);
                dp[i][j] = (psum[i-1][r] - psum[i-1][l-1] + mod) % mod;
            }
        }

        for(int j=1; j<mxn; j++) {
            psum[i][j] = (psum[i][j-1] + dp[i][j]) % mod;
        }
    }
    cout << psum[n][mxn-1] << endl;
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