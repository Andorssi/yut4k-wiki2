---
title: "2章"
weight: 20
---

# 2章　数当てゲームのプログラミング
2章で扱う内容はこちら
- 数当てゲームの実装からRustについて知っていく

### 新規プロジェクトの立ち上げ
まずは，新規プロジェクトの立ち上げをします．できたらCargo runもしてみましょう．
```bash
$ cargo new guessing_game
$ cd guessing_game
```

### 予想を処理する
標準入力の実装をしてみましょう．src/main.rsのなかみをまずは以下のように書きます．"use std::io"を宣言することで標準入出力に関するライブラリをインポートできます．変数に値を格納するには，"let"を使います．Rustでは変数はデフォルトで不変(immutable)なので，一度変数宣言をしたら変更はできません．C++でいうconstのことですかね．しかし，"mut"をつけることで変数を可変(mutable)にできます．変数guessはString型のインスタンスを返します．"::"構文はnewがStringの関連関数であることを示します．関連関数はある型に対して実装される関数のことです． <br>
".read_line(&mut guess)"は標準入力を受け取るメソッドです．"&"は参照であり，これもmutで可変にしておく必要があります．"read_line"メソッドはResult値も返します．これは，エラー処理に関する列挙型の値で，".expect"で例外処理をしているのはこのためです．

```rust
use std::io;

fn main() {
    println!("Guess the number!");

    println!("Please input your guess."); 

    let mut guess = String::new();  // 変数に値を格納する

    io::stdin()     // ユーザの入力を受け取る
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}
```

println!()中には"{}"に変数名を入れることで値を呼び出すことができます．式の評価結果を表示するときは空の"{}"を置き，式をカンマ区切りでリストにして続けます．
```rust
    let x = 5;
    let y = 10;
    println!("x = {x}");
    println!("y+2 = { y+2 }");  // <- コレはエラーが出る
    println!("y+2 = {}", y+2);
```

ここまでで，実行してみましょう．
```bash
$ cargo run
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 6.44s
     Running `target/debug/guessing_game`
Guess the number!
Please input your guess.
6
You guessed: 6
```

### 秘密の数字を生成する
乱数を使用して秘密の数字を生成します．標準ライブラリには乱数の機能はないため，"rand"クレートを使用して機能を追加します．Cargo.tomlファイルにrandクレートを依存関係に含めます．

```toml
[dependencies]
rand = "0.8.5"
```
main.rsは変更せずに，一度ビルドしてみましょう．dependenciesに追加した依存関係をCargoはレジストリから取得します．なお，一度取得すると次からは再利用されます．
```bash
$ cargo build
    Updating crates.io index
     Locking 14 packages to latest Rust 1.94.1 compatible versions
      Adding cfg-if v1.0.4
      Adding getrandom v0.2.17
      Adding libc v0.2.185
      Adding ppv-lite86 v0.2.21
      Adding proc-macro2 v1.0.106
      Adding quote v1.0.45
      Adding rand v0.8.6 (available: v0.10.1)
      Adding rand_chacha v0.3.1
      Adding rand_core v0.6.4
      Adding syn v2.0.117
      Adding unicode-ident v1.0.24
      Adding wasi v0.11.1+wasi-snapshot-preview1
      Adding zerocopy v0.8.48
      Adding zerocopy-derive v0.8.48
  Downloaded cfg-if v1.0.4
  Downloaded rand_chacha v0.3.1
  Downloaded ppv-lite86 v0.2.21
  Downloaded getrandom v0.2.17
  Downloaded rand_core v0.6.4
  Downloaded rand v0.8.6
  Downloaded libc v0.2.185
  Downloaded zerocopy v0.8.48
  Downloaded 8 crates (1.2MiB) in 0.13s
   Compiling libc v0.2.185
   Compiling zerocopy v0.8.48
   Compiling cfg-if v1.0.4
   Compiling getrandom v0.2.17
   Compiling rand_core v0.6.4
   Compiling ppv-lite86 v0.2.21
   Compiling rand_chacha v0.3.1
   Compiling rand v0.8.6
   Compiling guessing_game v0.1.0 (/home/icn/project/guessing_game)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4.14s
```

