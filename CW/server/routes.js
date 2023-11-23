const express = require("express");
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});

const fs = require("fs");

router.get("/", (req, res) => {
    res.sendFile("/home/azazzzel/WEB_LETI2024/CW/views/game.html");
})

router.get("/src/spriteManager", (req, res) => {
    res.redirect("/src/spriteManager.js");
})

router.get("/src/*.js", (req,res)=>{
    res.sendFile("/home/azazzzel/WEB_LETI2024/CW" + req.url);
})

router.get("/*.png", (req,res)=>{
    res.sendFile("/home/azazzzel/WEB_LETI2024/CW/public/map/" + req.url);
})

router.get("/home/azazzzel/WEB_LETI2024/CW/public/map/levels/*.json", (req, res) => {
    res.sendFile(req.url);
})

router.get("/*", (req,res) => {
    res.send("ERROR 404");
})


module.exports = router;


