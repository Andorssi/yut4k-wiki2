---
title: "管理人のつぶやき"
weight: 70
---

# つぶやき

## 管理人が1日1回はつぶやけたらいいなと思います．

<div id="timeline">読み込み中...</div>

<script>
async function loadMessages() {
  const timeline = document.getElementById("timeline");

  try {
    const response = await fetch("/list-message");

    if (!response.ok) {
      const text = await response.text();
      timeline.textContent =
        "読み込みに失敗しました: status=" +
        response.status +
        " / " +
        text;
      return;
    }

    const messages = await response.json();

    if (!Array.isArray(messages)) {
      timeline.textContent = "読み込みに失敗しました: JSONが配列ではありません。";
      return;
    }

    if (messages.length === 0) {
      timeline.textContent = "まだ投稿はありません。";
      return;
    }

    timeline.innerHTML = "";

    for (const msg of messages) {
      const article = document.createElement("article");

      article.style.border = "1px solid #ccc";
      article.style.borderRadius = "8px";
      article.style.padding = "1rem";
      article.style.marginBottom = "1rem";

      const time = document.createElement("p");
      time.textContent = msg.createdAt
        ? new Date(msg.createdAt).toLocaleString("ja-JP")
        : "日時なし";
      time.style.fontSize = "0.9rem";
      time.style.opacity = "0.7";

      article.appendChild(time);

      if (msg.text) {
        const text = document.createElement("p");
        text.textContent = msg.text;
        text.style.whiteSpace = "pre-wrap";
        article.appendChild(text);
      }

      if (msg.imageUrl) {
        const img = document.createElement("img");
        img.src = msg.imageUrl;
        img.alt = "投稿画像";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        img.style.marginTop = "0.5rem";
        article.appendChild(img);
      }

      timeline.appendChild(article);
    }
  } catch (error) {
    timeline.textContent =
      "読み込みに失敗しました: " + error.message;
  }
}

loadMessages();

</script>