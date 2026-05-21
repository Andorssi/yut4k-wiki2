---
title: "アクセスログ管理"
bookHidden: true
---

# アクセスログ管理

[秘密に戻る](/docs/secret/_index/)

## パスワード

<p>
  <label>入力せよ</label><br>
  <input type="password" id="password" required>
</p>

<button id="reload-logs">ログを更新</button>

<p id="access-count"></p>

<table border="1">
  <thead>
    <tr>
      <th>日時</th>
      <th>ページ</th>
      <th>操作</th>
      <th>IP</th>
      <th>国</th>
    </tr>
  </thead>
  <tbody id="access-log-body"></tbody>
</table>

<script>
const passwordInput =
  document.getElementById("password");

async function loadAccessLogs() {
  const logBody =
    document.getElementById("access-log-body");

  const count =
    document.getElementById("access-count");

  logBody.innerHTML =
    '<tr><td colspan="5">読み込み中...</td></tr>';

  const formData =
    new FormData();

  formData.append(
    "password",
    passwordInput.value
  );

  try {
    const response =
      await fetch("/list-access-logs", {
        method: "POST",
        body: formData,
      });

    if (!response.ok) {
      const text =
        await response.text();

      logBody.innerHTML =
        '<tr><td colspan="5">ログ取得失敗: ' +
        text +
        '</td></tr>';

      return;
    }

    const result =
      await response.json();

    count.textContent =
      "総アクセスログ数: " +
      result.total;

    if (result.logs.length === 0) {
      logBody.innerHTML =
        '<tr><td colspan="5">ログはありません．</td></tr>';
      return;
    }

    logBody.innerHTML = "";

    for (const log of result.logs) {
      const tr =
        document.createElement("tr");

      const tdTime =
        document.createElement("td");
      tdTime.textContent =
        new Date(log.time)
          .toLocaleString("ja-JP");

      const tdPath =
        document.createElement("td");
      tdPath.textContent =
        log.path;

      const tdAction =
        document.createElement("td");
      tdAction.textContent =
        log.action;

      const tdIp =
        document.createElement("td");
      tdIp.textContent =
        log.ip;

      const tdCountry =
        document.createElement("td");
      tdCountry.textContent =
        log.country;

      tr.appendChild(tdTime);
      tr.appendChild(tdPath);
      tr.appendChild(tdAction);
      tr.appendChild(tdIp);
      tr.appendChild(tdCountry);

      logBody.appendChild(tr);
    }
  } catch (error) {
    logBody.innerHTML =
      '<tr><td colspan="5">通信エラー: ' +
      error.message +
      '</td></tr>';
  }
}

document
  .getElementById("reload-logs")
  .addEventListener("click", loadAccessLogs);
</script>