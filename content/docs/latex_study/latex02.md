---
title: "2章 図"
weight: 3
---

# 2章　図の挿入

## 図の挿入

LaTeXでは，`graphicx` パッケージを利用することで画像を文書中に挿入できます．

プリアンブルに以下を記述します．

```latex
\usepackage[dvipdfmx]{graphicx}
```

`uplatex` と `dvipdfmx` を使用してPDFを作成する場合は，`dvipdfmx` オプションを指定します．

---

## 2-1 画像を挿入する

画像を挿入するには，`\includegraphics` を使用します．

例えば，`.tex` ファイルと同じディレクトリに `sample.png` が存在する場合は，以下のように記述します．

```latex
\includegraphics{sample.png}
```

画像ファイルを別のディレクトリに保存している場合は，相対パスを指定できます．

例えば，以下のようなディレクトリ構成とします．

```text
.
├── main.tex
└── figure
    └── sample.png
```

この場合は，以下のように記述します．

```latex
\includegraphics{figure/sample.png}
```

---

## 2-2 画像のサイズを指定する

`\includegraphics` のオプションを使用することで，画像の大きさを変更できます．

例えば，文書領域の横幅に対して80%の大きさで表示する場合は，以下のように記述します．

```latex
\includegraphics[width=0.8\textwidth]{figure/sample.png}
```

`\textwidth` は，文書の本文領域の横幅を表します．

代表的な指定例を以下に示します．

| 指定                    | 意味         |
| --------------------- | ---------- |
| `width=0.5\textwidth` | 本文幅の50%    |
| `width=0.8\textwidth` | 本文幅の80%    |
| `width=\textwidth`    | 本文幅いっぱい    |
| `width=10cm`          | 横幅を10cmにする |
| `height=5cm`          | 高さを5cmにする  |

通常は，固定値を指定するよりも `\textwidth` を基準として指定すると，文書のレイアウトを変更した場合にも対応しやすくなります．

---

## 2-3 figure環境

レポートや論文で図を挿入する場合は，単純に `\includegraphics` を使用するのではなく，`figure` 環境を利用することが多いです．

```latex
\begin{figure}[htbp]
    \centering
    \includegraphics[width=0.8\textwidth]{figure/sample.png}
    \caption{サンプル画像}
    \label{fig:sample}
\end{figure}
```

それぞれの命令には以下の役割があります．

| 記述                 | 意味                |
| ------------------ | ----------------- |
| `\begin{figure}`   | figure環境を開始する     |
| `\centering`       | 図を中央揃えにする         |
| `\includegraphics` | 画像を読み込む           |
| `\caption{}`       | 図のキャプションを設定する     |
| `\label{}`         | 図を参照するためのラベルを設定する |
| `\end{figure}`     | figure環境を終了する     |

---

## 2-4 図の配置

`figure` 環境は「フロート」と呼ばれる仕組みを利用しています．

そのため，ソースコードに記述した位置と実際に図が表示される位置が一致するとは限りません．

```latex
\begin{figure}[htbp]
```

`[]` の中では，図を配置する場所の候補を指定します．

|  指定 | 意味             |
| :-: | -------------- |
| `h` | 記述した位置付近（here） |
| `t` | ページ上部（top）     |
| `b` | ページ下部（bottom）  |
| `p` | 図専用ページ（page）   |

例えば，

```latex
\begin{figure}[htbp]
```

とすると，`h`，`t`，`b`，`p` の順に適切な配置場所が選択されます．

{{% hint info %}}
`[h]` を指定しても，必ずその場所に配置されるわけではありません．

LaTeXはページ全体のレイアウトを考慮して，自動的に図の位置を調整します．
{{% /hint %}}

---

## 2-5 図を指定した位置に固定する

図をどうしても記述した位置に配置したい場合は，`float` パッケージの `[H]` を使用できます．

プリアンブルに以下を追加します．

```latex
\usepackage{float}
```

その後，以下のように記述します．

```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{figure/sample.png}
    \caption{サンプル画像}
    \label{fig:sample}
\end{figure}
```

`H` を指定すると，基本的にソースコードに記述した位置へ図が配置されます．

{{% hint warning %}}
`[H]` を多用すると，ページ下部に大きな空白が発生するなど，LaTeXによる自動レイアウトの利点が失われる場合があります．

通常は `[htbp]` を使用し，配置を固定する必要がある場合に `[H]` を使用するとよいです．
{{% /hint %}}

---

## 2-6 キャプションを付ける

図の説明には `\caption` を使用します．

```latex
\caption{ネットワーク構成}
```

例えば，以下のように記述します．

```latex
\begin{figure}[htbp]
    \centering
    \includegraphics[width=0.8\textwidth]{figure/network.png}
    \caption{ネットワーク構成}
\end{figure}
```

これにより，図に番号とキャプションが自動的に付けられます．

---

## 2-7 図を本文から参照する

論文やレポートでは，「下の図」のように位置で図を示すのではなく，図番号を使って参照します．

図に `\label` を設定します．

```latex
\begin{figure}[htbp]
    \centering
    \includegraphics[width=0.8\textwidth]{figure/network.png}
    \caption{ネットワーク構成}
    \label{fig:network}
\end{figure}
```

本文では `\ref` を使用します．

```latex
図\ref{fig:network}にネットワーク構成を示します．
```

図番号が変更された場合でも，`\ref` の参照番号は自動的に更新されます．

{{% hint info %}}
`\label` は `\caption` の後に記述します．

```latex
\caption{ネットワーク構成}
\label{fig:network}
```

この順序にしておくことで，対応する図番号を正しく参照できます．

また，図のラベルには `fig:` を付けておくと，数式や表のラベルと区別しやすくなります．
{{% /hint %}}

---

## 2-8 画像を回転する

画像を回転して表示する場合は，`angle` を指定します．

```latex
\includegraphics[
    width=0.5\textwidth,
    angle=90
]{figure/sample.png}
```

`angle=90` では，画像を90度回転します．

---

## 2-9 よく使う図の書き方

レポートや論文では，基本的に以下の形式を使用すればよいです．

```latex
\begin{figure}[htbp]
    \centering
    \includegraphics[width=0.8\textwidth]{figure/sample.png}
    \caption{図の説明}
    \label{fig:sample}
\end{figure}
```

必要となるパッケージは以下です．

```latex
\usepackage[dvipdfmx]{graphicx}
```

図を指定した位置に固定する必要がある場合は，追加で `float` パッケージを読み込みます．

```latex
\usepackage{float}
```