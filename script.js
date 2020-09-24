/**
 * Show loading spinner and hide the quote container
 */
const showLoadingSpinner = () => {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

/**
 * Hide loading spinner and display the quote container
 */
const hideLoadingSpinner = () => {
  if (!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

let retryCount = 0; // to keep a track of quote fetch retries

/**
 * Fetch a quote from public API
 */
async function getQuote() {
  showLoadingSpinner();
  const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Used to bypass the CORS issue // works intermittently in which case there's a fallback quote
  const apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

  try {
    const response = await fetch(`${proxyUrl}${apiUrl}`);
    const data = await response.json();
    displayQuoteInUI(data);
    hideLoadingSpinner();
  } catch (error) {
    console.log('Whoops! No Quote', error);
    hideLoadingSpinner();
    // fallback if it does not even fetch on 10 tries
    if (retryCount === 5) {
      displayQuoteInUI({
        quoteText: "One secret of success in life is for a man to be ready for his opportunity when it comes",
        quoteAuthor: "Benjamin Disraeli"
      });
      retryCount = 0;
    } else {
      retryCount += 1;
      getQuote();
    }
  }
}

/**
 * Display the quote in the UI
 * @param {*} data received data
 */
function displayQuoteInUI(data) {
  if (data.quoteText.length > 50) {
    quoteText.classList.add('long-quote');
  } else {
    quoteText.classList.remove('long-quote');
  }
  quoteText.innerHTML = data.quoteText;
  authorText.innerText = data.quoteAuthor || "Unknown";
}

/**
 * Send the quote to twitter API
 */
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`
  window.open(twitterUrl, '_blank');
}

const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const quoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
// Get a quote on load
getQuote();
// Tweet quote on twitter button click
quoteBtn.addEventListener('click', getQuote);
// Get new quote on button click
twitterBtn.addEventListener('click', tweetQuote);
