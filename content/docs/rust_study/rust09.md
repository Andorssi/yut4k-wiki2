---
title: "9章"
weight: 90
---

# 9章　エラー処理


## 9.1 panic!で回避不能なエラー
プログラム中で悪いことが起き，どうしようもないときにpanic!マクロがあります．実際にパニックを起こす方法は二つあり，
- パニックを引き起こす操作を行う(配列の要素外にアクセスするなど)
- 明示的にpanic!マクロを呼び出す <br>
があります． <br>

デフォルトでは，パニックが失敗メッセージを出力し，巻き戻し，スタックを片付け，終了します．パニック発生時は発生源を特定するために，環境変数を介してスタックに表示するように指定することもできます．

### パニックに対してスタックを巻き戻すかAbortするか
デフォルトでは先述の通り，パニック発生時にスタックを巻き戻して，関数データを片付けてから終了します．しかし，即座に中止して片付けることもなく終了させることもできます．この場合，OSがメモリを解放しなければならないです．Cargo.tomlファイル[profile.release]欄に以下のように書いておけば，パニック時に巻き戻しから中止するように切り替えられます．
```toml
[profile.release]
panic = 'abort'
```

### 簡単なプログラムでぱにくってみる
以下のプログラムでpanic!を呼び出してみましょう．実行してみると以下のような出力を確認してください．最後の2行がエラーメッセージです．1行目にパニックメッセージと発生源を表示しています．例でいうと2行目5文字目であることを示唆しており，自分はその個所を見に行きます．
```rust
fn main() {
    panic!("crash and burn");
}
```
```bash
andorssi@Jre:~/rusting/panic01$ cargo run
   Compiling panic01 v0.1.0 (/home/andorssi/rusting/panic01)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.49s
     Running `target/debug/panic01`

thread 'main' (5935) panicked at src/main.rs:2:5:
crash and burn
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

関数のバックトレースを用いて問題の発生源を見つけることができます．これについてはこの後すぐ．

### panic!バックトレース
配列の無効な添え字を指定している例を見てみます．要素数が3のベクタに対し，100番目の要素にアクセスしようとしています．C言語では，この動作は未定義です．バッファオーバーリード(要素に対応するメモリ上の箇所にあるナニカを返してしまう)を引き起こす可能性があり，セキュリティの脆弱性に直結します． <br>
Rustでは，このようなことが起きると実行を中止し，継続を拒みます．
```rust
fn main() {
    let v = vec![1, 2, 3];

    v[99];
}
```
```bash
andorssi@Jre:~/rusting/panic01$ cargo run
   Compiling panic01 v0.1.0 (/home/andorssi/rusting/panic01)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.12s
     Running `target/debug/panic01`

thread 'main' (9756) panicked at src/main.rs:10:6:
index out of bounds: the len is 3 but the index is 99
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

index out of bouns: ... はエラーの原因を示しており，その下のnote:に注釈が書かれています．ここでは，RUST_BACKTRACE環境変数をセットしており，バックトレースを得られることが分かります．バックトレースは現時点までに呼び出された全関数の一覧です．ポイントは，先頭からスタートして自分のファイルを見つけるまで読んでいきます．そこが問題発生源です．そこから下は自分のコードを呼び出しているコードです．バックトレースを出力するには注釈行にもあるようにRUST_BACKTRACE=X(Xは0以外)をセットします．

```bash
andorssi@Jre:~/rusting/panic01$ RUST_BACKTRACE=1 cargo run
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.01s
     Running `target/debug/panic01`

thread 'main' (12502) panicked at src/main.rs:10:6:
index out of bounds: the len is 3 but the index is 99
stack backtrace:
   0: __rustc::rust_begin_unwind
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/std/src/panicking.rs:689:5
   1: core::panicking::panic_fmt
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/core/src/panicking.rs:80:14
   2: core::panicking::panic_bounds_check
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/core/src/panicking.rs:271:5
   3: <usize as core::slice::index::SliceIndex<[T]>>::index
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/core/src/slice/index.rs:272:10
   4: core::slice::index::<impl core::ops::index::Index<I> for [T]>::index
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/core/src/slice/index.rs:19:15
   5: <alloc::vec::Vec<T,A> as core::ops::index::Index<I>>::index
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/alloc/src/vec/mod.rs:3740:9
   6: panic01::main
             at ./src/main.rs:10:6
   7: core::ops::function::FnOnce::call_once
             at /rustc/e408947bfd200af42db322daf0fadfe7e26d3bd1/library/core/src/ops/function.rs:250:5
note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.
```

