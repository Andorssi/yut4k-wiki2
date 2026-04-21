---
title: 1章
weight: 10
---

# 1章　はじめに

この章では以下を実行できる状態にする：

- Rustをインストールする  
- Hello Worldを実行する  
- Cargoを使えるようにする  

---

## 1.1. インストール
どの環境でやってもらっても問題ないが，ここではLinux(Ubuntu)にダウンロードする方法を示す．(以降，頭の"$"プロンプトなので直接打たない)

```bash
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

インストール後：

```bash
$ rustc --version
```

## 1.2. Hello World!

まずは，作業するディレクトリを作成する．
```bash
$ mkdir hello_rust
$ cd hello_rust
```


```bash
$ touch main.rs
```

---

## コードを書く

```rust
fn main() {
    println!("Hello, world!");
}
```

---

## コンパイル

```bash
rustc main.rs
```

---

## 実行

### Linux / macOS

```bash
./main
```

### Windows

```bash
main.exe
```

---

# 4. Cargoを使う（推奨）

## プロジェクト作成

```bash
cargo new hello_cargo
cd hello_cargo
```

---

## 実行

```bash
cargo run
```

---

## ビルドのみ

```bash
cargo build
```

---

## 高速チェック（おすすめ）

```bash
cargo check
```

---

# 5. ディレクトリ構造

```text
hello_cargo/
├── Cargo.toml
└── src/
    └── main.rs
```

---

# 6. コード編集（src/main.rs）

```rust
fn main() {
    println!("Hello, Cargo!");
}
```

---

# 7. ハンズオン課題

## 課題1：文字列変更

```rust
fn main() {
    println!("Hello, Rust!");
}
```

---

## 課題2：複数行出力

```rust
fn main() {
    println!("Hello");
    println!("Rust");
}
```

---

## 課題3：変数（先取り）

```rust
fn main() {
    let name = "Rust";
    println!("Hello, {}!", name);
}
```

---

# 8. よくあるエラー

## エラー1：printlnに!をつけ忘れる

```rust
println("Hello"); // エラー
```

正しくは：

```rust
println!("Hello");
```

---

## エラー2：実行ファイルが見つからない

Linux / macOS：

```bash
./main
```

Windows：

```bash
main.exe
```

---

# 9. まとめ

- Rustはコンパイル型言語  
- 基本はCargoを使う  
- `println!`はマクロ  

---