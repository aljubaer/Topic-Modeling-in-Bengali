var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;
var fs = require('fs');
var ps = require("python-shell");
var path = require("path");

function onDataLoad() {
    const { dialog } = require('electron').remote;

    let fileContent = '';


    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        console.log(result.canceled);
        console.log(result.filePaths);

        if (result.filePaths.length == 0)
            return;

        console.log('not cancelled');

        console.log(result.filePaths[0]);
        document.getElementById("enFileInput").value = result.filePaths[0];
    });

}