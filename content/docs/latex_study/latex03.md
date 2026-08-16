---
title: "3章 表"
weight: 4
---

# 3章　表の作成

LaTeXでは，`tabular` 環境を使用して表を作成できます．

また，論文やレポートで表を掲載する場合は，`table` 環境と組み合わせることで，表番号やキャプションを付けることができます．

---

## 3-1 基本的な表の作成

表を作成する場合は，`tabular` 環境を使用します．

例えば，3列の表は以下のように記述します．

```latex
\begin{tabular}{ccc}
    名前 & 年齢 & 所属 \\
    田中 & 20 & 情報学科 \\
    鈴木 & 21 & 工学科 \\
\end{tabular}
```

表の中では，主に以下の記号を使用します．

|  記述  | 意味    |
| :--: | ----- |
|  `&` | 列を区切る |
| `\\` | 行を区切る |

例えば，

```latex
田中 & 20 & 情報学科 \\
```

と記述すると，

```text
田中    20    情報学科
```

のように3つの列へ分割されます．

---

### 列の配置を指定する

`tabular` 環境の `{}` 内では，各列の文字の配置を指定します．

```latex
\begin{tabular}{ccc}
```

この例では，`c` が3つ記述されているため，3列の表になります．

代表的な指定方法は以下の通りです．

|  指定 | 意味           |
| :-: | ------------ |
| `l` | 左揃え（left）    |
| `c` | 中央揃え（center） |
| `r` | 右揃え（right）   |

例えば，

```latex
\begin{tabular}{lcr}
```

とすると，

* 1列目：左揃え
* 2列目：中央揃え
* 3列目：右揃え

となります．

```latex
\begin{tabular}{lcr}
    名前 & 年齢 & 点数 \\
    田中 & 20 & 80 \\
    鈴木 & 21 & 95 \\
\end{tabular}
```

---

## 3-2 罫線を付ける

表に罫線を付ける場合は，`|` と `\hline` を使用します．

### 縦線

列の指定に `|` を追加すると，縦方向の罫線を表示できます．

```latex
\begin{tabular}{|c|c|c|}
```

例えば，以下のように記述します．

```latex
\begin{tabular}{|c|c|c|}
    名前 & 年齢 & 所属 \\
    田中 & 20 & 情報学科 \\
    鈴木 & 21 & 工学科 \\
\end{tabular}
```

### 横線

横方向の罫線を表示する場合は，`\hline` を使用します．

```latex
\begin{tabular}{|c|c|c|}
    \hline
    名前 & 年齢 & 所属 \\
    \hline
    田中 & 20 & 情報学科 \\
    \hline
    鈴木 & 21 & 工学科 \\
    \hline
\end{tabular}
```

これにより，各セルを罫線で囲んだ表を作成できます．

{{% hint info %}}
`|` は縦線，`\hline` は横線を表します．

```latex
\begin{tabular}{|c|c|c|}
    \hline
```

のように組み合わせることで，一般的な格子状の表を作成できます．
{{% /hint %}}

---

## 3-3 表を中央に配置する

`tabular` 環境だけでは，表は自動的に中央へ配置されません．

表を中央に配置する場合は，`\centering` を使用します．

```latex
\begin{center}
    \begin{tabular}{|c|c|c|}
        \hline
        名前 & 年齢 & 所属 \\
        \hline
        田中 & 20 & 情報学科 \\
        鈴木 & 21 & 工学科 \\
        \hline
    \end{tabular}
\end{center}
```

論文やレポートで `table` 環境を使用する場合は，`\centering` を使用する方法が一般的です．

```latex
\begin{table}[htbp]
    \centering

    \begin{tabular}{|c|c|c|}
        \hline
        名前 & 年齢 & 所属 \\
        \hline
        田中 & 20 & 情報学科 \\
        鈴木 & 21 & 工学科 \\
        \hline
    \end{tabular}
\end{table}
```

---

## 3-4 table環境

