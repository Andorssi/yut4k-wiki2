---
title: "3章"
weight: 30
---

# 3章　一般的なプログラミングの概念

3章で扱う内容はこちら
- 変数
- 基本的な型
- 関数
- コメント
- 制御フロー

## 3.1 変数と可変性

変数は標準では不変(immutable)です．変数の中身を自由に変更できることは便利ですが，セキュリティ面を考えるとバグの原因になったり，悪用されたりする可能性があります．C++だと"const"をつけることで不変変数を実現できますが，Rustではいちいち不変であることを宣言する必要がありません．明示的に可変にする方法もありますので，それらについてみていきます．まずは新規プロジェクトを立ち上げます．

```bash
$ cargo new variables
```

main.rsの中身を以下のようにします．ちなみに，このままだとコンパイルエラーとなりますが一旦...．
```rust
fn main() {
    let x = 5;
    println!("The value of x is: {x}");     // xの値は{x}です
    x = 6;
    println!("The value of x is: {x}");
}
```

実際にコンパイルしてみると以下のようなエラーが返ってきます．xは不変の値にも関わらず再び代入しようとしているため，エラーが出ています．もし，xに代入したい値があるならば，変数宣言時に"mut"をつけることで可変にできます．感覚的には，エラーやバグ発生時はmutがついている変数を追えば良いという感じです．

```bash
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         - first assignment to `x`
3 |     println!("The value of x is: {x}");
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
2 |     let mut x = 5;
  |         +++

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables` (bin "variables") due to 1 previous error
```

では，コードを改善します．
```rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}
```

```bash
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.30s
     Running `target/debug/variables`
The value of x is: 5
The value of x is: 6

```

### 定数
定数(constants)は変更できない値ですが，変数とは性質が異なります．以下にその性質を挙げます．(具体的には3.2にて)
- mutは使えない
- letの代わりにconstキーワードで宣言．値の型は必ず注釈する
- 定数式にしかセットできない(実行時に評価される値にはセットできない)
定数宣言の例は以下の通りです．
```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

### シャドーイング
変数は宣言したスコープ中でのみ有効です．シャドーイングは最初の変数を2番目の変数で覆い隠すことを指します．同じ変数名を宣言するときは，都度letを付けます．ともかく，例を見てみます．
```rust
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
```

まず，xは5という値が入っています．次の行でxは6に変わります．x = x * 2 は内側スコープで宣言されているので，スコープから出たらxは6です．
```bash
$ cargo run
   Compiling variables v0.1.0 (file:///projects/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.31s
     Running `target/debug/variables`
The value of x in the inner scope is: 12
The value of x is: 6
```

