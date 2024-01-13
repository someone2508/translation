const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchange = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

selectTag.forEach((tag, idx) => {
  // populate all the language as options in my select tag
  for (let lang_code in language) {
    let selected =
      idx == 0
        ? lang_code == "en-GB"
          ? "selected"
          : ""
        : lang_code == "hi-IN"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${lang_code}">${language[lang_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

exchange.addEventListener("click", () => {
  let leftText = fromText.value;
  let leftLang = selectTag[0].value;

  fromText.value = toText.value;
  selectTag[0].value = selectTag[1].value;

  toText.value = leftText;
  selectTag[1].value = leftLang;
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      // its the copy icon for sure!
      if (target.id == "from") {
        // from wala copy icon
        navigator.clipboard.writeText(fromText.value);
      } else {
        // to wala copy icon
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        // from wala volume icon
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        // to wala volume icon]
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }

      speechSynthesis.speak(utterance);
    }
  });
});
