const wordLength = 5;
const rounds = 6;
const letters = document.querySelectorAll(".scoreboard-letter");
const loading = document.querySelector(".loading");

// async function to initialize and call the API
async function init() {
  // initial state of the game
  let currentRow = 0;
  let currentGuess = "";
  let done = false;
  let isLoading = true;
  setLoading(isLoading);

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const { word: wordRes } = await res.json();
  const word = wordRes.toUpperCase();
  const wordParts = word.split("");

  isLoading = false;
  setLoading(isLoading);

  function addLetter(letter) {
    if (currentGuess.length < wordLength) {
      currentGuess += letter;
      letters[currentRow * wordLength + currentGuess.length - 1].textContent =
        letter.toUpperCase();
    } else {
      currentGuess = currentGuess.substring(0, wordLength);
      letters[currentRow * wordLength + currentGuess.length - 1].textContent =
        letter.toUpperCase();
    }
  }

  // removing a letter by taking part of string (currentGuess) and attributing
  // by itself; assign the letter's position with blank string
  function removeLetter() {
    if (currentGuess.length > 0) {
      letters[currentRow * wordLength + currentGuess.length - 1].textContent =
        "";
      currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    }
  }

  async function commit() {
    isLoading = true;
    setLoading(isLoading);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "post",
      body: JSON.stringify({ word: currentGuess }),
    });
    const { validWord: validate } = await res.json();
    isLoading = false;
    setLoading(isLoading);

    if (!validate) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.toUpperCase().split("");
    const wordMap = makeMap(wordParts);
    // let isRight = true;

    // verify if the letter is correct (same letter and position)
    // close (different position) or wrong
    for (let i = 0; i < wordLength; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * wordLength + i].classList.add("correct");
        wordMap[guessParts[i]]--;
      } else if (wordMap[guessParts[i]] > 0) {
        letters[currentRow * wordLength + i].classList.add("close");
        wordMap[guessParts[i]]--;
      } else {
        letters[currentRow * wordLength + i].classList.add("wrong");
      }
    }

    currentRow++;
    currentGuess = "";
  }

  function markInvalidWord() {
    for (let i = 0; i < wordLength; i++) {
      letters[currentRow * wordLength + i].classList.remove("invalid");
      // long enough for the browser to repaint without the "invalid class" so we can then add it again
      setTimeout(
        () => letters[currentRow * wordLength + i].classList.add("invalid"),
        10
      );
    }
  }

  document.addEventListener("keydown", ({ key }) => {
    if (key === "Backspace") {
      removeLetter();
    } else if (key === "Enter") {
      if (currentGuess.length === wordLength) commit();
    } else if (isLetter(key)) {
      addLetter(key);
    }
  });
}

// function with regular expression (regex) to just accept
// one letter character
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// toggle the class 'hidden' to show/hide the loading txt
function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
}

// function to count the number of times a letter appears in an array
// and return an object with the letter as the key and the count as the value
function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

init();
