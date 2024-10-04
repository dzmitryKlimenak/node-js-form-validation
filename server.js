const express = require('express');
const app = express();

// Setting up middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));

// Route to display the form
app.get('/', (req, res) => {
    res.send(`
        <h1>User Login</h1>
        <form method="GET" action="/submit">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" value="${req.query.username || ''}" required><br><br>
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            <button type="submit">Submit</button>
            ${req.query.error ? `<p style="color:red;">${req.query.error}</p>` : ''}
        </form>
    `);
});

// Helper function for validation
const validateFormData = (username, password) => {
    // Username: required, only Latin characters, exactly 5 characters
    const usernameRegex = /^[a-zA-Z]{5}$/;

    // Password: required, only digits, exactly 6 characters
    const passwordRegex = /^[0-9]{6}$/;

    if (!username || !password) {
        return 'Both fields are required.';
    }

    if (!usernameRegex.test(username)) {
        return 'Username must be exactly 5 Latin letters (a-z, A-Z).';
    }

    if (!passwordRegex.test(password)) {
        return 'Password must be exactly 6 digits (0-9).';
    }

    return null; // No validation errors
};

// Route to handle form submission
app.get('/submit', (req, res) => {
    const { username, password } = req.query;

    // Validate form data
    const validationError = validateFormData(username, password);

    if (validationError) {
        // If validation fails, redirect back with the error message and prefilled values
        return res.redirect(`/?error=${encodeURIComponent(validationError)}&username=${encodeURIComponent(username)}`);
    }

    // If validation passes, show the submitted data
    res.send(`
        <h1>Form Submission Successful</h1>
        <p>Username: ${username}</p>
        <p>Password: ${password}</p> <!-- Do not display password in real apps -->
    `);
});

// Start the server
const PORT = process.env.PORT || 7522;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});