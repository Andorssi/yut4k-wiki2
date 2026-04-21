---
title: 1章
weight: 10
---

# 1章　はじめに

1章で扱う内容はこちら
- Rustをインストールする  
- Hello Worldを実行する  
- Cargoを使えるようにする  

## 1.1. インストール
どの環境でやってもらっても問題ないが，ここではLinux(Ubuntu)にダウンロードする方法を示します．(以降，頭の"$"プロンプトなので直接打たない)

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

インストール後，rustcが無事入っているかを確認しておくこと．

```bash
$ rustc --version
```

## 1.2. Hello World!

まずは，作業するディレクトリを作成します．ホームディレクトリに**projects**ディレクトリを作成し，そのなかに**hello_world**ディレクトリを作成します．
```bash
$ mkdir ~/projects
$ cd ~/projects
$ mkdir hello_world
$ cd hello_world
```

main.rsというファイル名にしてソースファイルを作成します．Rustのファイルは.rsという拡張子で管理されています．どうやら，ファイル名を2単語以上使うなら，"_"で区切るのが習慣らしい・・．

```rust
fn main() {
    // 世界よ，こんにちは
    println!("Hello, world!");
}
```
### コンパイル
ファイルを保存したら，コンパイルをします．コンパイル方法は以下の通りです．

```bash
$ rustc main.rs
$ ./main
Hello, world!
```

### Rustプログラムの解剖
fn main() {}は実行されると最初に走るコードです．mainというのは特別な予約語となっているのです．また，println!はRustのマクロを呼び出しています．"!"を入れないと関数呼び出し扱いになるため，その違いに注意が必要です．Rustコードのほとんどは，行末に";"をつけます


##  1.3. Hello, Cargo!
CargoはRustにおけるビルドシステム，パッケージマネージャです．これを使うとライブラリのダウンロードやコードのビルドをまとめて扱ってくれるため非常に便利です．今後，基本的にはCargoを用いて勉強をしていきます．ちなみに，本サイトの通りにRustをインストールしていたらCargoも勝手に入っています．

### Cargoでプロジェクト作成
作業ディレクトリで以下を実行すると，Cargoを使って新しいプロジェクトを作成できます．

```bash
$ cargo new hello_cargo
$ cd hello_cargo
```

作成したCargoは基本的に以下のような構造になっていると思います．ここで，Cargo.tomlファイルを開いてみてください．開いてみると，[package]と[dependencies]という二つのヘッダがついています．前者はセクションヘッダで，ここに情報を追加していく中で他のセクションも追加していくことになります．後者はプロジェクトの依存を列挙するためのセクションです．

```text
hello_cargo/
├── Cargo.toml
└── src/
    └── main.rs
```

```rust
[package]
name = "hello_cargo"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```
Cargo.tomlのなかみ

### Cargoをビルドし，実行する
Cargoを実際にビルドしてみましょう．以下のコマンドでビルド可能です．これを行うと，実行ファイルをtarget/debug/hello_cargoに作成します．さらに実行ファイルを実行しましょう．実行が完了するとCargo.lockというファイルが生成されています．これは，プロジェクト内の依存関係の正確なバージョンを記録しています．特段触る必要はないです．
```bash
$ cargo build
   Compiling hello_cargo v0.1.0 (file:///projects/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 2.85 secs
$ ./target/debug/hello_cargo
Hello, world!
```

今度は，**cargo run**を使って実行してみましょう．コンパイルから実行までまとめてやってくれますので，今後はこちらをメインで使うことになります． 
```bash
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.0 secs
     Running `target/debug/hello_cargo`
Hello, world!

```

## まとめ
Rustをインストールし，簡単なプログラムの実行までを行いました．