論文やレポートで表を作成する場合は，`tabular` 環境を `table` 環境の中に記述することが多いです．

```latex
\begin{table}[htbp]
    \centering
    \caption{学生情報}
    \label{tab:student}

    \begin{tabular}{|c|c|c|}
        \hline
        名前 & 年齢 & 所属 \\
        \hline
        田中 & 20 & 情報学科 \\
        鈴木 & 21 & 工学科 \\
        \hline
    \end{tabular}
\end{table}
```

`table` と `tabular` は役割が異なります．

| 環境        | 役割                       |
| --------- | ------------------------ |
| `table`   | 表全体の配置，表番号，キャプションなどを管理する |
| `tabular` | 実際の行と列を作成する              |

つまり，実際の表そのものを作っているのは `tabular` 環境です．

`table` 環境は，その表を文書中でどのように扱うかを管理します．

---

### 表の配置

`table` 環境も `figure` 環境と同様にフロートとして扱われます．

```latex
\begin{table}[htbp]
```

`[]` の中では，表を配置する場所の候補を指定します．

|  指定 | 意味                  |
| :-: | ------------------- |
| `h` | 記述した位置付近（here）      |
| `t` | ページ上部（top）          |
| `b` | ページ下部（bottom）       |
| `p` | 表などのフロート専用ページ（page） |

通常は，

```latex
\begin{table}[htbp]
```

としておけば問題ありません．

---

## 3-5 キャプションを付ける

表にタイトルや説明を付ける場合は，`\caption` を使用します．

```latex
\caption{学生情報}
```

例えば，以下のように記述します．

```latex
\begin{table}[htbp]
    \centering
    \caption{学生情報}

    \begin{tabular}{ccc}
        \hline
        名前 & 年齢 & 所属 \\
        \hline
        田中 & 20 & 情報学科 \\
        鈴木 & 21 & 工学科 \\
        \hline
    \end{tabular}
\end{table}
```

これにより，表番号とキャプションが自動的に表示されます．

{{% hint info %}}
一般的な論文やレポートでは，**図のキャプションは図の下，表のキャプションは表の上**に配置する形式がよく用いられます．

そのため，表では `\caption` を `tabular` 環境より前に記述すると分かりやすくなります．

ただし，実際の配置規則は大学，学会，論文誌などの執筆要領に従ってください．
{{% /hint %}}

---

## 3-6 表を本文から参照する

表を本文から参照する場合は，図や数式と同様に `\label` と `\ref` を使用します．

```latex
\begin{table}[htbp]
    \centering
    \caption{学生情報}
    \label{tab:student}

    \begin{tabular}{ccc}
        \hline
        名前 & 年齢 & 所属 \\
        \hline
        田中 & 20 & 情報学科 \\
        鈴木 & 21 & 工学科 \\
        \hline
    \end{tabular}
\end{table}
```

本文からは，以下のように参照します．

```latex
表\ref{tab:student}に学生情報を示します．
```

表番号が変更された場合でも，`\ref` による参照番号は自動的に更新されます．

{{% hint info %}}
表のラベルには `tab:` を付けておくと管理しやすくなります．

例えば，以下のように使い分けます．

```latex
\label{fig:network}   % 図
\label{tab:result}    % 表
\label{eq:objective}  % 数式
```

また，`\label` は対応する表番号を取得できるように，`\caption` の後に記述しておくと安全です．

```latex
\caption{実験結果}
\label{tab:result}
```

{{% /hint %}}

---

## 3-7 セルを結合する

複数の列を1つのセルとしてまとめたい場合は，`\multicolumn` を使用します．

基本的な書式は以下の通りです．

```latex
\multicolumn{列数}{配置}{内容}
```

例えば，3列分を結合する場合は以下のように記述します．

```latex
\begin{tabular}{|c|c|c|}
    \hline
    \multicolumn{3}{|c|}{学生情報} \\
    \hline
    名前 & 年齢 & 所属 \\
    \hline
    田中 & 20 & 情報学科 \\
    鈴木 & 21 & 工学科 \\
    \hline
\end{tabular}
```

