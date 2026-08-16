---
title: "1章 数式"
weight: 2
---

# 1章　数式

## 1-1 数式を扱う
LaTeXの醍醐味の一つである数式をテキストで表現する方法を説明します．まず，数式表記には大きく分けて二種類あります．

- **インライン数式** : 文章の途中に数式を入れる場合は`$`で囲みます．例として，以下を試してみてください．

```latex
三平方の定理は $a^2+b^2=c^2$ と表される．
```

- **別行立て数式** : 数式を独立した行として表示する場合は`\[ \]`を使用します．指定をしない場合，数式は中央配置されます．また例をどうぞ．

```latex
三平方の定理は
\[ a^2+b^2=c^2 \]
と表される．
```

{{< hint info >}}
数式番号が必要な場合は，後述する equation 環境を使用します．
{{< /hint >}}

## 1-2 数式記号
数式を表現するためには，記号の表記法を把握しなければなりません．ただ，数が膨大なので一覧表をのせておきます．忘れたらまた見に来てください．では，どうぞ．


|[数式記号チートシート.pdf](/file/latex_study/数式記号チートシート.pdf)|
|-|

## 1-3 数式環境

LaTeXでは，用途に応じてさまざまな数式環境を利用できます．

数式環境を利用することで，数式番号を付けたり，複数行の数式を揃えたりすることができます．

### equation環境

数式を独立して表示し，数式番号を付ける場合は `equation` 環境を使用します．

```latex
\begin{equation}
    E = mc^2
\end{equation}
```

数式の右側に数式番号が自動的に付けられます．

数式番号が不要な場合は `equation*` を使用します．

```latex
\begin{equation*}
    E = mc^2
\end{equation*}
```

### align環境

複数行の数式を特定の位置で揃える場合は `align` 環境を使用します．

```latex
\begin{align}
    x + y &= 10 \\
    x - y &= 2
\end{align}
```

`&` を記述した位置が揃えられます．

上の例では `=` の直前に `&` を記述しているため，等号の位置が揃います．

また，`\\` で改行します．

数式番号が不要な場合は `align*` を使用します．

```latex
\begin{align*}
    x + y &= 10 \\
    x - y &= 2
\end{align*}
```

{{% hint info %}}
`equation*` や `align` などを利用する場合は，
プリアンブルで `amsmath` パッケージを読み込んでおく．

```latex
\usepackage{amsmath}
```
{{% /hint %}}

---

## 1-4 複数行の数式

長い数式や計算過程を記述する場合は，数式を複数行に分割すると読みやすくなります．

### align環境を使う

計算過程を複数行に分ける場合は `align` 環境が便利です．

```latex
\begin{align}
    (x+1)^2
        &= (x+1)(x+1) \\
        &= x^2 + 2x + 1
\end{align}
```

`&` の位置を基準として，それぞれの行が揃えられます．

この場合は各行に数式番号が付けられます．

### aligned環境を使う

複数行の数式全体に1つだけ数式番号を付けたい場合は，`equation` 環境の中で `aligned` 環境を使用します．

```latex
\begin{equation}
\begin{aligned}
    x + y &= 10 \\
    x - y &= 2
\end{aligned}
\end{equation}
```

この場合，2つの式全体に対して1つの数式番号が付けられます．

### 数式番号を一部だけ消す

`align` 環境で特定の行だけ数式番号を表示したくない場合は `\notag` を使用します．

```latex
\begin{align}
    (x+1)^2
        &= (x+1)(x+1) \notag \\
        &= x^2 + 2x + 1
\end{align}
```

---

## 1-5 場合分け

場合によって値が変化する関数などは，`cases` 環境を使用して記述できます．

```latex
\begin{equation}
f(x) =
\begin{cases}
    x^2 & (x \geq 0) \\
    -x  & (x < 0)
\end{cases}
\end{equation}
```

`&` より左側に値，右側に条件を記述します．

```text
値 & 条件
```

条件部分を通常の文章として記述する場合は `\text{}` を利用できます．

