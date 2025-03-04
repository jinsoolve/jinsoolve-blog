---
slug: boj-8872
title: 백준 8872 - 빌라봉
description: 
thumbnail: 
categories:
  - PS
tags: 
createdAt: 2025/03/04
updatedAt: 
featured: false
locale:
---
위 포스트는 [백준 8872 - 빌라봉](https://www.acmicpc.net/problem/8872) 문제의 해설입니다.

# 핵심 아이디어
위 문제에는 여러 개의 트리가 존재한다.
임의의 2개의 트리를 서로 이을 때 최대 시간이 최소가 되게 하기 위해서는 각 트리의 지름에서 중간점을 찾아, 그 중간점끼리 연결해야 최대시간이 최소가 될 것이다.

또한 각 트리끼리의 이동 시간의 최대시간을 최소로 만들려면 트리의 지름이 가장 큰 애와 나머지 트리를 서로 연결해야 할 것이다.

따라서 정답은 결국 3개 중 하나가 된다. (지름이 가장 긴 순서대로 번호가 매겨졌을 때라 가정하자.)
1. 1번 트리의 지름
2.  1번 트리 - L - 2번 트리
	$(1번 트리의 반지름) + L + (2번 트리의 반지름)$
3. 2번 트리 - L - L - 3번 트리
   $(2번 트리의 반지름) + 2L + (3번 트리의 반지름)$

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

ll n, m, l;
vve<pll> g;
ve<bool> vis;

ll U, D;
void dfs(ll p, ll u, ll d) {
    vis[u] = true;
    if(D < d) {
        U = u;
        D = d;
    }
    for(auto [v,w] : g[u]) {
        if(v == p) continue;
        dfs(u, v, d+w);
    }
}
ve<pll> route;
bool path(ll p, ll u, ll dst) {
    if(u == dst) {
        return true;
    }
    for(auto [v,w] : g[u]) {
        if(v == p) continue;
        route.emplace_back(v, route.back().sd + w);
        if(path(u,v,dst)) return true;
        route.pop_back();
    }
    return false;
}
bool cmp(ll a, ll b) { return a > b; }

void solve() {
    cin >> n >> m >> l;
    g = vve<pll>(n+1);
    vis = ve<bool>(n+1, false);
    while(m--) {
        ll a, b, t; cin >> a >> b >> t;
        g[a].emplace_back(b,t);
        g[b].emplace_back(a,t);
    }

    ll ans = 0;
    ve<ll> maxs;
    for(int i=0; i<n; i++) {
        if(vis[i]) continue;

        D = -1;
        dfs(i,i,0);
        ll A = U;

        D = -1;
        dfs(A,A,0);
        ll B = U;
        ll AB_dist = D;

        ckmax(ans, AB_dist);

        route.clear();
        route.emplace_back(A,0);
        path(A,A,B);

        int j=0;
        while(j < route.size()-1) {
            if(max(route[j].sd, AB_dist-route[j].sd) < max(route[j+1].sd, AB_dist-route[j+1].sd)) break;
            j++;
        }
        maxs.emplace_back(max(route[j].sd, AB_dist-route[j].sd));
    }
    sort(all(maxs), cmp);
    if(maxs.size() >= 2) ckmax(ans, maxs[0] + maxs[1] + l);
    if(maxs.size() > 2) ckmax(ans, maxs[1] + maxs[2] + l*2);

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
