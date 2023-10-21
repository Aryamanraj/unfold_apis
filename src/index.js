const express = require('express');
const cors = require('cors');  // Import cors module
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');
const app = express();
const nftRoutes = require('./routes/nftroutes'); // Adjust the path as needed

app.use(cors());  // Enable All CORS Requests
app.use(express.json()); // Middleware to parse JSON requests
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/nft', nftRoutes); // Use the nft routes for any requests under the /nft path

const PORT = process.env.PORT || 3225;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
