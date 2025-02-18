---
slug: boj-25315
title: 백준 25315 - N수매화검법
description: 
thumbnail: 
categories:
  - PS
tags:
  - 기하학
  - 그리디
  - 선분-교차-판정
createdAt: 2025/02/18
updatedAt: 
featured: false
locale:
---
[백준 25315번 - N수매화검법](https://www.acmicpc.net/problem/25315) 문제의 해설입니다.

# 핵심 아이디어
서로 교차하는 베기 A와 베기 B가 있을 때, 두 베기가 사라지려면 딱 2가지 경우이다.
$W_{A} \times (m+1) + W_{B} \times (m)$ 아니면 $W_{A} \times (m) + W_{B} \times (m+1)$이다.
결국 $W_{A}$ 가 더해지느냐, 아니면 $W_{B}$가 더해지느냐의 차이다. 따라서 무조건 적은 값이 더해지는 게 이득₩이라는 사실을 알 수 있다.

즉, **모든 두 베기의 교차마다 두 베기 중 작은 가중치를 더해주면 되고, 모든 베기의 가중치를 전부 더해주면 그것이 정답**이다.


# 풀이
모든 베기가 $N(\leq 2500)$ 이므로 $N^2$ 만에 모든 베기의 쌍에 대해서 교차하는 지의 여부와 교차한다면 두 베기 중 가중치가 작은 걸 더해준다. 그리고 모든 베기의 가중치를 전부 더해준다.

선분 교차 판정은 CCW를 기준으로 판단한다. ([선분 교차 판정 참고](https://killerwhale0917.tistory.com/6))

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

struct Point {
    ll x, y;

    Point() {}
    Point(ll _x, ll _y) : x(_x), y(_y) {}
    ll cross(Point other) {
        return x*other.y - y*other.x;
    }
    ll crossSign(Point other) {
        ll res = this->cross(other);
        if(res > 0) return 1;
        else if(res < 0) return -1;
        return 0;
    }
    ll dist(Point other) {
        return pow(x-other.x,2) + pow(y-other.y,2);
    }
    Point operator-(Point other) const {
        return Point(x-other.x, y-other.y);
    }
    bool operator<(Point other) const {
        if(x == other.x) return y < other.y;
        return x < other.x;
    }
    void print() {
        cout << x << ' ' << y << ' ';
    }
};

bool isIntersect(Point p1, Point p2, Point p3, Point p4) {
    ll p1p2 = (p2-p1).crossSign(p3-p2) * (p2-p1).crossSign(p4-p2); // 선분 p1p2 기준
    ll p3p4 = (p4-p3).crossSign(p1-p4) * (p4-p3).crossSign(p2-p4); // 선분 p3p4 기준

    // 두 직선이 일직선 상에 존재
    if(p1p2 == 0 && p3p4 == 0) {
        if(p2 < p1) swap(p1,p2);
        if(p4 < p3) swap(p3,p4);
        return p3 < p2 && p1 < p4;
    }
    return p1p2 <= 0 && p3p4 <= 0;
}

struct Cut {
    ll sx, sy, ex, ey, w;
};

int N;
ll ans = 0;

void solve() {
    cin >> N;
    ve<Cut> v(N);
    for(int i=0; i<N; i++) {
        cin >> v[i].sx >> v[i].sy >> v[i].ex >> v[i].ey >> v[i].w;
        ans += v[i].w;
    }

    for(int i=0; i<N; i++) {
        for(int j=i+1; j<N; j++) {
            if(!isIntersect({v[i].sx,v[i].sy}, {v[i].ex,v[i].ey}, {v[j].sx,v[j].sy}, {v[j].ex,v[j].ey})) continue;
            ans += min(v[i].w, v[j].w);
        }
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