---
title: "つぶやき投稿"
bookHidden: true
---

# つぶやき投稿

<p>
  <label>パスワード</label><br>
  <input type="password" id="password" required>
</p>

<p>
  <label>本文</label><br>
  <textarea id="message" maxlength="280" rows="5" style="width: 100%;"></textarea>
</p>

<p id="char-count">0 / 280</p>

<p>
  <label>画像</label><br>
  <input type="file" id="image" accept="image/*">
</p>

<button id="post-button">投稿</button>

<p id="post-result"></p>

<script>
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("message");
const imageInput = document.getElementById("image");
const postButton = document.getElementById("post-button");
const postResult = document.getElementById("post-result");
const charCount = document.getElementById("char-count");

messageInput.addEventListener("input", function () {
  charCount.textContent = messageInput.value.length + " / 280";
});

postButton.addEventListener("click", async function () {
  const formData = new FormData();

  formData.append("password", passwordInput.value);
  formData.append("text", messageInput.value);

  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  }

  postResult.textContent = "投稿中...";

  const response = await fetch("/post-message", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    postResult.textContent = "投稿失敗: " + text;
    return;
  }

  postResult.textContent = "投稿しました。";
  messageInput.value = "";
  imageInput.value = "";
  charCount.textContent = "0 / 280";
});
</script>