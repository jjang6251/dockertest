const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({message:"hello jjang"});
})

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});