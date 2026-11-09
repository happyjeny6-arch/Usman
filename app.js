const fields = {
  task: document.querySelector("#task"),
  context: document.querySelector("#context"),
  constraints: document.querySelector("#constraints"),
  checks: document.querySelector("#checks"),
};

const preview = document.querySelector("#preview");
const wordCount = document.querySelector("#word-count");
const copyButton = document.querySelector("#copy-button");
const status = document.querySelector("#status");

function linesFrom(value) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function makeBrief() {
  const sections = [];
  const task = fields.task.value.trim();
  const context = fields.context.value.trim();
  const constraints = linesFrom(fields.constraints.value);
  const checks = linesFrom(fields.checks.value);

  if (task) sections.push(`# Task\n${task}`);
  if (context) sections.push(`## Context\n${context}`);
  if (constraints.length) sections.push(`## Constraints\n${constraints.map((item) => `- ${item}`).join("\n")}`);
  if (checks.length) sections.push(`## Acceptance checks\n${checks.map((item) => `- [ ] ${item}`).join("\n")}`);

  return sections.join("\n\n");
}

function render() {
  const brief = makeBrief();
  preview.textContent = brief || "";
  if (!brief) {
    const empty = document.createElement("span");
    empty.className = "empty-preview";
    empty.textContent = "Your brief will take shape here.";
    preview.append(empty);
  }
  const words = brief.match(/\S+/g)?.length ?? 0;
  wordCount.textContent = `${words} ${words === 1 ? "WORD" : "WORDS"}`;
  copyButton.disabled = !brief;
  status.textContent = "";
}

Object.values(fields).forEach((field) => field.addEventListener("input", render));

document.querySelector("#example-button").addEventListener("click", () => {
  fields.task.value = "Add keyboard navigation to the command menu.";
  fields.context.value = "The menu is rendered by src/components/CommandMenu.tsx and is already searchable.";
  fields.constraints.value = "Keep the current visual design\nDo not add dependencies\nPreserve mouse interaction";
  fields.checks.value = "Arrow keys move through results\nEnter selects the highlighted result\nEscape closes the menu";
  render();
  fields.task.focus();
});

document.querySelector("#clear-button").addEventListener("click", () => {
  Object.values(fields).forEach((field) => { field.value = ""; });
  render();
  fields.task.focus();
});

copyButton.addEventListener("click", async () => {
  const brief = makeBrief();
  try {
    await navigator.clipboard.writeText(brief);
    status.textContent = "Brief copied.";
  } catch {
    const selection = document.createRange();
    selection.selectNodeContents(preview);
    const currentSelection = window.getSelection();
    currentSelection.removeAllRanges();
    currentSelection.addRange(selection);
    status.textContent = "Select and copy the highlighted brief.";
  }
});

render();