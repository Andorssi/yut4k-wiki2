---
title: "つぶやき"
---

# つぶやき

<div id="timeline"></div>

<script>
async function loadMessages() {
  const timeline = document.getElementById("timeline");

  timeline.textContent = "読み込み中...";

  const response = await fetch("/list-messages");

  if (!response.ok) {
    timeline.textContent = "読み込みに失敗しました。";
    return;
  }

  const messages = await response.json();

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
    time.textContent = new Date(msg.createdAt).toLocaleString("ja-JP");
    time.style.fontSize = "0.9rem";
    time.style.opacity = "0.7";

    const text = document.createElement("p");
    text.textContent = msg.text || "";
    text.style.whiteSpace = "pre-wrap";

    article.appendChild(time);

    if (msg.text) {
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
}

loadMessages();
</script>