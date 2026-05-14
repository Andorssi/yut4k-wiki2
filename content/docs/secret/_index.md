---
title: "秘密"
weight: 100
---

# 秘密

## 秘密の部屋へようこそ

## 外部リンク集
|Seikei Portal：[https://portal.seikei.ac.jp/campusweb/top.do](https://portal.seikei.ac.jp/campusweb/top.do)|
|-|

|Course Power：[https://lms.seikei.ac.jp/lms/lginLgir/#](https://lms.seikei.ac.jp/lms/lginLgir/#)|
|-|

|Github：[https://github.com/Andorssi](https://github.com/Andorssi)|
|-|

|Cloudflare：[https://dash.cloudflare.com/f1401fa6b67989032c97bab89f82948a/home/overview](https://dash.cloudflare.com/f1401fa6b67989032c97bab89f82948a/home/overview)|
|-|



## 一時ファイル置き場
ファイルアップロードにはパスワードが必要です． <br>
ファイルのアップロードは20MB以内です． <br>

<form id="upload-form">
  <p>
    <label>パスワード</label><br>
    <input type="password" name="password" required>
  </p>

  <p>
    <label>ファイル</label><br>
    <input type="file" name="file" required>
  </p>

  <p>
    <button type="submit">Upload</button>
  </p>
</form>

<p id="upload-message"></p>

<script>
document.getElementById("upload-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const message = document.getElementById("upload-message");
  const formData = new FormData(form);

  message.textContent = "アップロード中...";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      message.textContent = "アップロード完了しました．";
      alert("アップロード完了しました．");
      form.reset();
    } else {
      const text = await response.text();
      message.textContent = "アップロード失敗: " + text;
      alert("アップロード失敗: " + text);
    }
  } catch (error) {
    message.textContent = "通信エラーが発生しました．";
    alert("通信エラーが発生しました．");
  }
});
</script>

## その他
一応，このページはユーザ名とパスワードを求めるようにしている．動的サイトではないので，SQLインジェクションやXSSの類の脅威の心配はしていないが，脆弱性があれば対策する予定．まあ，個人情報とかクレカ情報とかを扱うわけではないのでクラックされても何ら問題ない．

ユーザ名は**カバネリのあの子**，パスワードは**調布店最後のPCのパスワード**と同じ．

GitHub上では普通に見れてしまう．これは対策のしようがない．