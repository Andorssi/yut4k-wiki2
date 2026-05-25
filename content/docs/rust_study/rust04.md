---
title: "4章"
weight: 40
---

# 4章　所有権

4章はRust特有の機能である所有権についてです．C++なんかは明示的にメモリを確保したり，開放したりする必要があります．Rustでは，所有権という概念を導入し，メモリ管理を行っています．

## 4.1 所有権とは

### 所有権のルール
以下の3つのルールを覚えます．
- 各値には所有者が存在する
- いかなる時も所有者は一人である
- 所有者がスコープ外に出た時，その値は失われる

### 変数スコープ
スコープを知っている人は，その内容で把握していてもらって大丈夫です．知らない人のために説明すると，当該要素が有効である範囲を示しています．例えば，main()のなかで宣言された変数はmainのなかで有効です．また，波かっこで囲まれた内部に変数宣言をしたら，その波かっこ内でのみ有効になります．コード例を示しておきます．この場合，変数yをスコープ外で標準出力しようとしているため，エラーになります．

```rust
fn main() {
    let s=3;
    {
        let y=5;
    }
    println!("s={}",s);
    println!("y={}",y); // E: cannot find value `y` in this scope
}
```

### String型
文字列リテラルはプログラムにハードコードされます．つまり，不変値です．そこで，String型を用いるとヒープにメモリを確保するためサイズが不明なテキストも保持することができます．以下のように用います．
```rust
    let f = "Hello" // コレがいわゆる文字列リテラル
    let mut s = String::from("hello");

    s.push_str(", world!"); // push_str() appends a literal to a String

    println!("{s}"); // this will print `hello, world!`

```

### メモリと確保
文字列リテラルは先ほども言った通り不変の値です．String型は実行時にメモリが確保されます．そして，実行が終わる(Stringを使用し終わる)をアロケータはメモリを返還します．C++とかだとrelease()とかでメモリ解放を行いますが，Rustはガベージコレクタ付き言語ですから，勝手にやってくれます．スコープを抜ける際にRustは自動的にdrop関数を呼び出します．

### データ移動による作用


### クローンとデータ・値の作用
String型のヒープデータのdeep copyが必要な場合，cloneメソッドを使います．
```rust
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("s1 = {}, s2 = {}", s1, s2);

```

### スタックのみのデータ
まずは以下のコードを実行してみてください．xの値がyにムーブされていないことが分かったと思います．スタック上に保持されるデータはムーブする必要性がないとコンパイラは判断します．
```rust
    let x = 5;
    let y = x;

    println!("x = {}, y = {}", x, y);
```

### 所有権と関数
コード例で関数に変数を渡すことによる所有権の移動について理解しましょう．
```rust
fn main() {
    let s = String::from("hello");  // sがスコープに入る

    takes_ownership(s);             // sの値が関数にムーブされ...
                                    // ... ここではもう有効ではない

    let x = 5;                      // xがスコープに入る

    makes_copy(x);                  // xも関数にムーブされるが、
                                    // i32はCopyなので、この後にxを使っても
                                    // 大丈夫

} // ここでxがスコープを抜け、sもスコープを抜ける。ただし、sの値はムーブされているので、
  // 何も特別なことは起こらない。

fn takes_ownership(some_string: String) { // some_stringがスコープに入る。
    println!("{}", some_string);
} // ここでsome_stringがスコープを抜け、`drop`が呼ばれる。後ろ盾してたメモリが解放される。
  // 後ろ盾してたメモリが解放される。

fn makes_copy(some_integer: i32) { // some_integerがスコープに入る
    println!("{}", some_integer);
} // ここでsome_integerがスコープを抜ける。何も特別なことはない。
```

戻り値に関しても

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownershipは、戻り値をs1に
                                        // ムーブする

    let s2 = String::from("hello");     // s2がスコープに入る

    let s3 = takes_and_gives_back(s2);  // s2はtakes_and_gives_backにムーブされ
                                        // 戻り値もs3にムーブされる
} // ここで、s3はスコープを抜け、ドロップされる。s2はムーブされているので、何も起きない。
  // s1もスコープを抜け、ドロップされる。

fn gives_ownership() -> String {             // gives_ownershipは、戻り値を
                                             // 呼び出した関数にムーブする

    let some_string = String::from("yours"); // some_stringがスコープに入る

    some_string                              // some_stringが返され、呼び出し元関数に
                                             // ムーブされる
}

// この関数は、Stringを一つ受け取り、返す。
fn takes_and_gives_back(a_string: String) -> String { // a_stringがスコープに入る。

    a_string  // a_stringが返され、呼び出し元関数にムーブされる
}
```

## 4.2 参照と借用(References and Borrowing)
String型は関数に引数を渡した際に，String型を戻り値で戻さないとStringを使えなくなってしまいます．ここでは，String値への参照を渡すことをしてみます．アドレスを渡すのでデータ自体の所有権が変わるわけではありません．値の所有権をもらう代わりに引数にオブジェクトの参照を取っている例を見てください．calculate_lengthの引数が**&**s1になっていることに注目です．この&が参照を指示しています．
```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

