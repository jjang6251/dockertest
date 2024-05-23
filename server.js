const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const models = require("./models");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { where } = require("sequelize");

app.use(cors({
    allowedHeaders: ['access_token', 'Content-Type']
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function verifyToken (req, res, next) {
    const token = req.headers.access_token;

    if (!token) {
        return res.status(403).json({ message: 'NoToken W' });
    } else {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                // res.clearCookie('accessToken', { path: '/', expires: new Date(0) });
                return res.status(401).json({ message: 'TokenFail' });
            } else {
                req.headers.username = decoded.username;
                // req.headers.username = decoded.name;
                next();
            }
        });
    }
}

app.get('/', (req, res) => {
    res.json({ message: "hello codecure!!" });
});

app.post('/posttest', (req, res) => {
    const name = req.body.name;
    return res.json({ message: `${name}님 반갑습니다!` });
});

app.post('/signup', (req, res) => {
    models.user.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(foundData => {
            if (foundData) {
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


app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    models.user.findOne({
        where: {
            username: username
        }
    })
        .then(findData => {
            if (findData) {
                if (findData.password == password) {
                    const accessToken = jwt.sign({
                        username: findData.username,
                    }, "secret", {
                        expiresIn: '3d',
                        issuer: "About tech",
                    });
                    return res.status(200).json({ access_token: accessToken })
                }
            } else {
                return res.sendStatus(404)
            }
        })
});

app.get('/checkuser', verifyToken, (req, res) => {
    return res.status(200).json({message: `hello ${req.headers.username}`});
})





app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});