クレートを更新して，アップグレードするときは"update"コマンドを使います．もし，randクレートが新しいバージョンとして0.8.6と0.9.0の二つがリリースされていたならば，以下のようになるでしょう．デフォルトでは0.8.5以上，0.9.0未満のバージョンのみを検索するため，こうなります．ただ，明示的にtomlファイルに0.9.0と変更すればそうなります．
```bash
$ cargo update
    Updating crates.io index
    (crates.ioインデックスを更新しています)
    Updating rand v0.8.5 -> v0.8.6
    (randクレートをv0.8.5 -> v0.8.6に更新しています)

```

話を戻して，乱数生成を行います．main.rsを以下のように更新しましょう．変数secret_numberが生成した乱数を格納するものです．
```rust
use std::io;
use rand::Rng;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("The secret number is: {secret_number}");    //ココは最終的には隠す

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}
```

### 予想と秘密の数字を比較する
数値を比較しましょう．以下のコードを実行してみるとどうなるでしょうか．実は，このままだとコンパイルエラーとなってしまいます．

```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("The secret number is: {secret_number}");    //ココは最終的には隠す

    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");

    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),       
        Ordering::Greater => println!("Too big!"),      
        Ordering::Equal => println!("You win!"),        
    }
}
```

"std::cmp::Ordering"型はLess，Greater，Equalという3つの列挙子をもっています．"cmp"メソッドを使って二つの比較を行い，Ordering型の列挙子を返すようにします．"match"式は複数のアームで構成されており，マッチさせるパターンと与えられた値がマッチしたときに実行されます．例えば，秘密の数字が40で予想した数字が30だとしたら，Ordering::Lessがマッチするので，"Too small"が返ってきます．<br>

ここで，コンパイル結果を見てみましょう．このエラーは型の不一致です．guessはString型なのに対して，secret_numberは整数型です．文字列と整数は比較できません．
```bash
$ cargo build
   Compiling libc v0.2.86
   Compiling getrandom v0.2.2
   Compiling cfg-if v1.0.0
   Compiling ppv-lite86 v0.2.10
   Compiling rand_core v0.6.2
   Compiling rand_chacha v0.3.0
   Compiling rand v0.8.5
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
error[E0308]: mismatched types       
  --> src/main.rs:22:21
   |
22 |     match guess.cmp(&secret_number) {
   |                 --- ^^^^^^^^^^^^^^ expected `&String`, found `&{integer}`

   |                 |
   |                 arguments to this method are incorrect
   |
   = note: expected reference `&String`
              found reference `&{integer}`
note: method defined here
  --> /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/core/src/cmp.rs:814:8

For more information about this error, try `rustc --explain E0308`.
error: could not compile `guessing_game` (bin "guessing_game") due to 1 previous error
```

そこで，標準入力を得た後に，以下の行を追加します．trimメソッドは文字列の先頭と末尾の空白を削除します．また，parseメソッドは文字列を別の型に変更します．今，guess: u32としているため，符号なし32ビット整数に変換しようとしています．parseメソッドを使うときは，コンパイラが解析できる文字列にしておく必要があります．例えば，"A👍%"を文字列から数値にしようなどと言ってもできません．
```rust
let guess: u32 = guess.trim().parse().expect("Please type a number!");
```

### ループで複数回の予想を可能にする
loopキーワードはfor文のような役割をもちます．main.rsを以下のように変更してみましょう．これを実行すると，ctrl-cで中断するか，数字以外の文字列を入力しない限り無限に続いてしまします．
```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);
    println!("The secret number is: {secret_number}");

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        println!("You guessed: {guess}");

        let guess: u32 = guess.trim().parse().expect("Please type a number!");

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),       
            Ordering::Greater => println!("Too big!"),      
            Ordering::Equal => println!("You win!"), 
        }       
    }
}
```

無限ループを正常に終了させるために，正しい答えを入力した時にbreak文でloopから抜け出すように修正します．
```rust
Ordering::Equal => {
    println!("You win!");
    break;
}
```

また，不正な入力を得た時にエラーを返すのではなく，再び標準入力を求めるようにします．
```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```

ここまでできれば，プログラムは完成しているはずです．最後に，全貌をのせておきます．
```rust
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
```

## まとめ
ここで出てきた概念
- メソッドについて
- match
- クレートの使い方
- loop