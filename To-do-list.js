let arrOfTasksobj = [];
let idCard = 1;
let sortObj = {
    Высокий: 1,
    Средний: 2,
    Низкий: 3,
};


function getNowDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    $("#datepicker").attr("value", today)
}


function formatDate(date) {
    return date = date.split('-').reverse().join(".")
}


function createNewTask() {
    showFullCard(null)
    getNowDate()
}


function replacer(event) {
    var regex = new RegExp("^[ а-яА-Яa-zA-Z0-9]+$");
    var key = event.target.value.slice(-1)
    if (!regex.test(key)) {
        event.preventDefault();
        event.target.value = event.target.value.slice(0, -1)
        return false;
    }
}


function nameOfTaskTextChange() {
    return document.getElementById("nameOfTask").value
}


function descriptionOfTaskTextChange() {
    return document.getElementById("descriptionOfTask").value
}

function validateNameOfTask() {
    let text = nameOfTaskTextChange()
    var regex = new RegExp("^[ ёЁа-яА-Яa-zA-Z0-9]+$");
    let valide = regex.test(text)
    let id = "nameOfTask"

    if (text == "") {
        addErrorText(id, "Вы не заполнили поле")
        return false
    } else if (valide == false) {
        addErrorText(id, "Вы ввели недопустимый символ")
        return false
    } else {
        removeErrorText(id)
        return true
    }
}


function validateDescriptionOfTask() {
    let text = descriptionOfTaskTextChange()
    var regex = new RegExp("^[ ёЁа-яА-Яa-zA-Z0-9]+$");
    let valide = regex.test(text)
    let id = "descriptionOfTask"

    if (text == "") {
        addErrorText(id, "Вы не заполнили поле")
        return false
    } else if (valide == false) {
        addErrorText(id, "Вы ввели недопустимый символ")
        return false
    } else {
        removeErrorText(id)
        return true
    }
}


function addErrorText(id, textOfError) {
    document.getElementById(id + "Err").innerText = textOfError
    document.getElementById(id).classList.add("ERR")
}


function removeErrorText(id) {
    document.getElementById(id + "Err").innerText = ""
    document.getElementById(id).classList.remove("ERR")
}


function addTask() {
    let agreement = confirm("хотите сохранить изменения?")

    if (agreement != true) {
        return
    }

    if (validateNameOfTask() == false || validateDescriptionOfTask() == false) {
        alert("Некоторые поля заполнены неверно, или пусты")
        return
    }

    let obj = arrOfTasksobj.find(element => element.id == idNow) || {}
    let nameOfTask = document.getElementById("nameOfTask").value;
    let descriptionOfTask = document.getElementById("descriptionOfTask").value;
    let progressStatus = document.querySelector("[name='progress']:checked").value
    let priorityStatus = document.querySelector("[name='priority']:checked").value
    let deadLineInput = document.getElementById("datepicker").value

    if (obj.id == undefined) {
        arrOfTasksobj.push(obj)
    }

    obj.id = obj.id || idCard
    obj.nameOfTask = nameOfTask
    obj.progressStatus = progressStatus
    obj.descriptionOfTask = descriptionOfTask
    obj.priorityStatus = priorityStatus
    obj.deadLine = deadLineInput

    drawTasks()
    $("#full-card-container").empty()

    if (include(arrOfTasksobj, idNow)) {
        arrOfTasksobj = arrOfTasksobj.filter(function(task) {
            if (task.id == idNow) {
                return false
            } else {
                return true
            }
        })
    }
    saveToLocalStorage()
    idCard = idCard + 1
}


function include(arr, name) {
    return arr.find(function(element) {
        return element.name == name
    })
}


function isCheckedProgress(progressStatus, value) {
    if (progressStatus == undefined && value == "ToDo") {
        return "checked"
    } else if (progressStatus == value) {
        return "checked"
    } else {
        return ""
    }
}


function isChecked(priorityStatus, value) {
    if (priorityStatus == undefined && value == "Средний") {
        return "checked"
    } else if (priorityStatus == value) {
        return "checked"
    } else {
        return ""
    }
}


function fillNameOfTask(data) {
    if (data == null) {
        return "Новая задача"
    } else {
        return data
    }
}

function fillDescriptionOfTask(data) {
    if (data == null) {
        return "Вы ещё не написали описание задачи"
    } else {
        return data
    }
}


function drawTasks() {
    if (arrOfTasksobj.length == 0) {
        return
    }
    $("#todo").empty()
    $("#in-progress").empty()
    $("#done").empty()

    arrOfTasksobj.sort(function(obj1, obj2) {
        if (sortObj[obj1.priorityStatus] == sortObj[obj2.priorityStatus]) {
            return new Date(obj1.deadLine).getTime() - new Date(obj2.deadLine).getTime()
        }
        return sortObj[obj1.priorityStatus] - sortObj[obj2.priorityStatus]
    })
    arrOfTasksobj.forEach(function(task) {
        task.deadLine = formatDate(task.deadLine)
        if (task.progressStatus == "ToDo") {
            $("#todo").append(jQuery("#card").tmpl(task))
        } else if (task.progressStatus == "InProgress") {
            $("#in-progress").append(jQuery("#card").tmpl(task))
        } else {
            $("#done").append(jQuery("#card").tmpl(task))
        }
    })

    $("#todo").children().css("background-color", "aquamarine");
    $("#in-progress").children().css("background-color", "aqua");
    $("#done").children().css("background-color", "lightgreen");
}


function showFullCard(idOfCard) {
    idNow = idOfCard
    $("#full-card-container").empty()
    let findedObj = arrOfTasksobj.find(element => element.id == idOfCard) || {}
    $("#full-card-container").append(jQuery("#full-card").tmpl(findedObj))
    $("#datepicker").datepicker()
}


function deleteTask() {
    let index = arrOfTasksobj.findIndex(function(element) {
        return element.id == idNow
    })
    arrOfTasksobj.splice(index, 1)
    $("#full-card-container").empty()
    drawTasks()
    saveToLocalStorage()
}

function rotation(priority, progress, id) {
    let string = id + "random" + priority + progress
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash >= 0 ? "rotated-1" : "rotated-2"
}


function saveToLocalStorage() {
    let strigified = JSON.stringify(arrOfTasksobj)
    localStorage.setItem("arrOfTasksobj", strigified)
}


function getFromLocalStorage() {
    let arrOfTasksobj = JSON.parse(localStorage.getItem("arrOfTasksobj"))
    return arrOfTasksobj == null ? [] : arrOfTasksobj
}

//////////////////////////////////////////////////////////////////////////

arrOfTasksobj = getFromLocalStorage()
createNewTask()
drawTasks()