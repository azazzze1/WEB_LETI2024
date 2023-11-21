const express = require("express");
const parser = require("express").json();
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});
const httpServer = require('http').createServer(express);

const io = require('socket.io')(httpServer, {
    cors: true, 
    origins: ["*"]
});

const fs = require("fs");

let usersList = require("../usersListStorage.json")["users"];
let userFile = require("../usersListStorage.json");

io.on("connection", (socket) => {
    console.log("a user connected");
    
    socket.on("chatMsg", (msg) => {
        let ids = [msg.userID, msg.friendID];
        ids.sort((a, b) => {return a-b;});
        let name = "d" + ids[0] + "-" + ids[1] + ".json"; 

        let msgs = require("/home/azazzzel/WEB_LETI2024/LB3/public/dialogs/" + name);
        let newMess = {
            "id": msg.userID - 0,
            "text": msg.msg
        };
        msgs.dialog.push(newMess);
    
        fs.writeFile('/home/azazzzel/WEB_LETI2024/LB3/public/dialogs/' + name, JSON.stringify(msgs) , error => console.log("Done!"));

        io.emit("chatMsg", {"msg": msgs});
    })
});

httpServer.listen(3001, () => console.log("Сервер запущен на порту 3001"));

router.get("/changeUserListStorage", (req,res) => {
    usersList = JSON.parse(req.query.newUserListParam);
    userFile["users"] = usersList;
    fs.writeFile('/home/azazzzel/LETI2024/WEB/LB3/usersListStorage.json', JSON.stringify(userFile) , error => console.log("Done!"));
})

router.get("/usersListStorage.json", (req,res) => {
    res.send(usersList);
})

router.get("/d*-*.json", (req,res) => {
    let fileName = req.url.slice(1);

    if (!fs.existsSync("/home/azazzzel/WEB_LETI2024/LB3/public/dialogs/" + fileName)) {
        fs.writeFileSync("/home/azazzzel/WEB_LETI2024/LB3/public/dialogs/" + fileName, JSON.stringify({"dialog": []}), 'utf8');
    }
    
    res.sendFile("/home/azazzzel/WEB_LETI2024/LB3/public/dialogs/" + fileName); 
})

router.post("*/updateUser*", urlencodedParser, (req, res) => {
    let id = req.body.user - 1;
    usersList[id].name = req.body.name;
    usersList[id].surname = req.body.surname;    
    usersList[id].patronymic = req.body.patronymic;
    usersList[id].birthdate = req.body.birthdate;

    if(req.body.admin == "on"){
        usersList[id].role = "admin";
    }

    fs.writeFile('/home/azazzzel/LETI2024/WEB/LB3/usersListStorage.json', JSON.stringify({"users": usersList}) , error => console.log("Done!"));
    res.redirect("/");
})

router.get("/", (req, res) => {
    res.redirect("/usersList/");
})

router.get("/usersList/", (req, res) => {
    res.render("users-list", {
        usersList: usersList
    });
})

router.get("/ajaxScriptList.js", (req, res) => {
    res.sendFile("/home/azazzzel/LETI2024/WEB/LB3/server/ajaxScriptList.js");
})

router.get("/jquery.js", (req, res) => {
    res.sendFile("/home/azazzzel/LETI2024/WEB/LB3/node_modules/jquery/src/jquery.js");
})

router.get("/usersList/friends/:num", (req, res) => {
    let id = req.params.num;
    let newList = [];
    let friendsList = JSON.parse(usersList[id-1].friends);
    for(let i = 0; i < friendsList.length; ++i){
        newList.push(usersList[friendsList[i]-1]);
    }
    console.log(newList);
    res.render("friends-list", {
        friendsList: newList
    });
})

router.get("/usersList/posts/:num", (req, res) => {
    let id = req.params.num;
    let postsList = JSON.parse(usersList[id-1].post);

    res.render("posts-list", {
        curUser: usersList[id-1],
        userPosts: postsList
    });
})

router.post("/ajax/changeStatus", urlencodedParser, (req, res) => {
    let data = [];
    let id = req.body.id;

    switch(usersList[id-1].status){
        case "blocked":
            data.push("active");
            break;
        case "active":
            data.push("blocked");
            break;
        case "unconfirmed":
            data.push("active");
            break;
    } 

    usersList[id-1].status = data[0];

    fs.writeFile('/home/azazzzel/LETI2024/WEB/LB3/usersListStorage.json', JSON.stringify({"users": usersList}) , error => console.log("Done!"));
    res.send(JSON.stringify(data));

})

router.post("/ajax", urlencodedParser, (req, res) => {
    let newUsersList = [];
    let subStr = req.body.content.split('=')[1];

    for(let i = 0; i < usersList.length; ++i){
        if(usersList[i].name.indexOf(subStr) + 1 || usersList[i].surname.indexOf(subStr) + 1
            || usersList[i].patronymic.indexOf(subStr) + 1){
            newUsersList.push(usersList[i]);
        }
    }

    res.send(JSON.stringify(newUsersList));
})

router.get("/usersList/public/awesomeFont/css/all.min.css", (req, res) => {
    res.redirect("/public/awesomeFont/css/all.min.css");
})
router.get("/usersList/public/images/header.png", (req, res) => {
    res.redirect("/public/images/header.png");
})
router.get("/usersList/public/styles/libStyle.css", (req, res) => {
    res.redirect("/public/styles/libStyle.css");
})

router.get("/*", (req,res) => {
    res.send("ERROR 404");
})

module.exports = router;