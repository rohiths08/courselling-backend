const { Router } = require('express');
const userRouter = Router();

userRouter.post('/sign-in', (req, res) => {
    console.log(req.body);
    res.json({ message: "sign in successful" });
});

userRouter.post('/sign-up', (req, res) => {
    console.log(req.body);
    res.json({ message: "sign up successful" });
});

userRouter.get('/purchase-course', (req, res) => {
    console.log(req.body);
    res.json({ message: "purchase successful" });
});

module.exports = {
    userRouter:userRouter
};