なんかずらっと出てきたわけですが，エラー箇所は6行目に出てきています．パニックを解消したい場合，言及されている頭の行から見ていくべきです．もちろん，今回の例では要素指定を正常にすればこのパニックは消えます．


## 9.2 Resultで回復可能なエラー
大抵はプログラムを完全に中止させるほど深刻ではないです．時に関数が失敗したときに簡単に修正できるところが理由です．<br><br>
Result型のenumはOKとErrの2列挙子から構成されています(2章でやったらしい...)．ジェネリック型については10章で言及されますが，Tが成功したときにOkに含まれる値を返し，Eが失敗したときにErrに含まれる値を返します．
```rust
enum Result<T,E> {
    Ok(T),
    Err(E),
}
```

例を見てみます．関数が失敗する可能性があるためにResult値を返す関数を呼び出します．
```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");
}
```
File::openの戻り値の型は，Result<T,E>です．TはFile::openの実装によって成功値の型std::fs::Fileで埋められ，ファイルハンドルとなっています．Eはstd::io::Errorです．<br>
File::openが成功したときはgreeting_file_resultの値はファイルハンドルを含むOkインスタンスです．失敗時は，Errインスタンスがgreeting_file_resultの値です．エラー情報を与える方法が必要であり，match式を用いて返り値に応じて異なる動作を実装できます．
```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };
}
```

Option enumのように，Result enumとその列挙子は，preludeでスコープ内に持ち込まれているため，Result::を指定する必要がないです(OkやErrの前に)．<br>
このコードは，結果がOkならOk列挙子から中身のfile値を返し，それからそのファイルハンドル値を変数greeting_fileに代入しています．<br>
File::openからErr値が得られた場合は，panic!マクロを呼び出すようになっています．つまり，hello.txtが存在しない場合にこちらが選択されるわけです．
```bash
andorssi@Jre:~/rusting/panic01$ cargo run
   Compiling panic01 v0.1.0 (/home/andorssi/rusting/panic01)
warning: unused variable: `greeting_file`
  --> src/main.rs:22:9
   |
22 |     let greeting_file = match greeting_file_result {
   |         ^^^^^^^^^^^^^ help: if this is intentional, prefix it with an underscore: `_greeting_file`
   |
   = note: `#[warn(unused_variables)]` (part of `#[warn(unused)]`) on by default

warning: `panic01` (bin "panic01") generated 1 warning (run `cargo fix --bin "panic01" -p panic01` to apply 1 suggestion)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.09s
     Running `target/debug/panic01`

thread 'main' (20664) panicked at src/main.rs:24:23:
Problem opening the file: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

### 異なるエラーにマッチする
File::openが失敗したときに，その理由によってpanic!動作を変えたいとき，以下の例のようにします．
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => {
                panic!("Problem opening the file: {:?}", other_error);
            }
        },
    };
}
```
File::openがErr列挙子に含めて返す値の型は，io::Errorです．これは標準ライブラリで提供されている構造体です．kind()メソッドをもち，呼び出すとio::ErrorKind値が得られます．io::ErrorKindのenumは，標準ライブラリで提供されており，io処理の結果発生する可能性のあるさまざまなエラーを表す列挙子があります．ErrorKind::NotFoundを用いると，開こうとしているファイルが存在しないことを示唆します．そして，greeting_file_resultに対してマッチし，さらにerror.kind()に対するインナーマッチも持たせます．<br>
error.kind()による返り値が，ErrorKind enumのNotFound列挙子であるかということが条件分岐です．正なら，ファイル生成をFile::createで行います．それすら失敗したらpanic!を出力します．

### パニック時のショートカット
match自体は別にいいのですが，いささか冗長になりがちです．そこで，Result<T,E>型にはさまざまなヘルパーメソッドが定義されています． <br>
まずは，unwrapメソッドです．Result値がOk列挙子なら，unwrapはOkの中身を返します．Result値がErr列挙子なら，unwrapはpanic!マクロを呼び出します．例はこちら
```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap();
}
```
```bash
andorssi@Jre:~/rusting/panic01$ cargo run
   Compiling panic01 v0.1.0 (/home/andorssi/rusting/panic01)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.11s
     Running `target/debug/panic01`

