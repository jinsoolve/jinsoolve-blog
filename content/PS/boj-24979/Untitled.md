---
slug: boj-24979
title: 백준 24979 - COW Operations
description: 
thumbnail: 
categories:
  - PS
tags:
  - 문자열
  - 누적합
  - 애드-혹
createdAt: 2025/02/28
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 24979 - COW Operations](https://www.acmicpc.net/problem/24979)에 대한 해설입니다.

# 핵심 아이디어

## 아이디어1
주어진 Operation을 해보면 아래와 같은 변환이 가능하다는 것을 알 수 있다.
- OW, WO ↔ C
- WC. CW ↔ O
- CO, OC ↔ W

양쪽으로 자유롭게 왔다갔다할 수 있다.

## 아이디어2
문자의 순서를 바꿀 수 있다. 
- CO ↔ OC
- WC ↔ CW
- WO ↔ OW

주어진 Operation을 해보면 문자의 순서를 바꿀 수 있다는 사실을 알 수 있다.

## 아이디어3
C 하나를 남겨야 하므로 O나 W 둘 중 하나를 아예 제거해보자.
W를 제거한다고 가정하면 아이디어1에 의해 W를 전부 CO나 OC로 바꿀 수 있다.
결과적으로 C와 O로 이루어진 문자열을 얻을 수 있다.

# 풀이
아이디어2와 아이디어3에 의해서 문자열을 CC...CCOO...O 꼴로 만들 수 있다.
이때 C가 홀수개이고 O가 짝수개라면 우리는 C를 만들 수 있다는 것을 알 수 있다.

C와 O의 개수는 각각 누적합을 이용해서 세어준다.


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

void solve() {
    string s; cin >> s;
    ve<ll> csum(s.length()+1, 0), osum(s.length()+1, 0);
    for(int i=1; i<=s.length(); i++) {
        char c = s[i-1];
        csum[i] = csum[i-1] + (c == 'O' ? 0:1);
        osum[i] = osum[i-1] + (c == 'C' ? 0:1);
    }

    int q; cin >> q;
    string ans;
    while(q--) {
        int l, r; cin >> l >> r;
        ll cval = csum[r] - csum[l-1];
        ll oval = osum[r] - osum[l-1];
        ans += ((cval%2 == 1 and oval%2 == 0) ? "Y" : "N");
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
https://dong-gas.tistory.com/76