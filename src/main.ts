import "./style.css";
import { generate, type ScientificMode } from "./generator";

type UnitType = "paragraphs" | "sentences" | "words";

const VALID_TYPES: UnitType[] = ["paragraphs", "sentences", "words"];
const VALID_SCIENTIFIC: ScientificMode[] = ["include", "exclude", "only"];

function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function updateUrl(type: UnitType, count: number, scientific: ScientificMode) {
  const params = new URLSearchParams();
  params.set("type", type);
  params.set("count", String(count));
  params.set("scientific", scientific);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  const unitType = document.getElementById("unit-type") as HTMLSelectElement;
  const quantity = document.getElementById("quantity") as HTMLInputElement;
  const generateBtn = document.getElementById(
    "generate-btn"
  ) as HTMLButtonElement;
  const output = document.getElementById("output") as HTMLDivElement;
  const copyBtnTop = document.getElementById(
    "copy-btn-top"
  ) as HTMLButtonElement;
  const copyBtnBottom = document.getElementById(
    "copy-btn-bottom"
  ) as HTMLButtonElement;

  let currentText = "";

  // Read URL params and apply to form controls
  const params = getSearchParams();
  const paramType = params.get("type") as UnitType | null;
  const paramCount = params.get("count");
  const paramScientific = params.get("scientific") as ScientificMode | null;

  if (paramType && VALID_TYPES.includes(paramType)) {
    unitType.value = paramType;
  }

  if (paramCount) {
    const parsed = parseInt(paramCount, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 99) {
      quantity.value = String(parsed);
    }
  }

  if (paramScientific && VALID_SCIENTIFIC.includes(paramScientific)) {
    const radio = document.querySelector(
      `input[name="scientific-mode"][value="${paramScientific}"]`
    ) as HTMLInputElement | null;
    if (radio) radio.checked = true;
  }

  function renderOutput(text: string, type: UnitType) {
    output.innerHTML = "";

    if (type === "paragraphs") {
      const paragraphs = text.split("\n\n");
      for (const p of paragraphs) {
        const el = document.createElement("p");
        el.textContent = p;
        output.appendChild(el);
      }
    } else {
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
    if (!currentText) return;

    try {
      await navigator.clipboard.writeText(currentText);
      showCopiedFeedback();
    } catch {
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

  function doGenerate() {
    const type = unitType.value as UnitType;
    const count = parseInt(quantity.value, 10) || 1;
    const scientificMode = (
      document.querySelector(
        'input[name="scientific-mode"]:checked'
      ) as HTMLInputElement
    )?.value as ScientificMode ?? "include";
    updateUrl(type, count, scientificMode);
    currentText = generate(type, count, scientificMode);
    renderOutput(currentText, type);
    showCopyButtons();
  }

  generateBtn.addEventListener("click", doGenerate);

  // Auto-generate if any URL params were provided
  if (params.has("type") || params.has("count") || params.has("scientific")) {
    doGenerate();
  }

  copyBtnTop.addEventListener("click", copyToClipboard);
  copyBtnBottom.addEventListener("click", copyToClipboard);
});
