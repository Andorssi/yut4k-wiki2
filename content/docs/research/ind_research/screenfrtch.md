
---
title: screenfetchで遊ぶ
weight: 30
---

# Screenfetchで遊ぼう

ターミナルを使用している人にとっての小ネタです．今回は，ターミナル起動時にアスキーアートを表示して少しだけほっこりしようという内容です．screenfetchというコマンドを使うことでそれを実現します．管理人のWSLは好みのアスキーアートを表示させるようにしています．超余談ですが，画像で二人が詠唱している「急急如律令」(きゅうきゅうにょりつりょう)というのは中国漢代の公文書の末尾に書かれる決まり文句のようです．日本では陰陽術の最後に詠唱されるもので，「急いでやれ！」的な意味らしいです．「何故急に？」と思うかもしれませんが，管理人が最近東京レイヴンズというアニメを観たからです．まあ，そんな無駄話は置いといて，本題に入っていきます．

<div class="center-fig">
    <img src="/figure/screenfetch/01.png" alt="ロゴ">
    <p class="caption">WSL起動時にロゴを出してみよう</p>
</div>

screenfetchのGitHubは以下のURLからどうぞ．
|[GitHubリポジトリ](https://github.com/KittyKatt/screenFetch)|
|-|

## screenfetchを導入し，使ってみる
Linuxでの利用を前提に話します．まずは，以下のコマンドでインストールしてください．正しくインストールされたかは`--version`で確認できます．インストールが完了したら，`screenfetch`とコマンド入力すれば以下の画像のようなイラストが表示されます．これはUbuntuロゴですね．

```bash
$ sudo apt install screenfetch
$ screenfecth --version
$ screenfetch
```

<div class="center-fig">
    <img src="/figure/screenfetch/02.png" alt="ロゴ2">
    <p class="caption">コマンドを打つと表示される</p>
</div>

また，Ubuntu以外のロゴも出すことができます．オプションでロゴを指定してください．以下がそのコマンド例です．
```bash
$ screenfetch -D 'pentax'
```

## ターミナル起動時にscreenfetchを表示させる
本記事の本題です．ただ，必要なコマンドは前節で説明済みなので，それをあるファイルに記述してあげます．それは，`.bashrc`ファイルです．新しいターミナルセッションが開始されるたびに.bashrcが実行されるので，そこにscreenfetchコマンドを書いておけば，勝手に実行してくれます． <br>
それでは，.bashrcに以下のコードを追加してみてください．出来たら，`$ source .bashrc`で.bashrcを再起動しましょう．これで，ロゴが表示されれば成功です．

```shell
/usr/bin/screenfetch -A 'pentax'
. "$HOME/.cargo/env"
```

### 起動時にランダムに表示させる
`.bashrc`に書いた先ほどのコードを以下のように変更すると，起動時にランダムでロゴを表示することができます．
```shell
# PBL2の付録を参照のこと
SCREEN=$(echo "$(($RANDOM % 5))")
if [ "${SCREEN}" = "0" ]; then
    /usr/bin/screenfetch -D 'Ubuntu'
elif [ "${SCREEN}" = "1" ]; then
    /usr/bin/screenfetch -A 'pentax'
elif [ "${SCREEN}" = "2" ]; then
    /usr/bin/screenfetch -A 'Raspbian'
elif [ "${SCREEN}" = "3" ]; then
    /usr/bin/screenfetch -A 'Red Hat Enterprise Linux'
elif [ "${SCREEN}" = "4" ]; then
    /usr/bin/screenfetch -A 'FreeBSD'
fi
    . "$HOME/.cargo/env"
```

### オリジナルAAを表示させる
流れとしては，先ほどの`-A 'XXX'`のように呼び出すためのAAが書かれたシェルスクリプトファイルを作成します．まずは，以下のディレクトリを作成します．

```bash
$ cd
$ mkdir .config
$ cd .config
$ mkdir screenfetch
$ cd screenfetch
# ~/.config/screenfetch/ならOK
```

移動したら，`myascii01.sh`としてAAを作成します．fulloutput=()内にAAを書きます．各行の終わりには`%s`で区切ります．%sの右側にWSL起動時の情報が出力されます．各行の位置を%sの位置でうまく調整してください．

```shell
startline="0"
logowidth="65"

fulloutput=(
'                 ＿人人人人人人人人人＿			%s'
'                 ＞　WSL 急急如律令　＜			%s'
'                 ￣Y^Y^Y^Y^Y^Y^Y^Y^Y^￣			%s'
'							%s'
'　　　　　　　　　　   　　　 　 ＿＿＿＿_		%s'
'　　　 ／￣￣￣￣＼,,　　　　  ／ －､ －､ ＼		%s'
'　　　/＿＿＿＿    ヽ　　　   /　|・|・| ､　＼		%s'
'　　　| ─､ ─ ､ |   |　       /／ `-●－′　 ＼  ヽ	%s'
'　　　| ・|・|─ |__/        |/  ──　|　 ──  ヽ |	%s'
'　　　| `-c`─′　 6 l　      |.　──　|　 ──   | |	%s'
'.　 　ヽ (＿＿＿ ,-′　 　    |　──　|　 ── 　| l	%s'
'　　 　ヽ＿＿＿ ／ヽ　　     ヽ （＿|＿＿＿  / /	%s'
'　　　 ／ |／＼／ l ^ヽ　  　 ＼　　　　　　/ /		%s'
'　　　 |　|　　　 |  |　　    　l━━（ｔ）━━━━┥		%s'
'							%s'
'							%s'
)
```

シェルスクリプトが完成したら，.bashrcで指定します．先ほどのコードを少し修正してmyascii01.shが呼び出されるようにします．`-A 'Ubuntu'`と指定していた箇所を以下のように書き直します．
```bash
/usr/bin/screenfetch -a "$HOME/.config/screenfetch/myascii01.sh"
```

これで最初の画像のような表示になれば成功です．お疲れさまでした．

## 付録 jp2aでも遊んでみよう
jp2aは，好みのPNG/JPEG画像をアスキーアートに変換できるコマンドです．簡単にAA化させられるので，気になる人はやってみてください．

```bash
sudo apt install jp2a
jp2a [ファイル名]
```
実際には幅や色等も指定できるのでより本格的にやってみたい人は各々調べてみてください．