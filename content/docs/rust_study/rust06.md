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

各列挙子に紐づけるデータの型と数は異なっていても問題ないです．
```rust
    enum IpAddr {
        V4(u8, u8, u8, u8),
        V6(String),
    }

    let home = IpAddr::V4(127, 0, 0, 1);

    let loopback = IpAddr::V6(String::from("::1"));
```

別のenumを見ます．いくつかの種類の型が一つにまとまっている状況です．
- Quit: データ型指定なし <br>
- Move: 名前付きフィールドをもつ <br>
- Write: Stringオブジェクトを一つもつ <br>
- ChangeColor: i32型を3つもつ <br>
```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```
構造体を用いると，先ほどのenumの列挙子が保持しているのと同じデータを格納することができる．やりたいことは同じです．
```rust
struct QuitMessage; // ユニット構造体
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // タプル構造体
struct ChangeColorMessage(i32, i32, i32); // タプル構造体
```

### Option enumとNull値に勝る利点
Option型は，値が○○かそうではないかをコード化でき，標準ライブラリによって定義されています．その定義は以下のようにされています．<T>型はあらゆる型のデータを一つもつことができるものである．10章のジェネリクス型引数でkwsk．
```rust
enum Option<T> {
    None,
    Some(T),
}
```

Option値を使ってみると，こんな感じです．「Someなんたら」として値を指定しますが，コンパイラが型推定をします．absent_numberはNone値を見ますが，Noneだけではコンパイラは推測できないのです．この場合は，Option<i32>型をもつことをコンパイラに伝えています．
```rust
    let some_number = Some(5);
    let some_char = Some('e');

    let absent_number: Option<i32> = None;
```

Some値がある時，値が存在することが分かり，その値をSomeに保持します．None値の場合，nullと同じような意味合いになります．nullをそのまま使うよりもOption<T>を使った方が好ましい理由は，nullチェック的なことが不要だからです． <br>

例えば，以下のようなコードはエラーになります．Option<T>とTが異なる型なので，足そうとするときに型エラーを起こします．Rust側で勝手にその辺をやってくれるわけですね～．
```rust
    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    let sum = x + y;
```

## 6.2 match制御フロー構造

match式を用いると高度にパターンマッチングを行うことができます．コインの仕分けをするコードを作成します．value_in_centsの引数はCoin型のcoin変数です．match式内部は一行ずつパターンマッチングしていって，あてはまる場合は`=>`以降を実行します．
```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

### 値を束縛されるパターン
パターンマッチした値の一部に束縛できる点がもう一つの利点です．enumの列挙子から値を取り出すことができます． <br>
```rust
#[derive(Debug)] // すぐに州を検査できるように
enum UsState {
    Alabama,
    Alaska,
    // --略--
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}

fn main() {
    let coins = [
        Coin::Penny,
        Coin::Nickel,
        Coin::Dime,
        Coin::Quarter(UsState::Alaska),
    ];

    for coin in coins {
        let value = value_in_cents(coin);
        println!("Value: {} cents\n", value);
    }
}
```
実行結果はこうなります．
```bash
Value: 1 cents

Value: 5 cents

Value: 10 cents

State quarter from Alaska!
Value: 25 cents
```

### Option<T>とのマッチ

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("five = {:?}", five);
    println!("six = {:?}", six);
    println!("none = {:?}", none);
}
```
実行結果は以下の通りです．plus_one(five)と呼び出した時，変数xはSome(5)です．これは，`None => None`にはマッチしないので，`Some(i) => Some(i+1)`にマッチします．よって，値が1足されて`6`が返ります．plus_one(None)は`None => None`にマッチするので，ただただNoneが返るだけです．
```bash
five = Some(5)
six = Some(6)
none = None
```

### catch-allパターンとプレースホルダー(_)
enumを用いると，ある特定の値に対して特別な操作を行い，他に対してはデフォルト操作を行う，ということができます．match式を使えばこういうことができます．サイコロを振って3や7(?)が出たら特別な操作をするというロジックを見ます．
```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
```

match式は包括的でないとエラーとなるので，今回でいうotherがないと怒られます．otherがcatch-allパターンになっているわけですね．
```bash
error[E0004]: non-exhaustive patterns: `i32::MIN..=2_i32`, `4_i32..=6_i32` and `8_i32..=i32::MAX` not covered
 --> src/main.rs:6:11
  |
6 |     match dice_roll {
  |           ^^^^^^^^^ patterns `i32::MIN..=2_i32`, `4_i32..=6_i32` and `8_i32..=i32::MAX` not covered
  |
  = note: the matched value is of type `i32`
help: ensure that all possible cases are being handled by adding a match arm with a wildcard pattern, a match arm with multiple or-patterns as shown, or multiple match arms
  |
8 ~         7 => remove_fancy_hat(),
9 ~         i32::MIN..=2_i32 | 4_i32..=6_i32 | 8_i32..=i32::MAX => todo!(),
  |
```

ゲームのルールを変更しましょう．3か7以外の目をだしたら，サイコロを振りなおさなければならないので，other変数の代わりに`_`を使用します．
```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}
```