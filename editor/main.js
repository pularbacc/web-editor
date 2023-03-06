let stt = 0;
let id = 0;

let arr = [];

class Tab {
    constructor(tab, txt, editor) {
        this.tab = tab;
        this.txt = txt;
        this.editor = editor;
    }

    txtSave = "";
}

newTab();

function display(b) {
    if (b == true) {
        arr[id].tab.className = "active";
        arr[id].txt.style.display = "block";
    } else {
        arr[id].tab.className = "";
        arr[id].txt.style.display = "none";
    }
}

function newTab() {
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "Tab " + stt;
    btn.id = stt;
    btn.addEventListener("click", function() {
        tabChose(this)
    });
    document.getElementById("tab").append(btn);

    let txt = document.createElement("PRE");
    txt.id = "txt" + btn.id;
    document.getElementById("txt").append(txt);

    var editor = ace.edit(txt.id);
    editor.setTheme("ace/theme/monokai");

    editor.session.setMode("ace/mode/html");
    editor.setOptions({
        fontSize: "12pt"
    });

    arr.push(new Tab(btn, txt, editor));
    btn.click();
    stt++;
}

function undoTxt() {
    arr[id].editor.session.getUndoManager().undo();
}

function redoTxt() {
    arr[id].editor.session.getUndoManager().redo();
}

function tabChose(o) {
    display(false);
    let i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].tab.id == o.id) {
            id = i;
            break;
        }
    }
    display(true);
}

function closeTab() {
    let check = true;

    if (arr[id].editor.getValue() != arr[id].txtSave) {
        check = confirm("file not save , are you want close tab !");
    }

    if (check == true) {
        arr[id].tab.remove();
        arr[id].txt.remove();

        arr.splice(id, 1);

        if (arr.length == 0) {
            newTab();
        }

        if (id != 0) {
            id = id - 1;
        }

        display(true);
    }

}

function loadFile() {
    let loadLink = document.createElement("input");
    loadLink.type = "file";
    loadLink.style.display = "none";
    document.body.appendChild(loadLink);

    loadLink.click();

    loadLink.onchange = function() {
        console.log("run :");
        console.log(loadLink);
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            arr[id].editor.setValue(fileLoadedEvent.target.result);
        };
        fileReader.readAsText(loadLink.files[0], "UTF-8");

        arr[id].tab.innerHTML = loadLink.files[0].name;
    };
    loadLink.remove();
}

function saveFile() {
    let textToSave = arr[id].editor.getValue();
    arr[id].txtSave = textToSave;

    let textToSaveAsBlob = new Blob([textToSave], {
        type: "text/plain"
    });
    let textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    let downloadLink = document.createElement("a");
    downloadLink.download = arr[id].tab.textContent;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
    downloadLink.remove();
}

function clearText() {
    arr[id].editor.setValue("");
}

function run() {
    let w = window.open();
    w.document.open();
    w.document.write(arr[id].editor.getValue());
    w.document.close();
}

function insertTab(o, e) {
    let kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;

    if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        let oS = o.scrollTop;

        if (o.setSelectionRange) {
            let sS = o.selectionStart;
            let sE = o.selectionEnd;
            o.value = o.value.substring(0, sS) + "\t" + o.value.substr(sE);
            o.setSelectionRange(sS + 1, sS + 1);
            o.focus();
        } else
        if (o.createTextRange) {
            document.selection.createRange().text = "\t";
            e.returnValue = false;
        }

        o.scrollTop = oS;
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }
    return true;
}

window.onbeforeunload = function(event) {
    let i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].editor.getValue() != arr[i].txtSave) {
            return "you not save !";
        }
    }
};