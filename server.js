const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const models = require("./models");


app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({message:"hello codecure!"});
});

app.post('/posttest', (req, res) => {
    const name = req.body.name;
    return res.json({message:`${name}님 반갑습니다!`});
});

app.post('/signup', (req, res) => {
    models.user.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(foundData => {
        if(foundData){
            console.log("원래 아이디 있음");
            return res.sendStatus(409);
        } else {
            try {
                models.user.create({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                })
                .then(user => {
                    return res.sendStatus(200);
                })
            } catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        }
    })
});



app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});