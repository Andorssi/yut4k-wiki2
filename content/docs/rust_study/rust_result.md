---
title: "Resultについて"
weight: 200
---

# Result型についての補足

9章でガッツリ出てくるResult型についての補足です．重複している内容もありますが，理解の踏み台となればうれしいです．

## 1. Result型とは
Rust標準ライブラリに用意されているOption型の列挙子です．処理の成否を判定するもので，何らかの処理が成功したらOk,失敗したらErrを返すことが慣例となっています．Resultの定義は以下の通りです．

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

成否を表現すること自体はbool型を管理してチェックしても不都合はないですが，成功時，失敗時それぞれにおける処理を付随して書くことができます．また，Result型を用いることはエラー処理を強制させることにもつながっています．Result型を指定すると，戻り値の指定をさぼったときにコンパイラに怒られます．例外処置をしていなくても通してしまう言語と比較するとその辺の安全性は高いものとなっています．

## 2. Resultを使ってみる
一番ポピュラーな表現はmatch式を使って処理する方法です(?)．以下のコード例を見てみましょう．File::openはResult型を返すライブラリです．厳密にいうと，Result<File, std::io::Error>となっています．ファイルオープンが成功した場合と失敗した場合で処理を別々に実装しています．
```rust
use std::fs::File;

fn main() {
    let result = File::open("hello.txt");

    match result {
        Ok(file) => {
            println!("ファイルを開けました");
        }

        Err(error) => {
            println!("ファイルを開けません: {:?}", error);
        }
    }
}
```
実行結果は以下のようになっています．今，プロジェクトカーゴ内にhello.txtが存在していないので，resultにはErr列挙子が返されます．Err内はio::Errorなので，その中身がprintされているというわけですね．
```bash
andorssi@Jre:~/rusting/hello_cargo$ cargo run
   Compiling hello_cargo v0.1.0 (/home/andorssi/rusting/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.02s
     Running `target/debug/hello_cargo`
ファイルを開けません: Os { code: 2, kind: NotFound, message: "No such file or directory" }
```

## 3. unwrapとexpectを用いて記述を省略する
毎回match式を用いてエラーハンドリングを行ってももちろん良いのですが，面倒なときはメソッドを用いましょう．まずは，unwrapメソッドです．unwrapメソッドを使うと，成功したらOkを返し，失敗したらErrを返すという処理を担います．コード例を見ましょう．先ほどのファイルオープンはなんと1行で表現できてしまいます．

```rust
let file = File::open("hello.txt").unwrap();
```
先ほど同様にhello.txtなるファイルは存在しないので，Errを返していることが分かります．しかし，unwrapはエラー時にはErrを返すだけになってしまいますので，現場での利用はあまりお勧めされていません．使い捨てのコードやテスト程度であればいいと思いますが．(余談)note:以下はコンパイラからの注釈のようなものです．バックトレースという機能を指定して実行すると詳しいエラーまでの詳細を表示してくれます．
```bash
andorssi@Jre:~/rusting/hello_cargo$ cargo run
thread 'main' (46455) panicked at src/main.rs:4:40:
called `Result::unwrap()` on an `Err` value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

expectメソッドはやっていること自体はほとんどunwrapと同じです．違いとしては，panic!時にメッセージを記述できるという点です．一応例をのせておきます．
```rust
    let file = File::open("hello.txt").expect("失敗");
```

## 4. ?演算子
?演算子も記述の省略でよく用いられます．成功時はOkが返されますが，失敗時にはreturnされ，Err値が返されます．まずはコード例を
```rust
let file = File::open("hello.txt")?;
```
やっていることはこんな感じです．Okならfileにhello.txtが格納されますが，ErrならErr値が早期returnされます．
```rust
let file = match File::open("hello.txt") {
    Ok(f) => f,

    Err(e) => {
        return Err(e);
    }
};
```

この結果をmain側で表示するためにもう少し改善します．fileを宣言するときに，open_file関数がOkならfileを返し，エラーならreturn Err値を返します．その結果をmatch式で評価します．

```rust
se std::fs::File;
use std::io;

fn open_file() -> Result<File, io::Error> {
    let file = File::open("hello.txt")?;
    Ok(file)
}

fn main() {
    let file = open_file();

    match file {
        Ok(t) => println!("file name -> : {:?}", t),
        Err(e) => println!("エラー:{:?}", e),
    }
}
```
main側のmatch式も?演算子を使って省略できますが，一つ注意があります．main()の戻り値はデフォルトでは()なので，この状態で?演算子を使ってしまうと型エラーが出ます．そのため，以下のように表現します．main関数の戻り値を意図的にResult型にしたので，main内で?を使っても戻り値の型エラーを防げます．
```rust
use std::fs::File;
use std::io;

fn open_file() -> Result<File, io::Error> {
    let file = File::open("hello.txt")?;
    Ok(file)
}

fn main() -> Result<(), io::Error> {
    let file = open_file()?;
    Ok(())
}
```


## 5. ライブラリとResultの関係
File::openや.parseをはじめとするライブラリのほとんどは実はResult型を返します．失敗の可能性をはらんでいるものはだいたいResult型を返します．面倒かもしれませんが，思わぬバグやクラッシュを防いでくれる処理なので慣れると最強の味方になってくれることでしょう．
```rust
// 数値変換
"123".parse::<i32>()    // Result<i32, ParseIntError>
// ネットワーク
reqwest::get(url)       // Result<Response, reqwest::Error>
```

## 6. panic!でいいじゃんという人に対して
panic!を使ってしまえばいちいちErrに対する通知とか必要ないじゃんと思うそこのあなた．panic!はいかなる場合でもプログラムを強制終了させてしまいます．そのため，本来回復可能な場面だったとしても終了させてしまうのです． <br>
Resultを使うのはユーザ側にミスの可能性が存在するときです．例えば入力ミスだったり，ファイルの置き場所を間違えただけだったりといった具合です．panic!は利用者側ではどうすることもできない想定外のバグに対して使います．一番多いのは，メモリ外へのアクセス時です． <br>
性質としては，unwrapやexpectもpanic!側の発想です．そのため，多くの場合はResultで利用者にミスの原因を適切に通知することが大切で，テスト時や絶対に成功することが分かっているときはpanic!を使うというのがいいでしょう．