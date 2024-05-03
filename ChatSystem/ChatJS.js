/*
    -JavaScript Code for Chat System-
            -Josh Want-
            -Comp1004-
*/

// Initialize variables
let isLoggedIn = false;
let username = "";
let recipientName = "user2";
let messages = [];

// Get DOM elements
const loginForm = document.getElementById("login-form");
const usernameDisplay = document.getElementById("username");
const chatbox = document.getElementById("chatbox");


// Check if user is already logged in
if (localStorage.getItem("isLoggedIn")) {
    // Set username display
    if (localStorage.getItem("username")) {
        usernameDisplay.textContent = localStorage.getItem("username");
        // Set username variable
        username = localStorage.getItem("username");
        // Update recipient name
        recipientName = username === "user1" ? "user2" : "user1";
    }
    // Set logged in flag
    isLoggedIn = true;
    // Hide login form
    loginForm.classList.add("hidden");
} else {
    // Show login form
    loginForm.classList.remove("hidden");
    // Hide chat box
    chatbox.classList.add("hidden");
}

// Function to check if user is logged in
function checkLogin() {
    // If logged in disable messagebar and submit msg button
    document.getElementById("messagebar").disabled = !isLoggedIn;
    document.getElementById("submit-msg").disabled = !isLoggedIn;
    // If logged in hide chat box
    chatbox.classList.toggle("hidden", !isLoggedIn);

    // Update recipient name
    recipientName = isLoggedIn ? (username === "user1" ? "user2" : "user1") : "";
    // Display recipient name
    usernameDisplay.textContent = recipientName;
    // Display username
    document.getElementById("loggedin-username").textContent = username;
}


// Retrieve username from local storage
if (localStorage.getItem("isLoggedIn") && localStorage.getItem("username")) {
    isLoggedIn = true;
    username = localStorage.getItem("username");
    // Call checkLogin function
    checkLogin();
}


// Clear chat messages function
function clearChat() {
    // Clear messages array and chat box contents
    messages = [];
    chatbox.innerHTML = "";
    // Removes messages from local storage
    localStorage.removeItem("messages");
}
// Add event listener for clear chat button click
document.getElementById("clear-chat").addEventListener("click", (event) => {
    // Prevent default button click behavior
    event.preventDefault();
    clearChat();
});

// Load messages from local storage
if (localStorage.getItem("messages")) {
    messages = JSON.parse(localStorage.getItem("messages"));
    // Display messages in chatbox
    for (let i = 0; i < messages.length; i++) {
        // Determine if message is sent or received based on sender name matching the current user's username
        const messageClass = messages[i].sender === username ? "sent" : "received";
        // Determine who message was sent by
        const nameClass = messageClass === "sent" ? "your-name" : "other-name";
        // Creates an HTML string for a new chat message to be added to the chatbox
        const newMessage = `
            <div class="message ${messageClass}">
                <div class="chat-names ${nameClass}">${messages[i].sender}</div>
                <div class="text-bubble ${messageClass === "sent" ? "bubble-out" : "bubble-in"}">${messages[i].text}</div>
            </div>
        `;
        chatbox.insertAdjacentHTML("beforeend", newMessage);
    }
    // Scrolls to bottom of chat box
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Set of hardcoded username and password
const usernames = ["user1", "user2"];
const passwords = ["password1", "password2"];

// Add event listener for login form submission
loginForm.addEventListener("submit", (event) => {
    // Prevent default form submission
    event.preventDefault();

    // Get username and password inputs
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");

    // Check if username and password are correct
    const index = usernames.indexOf(usernameInput.value);
    if (index !== -1 && passwords[index] === passwordInput.value) {
        // Set username
        username = usernameInput.value;
        // Hide login form
        loginForm.classList.add("hidden");
        // Set logged in true
        isLoggedIn = true;

        // Save login state to local storage in try-Catch incase an error occurs then will catch and output to console
        try {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("username", username);
            location.reload();
        } catch (e) {
            console.error("Error accessing local storage: ", e);
        }

        checkLogin();
    } else {
        // Display error message
        alert("Invalid username or password!");
    }
});

// Send message function
function sendMessage() {
    const message = document.getElementById("messagebar").value;
    // Checks message is not empty
    if (message !== "") {
        // Sets mesasgeClass and nameClass
        const messageClass = "sent";
        const nameClass = "your-name";
        // Creates new message object with current user and users message
        const newMessage = {
            sender: username,
            text: message
        };
        // Adds newMessage to messages array
        messages.push(newMessage);
        // Creates HTML string for new message using variables and is used to display the new message in chat box
        const newMessageHTML = `
            <div class="message ${messageClass}">
                <div class="chat-names ${nameClass}">${username}</div>
                <div class="text-bubble ${messageClass === "sent" ? "bubble-out" : "bubble-in"}">${message}</div>
            </div>
        `;
        chatbox.insertAdjacentHTML("beforeend", newMessageHTML);
        chatbox.scrollTop = chatbox.scrollHeight;
        document.getElementById("messagebar").value = "";
        // Store messages to local storage
        localStorage.setItem("messages", JSON.stringify(messages));
    }
}

// Add event listener for send message button
document.getElementById("submit-msg").addEventListener("click", (event) => {
    event.preventDefault();
    sendMessage();
});

// Get logout button element
const logoutButton = document.getElementById("logout-button");

// Add event listener for logout button click
logoutButton.addEventListener("click", (event) => {
    // Prevent default button click behavior
    event.preventDefault();
    // Clear local storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    // Update logged in flag and username
    isLoggedIn = false;
    username = "";
    // Show login form and hide chat box
    loginForm.classList.remove("hidden");
    chatbox.classList.add("hidden");
    // Clear username display
    usernameDisplay.textContent = "";
    // Check login status
    checkLogin();
});

// Check login status on page load
checkLogin();

