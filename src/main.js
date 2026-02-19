import "./style.css";
import { generate } from "./generator";
document.addEventListener("DOMContentLoaded", () => {
    const unitType = document.getElementById("unit-type");
    const quantity = document.getElementById("quantity");
    const generateBtn = document.getElementById("generate-btn");
    const output = document.getElementById("output");
    const copyBtnTop = document.getElementById("copy-btn-top");
    const copyBtnBottom = document.getElementById("copy-btn-bottom");
    let currentText = "";
    function renderOutput(text, type) {
        output.innerHTML = "";
        if (type === "paragraphs") {
            const paragraphs = text.split("\n\n");
            for (const p of paragraphs) {
                const el = document.createElement("p");
                el.textContent = p;
                output.appendChild(el);
            }
        }
        else {
            const el = document.createElement("p");
            el.textContent = text;
            output.appendChild(el);
        }
    }
    function showCopyButtons() {
        copyBtnTop.classList.remove("hidden");
        copyBtnBottom.classList.remove("hidden");
    }
    async function copyToClipboard() {
        if (!currentText)
            return;
        try {
            await navigator.clipboard.writeText(currentText);
            showCopiedFeedback();
        }
        catch {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");
            textarea.value = currentText;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            showCopiedFeedback();
        }
    }
    function showCopiedFeedback() {
        const buttons = [copyBtnTop, copyBtnBottom];
        for (const btn of buttons) {
            btn.textContent = "Copied!";
        }
        setTimeout(() => {
            for (const btn of buttons) {
                btn.textContent = "Copy to Clipboard";
            }
        }, 2000);
    }
    generateBtn.addEventListener("click", () => {
        const type = unitType.value;
        const count = parseInt(quantity.value, 10) || 1;
        currentText = generate(type, count);
        renderOutput(currentText, type);
        showCopyButtons();
    });
    copyBtnTop.addEventListener("click", copyToClipboard);
    copyBtnBottom.addEventListener("click", copyToClipboard);
});
