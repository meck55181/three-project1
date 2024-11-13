const symbolsContainer = document.getElementById('symbols-container');
const userInput = document.getElementById('userInput');
const leftContainer = document.querySelector('.left'); // Left container for padding limit
let typedText = ''; // Keep track of typed text
const generatedSymbols = []; // Store symbols for each typed character

// Array of symbols to choose from
const symbols = ['$', ')', '*', '&', '@', '#', '^', '(', '!', '%', '0', '1', '(', ')', '+'];

// Function to generate a random symbol
function generateRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Event listener for typing in the textarea
userInput.addEventListener('input', () => {
    const previousLength = typedText.length;
    typedText = userInput.value;

    // Update rotation speed or stop rotation based on character count
    if (typedText.length >= maxCharacters) {
        rotationSpeed = 0; // Stop rotation
        overlayImage.style.display = 'block'; // Show overlay image
    } else {
        rotationSpeed = 0.01 + typedText.length * 0.006; // Adjust speed based on text length
        overlayImage.style.display = 'none'; // Hide overlay image if below character limit
    }

    // Generate symbols only for newly typed characters
    if (typedText.length > previousLength) {
        for (let i = previousLength; i < typedText.length; i++) {
            generatedSymbols.push(generateRandomSymbol()); // Add a new random symbol
            
            // Insert newline every 8 symbols instead of 15
            if (generatedSymbols.length % 18 === 0) {
                generatedSymbols.push('\n');
            }
        }
    } else if (typedText.length < previousLength) {
        // Remove symbols if characters are deleted
        generatedSymbols.splice(typedText.length);
    }

    // Display the generated symbols with newlines
    symbolsContainer.textContent = generatedSymbols.join(''); // Added space between symbols
});