ちなみに，x = x + 1をletをつけないで宣言すると以下のようなエラーが返ってきます．不変の値を変更しようとしているためですね．
```bash
$ cargo run
   Compiling variables v0.1.0 (/home/icn/project/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:3:5
  |
2 |     let x = 5;
  |         - first assignment to `x`
3 |     x = x + 1;
  |     ^^^^^^^^^ cannot assign twice to immutable variable
  |
help: consider making this binding mutable
  |
2 |     let mut x = 5;
  |         +++

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables` (bin "variables") due to 1 previous error
```

letを使うと，実質的には新しい変数を生成していることになります．つまり，値の型を変更してもＯＫというわけです．例えば，スペースの数を数える変数spacesについて考えると，以下のような操作を行えるようになります．
```rust
let spaces = "   ";
let spaces = spaces.len();
```
最初のspaces変数は文字列型であり，2番目のspaces変数は数値型です．わざわざspaces_strとspaces_numのように別々の変数宣言をしなくてよくなります．これをmutでやろうとすると型のエラーになってしまいます．
```rust
let mut spaces = "   ";
spaces = spaces.len();
```

## 3.2 データ型
第２章で出てきたこのコードをまずは見てみます．parseメソッドでString型を数値型に変換しているものです．必ず型注釈が必要なのです．この場合，"u32"を注釈しないとコンパイルエラーになってしまいます．
```rust
let guess u32 = "42".parse().expect("Not a number!");
```
### スカラー型
Rustには4つのスカラー型があります(整数，浮動小数点数，論理値，文字)．<- まあ，あるあるな感じですが...<br>

1. 整数型 <br>
整数型は小数点以下をもたない数値です．大きく分けて二種類あり，符号付き整数(i)と符号なし整数(u)です．符号付きは負の整数まで扱うことができるため，8-bitならば-128 ~ 127までの値が対象です．ちなみに，符号付きは2の補数表現で保持されています．基準値は32-bitなので，実践的にはu32とかi32を多用することとなるでしょう．

| 大きさ | 符号付き | 符号なし |
|:---:|:---:|:---:|
| 8-bit | i8 | u8 |
| 16-bit | i16 | u16 |
| 32-bit | i32 | u32 |
| 64-bit | i64 | u64 |
| 128-bit | i128 | u128 |
| arch | isize | usize |

2. 浮動小数点型 <br>
浮動小数点数はすべて符号付きの値で扱われます．f32とf64があり，32-bitと64-bitを表しています．基準型はf64となっています．
実践的には以下のようなコード例があります．
```rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32
}
```

3. 論理演算 <br>
和差積商，そして余りの基本的演算が用意されています．整数の割り算は0に近い整数に切り捨てられます．以下は使用例です．
```rust
fn main() {
    // addition
    // 足し算
    let sum = 5 + 10;

    // subtraction
    // 引き算
    let difference = 95.5 - 4.3;

    // multiplication
    // 掛け算
    let product = 4 * 30;

    // division
    // 割り算
    let quotient = 56.7 / 32.2;
    let truncated = -5 / 3; // Results in -1
                            // 結果は-1

    // remainder
    // 余り
    let remainder = 43 % 5;
}
```

4. 論理値型 <br>
trueかfalseです．サイズは1byteです．はい．
```rust
fn main() {
    let t = true;

    let f: bool = false; // with explicit type annotation
                         // 明示的型注釈付きで
}
```

本格使用は条件分岐やフロー制御，フラグ管理の際などでしょうかね...

5. 文字型 <br>
char型で扱うことができまして，最も基本的なアルファベット型です．charリテラルは必ずシングルクォーテーションで指定します．型サイズは4byteです．
```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
                       // 明示的型注釈付きで
    let heart_eyed_cat = '😻';    //ハート目の猫
}
```

### 複合型
1. タプル型 <br>
様々な型の複数値を一つの複合型にまとめる手法です．タプルは固定長なので，一度宣言するとサイズの変更はできません．型注釈をあえて追加して宣言してみるとこんな感じです．
```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```
タプル中の一つの値を取り出したいとき，一つ一つの値を変数に変換してその変数を参照する形になっています．以下が使用例です．
```rust
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup;

    println!("The value of y is: {y}");
}
```
また，クラスメソッドを呼び出す雰囲気でピリオド指定をしても参照可能です．例によって，添え字のスタートは0からです．空のタプルはユニットという特別な名前を持っており，()と表します．返す値は空です．
```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

2. 配列型 <br>
配列については後々明らかになることが多いので，とりあえず使い方だけ示します．
```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

    let a: [i32; 5] = [1, 2, 3, 4, 5];

    let a = [3; 5];     // [3,3,3,3,3]

    let first = a[0];   // firstは1
    let second = a[1];  // secondは2
}
```

## 3.3 関数
関数という概念はどんな言語にも存在していますが，Rustも例外ではないです．最も使われる関数はmain関数です．これが，プログラムのエントリーポイントとなっていることはすでに理解していることと思います．命名はスネークケースを用いるのが慣例です．要は，すべて小文字で，単語区切りでアンダースコアを使うのです．簡単な使用例を見てみましょう．

```rust
fn main() {
    println!("Hello, world!");

    another_function();
}

fn another_function() {
    println!("Another function.");  // 別の関数
}
```

### 引数
関数呼び出し時に仮引数を与えることができます．以下のように．another_function関数にはxという仮引数があります．型指定はi32となっています．Rustは仮引数の型を宣言しなければなりません．プログラマが意図してその型を指定することになるため，コンパイルエラーが起きた時にコンパイラは対応しやすくなります．
```rust
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("The value of x is: {x}");   // xの値は{x}です
}
```

```bash
$ cargo run
   Compiling functions v0.1.0 (file:///projects/functions)
    Finished dev [unoptimized + debuginfo] target(s) in 1.21s
     Running `target/debug/functions`
The value of x is: 5

```

また，複数の仮引数を定義したいときは，カンマ区切りで表現します．以下はコード例です．実行結果は○○5hのように出ます．
```rust
fn main() {
    print_labeled_measurement(5, 'h');
}

fn print_labeled_measurement(value: i32, unit_label: char) {
    println!("The measurement is: {value}{unit_label}");
}
```

### 文と式
文はなんらかの動作をして値を返さない命令，式は結果値に評価されます．関数本体は文がざーっと並んでいて，最後に式を置くか文を置くかみたいな形で構成されています．例えば，以下のコードは文です．
```rust
fn main() {
    let y = 6;
}
```
ただし，文は値を返しません．すなわち，let文を他の変数に代入することはできません．こんな感じに．C言語はx=y=6のような命令をすると，xもyも6になりますが，Rustではそれができません．
```rust
fn main() {
    let x = (let y = 6);
}
```

