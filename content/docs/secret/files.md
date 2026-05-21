---
title: "ファイル置き場"
bookHidden: true
---

# ファイル置き場

[秘密に戻る](/docs/secret/)

## さらなる秘密を知るためのパスワード
<form id="upload-form">
  <p>
    <label>入力せよ</label><br>
    <input type="password" name="password" id="password" required>
  </p>

## アップロード
アップロードは20MB以内 <br>

  <p>
    <label>ファイル</label><br>
    <input type="file" name="file" required>
  </p>

  <p>
    <button type="submit">Upload</button>
  </p>
</form>

<p id="upload-message"></p>

<hr>

## アップロード済みファイル一覧(ダウンロード)

<button id="reload-files">一覧を更新</button>

<table id="file-table" border="1">
  <thead>
    <tr>
      <th>ファイル名</th>
      <th>サイズ</th>
      <th>アップロード日時</th>
      <th>ダウンロード</th>
      <th>削除</th>
    </tr>
  </thead>
  <tbody id="file-table-body"></tbody>
</table>

<script>
const passwordInput = document.getElementById("password");
const uploadForm = document.getElementById("upload-form");
const uploadMessage = document.getElementById("upload-message");
const fileTableBody = document.getElementById("file-table-body");

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

    // パスワードは消さず，ファイル選択だけ消す
    uploadForm.querySelector('input[type="file"]').value = "";

    await loadFiles();

  } catch (error) {
    uploadMessage.textContent = "通信エラーが発生しました: " + error.message;
    alert("通信エラーが発生しました: " + error.message);
  }
});

async function loadFiles() {
  fileTableBody.innerHTML =
    '<tr><td colspan="5">読み込み中...</td></tr>';

  const formData = new FormData();
  formData.append("password", passwordInput.value);

  try {
    const response = await fetch("/list-files", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      fileTableBody.innerHTML =
        '<tr><td colspan="5">一覧取得失敗: ' + text + '</td></tr>';
      return;
    }

    const files = await response.json();

    if (files.length === 0) {
      fileTableBody.innerHTML =
        '<tr><td colspan="5">ファイルはありません．</td></tr>';
      return;
    }

    fileTableBody.innerHTML = "";

    for (const file of files) {
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = file.name;

      const tdSize = document.createElement("td");
      tdSize.textContent = Math.round(file.size / 1024) + " KB";

      const tdDate = document.createElement("td");
      tdDate.textContent = new Date(file.uploaded).toLocaleString("ja-JP");

      const tdDownload = document.createElement("td");
      const downloadButton = document.createElement("button");
      downloadButton.textContent = "ダウンロード";
      downloadButton.addEventListener("click", function () {
        downloadFile(file.key, file.name);
      });
      tdDownload.appendChild(downloadButton);

      const tdDelete = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";
      deleteButton.addEventListener("click", function () {
        deleteFile(file.key);
      });
      tdDelete.appendChild(deleteButton);

      tr.appendChild(tdName);
      tr.appendChild(tdSize);
      tr.appendChild(tdDate);
      tr.appendChild(tdDownload);
      tr.appendChild(tdDelete);

      fileTableBody.appendChild(tr);
    }

  } catch (error) {
    fileTableBody.innerHTML =
      '<tr><td colspan="5">通信エラー: ' + error.message + '</td></tr>';
  }
}

async function downloadFile(key, name) {
  const formData = new FormData();
  formData.append("password", passwordInput.value);

  const response = await fetch("/download/" + encodeURI(key), {
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
}

async function deleteFile(key) {
  if (!confirm("削除しますか？")) {
    return;
  }

  const formData = new FormData();
  formData.append("password", passwordInput.value);

  const response = await fetch("/delete-file/" + encodeURI(key), {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    alert("削除失敗: " + text);
    return;
  }

  alert("削除しました．");
  await loadFiles();
}

document
  .getElementById("reload-files")
  .addEventListener("click", loadFiles);

</script>