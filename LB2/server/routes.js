const express = require("express");
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false});

const fs = require("fs");

let lib_catalog = require("../DataStorage.json")["lib_catalog"];

let user = {
    "userName": "null",
    "adminRoot": false
};

router.get("/", (req, res) => {
    res.render("index", {
        user: user,
        lib_catalog: lib_catalog
    });
})

router.get("/login", (req, res) => {
    res.render("login");
})

router.get("/books/login?", (req, res) => {
    res.redirect("/login");
})

router.post("/login", urlencodedParser, (req, res) => {
    user.userName = req.body.userName;
    user.adminRoot = (req.body.adminRoot === "on");
    res.redirect("/");
})

router.post("/exit", urlencodedParser, (req,res)=>{
    user.userName = "null";
    user.adminRoot = false;
    res.redirect("/");
})

router.get("/books/:num", (req, res) =>{
    if(lib_catalog.length < req.params.num){
        res.status(404);
        res.end("ERROR404");
    }

    res.render("book",{
        user: user,
        num: req.params.num,
        lib_catalog: lib_catalog
    });
})

router.post("/books/takeBook", urlencodedParser, (req, res) => {
    lib_catalog[req.body.curBook - 1].isTaken = "yes";
    lib_catalog[req.body.curBook - 1].owner = user.userName;
    let date = new Date();
    date.setDate(date.getDate() + 14);
    dateStr = date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    dateCorrectStr = dateStr.split(".").reverse().join(".");

    lib_catalog[req.body.curBook - 1].submitDeadline = dateCorrectStr;
    res.redirect("/books/" + req.body.curBook.toString());
})

router.post("/books/extendDeadline", urlencodedParser, (req, res) => {
    let date = new Date(lib_catalog[req.body.curBook - 1].submitDeadline);
    date.setDate(date.getDate() + 7);
    dateStr = date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    dateCorrectStr = dateStr.split(".").reverse().join(".");

    lib_catalog[req.body.curBook - 1].submitDeadline = dateCorrectStr;
    res.redirect("/books/" + req.body.curBook.toString());
})

router.post("/books/returnBook", urlencodedParser, (req, res) => {
    lib_catalog[req.body.curBook - 1].isTaken = null;
    lib_catalog[req.body.curBook - 1].owner = null;
    lib_catalog[req.body.curBook - 1].submitDeadline = null;
    res.redirect("/books/" + req.body.curBook.toString());
})

router.post("/books/changeBookInfo", urlencodedParser, (req, res) => {
    lib_catalog[req.body.curBook - 1].title = req.body.title;
    lib_catalog[req.body.curBook - 1].author = req.body.author;
    lib_catalog[req.body.curBook - 1].releaseYear = req.body.releaseYear;
    res.redirect("/books/" + req.body.curBook.toString());
})

router.post("/books/changeBookInfo", urlencodedParser, (req, res) => {
    lib_catalog[req.body.curBook - 1].title = req.body.title;
    lib_catalog[req.body.curBook - 1].author = req.body.author;
    lib_catalog[req.body.curBook - 1].releaseYear = req.body.releaseYear;
    res.redirect("/books/" + req.body.curBook.toString());
})

router.post("/books/deleteBook", urlencodedParser, (req, res) => {
    lib_catalog.splice(req.body.curBook - 1, 1);
    for(let i = req.body.curBook - 1; i < lib_catalog.length; ++i){
        lib_catalog[i].id = (i+1).toString();
    }
    res.redirect("/");
})

router.post("/addBook", urlencodedParser, (req, res) => {
    let title = req.body.title;
    let author = req.body.author;
    let releaseYear = req.body.releaseYear;
    let id = lib_catalog.length+1;
    lib_catalog.push({"title": title, "author": author, "releaseYear": releaseYear,
    "owner": null, "submitDeadline": null, "isTaken": null, "id": id.toString()});
    res.redirect("/");
})

router.get("/ajax.js", (req, res) => {
    res.sendFile("/home/azazzzel/LETI2024/WEB/LB2_t/server/ajax.js")
})

router.post("/filter", urlencodedParser, (req, res) => {
    let listOfBooks = lib_catalog.slice();
    switch(req.body.value){
        case "sortTitle":
            listOfBooks.sort(function (book1, book2){
                if(book1.title === book2.title)
                    return 0;
                return(book1.title > book2.title) ? 1 : -1
            })
            break;
        case "onlyInStock":
            listOfBooks = listOfBooks.filter(function (book){return book.isTaken == null})
            break;
        case "sortDate":
            listOfBooks.sort(function (book1, book2) {
                if((book1.submitDeadline == null && book2.submitDeadline != null) ||
                    (book1.submitDeadline == null && book2.submitDeadline == null)){
                    return 1;
                }else if(book1.submitDeadline != null && book2.submitDeadline == null){
                    return -1;
                }
                let date1 = new Date(book1.submitDeadline);
                let date2 = new Date(book2.submitDeadline);
                if(date1 >= date2)
                    return -1;

                return 1;
                });
            break;

        case "default":
            break;
    }

    res.render("bookList", {lib_catalog : listOfBooks, user : user});
})


router.get("/*", (req,res) => {
    res.send("ERROR 404");
})

module.exports = router;