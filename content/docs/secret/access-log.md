---
title: "アクセスログ管理"
bookHidden: true
---

# アクセスログ管理

[秘密に戻る](/docs/secret/)

## さらなる秘密を知るためのパスワード

<p>
  <label>入力せよ</label><br>
  <input type="password" id="password" required>
</p>

<button id="reload-logs">ログを更新</button>

<p id="access-count"></p>


## アクセス数グラフ
<canvas id="daily-access-chart" width="800" height="300"></canvas>

## アクセスページランキング
<table border="1">
  <thead>
    <tr>
      <th>順位</th>
      <th>ページ</th>
      <th>アクセス数</th>
    </tr>
  </thead>
  <tbody id="page-ranking-body"></tbody>
</table>

## ログ一覧
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

    const result = await response.json();
    renderDailyChart(result.logs);
    renderPageRanking(result.logs);

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

function renderDailyChart(logs) {
  const counts = {};

  for (const log of logs) {
    const date = new Date(log.time);
    const key = date.toLocaleDateString("ja-JP");
    counts[key] = (counts[key] || 0) + 1;
  }

  const labels = Object.keys(counts).reverse();
  const values = labels.map((label) => counts[label]);

  const canvas = document.getElementById("daily-access-chart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (labels.length === 0) {
    ctx.fillText("データがありません", 20, 30);
    return;
  }

  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  const maxValue = Math.max(...values);

  const barWidth = chartWidth / labels.length * 0.7;
  const gap = chartWidth / labels.length * 0.3;

  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  for (let i = 0; i < labels.length; i++) {
    const barHeight = values[i] / maxValue * chartHeight;
    const x = padding + i * (barWidth + gap) + gap / 2;
    const y = canvas.height - padding - barHeight;

    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillText(values[i], x, y - 5);
    ctx.save();
    ctx.translate(x, canvas.height - padding + 15);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  }
}

function renderPageRanking(logs) {
  const counts = {};

  for (const log of logs) {
    const path = log.path || "/";
    counts[path] = (counts[path] || 0) + 1;
  }

  const ranking = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  const tbody = document.getElementById("page-ranking-body");
  tbody.innerHTML = "";

  if (ranking.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3">データがありません．</td></tr>';
    return;
  }

  ranking.forEach(([path, count], index) => {
    const tr = document.createElement("tr");

    const tdRank = document.createElement("td");
    tdRank.textContent = index + 1;

    const tdPath = document.createElement("td");
    tdPath.textContent = path;

    const tdCount = document.createElement("td");
    tdCount.textContent = count;

    tr.appendChild(tdRank);
    tr.appendChild(tdPath);
    tr.appendChild(tdCount);

    tbody.appendChild(tr);
  });
}

document
  .getElementById("reload-logs")
  .addEventListener("click", loadAccessLogs);
</script>