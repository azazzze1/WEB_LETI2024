
$(document).ready(function () {
    $(".user-list-elem").on("click", function (e) {
        if(e.target.localName == "div"){
            let id = e.currentTarget.id;
    
            $.ajax({
                url: "/ajax/changeStatus",
                type: "POST",
                data: {id: id},
                success: function(data){
                    let newClass = JSON.parse(data) || [];
                    $("#" + id).removeClass();
                    $("#" + id).addClass("user-list-elem");
                    $("#" + id).addClass(newClass[0].toString());
                }
            });
        }
    });
});

$(document).ready(function (){
    $("#search-filter").on("submit", function(e) {
        e.preventDefault();
        var str1 = $(this).serialize();
        var str = decodeURI(str1);

        $("ol").remove();
        $("body").append("<ol class = 'user-list'></ol>");
        $("ol").append("<h3>Список пользователей</h3>");

        $.ajax({
            url: "/ajax",
            type: "POST",
            data: {content: str},
            success: function(data){
                let newList = JSON.parse(data) || [];
                for(let i = 0; i < newList.length; ++i){
                    let li = 'li#' + newList[i].id;
                    let div = 'div#d' + newList[i].id;
                    $("ol").append($("<li id=" + newList[i].id + "></li>"));
                    $(li).append($("<div class='" + newList[i].status + "' id=d" + newList[i].id + "></div>"));
                    $(div).append($("<img src='../public/images/avatars/" + newList[i].id + ".jpg' class='user-avatar'>"));
                    $(div).append($("<span>" + newList[i].surname + " " + newList[i].name + " " + newList[i].patronymic +
                    " (" + newList[i].birthdate + ")</span>"));
                    if(newList[i].role == "admin"){
                        $(div).append($("<span> [admin]</span>"));
                    }
                }
            }
        });
    })
})






