---
title: "5章"
weight: 50
---

# 5章　構造体

## 5.1 構造体を定義し，インスタンス化する

構造体の定義は，structキーワードを用いて名前を付けます．波かっこ内にデータの名前と型を指定し，変数を作成します．例えば，ユーザアカウントに関する情報を保持する構造体を作成してみましょう．

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

構造体を定義したら，使っていきましょう．インスタンスを生成しますが，構造体名を記述し，キーと値を指定します．ちなむと，順番は見ていません．先ほどのUserを使ってインスタンスを生成すると以下のように書けます．また，構造体から特定の値を得るには，ドット記法で指定します．その例も含めてどうぞ．ただし，一部の値を変更するには可変状態でなければなりません．

```rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };

}
```

```rust
// let mut user1{...};の状態ならばOK
user1.email = String::from("anotheremail@example.com");
```

与えられたemailとusernameでUserインスタンスを生成する関数build_userを示します．

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username: username,
        email: email,
        sign_in_count: 1,
    }
}
```

### フィールド初期化省略記法を使う
先ほどのコードは，emailとusernameというフィールド名と変数を繰り返さなければならず，ちょっち面倒です．そこで，以下のように書くこともできます．email: emailと書く必要はなくて，emailだけで済みます．

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

### 構造体更新記法で他のインスタンスからインスタンスを生成する
新しいインスタンスを生成するとき，一部の値を変えて既存インスタンスから更新する形で行うことができます．まずは，user1の値を使用し，user2としてUserインスタンスを生成します．emailだけ値を更新しています．

```rust
fn main() {
    // --snip--

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("another@example.com"),
        sign_in_count: user1.sign_in_count,
    };
}
```

..という記法を用いることで，明示的にセットされていない残りのフィールドが，与えられたインスタンスのフィールドと同じ値になるように指定します．構造体更新記法では，代入と同じように=を使います．データをムーブしているからです．user2を作成した後は，user1をそのまま使えません．この辺は，所有権でやったと思います．(?)

```rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

### 異なる型を生成する名前付きフィールドのないタプル構造体を使用する
タプル構造体とは，フィールドに紐づけられた名前がなく，型指定だけを行うものです．以下の例では，ColorとPointという二つのタプル構造体を作成しています．この場合，中身がすべてi32型でもColorとPoint間で引数を取り合うことはできません．

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

## 5.2 構造体を使ったプログラム例

構造体を用いて長方形の面積を求めるプログラムを書きます．まずは，構造体を使わないで書いてみると...．area関数は，長方形の面積を求めるものだが，引数が2つあり関連性もわかりずらいです．幅，高さを一緒にグループ化するほうが良くなるので，タプルを使います．
```rust
fn main() {
    let width1 = 30;
    let height1 = 50;

    println!(
        "The area of the rectangle is {} square pixels.",
        area(width1, height1)
    );
}

fn area(width: u32, height: u32) -> u32 {
    width * height
}
```

### タプルでリファクタリングする
タプルの要素に添え字でアクセスしなければならず，添え字と意味を何らかの手段で明示しておかないと使いにくいです．

```rust
fn main() {
    let rect1 = (30, 50);

    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
}

fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
```

### 構造体でリファクタリングする
構造体Rectangleを作成しました．フィールドはwidthとheightを定義し，型はu32です．これを，main関数内でインスタンス生成します．area関数は引数が一つになり，rectangle引数を使って処理を行います．型はRectangle構造体インスタンスへの不変借用になりました．main関数は所有権を保って，rect1を使用し続けることができ，そのために関数呼び出し時に&を使います． <br>
area関数では，Rectangleインスタンスのフィールドにアクセスしています．借用された構造体インスタンスのフィールドにアクセスしても，そのフィールドの値はムーブされていないです．

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        area(&rect1)
    );
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

### トレイトの導出で有用な機能を追加する
さっきのプログラムの結果を標準出力してみましょう．

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
     let rect1 = Rectangle {
         width: 30,
         height: 50,
     };

    println!("rect1 is {}", rect1);
}
```


## 5.3 メソッド

メソッドは関数と似ていて，引数と戻り値を持つことができ，別の場所で呼び出されたときに実行されるコードを含みます．最初の引数は必ずselfになり，これはメソッドが呼び出される構造体インスタンスを示します．Rectangleインスタンスを引数にとるarea関数のように，Rectangle構造体上にareaメソッドを作ると以下のようになります． <br>
Rectangleの文脈内にメソッドを定義するためには，impl(implementation)ブロックをつけます．area内では，rectangle: &Rectangleの代わりにself: &Selfを使います．&はSelfのインスタンスを借用していることを示しますので，必要です．

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

### より引数の多いメソッド
複数の長方形を比較し，長方形がもう一つの長方形に収まるかを判定するプログラムを考えます．イメージとしては以下のような感じです．can_holdメソッドは追々実装しますが，長方形同士を比較するような意味合いをもっています．
```rust
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };

    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));   // true
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));   // false
}
```

Rectangle内で呼び出したいので，メソッドを使います．rect1.can_hold(&rect2)は，rect2への不変借用を表しており，所有権をmain関数に残したまま参照だけします．

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

### 関連関数
selfを第一引数としてもたない関連関数を定義することができます．感覚的にはコンストラクタによく使用されます．正方形を生成するコード例を以下に示します．

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}

// let sq = Rectangle::square(3);
```

### 複数のimplブロック
各構造体には，複数のimplブロックを書くことができます．まあ，先ほどのコードと意味的な違いはないですが．
```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```