thread 'main' (32076) panicked at src/main.rs:51:49:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

さらに，expectメソッドを用いて，panic!のエラーメッセージをカスタムすることができます．unwrapの代わりにexpectを使ってみると以下のようになります．
```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
}
```
```bash
thread 'main' (33340) panicked at src/main.rs:57:10:
hello.txt should be included in this project: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

### エラーの委譲
関数の実装が失敗する可能性のある何かを呼び出すとき，関数自身のエラー処理の代わりに，呼び出す側がどうするかを決められます．これをエラーの委譲といい，エラーの処理を規定する情報やロジックがより多くある呼び出し元のコードに制御を明け渡します．<br>
以下の例は，ファイルからユーザ名を読みます．ファイルが存在しなかったり，読めなかったりしたら，この関数はエラーを呼び出し元のコードに返します．
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```
関数の戻り値型はResult<String, io::Error>です．すなわち，関数がResult<T, E>型の値を返しているということです．TはStringで埋められ，Eはio::Errorで埋められています． <br>
何事もなく成功したら，Stringを保持するOk値を返しますが，問題発生時はio::Errorインスタンスを保持するErr値を返します．io::Errorを戻り値型にすることで，より多くの問題の情報を含むことができます(File::open関数とread_to_stringメソッド)． <br>
関数本体は，File::openから始まります．matchが成功したらusername_file内の値がfileに入り，関数は続いていきます．Err時は早期returnでFile::openから得たエラー値を返します．そのあと，read_to_stringでファイルの中身をusernameに読み込みます．read_to_stringメソッドでもResultを返しています．失敗時は先ほどと同様にエラー値を返しますが，関数の最後なのでreturnを明示的に書く <必要はありません．<br>
main側で呼び出す際は，エラー値が返ってきたらpanic!を呼び出してプログラムを中止させたり，デフォルトユーザ名を使ったり，ファイル以外の場所からユーザ名を検索したりできるでしょう．

### ?演算子でショートカット
前コードはエラー処理を毎回書いていたが，面倒だと思うので?演算子を使って簡略化します．やってることはさっきと同じですが以下のコード例を見てください．

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```
Result値のすぐあとに書いた?は先ほどやったmatch式とほぼ同じような動作をします．OkならOkの中身の値が返ってくるし，エラーならreturn的な感じでErrがエラー値が返ってきます．<br>
?演算子が呼ぶエラー値は標準ライブラリのFromトレイトで定義されています．?演算子がfrom関数を呼び出すと，受け取ったエラー型が現在の関数の戻り値型で定義されているエラー型に変換されます．汎用性があるということですかね．<br>
例えば，以下のコードを考えてみるとどうでしょうか．
```rust
use std::fs::File;
use std::io::{self, Read};

#[derive(Debug)]
struct OurError {
    message: String,
}

impl From<io::Error> for OurError {
    fn from(error: io::Error) -> Self {
        OurError {
            message: format!("IO error occurred: {:?}", error),
        }
    }
}

fn read_username_from_file() -> Result<String, OurError> {
    let mut username_file = File::open("hello.txt")?;
    
    let mut username = String::new();
    
    username_file.read_to_string(&mut username)?;
    
    Ok(username)
}

