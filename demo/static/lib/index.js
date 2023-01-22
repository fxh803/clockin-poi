
function passname() {
    localStorage.string = $("#user").val();
}

function checkAccount() {
    var field1 = document.getElementById('user');
    var field2 = document.getElementById('password');
    var user = field1.value;
    var password = field2.value;
    if (user == "" || password == "") {
        alert("用户名/密码为空")
        return;
    }
    let formData = new FormData()
    formData.append('user', user);
    formData.append('password', password);
    $.ajax({
        url: "http://39.108.108.16:5000/checkAccount",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response['state'] == '0')
                alert("账号密码错误/不存在")
            else {
                passname();
                $('#user').val("");
                $('#password').val("");
                alert("密码正确")
                window.location.replace("/main");

            }

        }
    })
}

function upLoadAccount() {
    var field1 = document.getElementById('newUser');
    var field2 = document.getElementById('newPassword');
    var user = field1.value;
    var password = field2.value;
    if (user == "" || password == "") {
        alert("用户名/密码为空")
        return;
    }
    let formData = new FormData()
    formData.append('user', user);
    formData.append('password', password);
    $.ajax({
        url: "http://39.108.108.16:5000/upLoadAccount",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response['state'] == '0')
                alert("账号已存在")
            else {
                $('#newUser').val("");
                $('#newPassword').val("");
                alert("注册成功！")
                switchPage();
            }

        }
    })
}
function renewAccount() {
    var field1 = document.getElementById('changedUser');
    var field2 = document.getElementById('oldPassword');
    var field3 = document.getElementById('changedPassword');
    var user = field1.value;
    var oldpassword = field2.value;
    var newpassword = field3.value;
    if (user == "" || oldpassword == "" || newpassword == "") {
        alert("用户名/新/旧密码为空")
        return;
    }
    let formData = new FormData()
    formData.append('user', user);
    formData.append('oldpassword', oldpassword);
    formData.append('newpassword', newpassword);
    $.ajax({
        url: "http://39.108.108.16:5000/renewAccount",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response['state'] == '0')
                alert("用户名/旧密码输入有误")
            else {
                $('#changedUser').val("");
                $('#oldPassword').val("");
                $('#changedPassword').val("");
                alert("修改成功！")
                switchPage2()
            }

        }
    })
}
function switchPage() {
    var page1 = document.getElementById('sign_up');
    var page2 = document.getElementById('Log_in');
    if (page2.style.display == "block") {
        page2.style.display = "none"
        page1.style.display = "block"
    }
    else {
        page1.style.display = "none"
        page2.style.display = "block"
    }

}
function switchPage2() {
    var page1 = document.getElementById('passwordChanging');
    var page2 = document.getElementById('Log_in');
    if (page2.style.display == "block") {
        page2.style.display = "none"
        page1.style.display = "block"
    }
    else {
        page1.style.display = "none"
        page2.style.display = "block"
    }

}