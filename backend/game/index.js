const express = require('express');
const app = express();

app.use(express.json());
require('./games/questions')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));