```latex
\begin{equation}
f(x) =
\begin{cases}
    1 & \text{成功した場合} \\
    0 & \text{失敗した場合}
\end{cases}
\end{equation}
```

`\text{}` は数式中に通常の文章を記述するときにも利用できます．

---

## 1-6 行列

行列は `matrix` 系の環境を使用して記述します．

例えば，丸括弧で囲まれた行列は `pmatrix` を使用します．

```latex
\[
A =
\begin{pmatrix}
    1 & 2 \\
    3 & 4
\end{pmatrix}
\]
```

行列では，

* `&` で列を区切る
* `\\` で行を区切る

という記法を使用します．

例えば，3行3列の行列は次のように記述できます．

```latex
\[
A =
\begin{pmatrix}
    1 & 2 & 3 \\
    4 & 5 & 6 \\
    7 & 8 & 9
\end{pmatrix}
\]
```

### 行列環境の種類

行列を囲む括弧によって，使用する環境が異なります．

| 環境        | 表示される括弧 | 主な用途     |   |   |   |      |
| --------- | ------- | -------- | - | - | - | ---- |
| `matrix`  | なし      | 括弧が不要な行列 |   |   |   |      |
| `pmatrix` | `( )`   | 一般的な行列   |   |   |   |      |
| `bmatrix` | `[ ]`   | 角括弧の行列   |   |   |   |      |
| `Bmatrix` | `{ }`   | 中括弧の行列   |   |   |   |      |
| `vmatrix` | `\| \|` | 行列式など    |   |   |   |      |
| `Vmatrix` | `       |          |   |   | ` | 二重縦線 |

角括弧を使用する場合は `bmatrix` を使用します．

```latex
\[
A =
\begin{bmatrix}
    1 & 2 \\
    3 & 4
\end{bmatrix}
\]
```

行列式を表現する場合は `vmatrix` を使用できます．

```latex
\[
\begin{vmatrix}
    a & b \\
    c & d
\end{vmatrix}
= ad-bc
\]
```

{{% hint info %}}
`pmatrix`，`bmatrix`，`cases` などの環境を使用する場合も `amsmath` パッケージを読み込んでおきます．
{{% /hint %}}

---

## 1-7 数式番号と参照

論文やレポートでは，数式に番号を付け，本文からその数式を参照することが多い．

LaTeXでは `\label` と `\ref` を使用することで，数式番号を自動的に管理できます．

### 数式にラベルを付ける

`equation` 環境の中に `\label` を記述します．

```latex
\begin{equation}
    E = mc^2
    \label{eq:einstein}
\end{equation}
```

`eq:einstein` は，この数式を識別するための名前．

名前は自由に設定できるが，

```text
eq:
```

を数式用ラベルの接頭辞として使用すると管理しやすい．

例えば，

```latex
\label{eq:energy}
\label{eq:distance}
\label{eq:objective}
```

のように設定できます．

### 数式を参照する

本文から数式を参照する場合は `\ref` を使用します．

```latex
式(\ref{eq:einstein})より，エネルギーと質量の関係が得られる．
```

`amsmath` を使用している場合は `\eqref` も利用できます．

```latex
式\eqref{eq:einstein}より，エネルギーと質量の関係が得られる．
```

`\eqref` を使用すると，数式番号を囲む括弧も自動的に付けられます．

そのため，

```latex
式\eqref{eq:einstein}
```

の形式が便利．

{{% hint info %}}
数式番号を本文中に直接「式(1)」などと記述するのは避ける．

数式を追加・削除すると，数式番号が変化する可能性がある．

`\label` と `\ref` または `\eqref` を利用すれば，数式番号が変化しても参照先が自動的に更新される．
{{% /hint %}}

### align環境でラベルを付ける

`align` 環境では，それぞれの行にラベルを設定することもできます．

```latex
\begin{align}
    x + y &= 10
    \label{eq:add} \\
    x - y &= 2
    \label{eq:sub}
\end{align}
```

それぞれ，

```latex
式\eqref{eq:add}
```

```latex
式\eqref{eq:sub}
```

として参照できます．