この部分では，

```latex
\multicolumn{3}{|c|}{学生情報}
```

によって，3列分のセルを1つに結合しています．

それぞれの引数には以下を指定します．

| 引数      | 内容         |
| ------- | ---------- |
| `3`     | 結合する列数     |
| `\|c\|` | 中央揃えと左右の罫線 |
| `学生情報`  | セルに表示する内容  |

---

### 行方向にセルを結合する

複数の行を結合する場合は，`multirow` パッケージを利用できます．

プリアンブルに以下を追加します．

```latex
\usepackage{multirow}
```

例えば，以下のように記述します．

```latex
\begin{tabular}{|c|c|c|}
    \hline
    所属 & 名前 & 年齢 \\
    \hline

    \multirow{2}{*}{情報学科}
        & 田中 & 20 \\
        & 鈴木 & 21 \\

    \hline
\end{tabular}
```

`\multirow` の基本的な書式は以下です．

```latex
\multirow{行数}{幅}{内容}
```

通常は，幅に `*` を指定して内容に合わせて自動調整します．

---

## 3-8 列の幅を指定する

文章が長いセルでは，通常の `l`，`c`，`r` だけでは表が横に広がりすぎる場合があります．

その場合は `p{幅}` を使用すると，列の横幅を指定できます．

```latex
\begin{tabular}{|c|p{8cm}|}
    \hline
    項目 & 説明 \\
    \hline
    LaTeX &
    文書の構造と内容を記述することで，
    高品質な文書を作成できる組版システムです． \\
    \hline
\end{tabular}
```

この例では，

```latex
p{8cm}
```

によって，2列目の横幅を8cmに指定しています．

文章が指定した幅を超えた場合は，自動的に折り返されます．

---

## 3-9 表の見た目を整える

論文などでは，すべてのセルを縦線と横線で囲むよりも，必要な横線だけを使用した表が用いられることがあります．

表の罫線を整える場合は `booktabs` パッケージが便利です．

プリアンブルに以下を追加します．

```latex
\usepackage{booktabs}
```

その後，`\hline` の代わりに以下の命令を使用できます．

| 命令            | 用途         |
| ------------- | ---------- |
| `\toprule`    | 表の一番上の線    |
| `\midrule`    | 見出しなどを区切る線 |
| `\bottomrule` | 表の一番下の線    |

例えば，以下のように記述します．

```latex
\begin{table}[htbp]
    \centering
    \caption{実験結果}
    \label{tab:result}

    \begin{tabular}{lrr}
        \toprule
        手法 & 実行時間[s] & 精度[\%] \\
        \midrule
        Method A & 10.2 & 92.5 \\
        Method B & 8.7  & 94.1 \\
        Method C & 12.1 & 95.3 \\
        \bottomrule
    \end{tabular}
\end{table}
```

{{% hint info %}}
論文向けの表では，縦線を多用せず，必要な横線だけを配置すると見やすくなる場合があります．

`booktabs` を使用する場合は，基本的に `\toprule`，`\midrule`，`\bottomrule` を使用して表を構成します．
{{% /hint %}}

---

## 3-10 よく使う表の書き方

レポートや論文で一般的な表を作成する場合は，以下の形式を基本として利用できます．

```latex
\begin{table}[htbp]
    \centering
    \caption{実験結果}
    \label{tab:result}

    \begin{tabular}{lrr}
        \toprule
        手法 & 実行時間[s] & 精度[\%] \\
        \midrule
        Method A & 10.2 & 92.5 \\
        Method B & 8.7  & 94.1 \\
        Method C & 12.1 & 95.3 \\
        \bottomrule
    \end{tabular}
\end{table}
```

この形式を使用する場合は，プリアンブルで `booktabs` パッケージを読み込みます．

```latex
\usepackage{booktabs}
```