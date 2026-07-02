---
title: "6章"
weight: 60
---

# 6章 Enumとパターンマッチング

この章では，列挙子(enum)について見ていきます．

## 6.1 Enumを定義する

構造体はRectangle型のなかにwidthとheightをもつようなものでした．要は，フィールドとデータをひとまとめにする方法であるわけです．一方，enumはRectangleはCircleやTriangleも含めたとりうる形の集合のいずれかひとつであるようなものです． <br>
わかりやすい例でいうと，IPアドレスの表現です．IPv4とIPv6が存在しますが，実際にはどちらか一方が割り振られています．これをenumで記述すると以下のようになります．また，インスタンス変数の生成は`::`を用いて指定します．IpAddrKind型のなかのV4 or V6になっているのです．関数の仮引数としても指定が可能です．その場合，呼び出し時に型指定をすることでV4,V6を使い分けることができます．

```Rust
enum IpAddrKind {
    V4,
    V6,
}

let four = IpAddrKind::V4;
let six = IpAddrKind::V6;

fn route(ip_kind: IpAddrKind) {}

route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

ここまでの話を見ると，データを保持する方法はあるのかと勘のいい方がいるでしょう．構造体を使うと以下のようになります(復習)．IpAddr構造体はIpAddrKind型とString型の変数をもっており，前者がIP型を指定し，後者がIPアドレスを格納しています．
```Rust
    enum IpAddrKind {
        V4,
        V6,
    }

    struct IpAddr {
        kind: IpAddrKind,
        address: String,
    }

    let home = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.1"),
    };

    let loopback = IpAddr {
        kind: IpAddrKind::V6,
        address: String::from("::1"),
    };

```

これを，enumだけで表現すると以下のようになります．enumの各列挙子にデータを直接格納できるので，構造体をいちいち生成する必要はないのです．
```rust
    enum IpAddr {
        V4(String),
        V6(String),
    }

    let home = IpAddr::V4(String::from("127.0.0.1"));

    let loopback = IpAddr::V6(String::from("::1"));

```