const wordLength = 5;
const rounds = 6;
const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.loading');

// async function to initialize and call the API 
async function init() {
  // initial state of the game
  let currentRow = 0;
  let currentGuess = '';
  let done = false;
  let isLoading = true;


}

// function with regular expression (regex) to just accept
// one letter character
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// toggle the class 'show' to show/hide the loading txt
function setLoading(isLoading) {
  loading.classList.toggle("show", isLoading);
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