```bash
$ cargo run
   Compiling functions v0.1.0 (file:///projects/functions)
error: expected expression, found `let` statement
 --> src/main.rs:2:14
  |
2 |     let x = (let y = 6);
  |              ^^^
  |
  = note: only supported directly in conditions of `if` and `while` expressions

warning: unnecessary parentheses around assigned value
 --> src/main.rs:2:13
  |
2 |     let x = (let y = 6);
  |             ^         ^
  |
  = note: `#[warn(unused_parens)]` on by default
help: remove these parentheses
  |
2 -     let x = (let y = 6);
2 +     let x = let y = 6;
  |

warning: `functions` (bin "functions") generated 1 warning
error: could not compile `functions` (bin "functions") due to 1 previous error; 1 warning emitted

```

式は値に評価されます．例えば，(5+6)は値11に評価される式です．式は文の一部にもなります．先ほどのコードにあったlet y = 6という文の6は値6に評価される式です．関数呼び出しも式です．マクロ呼び出しも式です．波かっこで作られる新しいスコープも式です．スコープで評価された4はlet文の一部としてyに束縛されます．式にはセミコロンをつけないので，x + 1にはついていないことを確認してください．もし，セミコロンをつけたら文になってしまいます．そうした場合のエラー文を示しておきます．

```rust
fn main() {
    let y = {
        let x = 3;
        x + 1
    };    // このスコープは4に評価される

    println!("The value of y is: {y}");
}
```

```bash
icn@zenigame:~/project/variables$ cargo run
   Compiling variables v0.1.0 (/home/icn/project/variables)
error[E0277]: `()` doesn't implement `std::fmt::Display`
 --> src/main.rs:7:34
  |
7 |     println!("The value of y is: {y}");
  |                                  ^^^ `()` cannot be formatted with the default formatter
  |
  = help: the trait `std::fmt::Display` is not implemented for `()`
  = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
  = note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)

For more information about this error, try `rustc --explain E0277`.
error: could not compile `variables` (bin "variables") due to 1 previous error
```

### 戻り値のある関数
戻り値は関数を呼び出した際に値を返すことができる機能です．戻り値に名前を付けることはしないですが，型は指定する必要があります．Rustは関数の戻り値を関数本体ブロックの最後の式の値と同義としています．returnを用いて明示的に戻すことも可能です．関数例はこちら．five関数内は条件分岐もlet文もないですが，5という値だけがあるだけです．そして，戻り値型がi32で，5が戻されるというわけであります．

```rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five();

    println!("The value of x is: {x}");
}
```

## 3.4 コメント
// ここはコメントです．

## 3.5 制御フロー

### if文
ifキーワードに続いて条件式を書きます．条件式はbool型で評価されるようにしてください．その条件式の真偽によってあとのコードが実行されるかどうかが決まります．条件がTrueならば直後の波かっこ内のプログラムが実行されます．また，Flaseだった場合にelseキーワードを使ってプログラムを指定することができます．
```rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true"); 
    } else {
        println!("condition was false");
    }
}
```

else if式を用いて複数の条件を使うことができます．pythonではelifという式があったと思いますが，やっていることはそれと同じです． <br>

ifは式なので，let文の右辺に持ってきて結果を変数に代入することができます．以下が使用例です．conditionがtrueであり，それをif式で評価しているため，number変数には5が代入されます．

```rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}");
}
```

注意が必要なのは，if式全体の値は同じ型でなければならないということです．上記コードは5と6でどちらもi32の整数でしたので，なんら問題はないです．もし，文字とかをelseに入れていたら怒られます．

### ループでの繰り返し
1. loop <br>
loop内のコードを無限に繰り返します．この無限ループを回避するにはbreakを使うことが一つの対策です．例を見てみましょう．

```rust
fn main() {
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");
}
```

### 複数のループを区別するループラベル
二重ループを使うとき，breakやcontinueは最も内側のループに適用されます．ただ，ループラベルを指定することでbreakやcontinueが適用されるループを指定することができます．ループラベルはシングルクォートを使います．例を見ます．その側ループに'counting_upというラベルがついています．そして，内側ループのbreakには同一ラベルが指定されています．つまり，countが2のときに外側ループを抜け出すのです．

```rust
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```

### while
pythonやC++を使っている人ならお察しの通りの使い方ですのでコード例だけ載せておきます．

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");

        number -= 1;
    }

    // 発射！
    println!("LIFTOFF!!!");
}
```

### for
for XX in YYのような記法が一般的です．whileだと条件文や配列のサイズの扱いなどでバグや指定ミスが起きやすいため，こちらを使うこともおススメです．例をどうぞ．

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

また，revメソッドを使うことで範囲を逆順にしたカウントダウンで代入していくことができます．
```rust
fn main() {
    for number in (1..4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
}
```