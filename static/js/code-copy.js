document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".copy-code-button");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const wrapper = button.closest(".code-block-wrapper");
      if (!wrapper) return;

      const codeElement = wrapper.querySelector("pre code");
      if (!codeElement) return;

      const codeText = codeElement.innerText;

      try {
        await navigator.clipboard.writeText(codeText);
        const originalText = button.textContent;
        button.textContent = "コピー済み";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      } catch (error) {
        console.error("コピーに失敗:", error);
        button.textContent = "失敗";
        setTimeout(() => {
          button.textContent = "コピー";
        }, 1500);
      }
    });
  });
});
