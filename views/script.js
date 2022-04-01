var qlen = 1;
addQuestion = () => {
    qlen++;
    fset =
        '<fieldset id=' +
        qlen +
        '> <legend>Question' +
        qlen +
        '<button class="btn btn-primary" type="button" onclick="removeQuestion(' +
        qlen +
        ')" style="margin-right:20px;float:right">Remove question</button><div class="form-group"> <input class="form-control" type="text" name=' +
        qlen +
        ' placeholder="Enter Question" style="width:98%"></div><div class="form-group"><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option1" name=' +
        qlen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option2" name=' +
        qlen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option3" name=' +
        qlen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option4" name=' +
        qlen +
        ' required="required"></div><div class="form-group col-md-6 mr-3" style="margin-left:20%;"><input class="form-control" type="text" placeholder="Answer" name=' +
        qlen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="number" placeholder="Marks" name=' +
        qlen +
        ' required="required" value="1"></div></div></legend></fieldset>';
    $('#questions').append(fset);
};

removeQuestion = (id) => {
    $('#' + id).remove();
    qlen--;
};

addQuestioninupdateform = () => {
    var qslen = $('.question').length;
    console.log(qslen);
    qnum = qslen + 1;
    fset =
        '<fieldset class="question" id=' +
        qslen +
        '> <legend>Question' +
        qnum +
        '<button class="btn btn-primary" type="button" onclick="removeQuestion(' +
        qslen +
        ')" style="margin-right:20px;float:right">Remove question</button><div class="form-group"> <input class="form-control" type="text" name=' +
        qslen +
        ' placeholder="Enter Question" style="width:98%"></div><div class="form-group"><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option1" name=' +
        qslen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option2" name=' +
        qslen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option3" name=' +
        qslen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="text" placeholder="Option4" name=' +
        qslen +
        ' required="required"></div><div class="form-group col-md-6 mr-3" style="margin-left:20%;"><input class="form-control" type="text" placeholder="Answer" name=' +
        qslen +
        ' required="required"></div><div class="form-group col-md-6 mr-3"><input class="form-control" type="number" placeholder="Marks" name=' +
        qslen +
        ' required="required" value="1"></div></div></legend></fieldset>';
    $('#questions').append(fset);
};
requestAccess = () => {
    var id = $('#userId').val();
    console.log(id);
    $.ajax({
        url: '/requestAccess',
        type: 'POST',
        data: {
            id: id,
        },
        success: function (data) {
            console.log(data);
            if (data.status == 'success') {
                alert('Request sent successfully');
                location.reload();
            } else {
                alert('Request failed');
            }
        },
    });
};
copyUrl = () => {
    var url = window.location.href;
    console.log(url);
    navigator.clipboard.writeText(url);
    alert('Test Url copied to Clipboard');
};
