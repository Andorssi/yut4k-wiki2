---
title: "つぶやき投稿"
bookHidden: true
bookSearchExclude: true
---

# つぶやき投稿

[秘密に戻る](/docs/secret/)

## ツイート権限を得るにはパスワードを入力してください
<p>
  <label>入力せよ</label><br>
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

## 投稿一覧

<button id="reload-messages">一覧を更新</button>

<div id="message-list"></div>

<script>
document.addEventListener("DOMContentLoaded", function () {

  // 要素取得
  const passwordInput = document.getElementById("password");
  const messageInput = document.getElementById("message");
  const imageInput = document.getElementById("image");
  const postButton = document.getElementById("post-button");
  const postResult = document.getElementById("post-result");
  const charCount = document.getElementById("char-count");
  const messageList = document.getElementById("message-list");
  const reloadMessagesButton = document.getElementById("reload-messages");

  // 存在確認
  if (
    !passwordInput ||
    !messageInput ||
    !imageInput ||
    !postButton ||
    !postResult ||
    !charCount ||
    !messageList ||
    !reloadMessagesButton
  ) {
    alert("必要なHTML要素が見つかりません");
    return;
  }

  // 文字数
  messageInput.addEventListener(
    "input",
    function () {
      charCount.textContent =
        messageInput.value.length +
        " / 280";
    }
  );

  // ===== 投稿 =====

  postButton.addEventListener(
    "click",
    async function () {

      const formData =
        new FormData();

      formData.append(
        "password",
        passwordInput.value
      );

      formData.append(
        "text",
        messageInput.value
      );

      if (
        imageInput.files.length > 0
      ) {
        formData.append(
          "image",
          imageInput.files[0]
        );
      }

      postResult.textContent =
        "投稿中...";

      try {

        const response =
          await fetch(
            "/post-message",
            {
              method: "POST",
              body: formData,
            }
          );

        if (!response.ok) {

          const text =
            await response.text();

          postResult.textContent =
            "投稿失敗: status=" +
            response.status +
            " / " +
            text;

          return;
        }

        postResult.textContent =
          "投稿しました。";

        messageInput.value = "";

        imageInput.value = "";

        charCount.textContent =
          "0 / 280";

        await loadMessagesForAdmin();

      } catch (error) {

        postResult.textContent =
          "通信エラー: " +
          error.message;
      }
    }
  );

  // ===== 一覧読み込み =====

  async function loadMessagesForAdmin() {

    messageList.textContent =
      "読み込み中...";

    try {

      const response =
        await fetch(
          "/list-message"
        );

      if (!response.ok) {

        const text =
          await response.text();

        messageList.textContent =
          "読み込み失敗: status=" +
          response.status +
          " / " +
          text;

        return;
      }

      const messages =
        await response.json();

      if (
        !Array.isArray(messages)
      ) {

        messageList.textContent =
          "JSONが配列ではありません";

        return;
      }

      if (
        messages.length === 0
      ) {

        messageList.textContent =
          "投稿はありません。";

        return;
      }

      messageList.innerHTML = "";

      for (const msg of messages) {

        const article =
          document.createElement(
            "article"
          );

        article.style.border =
          "1px solid #ccc";

        article.style.borderRadius =
          "8px";

        article.style.padding =
          "1rem";

        article.style.marginBottom =
          "1rem";

        // 時刻

        const time =
          document.createElement(
            "p"
          );

        time.textContent =
          msg.createdAt
            ? new Date(
                msg.createdAt
              ).toLocaleString(
                "ja-JP"
              )
            : "日時なし";

        time.style.fontSize =
          "0.9rem";

        time.style.opacity =
          "0.7";

        article.appendChild(time);

        // 本文

        if (msg.text) {

          const text =
            document.createElement(
              "p"
            );

          text.textContent =
            msg.text;

          text.style.whiteSpace =
            "pre-wrap";

          article.appendChild(text);
        }

        // 画像

        if (msg.imageUrl) {

          const img =
            document.createElement(
              "img"
            );

          img.src =
            msg.imageUrl;

          img.alt =
            "投稿画像";

          img.style.maxWidth =
            "240px";

          img.style.display =
            "block";

          img.style.marginBottom =
            "0.5rem";

          img.style.borderRadius =
            "8px";

          article.appendChild(img);
        }

        // 削除ボタン

        const button =
          document.createElement(
            "button"
          );

        button.textContent =
          "削除";

        button.addEventListener(
          "click",
          function () {
            deleteMessage(
              msg.id
            );
          }
        );

        article.appendChild(button);

        messageList.appendChild(
          article
        );
      }

    } catch (error) {

      messageList.textContent =
        "通信エラー: " +
        error.message;
    }
  }

  // ===== 削除 =====

  async function deleteMessage(id) {

    if (
      !confirm(
        "この投稿を削除しますか？"
      )
    ) {
      return;
    }

    const formData =
      new FormData();

    formData.append(
      "password",
      passwordInput.value
    );

    formData.append(
      "id",
      id
    );

    try {

      const response =
        await fetch(
          "/delete-message",
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        const text =
          await response.text();

        alert(
          "削除失敗: " + text
        );

        return;
      }

      alert("削除しました。");

      await loadMessagesForAdmin();

    } catch (error) {

      alert(
        "通信エラー: " +
        error.message
      );
    }
  }

  // ===== 更新ボタン =====

  reloadMessagesButton.addEventListener(
    "click",
    loadMessagesForAdmin
  );

  // ===== 初回読み込み =====

  loadMessagesForAdmin();

});
</script>