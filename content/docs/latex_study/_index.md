---
title: "LaTex入門"
weight: 40
---

# LaTex入門(環境構築)

普段，PC上で文書を書くときはメモ帳やMS Wordを用いていると思います．それでいいじゃないかと思うかもしれませんが，理系大学生であるあなたは卒業論文を何で書きますか．章立てや画像配置，キャプション生成などを付けなければなりませんが，Wordだと超面倒ですよね．そこででてくるのがLaTeXです．LaTeXは組版ソフトで，テキストベースで論文や書籍等を作成することができます．昔はTeXというものがありましたが，今ではLaTeXを使います．ちなみに，読み方は「ラテフ」ないし「テフ」です．<br>

## LaTeX環境構築
とりあえずLaTeXを体験してみたい人は以下のWebページにアクセスしてみてください．アカウントを作る必要があるのでそこだけお願いします．ログインすればクラウド上でファイル管理されるので手軽に使えます．<br>
[Cloud LaTeX](https://cloudlatex.io/) <br>
[Overleaf](https://ja.overleaf.com/) <br>

私はWSLを主戦場にしているので，WSL上で環境構築しました．以下のQiita記事が非常に参考になりますので，そちらを参照の上構築してみてください．<br>
[VSCodeで最高のLaTeX環境を作る](https://qiita.com/rainbartown/items/d7718f12d71e688f3573) <br>

## WSL環境構築(未の方はこちらから)

{{< hint info >}}

### WSLとは <br>
WSL (Windows Subsystem for Linux) は、Windows上でLinux環境を実行するための機能です．研究やプログラミングではLinux環境を利用する機会が多いため、まずはWSLを導入しましょう．
{{< /hint >}}

### Windowsの設定

1. 「Windowsの機能の有効化または無効化」を開く
2. 以下にチェックを入れる

```text
Windows Subsystem for Linux
仮想マシンプラットフォーム
```

3. 求められたらPCを再起動する

{{< hint warning >}}
「Windowsハイパーバイザープラットフォーム」は通常不要です．仮想化ソフトと競合する場合があるため、本ページでは有効化しません．
{{< /hint >}}

### Ubuntuのインストール
PowerShellを管理者権限で起動し，以下を実行します．
```powershell
wsl --set-default-version 2
wsl --update
wsl --install -d Ubuntu-24.04
```
インストール完了後，PCを再起動します．

### Ubuntuの初回起動
スタートメニューから Ubuntu を起動します．初回起動時にユーザー名とパスワードを設定します．
```text
Enter new UNIX username:
```
ユーザー名を入力します．
```text
Enter new UNIX password:
```
パスワードを入力します．表示されないですが，正常です．(注意：忘れると変更できないので必ず覚える！)

### パッケージの更新
Ubuntu起動後、以下を実行します．
```bash
sudo apt update
sudo apt upgrade -y
```

### 補足A　VSCodeとの連携
Windows版Visual Studio Codeをインストールします．VSCodeの拡張機能から以下を導入します．

```text
WSL
```

Ubuntu上で任意のディレクトリに移動し，

```bash
code .
```
を実行すると，WSL環境に接続されたVSCodeが起動します．

### 補足B WSLのファイル場所
エクスプローラー上でパスに`\wsl`と入力するとホームディレクトリにアクセスできます．

<div class="center-fig">
    <img src="/figure/latex_study/filepath.png" alt="filepath">
    <p class="caption">エクスプローラーを開く</p>
</div>

### 補足C Ubuntuの日本語化
言語環境を日本語化する際は，以下コマンドを入力してください．
```bash
$ sudo apt install -y language-pack-ja
$ sudo update-locale LANG=ja_JP.UTP8
```