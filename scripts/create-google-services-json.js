const fs = require('fs');
const path = require('path');

// Access the secret from environment variables
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (googleServicesJson) {
    const filePath = path.join(__dirname, 'google-services.json');

    // Write the google-services.json content to the file
    fs.writeFileSync(filePath, googleServicesJson);
} else {
    console.error('Error: GOOGLE_SERVICES_JSON secret is missing!');
}
