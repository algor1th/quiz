const express = require('express');
const app = express();

app.use(express.json());
require('./games/questions')(app);
require('./games/answers')(app);
require('./games/games')(app);
require('./games/rounds')(app);
require('./authenticationAPI')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen on port ${port}...`));
