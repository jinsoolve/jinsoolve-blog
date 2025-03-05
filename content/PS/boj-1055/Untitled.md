---
slug: boj-1055
title: 백준 1055 - 끝이없음
description: 
thumbnail: 
categories:
  - PS
tags:
  - 구현
  - 재귀
createdAt: 2025/03/05
updatedAt: 
featured: true
locale:
---
위 포스트는 [백준 1055 - 끝이없음](https://www.acmicpc.net/problem/1055)의 해설입니다.
# 핵심 아이디어

문자열이 재귀적으로 반복하는 것을 알 수 있다.

이때 min과 max의 차이가 최대 100개 정도임을 알 수 있고, 우리는 i번째 문자가 주어졌을 때 해당 i 번째 문자가 무엇인지를 알아차리는 함수를 작성하고 이를 100번만 반복하면 원하는 정답을 얻을 수 있다.

i번째 문자가 무엇인지를 알아차리는 것은 이분탐색을 이용해서 찾을 것이다.

예를 들어, `abc`와 `$x$y$z$`가 주어졌을 때, 2번 연산한다고 하면 첫번째 $는 `abcxabcyabczabc`로 변화할 것이다.

연산을 해보면 다음과 같은 수식으로 정리할 수 있다.

k번 연산했다고 가정했을 때, 다음과 같은 전체 문자열 길이를 얻을 수 있다.

$$
n \times \$^{k-1} + m \times \frac{\$^{k-1}-1}{\$-1}
$$

이때, n은 처음 입력 문자열의 길이, \$는 문자열 S의 \$의 개수, m은 문자열 S에서 \$가 아닌 문자의 개수가 된다.

위 수식을 이용해서 이분 탐색을 하여 i번째 문자가 무엇인지를 찾아내는 것이다.
이분 탐색을 해서 k번째 연산을 했을 때 다음 \$로 이동해야 할 때가 온다.
(예를 들어, `$x$y$z$`을 k번 연산했더니 i가 첫번째 \$안에 포함되지 않은 경우가 생긴다.)
이때 이동하면서 \$가 아닌 문자 번호인지를 체크하고, 만약 \$ 영역에 포함된다면 다시 재귀적으로 해결해주고, 그렇지 않다면 해당 문자열을 반환해준다.


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

const ll mxn = 1e9+99;
string p, s;
ve<string> notDollar;
ll op, Min, Max;
// a^b mod c
ll pow(ll a, ll b) {
    ll res = 1;
    while(b) {
        if(a > mxn) return LNF;
        if(b%2) res = (res * a);
        a = (a * a);
        b >>= 1;
    }
    return res;
}

ll n, dollar, m;
ll f(ll k) {
    if(--k == 0) return p.length();
    if(dollar == 1) return n + m*k;
    ll dk = pow(dollar, k);
    if(dk == LNF) return LNF;

    return n*dk + m*(dk-1)/(dollar-1);
}

void solve() {
    cin >> p >> s >> op >> Min >> Max;
    Min--; Max--;
    string str;
    int _=0;
    for(auto c : s) {
        dollar += (c == '$');
        m += (c != '$');
        if(c != '$') str += c;
        else if(_ != 0) {
            notDollar.emplace_back(str);
            str = "";
        }
        _++;
    }
    if(!str.empty()) notDollar.emplace_back(str);
    n = p.length();

    string ans;
    ll opop = f(op+1);
    for(ll i=Min; i<=Max; i++) {
        if(i >= opop) {
            ans += '-';
            continue;
        }
        ll target = i;
        while(target >= (int)p.length()) {
            ll lo=1, hi=1e9;
            while(lo < hi) {
                ll mid = lo + (hi-lo)/2 + (hi-lo)%2;
                ll res = f(mid);
                if(res <= target) lo = mid;
                else hi = mid-1;
            }
            ll res = f(lo);
            target -= res;
            for(auto only : notDollar) {
                if(target < only.length()) {
                    ans += only[target];
                    target = -1;
                    break;
                }
                target -= only.length();
                if(target < res) break;
                else target -= res;
            }
        }
        if(target != -1) ans += p[target];
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
# 후기
솔직히 아이디어 자체는 그리 까다롭지 않다고 생각하지만, 구현적인 아이디어가 상당히 까다롭고 반례가 잘 생길 수 밖에 없는 문제라고 생각한다.
필자는 https://testcase.ac/problems/1055 여기의 도움을 받아서 해결했다.
여기서 찾은 반례는 알고보니 pow 연산 시, a가 너무 커지면 안 돼서 막아놓았는데 이걸 $a \times a$ 전에 했어야 했는데 그러지 않아서 생겼던 문제였다.