参照を作成することを借用といいます．借りている間は変更できません．あたりまえですよね，人のものを借りているのですから．もし，変更しようとするとどうなるのでしょうか．変数が標準で不変なことと同じで，参照も不変であるということを表しています．
```rust
fn main() {
    let s = String::from("hello");

    change(&s);
}

fn change(some_string: &String) {
    some_string.push_str(", world");
}
```

```bash
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
 --> src/main.rs:8:5
  |
8 |     some_string.push_str(", world");
  |     ^^^^^^^^^^^ `some_string` is a `&` reference, so the data it refers to cannot be borrowed as mutable
  |
help: consider changing this to be a mutable reference
  |
7 | fn change(some_string: &mut String) {
  |                         +++

For more information about this error, try `rustc --explain E0596`.
error: could not compile `ownership` (bin "ownership") due to 1 previous error
```

### 可変参照(mutable references)
借用した値を変更するには，例によってmutを付ければ良いです．以下例です．
```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```
```bash
andorssi@Jre:~/rusting/hello_cargo$ cargo run
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/hello_cargo`
hello, world
```

ただ，ある値への可変参照が存在するとき，その値への参照を他に作ることはできません．以下例では，一つの変数に対して二つの可変参照を作ろうとしています．これはエラーになります．
```rust
    let mut s = String::from("hello");

    let r1 = &mut s;
    let r2 = &mut s;

    println!("{}, {}", r1, r2);
```

データ競合が起きると安全上問題があるため，Rustでは上記のような制約が設けられています．データ競合は，
- 二つ以上のポインタが同じデータに同時にアクセスする
- 少なくとも一つのポインタがデータに書き込みを行っている
- データへのアクセスに対する同期処理を行っていない
ときに発生します．Rustではこのような問題をコンパイラがエラーで出すので，安全性があると言えるのですね． <br>

コンパイラは可変と不変な参照を組み合わせることに対して，エラーを出します．不変な参照をしている間に，同じ値に対して可変参照はできません．
```rust
    let mut s = String::from("hello");

    let r1 = &s; // 問題なし
    let r2 = &s; // 問題なし
    let r3 = &mut s; // 大問題！

    println!("{}, {}, and {}", r1, r2, r3);
```
```bash
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:14
  |
4 |     let r1 = &s; // no problem
  |              -- immutable borrow occurs here
5 |     let r2 = &s; // no problem
6 |     let r3 = &mut s; // BIG PROBLEM
  |              ^^^^^^ mutable borrow occurs here
7 |
8 |     println!("{r1}, {r2}, and {r3}");
  |                -- immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership` (bin "ownership") due to 1 previous error
```

不変参照を同時に行うことはOKです．どうせ書き換えをできないので制限する必要性がないからです．よって，以下のコード例はエラーにはならないのです．r1, r2の不変参照はprintln!()で使われたので，r3が可変参照するタイミングではもう影響しないのです．
```rust
    let mut s = String::from("hello");

    let r1 = &s; // 問題なし
    let r2 = &s; // 問題なし
    println!("{} and {}", r1, r2);
    // r1とr2はもうこれ以降使用されません

    let r3 = &mut s; // 問題なし
    println!("{}", r3);
```

### 宙ぶらりんな参照
dangling pointerという問題があります．これは，他人に渡されてしまった可能性のあるメモリを指すポインタです．そのポインタを指し，保持している間にメモリ解放を行ってしまうことで起きます．Rustではそうならないようにコンパイラがチェックしています． <br>
dangle関数では，String型の変数sを宣言しており，&sとして参照を返しています(戻り値)．ただ，よくよく考えると，変数sは関数が終わると解放されてしまうので，無効なStringを指すようになってしまうわけです．コンパイラは，こういうのを阻止してくれるのですね．ちなみに，この場合は普通にStringを返せばOKです．
```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");

    &s
}
```
```bash
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0106]: missing lifetime specifier
 --> src/main.rs:5:16
  |
5 | fn dangle() -> &String {
  |                ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from
help: consider using the `'static` lifetime, but this is uncommon unless you're returning a borrowed value from a `const` or a `static`
  |
5 | fn dangle() -> &'static String {
  |                 +++++++
help: instead, you are more likely to want to return an owned value
  |
5 - fn dangle() -> &String {
5 + fn dangle() -> String {
  |

For more information about this error, try `rustc --explain E0106`.
error: could not compile `ownership` (bin "ownership") due to 1 previous error
```

## 4.3 スライス型
