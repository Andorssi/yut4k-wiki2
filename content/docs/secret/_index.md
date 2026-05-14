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
    <input type="password" name="password" id="password" required>
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

### アップロード済みファイル

<button id="reload-files">一覧を更新</button>

<ul id="file-list"></ul>

<script>
const passwordInput = document.getElementById("password");
const uploadForm = document.getElementById("upload-form");
const uploadMessage = document.getElementById("upload-message");
const fileList = document.getElementById("file-list");

uploadForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  uploadMessage.textContent = "アップロード中...";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      uploadMessage.textContent = "アップロード失敗: " + text;
      alert("アップロード失敗: " + text);
      return;
    }

    uploadMessage.textContent = "アップロード完了しました．";
    alert("アップロード完了しました．");

    uploadForm.reset();
    fileList.innerHTML = "";
  } catch (error) {
    uploadMessage.textContent = "通信エラーが発生しました．";
    alert("通信エラーが発生しました．");
  }
});

async function loadFiles() {
  fileList.innerHTML = "<li>読み込み中...</li>";

  const formData = new FormData();
  formData.append("password", passwordInput.value);

  try {
    const response = await fetch("/list-files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      fileList.innerHTML = "<li>一覧取得失敗: " + text + "</li>";
      return;
    }

    const files = await response.json();

    if (files.length === 0) {
      fileList.innerHTML = "<li>ファイルはありません．</li>";
      return;
    }

    fileList.innerHTML = "";

    for (const file of files) {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent =
        file.name + " (" + Math.round(file.size / 1024) + " KB) ";

      const button = document.createElement("button");
      button.textContent = "ダウンロード";
      button.addEventListener("click", function () {
        downloadFile(file.key, file.name);
      });

      li.appendChild(span);
      li.appendChild(button);
      fileList.appendChild(li);
    }
  } catch (error) {
    fileList.innerHTML = "<li>通信エラーが発生しました．</li>";
  }
}

async function downloadFile(key, name) {
  const formData = new FormData();
  formData.append("password", passwordInput.value);

  try {
    const response = await fetch("/download/" + key, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      alert("ダウンロード失敗: " + text);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    alert("通信エラーが発生しました．");
  }
}

document
  .getElementById("reload-files")
  .addEventListener("click", loadFiles);
</script>

## その他
一応，このページはユーザ名とパスワードを求めるようにしている．動的サイトではないので，SQLインジェクションやXSSの類の脅威の心配はしていないが，脆弱性があれば対策する予定．まあ，個人情報とかクレカ情報とかを扱うわけではないのでクラックされても何ら問題ない．

ユーザ名は**カバネリのあの子**，パスワードは**調布店最後のPCのパスワード**と同じ．

GitHub上では普通に見れてしまう．これは対策のしようがない．