fn main() {
    match read_username_from_file() {
        Ok(name) => println!("username: {}", name),
        Err(e) => println!("error: {:?}", e),
    }
}
```
?演算子はio::Errorをそのまま返す代わりに自分で定義したOurErrorを返すようにすることができます．さらに，io::ErrorからOurErrorのインスタンスを構築するためのimpl From<io::Error> for OurErrorを定義すればread_username_from_file中の?演算子呼び出しはfromを呼び出すので，関数にコードを追加しなくてもエラー型を変換してくれます．<br>
?演算子直後のメソッド呼び出しを連結することでさらにコードを短くできます．
```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username = String::new();

    File::open("hello.txt")?.read_to_string(&mut username)?;

    Ok(username)
}
```
usernameのString生成を関数の頭に移動しています．username_fileを生成する代わりにread_to_string呼び出しを直接File::open("hello.txt")?の結果に連結させています．read_to_string呼び出し末尾にも?があります．File::openとread_to_stringどちらも成功したらOk値が返ります．<br>
さらにさらにさらに短くする方法もあるみたいです．
```rust
use std::fs;
use std::io;

fn read_username_from_file() -> Result<String, io::Error> {
    fs::read_to_string("hello.txt")
}
```
fs::read_to_string関数はファイルを開く，ファイル読み込み，内容をStringに格納し，それを返すという操作をまとめてやってくれます．

### ?演算子の使いどころ
?演算子は，使用する対象の値と戻り値型に互換性がある関数でしか使えません．早期returnが存在するためです．関数の戻り値型はResultでなければならないのです．例えば，以下のコードはコンパイルエラーになります．
```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")?;
}
```
```bash
andorssi@Jre:~/rusting/panic01$ cargo run
   Compiling panic01 v0.1.0 (/home/andorssi/rusting/panic01)
error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option` (or another type that implements `FromResidual`)
   --> src/main.rs:120:48
    |
119 | fn main() {
    | --------- this function should return `Result` or `Option` to accept `?`
120 |     let greeting_file = File::open("hello.txt")?;
    |                                                ^ cannot use the `?` operator in a function that returns `()`
    |
help: consider adding return type
    |
119 ~ fn main() -> Result<(), Box<dyn std::error::Error>> {
120 |     let greeting_file = File::open("hello.txt")?;
121 +     Ok(())
    |

For more information about this error, try `rustc --explain E0277`.
error: could not compile `panic01` (bin "panic01") due to 1 previous error; 1 warning emitted
```

コンパイラは，?演算子を使うにはResultまたはOptionを返す関数でなければならないと言っています．このエラーの修正には以下の二つの選択肢があります．
- 関数の戻り値型を，?演算子を使用する対象の値と互換性があるような型に変換すること． <br>
- matchまたはResult<T,E>のメソッドのいずれかを使用して，何らかの適切な方法でResult<T,E>を処理すること．<br>
エラーメッセージを見ると，?はOption<T>値にも使用できると書いてます．Optionを返す関数中でのみ，Optionに?を使用することができます．Option<T>に対して呼び出された?演算子は，Noneの場合は早期returnされます．ResultでいうEに相当しますかね．また，Someが返されたらSomeの値が式の結果となります．例を見てみましょう．
```rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}
```
文字列textの最初の行の最後の1文字を返す関数です．lines()で"\n"ごとに分割し，.next()で最初の行を取得します．結果はOption<&str>です．で，.next()?となっていて，Some(v)ならvを取り出し，Noneなら関数全体からNoneを返すという処理になっています．.chars()は文字単位へ分解し，.last()は最後の文字を取得します．<br>
?を使わないであえて書くとしたら以下のようなコードになります．復習的な感じですが...
```rust
fn last_char_of_first_line(text: &str) -> Option<char> {
    match text.lines().next() {
        Some(line) => line.chars().last(),
        None => None,
    }
}
```

今まで，main()はすべて()を返してきました．エントリーポイントとして特別な意味をもつ関数ですので，返り値型に制限があります．mainはResult<(),E>を返すことができます．例を見てみましょう．
```rust
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let greeting_file = File::open("hello.txt")?;

    Ok(())
}
```
Box<dyn Error>型はtrait objectですが，詳細は18章にてとのこと．任意の種類のエラーを意味しています．エラー型Box<dyn Error>をもつmain関数内では，任意のErr値を早期returnすることができるので，?演算子が使えます．Okが返るなら0で，Err値が返るなら非0です．

