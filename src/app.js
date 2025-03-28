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

  function commit() {
    currentRow++;
    currentGuess = "";
  }

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

  document.addEventListener("keydown", ({ key }) => {
    if (key === "Backspace") {
      removeLetter();
    } else if (key === "Enter") {
      if (currentGuess.length === 5) commit();
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

// toggle the class 'show' to show/hide the loading txt
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
