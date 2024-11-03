const express = require('express');
const { create } = require('express-handlebars');
const app = express();

// Set up Handlebars as the template engine
const hbs = create({ extname: '.hbs', defaultLayout: 'main' });
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Helper function for validation
const validateFormData = (username, password) => {
    const usernameRegex = /^[a-zA-Z]{5}$/;
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
    return null;
};

// Route to display the form
app.get('/', (req, res) => {
    res.render('form', { error: null, username: '' });
});

// Route to handle form submission via POST
app.post('/submit', (req, res) => {
    const { username, password } = req.body;

    const validationError = validateFormData(username, password);

    if (validationError) {
        // If validation fails, render the form with error and previously entered values
        return res.render('form', { error: validationError, username });
    }

    // If validation passes, redirect to the success page with the username
    res.redirect(`/success?username=${encodeURIComponent(username)}`);
});

// Route to display the success page without the form
app.get('/success', (req, res) => {
    const username = req.query.username;
    res.render('success', { username });
});

// Start the server
const PORT = process.env.PORT || 7580;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
