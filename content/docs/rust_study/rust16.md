---
title: "16章"
weight: 160
---

# 16章 並列処理
並列プログラミングを実装する際は，同期処理やデッドロック処理等気を使わなければならないものが結構あります．Rustでは，そのあたりを勝手にやってくれるので，便利です．そんな話をまず添えておきます．

## 16.1 スレッドを使用してコードを同時に走らせる

プログラム内で複数のプロセスを同時に走らせることができます．裏側はOSが勝手にやってくれるので，我々はスレッド生成・管理を行います．

### spawnで新規スレッドを生成
新規スレッドは`thread::spawn`関数を呼び出し，新規スレッドを走らせたいコードを含むクロージャを渡します．`thread::sleep`は指定時間スレッドを止めます．以下のプログラムを何回か実行すると，大枠は変わらないですが，順序は少し変わるかもしれません．そこは，OSの気まぐれというか内部的な話なのでよくわからんです．

```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
}
```

### joinハンドルで全スレッドの終了を待つ
メインスレッドが終了すると，立ち上げたスレッドが終わることなく停止してしまう場合があります．そこで，`joinHandle`を使用し，mainが終了する前に立ち上げたスレッドが確実に完了するようにします．ちなみに，コメントアウトの場所でjoinすると，立ち上げたスレッドが終わってから本流に戻るので，あまりマルチスレッドの意味がないです．呼び出す場所が重要なのです．

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {} from the spawned thread!", i);
            thread::sleep(Duration::from_millis(1));
        }
    });
    
    // handle.join().unwrap();

    for i in 1..5 {
        println!("hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();
}
```

### スレッドでmoveクロージャを使用する
あるスレッドから別のスレッドに所有権を移して処理を進めていくことができます．その時は，moveキーワードを用いて渡します．メインスレッドでベクタを生成し，立ち上げたスレッドで使用するプログラムを示します．ただ，これはエラーです．

```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(|| {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}
```
クロージャはvを使用しているのでvをキャプチャし，クロージャの環境の一部にしています． thread::spawnはこのクロージャを新しいスレッドで走らせるので，その新しいスレッド内でvにアクセスできるはずです． <br>
Rustはvのキャプチャ方法を推論し，println!はvへの参照のみを必要とするので，クロージャはvを借用しようとします．立ち上げたスレッドがどのくらいの期間動くかわからないので，vへの参照が常に有効であるか把握できないのです．
```bash
$ cargo run
   Compiling threads v0.1.0 (file:///projects/threads)
error[E0373]: closure may outlive the current function, but it borrows `v`, which is owned by the current function
 --> src/main.rs:6:32
  |
6 |     let handle = thread::spawn(|| {
  |                                ^^ may outlive borrowed value `v`
7 |         println!("Here's a vector: {:?}", v);
  |                                           - `v` is borrowed here
  |
note: function requires argument type to outlive `'static`
 --> src/main.rs:6:18
  |
6 |       let handle = thread::spawn(|| {
  |  __________________^
7 | |         println!("Here's a vector: {:?}", v);
8 | |     });
  | |______^
help: to force the closure to take ownership of `v` (and any other referenced variables), use the `move` keyword
  |
6 |     let handle = thread::spawn(move || {
  |                                ++++

For more information about this error, try `rustc --explain E0373`.
error: could not compile `threads` (bin "threads") due to 1 previous error
```

このコードが実行できるなら，立ち上げたスレッドはまったく実行されることなく即座にバックグラウンドに置かれる可能性があります．メインスレッドでvをすぐにdropしてしまうのでvの参照が不正になります．
```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(|| {
        println!("Here's a vector: {:?}", v);
    });

    drop(v);

    handle.join().unwrap();
}
```

クロージャの前にmoveキーワードを付けて，コンパイラに値を借用すべきと推論させるのではなく，所有権を強制的に奪わせます．
```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("Here's a vector: {:?}", v);
    });

    handle.join().unwrap();
}
```

## 16.2 メッセージ受け渡しを使ってスレッド間でデータを転送する

send：receiveの関係を作ります．`mpsc::channel`関数で新しいチャンネルを生成します．タプルを返し，一つ目の要素は送信側，二つ目の要素は受信側を指します．
```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
}
```

以下のプログラム例はtxを立ち上げたスレッドに移動し，"hi"を送るロジックです．
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });
}
```

立ち上げたスレッドで"hi"を送り，メインスレッドがそれを受け取って標準出力します．
```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### 複数の値を送信し，受信側が待機するのを確かめる

以下のプログラム例は立ち上げたスレッドは，複数のメッセージを送信し，各メッセージ間で，1秒待機します．rxで常時受信待ち状態になっている感じです．
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

## 16.3 状態共有並行性

前節では，send/receiveでデータの受け渡しを行っていましたが，ここでは，一つのデータに複数スレッドがアクセスする状況を考えます． <br>
Go言語においてのスローガンでこんなのがあります．“Do not communicate by sharing memory.” <br>
メモリ共有の並行性は，複数の所有権に類似しており，スマートポインタがそれを可能にしました．

### ミューテックスでアクセスを許可する
ミューテックスは，どんな時も1つのスレッドにしかデータアクセスを許可しないもので，mutual exclusion(相互排他)の省略形です．ミューテックスの規則は以下の2つです．
- データ使用前にロックする
- ミューテックスが死守しているデータ使用が終わったら，他スレッドがロックできるように開放する <br>
要は，舞台は1つしかなく，多くの人が順番に演技をするわけです．演技を終わった人は舞台を開けないと次の人が使えないでしょう？ <br>

では，ミューテックスを実際に使ってみましょう．newでMutex\<T\>を生成します．変数mはMutex\<i32\>型で5という値を持っています．これにアクセスするためにはlockメソッドでロックを得ます．他スレッドがロック中ならばここで失敗(順番待ち)になります．そのためにunwrapで保険をかけているわけです． <br>
ロックを獲得すると，内部データへの可変参照として扱うことができます．今回はnumに格納しています．
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }

    println!("m = {:?}", m);
}
```

Mutex\<T\>はスマートポインタです．lockを呼び出すとLockResultに包まれた形でMutexGuardというスマートポインタを返却，これをunwrapの呼び出しによって処理しています．MutexGuardスマートポインタが，内部データを表すDerefを実装していて，さらにスコープから外れた時に自動的にDrop実装もしています．これによって，ロック開放が自動的に行われ，開放忘れを防ぎます．

### 複数スレッド間でMutex\<T\>を共有する
Mutex\<T\>を用いて複数スレッド間で値を共有する方法を考えます．プログラム例では，10個のスレッドを立ち上げ，各々カウンタを1ずつインクリメントさせます．最終的に，10が出力されれば成功です．

counterがMutexを取得 -> thread::spawnで全スレッドに同じクロージャを与える -> スレッド内にcounterをムーブし，lockメソッドを呼ぶことでMutexのロックを獲得 -> numは1足したらスコープ外に出るので自動開放 -> 他スレッドがロック獲得　<br>
handleをhandlesに入れておき，最後に全スレッドをjoinさせます．一見すると，いいプログラムですが，このままだとエラーが起きます．
```rust
use std::sync::Mutex;
use std::thread;

fn main() {
    let counter = Mutex::new(0);
    let mut handles = vec![];

    for _ in 0..10 {
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

エラーの原因はcounterの所有権です．ロックの所有権を複数スレッドに移動させることはできないのです．
```bash
$ cargo run
   Compiling shared-state v0.1.0 (file:///projects/shared-state)
error[E0382]: borrow of moved value: `counter`
  --> src/main.rs:21:29
   |
5  |     let counter = Mutex::new(0);
   |         ------- move occurs because `counter` has type `Mutex<i32>`, which does not implement the `Copy` trait
...
9  |         let handle = thread::spawn(move || {
   |                                    ------- value moved into closure here, in previous iteration of loop
...
21 |     println!("Result: {}", *counter.lock().unwrap());
   |                             ^^^^^^^ value borrowed here after move

For more information about this error, try `rustc --explain E0382`.
error: could not compile `shared-state` (bin "shared-state") due to 1 previous error
```

### 複数スレッドで複数の所有権
じゃー，スマートポインタのRC\<T\>を使用して参照カウントの値を作れば，複数の所有者を与えられるじゃん！RcにMutexを包含し，所有権をスレッドに移す前にRcをクローンしています．しかし，これもエラーが出ます．
```rust
use std::rc::Rc;
use std::sync::Mutex;
use std::thread;

fn main() {
    let counter = Rc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Rc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

Rcはスレッド間で共有するには安全ではないのです．Rcが参照カウントを管理する際，クローンが呼び出されるたびにカウントを追加し，クローンがドロップされるたびにカウントを差し引きます．これは，並行基本型を使用してカウントの変更が別スレッドに妨害されないことを確認していないので，エラーが出てしまいます．
```bash
$ cargo run
   Compiling shared-state v0.1.0 (file:///projects/shared-state)
error[E0277]: `Rc<Mutex<i32>>` cannot be sent between threads safely
  --> src/main.rs:11:36
   |
11 |           let handle = thread::spawn(move || {
   |                        ------------- ^------
   |                        |             |
   |  ______________________|_____________within this `{closure@src/main.rs:11:36: 11:43}`
   | |                      |
   | |                      required by a bound introduced by this call
12 | |             let mut num = counter.lock().unwrap();
13 | |
14 | |             *num += 1;
15 | |         });
   | |_________^ `Rc<Mutex<i32>>` cannot be sent between threads safely
   |
   = help: within `{closure@src/main.rs:11:36: 11:43}`, the trait `Send` is not implemented for `Rc<Mutex<i32>>`
note: required because it's used within this closure
  --> src/main.rs:11:36
   |
11 |         let handle = thread::spawn(move || {
   |                                    ^^^^^^^
note: required by a bound in `spawn`
  --> /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/std/src/thread/mod.rs:678:1

For more information about this error, try `rustc --explain E0277`.
error: could not compile `shared-state` (bin "shared-state") due to 1 previous error
```

### Arc\<T\>で原子的な参照カウント
AtomicRcですが，これを使えばスレッド間で共有しても安全である，ということが分かっていればよいです．シングルスレッドで処理するなら，わざわざArcを使わなくても並行性の安全は保証されているので，コンパイルが早くなります．では，プログラムの完成形を見ます．
```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

### RefCell\<T\> / Rc\<T\>とMutex\<T\> / Arc\<T\>の類似性
counterは不変なのに，内部データへの可変参照を得ることができました．要は，MutexはCell系のように内部可変性を提供しているのです．また，Mutexはあらゆる種類のロジックエラーからはコンパイラは保護してくれません．Rcは循環参照を生成してしまうリスクをもつので，デッドロックを引き起こしてしまう可能性があります．


## 16.4 SyncとSendトレイトで拡張可能な並行性

Rustでは，並行処理の多くは標準ライブラリによって提供されているが，言語レベルでは **`Send`** と **`Sync`** の2つのマーカートレイトが並行性の安全性を支えている．これらはコンパイラがスレッド間で安全にデータを扱えるかを判定するために利用される．

### Sendトレイト

`Send` は，**値の所有権を別のスレッドへ安全に移動できる型**であることを表す．

- `Send` を実装した型は，スレッド間で所有権を移動できる．
- 基本型（`i32`，`bool`など）の多くは `Send` を実装している．
- `Rc<T>` は参照カウントの更新がスレッドセーフではないため `Send` ではない．
- 複数スレッドで共有したい場合は `Arc<T>` を使用する．

### Syncトレイト

`Sync` は，**複数のスレッドから共有参照（`&T`）で安全にアクセスできる型**であることを表す．

- 型 `T` が `Sync` であるとは，「`&T` が `Send` である」ことを意味する．
- `Mutex<T>` は `Sync` を実装しており，複数スレッドから安全に共有できる．
- `RefCell<T>` や `Rc<T>` はスレッドセーフではないため `Sync` を実装していない．

### 自動実装

`Send` 型だけで構成された型は自動的に `Send` となり，`Sync` 型だけで構成された型は自動的に `Sync` となる．そのため，通常はこれらのトレイトを自分で実装する必要はない．

### 手動実装について

`Send` や `Sync` を手動で実装する場合は `unsafe` が必要となる．誤った実装はデータ競合などの原因となるため，通常は自動実装に任せるべきである

### まとめ

- **Send**：所有権をスレッド間で移動できる．
- **Sync**：複数スレッドから共有参照でアクセスできる．
- 多くの型は自動的に `Send`・`Sync` を実装する．
- `Rc<T>` や `RefCell<T>` はスレッドセーフではないため実装しない．
- `Arc<T>` や `Mutex<T>` は並行処理で安全に利用できる代表的な型である．