## 9.3 panic!すべき？しないべき？
panic!はプログラムを中止しますので，回復する手段がありません．一方，Resultを返すことは呼び出し側に選択肢を与えることとなります．回復を試みたり，Err値によってはpanic!を呼び出したりと思考することができるわけです．いくつかの例を考えてみましょう．

### 例，プロトタイプコード，テスト
例を記述するときは，エラー処理をすると全体の明瞭さを欠くことにつながる場合があります．また，unwrapやexpectメソッドはプロトタイプ段階では非常に便利です．まだエラー処理法が確立されていないときにつけておくとマーカーとしての役割を持たせられます．メソッド呼び出しがテスト内で失敗したら，そのメソッドがテスト下に置かれた機能ではなかったとしても，テスト全体が失敗してほしいでしょう．

### コンパイラよりもプログラマがより情報を持っている場合
ResultがOkを返す確証が他のロジックにあるときはexpectメソッドを使うことはいいことかもしれませんが，コンパイラはそのロジックを理解できません．それでも処理する必要のあるResultは存在するでしょう．呼び出している処理が何であれ，特定の場面では論理的に起こり得なくても，一般的には失敗する可能性があるわけです．手を動かしてErr列挙子がないことを確認出来たら，expectメソッドを使ってもよいでしょう．そして，メッセージに理由を書いておくべきであります．<br>
以下の例を見ると，IpAddrに直接固定値を与えています．エラーが起きないことが我々にとっては自明であるので，expectメソッドを使います．しかし，得られるのはResult値なのでコンパイラはErr列挙子になる可能性があると判断しResult処理を要求します．
```rust
    use std::net::IpAddr;

    let home: IpAddr = "127.0.0.1"
        .parse()
        .expect("Hardcoded IP address should be valid");
```

### エラー処理ガイドライン
プログラムが何かしら悪い状態に陥ったらpanic!させることが推奨されます．悪い状態とは以下が挙げられます．
- 無効な値，矛盾値，欠陥値が渡されるなど
- 予期されていない何か．(ユーザ入力がフォーマット外の入力値だったとかは起こりえることなので違います) <br>
- この地点以降は各ステップの問題をチェックするのではなく，悪い状態が存在しないことを信頼できる必要があります． <br>
- 使用している型にこの情報をコード化する手段がない．(17章で詳しく)

意味をなさない値が返ってきたとき，可能であれば当事者がその場合にどうすればいいのか分かるようにエラーを返すべきです．ただ，実行を継続することが危険な場合はpanic!すべきです．また，自身の制御下にない外部コードを呼び出し，無効な状態を返すときにもpanic!を使うべきです． <br>
失敗が予測できる内容ならResultを返してあげたほうがいいです．呼び出し側に問題があることを通知できるからです． <br>
プログラムが不正値を使用して呼ばれるとユーザに危険が及ぶ恐れがあるとき，値が合法であるかを調べたうえで，やばそうだったらpanic!すべきです．無理に実行すると脆弱性につながります．標準ライブラリではメモリ外にアクセスしようとしたらpanic!を呼び出します．関数も正しい型，値が渡されたときのみ実行されるべきであり，間違った指示を受けたらpanic!するべきです． <br>
毎回関数のエラーチェックをするのは面倒だと思うので，Rustの型システムがそこを補填してくれます．

### 検証
2章でやった数あてゲームを流用して考えます．1から100の範囲内に入力値が収まっているかを確認していませんでした．そこで，i32型にして負の数を許容したうえでチェックを行います．
```rust
    loop {
        // --snip--

        let guess: i32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        if guess < 1 || guess > 100 {
            println!("The secret number will be between 1 and 100.");
            continue;
        }

        match guess.cmp(&secret_number) {
            // --snip--
    }
```
関数の数が増えれば，毎回このエラーチェックをしなければなりません．そこで，コンストラクタ的なふるまいを導入します．受けとった値が正常な時だけインスタンスを生成するようにしているため，生成されたインスタンスは信頼できるものとして扱えます．
```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {}.", value);
        }

        Guess { value }
    }

    pub fn value(&self) -> i32 {
        self.value
    }
}
```

## まとめ
- panic!とResultを使い分ける
- より安全なプログラムを書くための仕様
- コードの信頼度がアップアップ