//上传照片
let previewImage = document.getElementById("preview-img");//输入框预览图
let modalImg = document.getElementById("modal-img");//模态框预览图
let img = []//储存要上传的照片
const file = document.getElementById('inputFile');//实际的input
const fileButton = document.getElementById("inputFile-btn")//表面的按钮
fileButton.onclick = (event) => {
    file.click();
}
file.onchange = (event) => {
    var fileData = file.files[0];//获取到一个FileList对象中的第一个文件(File 对象),是我们上传的文件
    var pettern = /^image/;
    if (typeof (fileData) == "undefined") {
        return;
    }
    if (!pettern.test(fileData.type)) {
        alert("图片格式不正确");
        return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(fileData);//异步读取文件内容，结果用data:url的字符串形式表示
    /*当读取操作成功完成时调用*/
    reader.onload = function () {
        img = reader.result //结果储存在img中，等等submit上传
        modalImg.setAttribute("src", reader.result)//更改模态框预览
        previewImage.setAttribute("src", reader.result)//更改输入框预览
        previewImage.style.display = 'block'
    }
}


//修改头像
const inputButton = document.getElementById("change-head-sculpture-a")//表面的按钮
const inputFile = document.getElementById("change-head-sculpture")//实际的input
inputButton.onclick = (event) => {
    inputFile.click();
}
inputFile.onchange = (event) => {
    var fileData = inputFile.files[0];//获取到一个FileList对象中的第一个文件(File 对象),是我们上传的文件
    var pettern = /^image/;
    if (typeof (fileData) == "undefined") {
        return;
    }
    if (!pettern.test(fileData.type)) {
        alert("图片格式不正确");
        return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(fileData);//异步读取文件内容，结果用data:url的字符串形式表示
    /*当读取操作成功完成时调用*/
    reader.onload = function () {
        let sculpture = document.getElementById('head-sculpture');
        sculpture.src = this.result;
        let formData = new FormData();
        let user = localStorage.string;
        formData.append('user', user);
        formData.append('sculpture', this.result);
        $.ajax({
            url: "http://39.108.108.16:5000/renewSculpture",
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // console.log(response)
            }
        })
    }
}
//监听文本框输入
$("#message").on("input propertychange", function () {
    //获取输入内容
    var userDesc = $(this).val();
    //判断字数
    var len;
    if (userDesc) {
        len = userDesc.length;
    } else {
        len = 0;
    }
    //显示字数及输入样式
    $(".wordsNum_v1").html(len);
    $(".wordsNum_v1").css("color", "rgb(51,51,51)");
    if (len > 200)
        $(".wordsNum_v1").css("color", "rgb(204, 0, 51)");
});

//重新设置列表透明度
function cleanSelect() {
    let item = document.getElementsByClassName('list-group-item');
    for (let i = 0; i < item.length; i++) {
        item[i].style.opacity = "1"
    }

}
//查找
function searchList() {
    cleanSelect()
    var input = document.getElementById('searchContent').value
    var list = []
    var message = document.getElementsByClassName('list-group-item-text')
    var user = document.getElementsByClassName('list-group-item-heading')
    var pointId = document.getElementsByClassName('list-group-item')
    var info = document.getElementsByClassName('listInfo')
    //建立待查list
    for (let i = 0; i < pointId.length; i++) {
        var word = info[i].innerHTML.indexOf('--')
        //如果有poi项
        if (word != -1)
            var res = info[i].innerHTML.substring(word + 2, info[i].innerHTML.length)//截取poi字段
        else
            var res = []//否则为空
        list.push({ 'pointId': pointId[i].id, 'user': user[i].innerHTML, 'message': message[i].innerHTML, 'info': res })
    }
    // console.log(list)
    //数组储存查询结果，-1失败
    var arr = list.filter(item => {
        return (item.info.indexOf(input) + item.user.indexOf(input) + item.message.indexOf(input)) > -3;
    })
    if (arr.length == 0) {
        alert("没有找到相关信息")
        return;
    }
    //遍历查询到的name
    for (let i = arr.length - 1; i >= 0; i--) {
        //列表锚点定位
        var list = document.getElementById("list-group");
        list = document.querySelector('#' + arr[i].pointId).scrollIntoView({ behavior: 'smooth' })
        let item = document.getElementById(arr[i].pointId);
        item.style.opacity = "0.7"
    }
    //清空输入框
    document.getElementById('searchContent').value = "";
}
//伸缩
function flex() {
    $('#message-block').on('hidden.bs.collapse', function () {
        let block1 = document.getElementById('visual-block');
        let block2 = document.getElementById('map-block');
        let block3 = document.getElementById('message-block');
        let label = document.getElementById('label');
        if (block2.classList == 'col-md-6') {
            block2.classList.replace('col-md-6', 'col-md-9');
            block3.classList.replace('col-md-3', 'col-md-0');
        }
        else if (block2.classList == 'col-md-9' && block1.classList == 'col-md-0 hidden-xs hidden-sm collapse') {
            block2.classList.replace('col-md-9', 'col-md-12');
            block3.classList.replace('col-md-3', 'col-md-0');
        }
        label.className = 'glyphicon glyphicon-menu-left';
    })
    $('#message-block').on('show.bs.collapse', function () {
        let block1 = document.getElementById('visual-block');
        let block2 = document.getElementById('map-block');
        let block3 = document.getElementById('message-block');
        let label = document.getElementById('label');
        if (block2.classList == 'col-md-9' & block1.classList == 'col-md-3 hidden-xs hidden-sm collapse in') {
            block2.classList.replace('col-md-9', 'col-md-6');
            block3.classList.replace('col-md-0', 'col-md-3');
        }

        else if (block2.classList == 'col-md-12') {
            block2.classList.replace('col-md-12', 'col-md-9');
            block3.classList.replace('col-md-0', 'col-md-3');
        }
        label.className = 'glyphicon glyphicon-menu-right';
    })
}

//伸缩
var acc = 0//一个点击记录
function flex3() {
    acc = 1
    $('#visual-block').on('hidden.bs.collapse', function () {//这里如果没有acc变量，会触发visualblock里元素collapse
        let block1 = document.getElementById('visual-block');
        let block2 = document.getElementById('map-block');
        let block3 = document.getElementById('message-block');
        let label = document.getElementById('label3')
        if (acc == 1) {
            if (block2.classList == 'col-md-6' && block3.classList == 'col-md-3 collapse in') {
                block2.classList.replace('col-md-6', 'col-md-9');
                block1.classList.replace('col-md-3', 'col-md-0');
                acc = 0
                // console.log('1')
            }
            else if (block2.classList == 'col-md-9' && block3.classList == 'col-md-0 collapse') {
                block2.classList.replace('col-md-9', 'col-md-12');
                block1.classList.replace('col-md-3', 'col-md-0');
                acc = 0
                // console.log('2')
            }
        }
        label.className = 'glyphicon glyphicon-menu-right';
    })
    $('#visual-block').on('show.bs.collapse', function () {
        let block1 = document.getElementById('visual-block');
        let block2 = document.getElementById('map-block');
        let block3 = document.getElementById('message-block');
        let label = document.getElementById('label3')
        if (acc == 1) {
            if (block2.classList == 'col-md-9' && block3.classList == 'col-md-3 collapse in') {
                block2.classList.replace('col-md-9', 'col-md-6');
                block1.classList.replace('col-md-0', 'col-md-3');
                acc = 0
                // console.log('3')
            }
            else if (block2.classList == 'col-md-12' && block3.classList == 'col-md-0 collapse') {
                block2.classList.replace('col-md-12', 'col-md-9');
                block1.classList.replace('col-md-0', 'col-md-3');
                acc = 0
                // console.log('4')
            }
        }
        label.className = 'glyphicon glyphicon-menu-left';
    })
}
//伸缩
function flex2() {
    let block1 = document.getElementById('edit');
    let block2 = document.getElementById('list')
    if (block1.style.opacity != '0') {
        block1.style.height = '0';
        block1.style.opacity = '0';
        block1.style.padding = '0';
        block2.style.height = '95%'
        let label = document.getElementById('label2');
        label.className = "glyphicon glyphicon-menu-down"
    }
    else {
        block1.style.opacity = '1';
        block1.style.height = '50%';
        block1.style.padding = '10px';
        block2.style.height = '45%'
        let label = document.getElementById('label2');
        label.className = "glyphicon glyphicon-menu-up"
    }

}
//移动端上下滑动按钮
var move = 0;
function flex4() {
    if (move == 0) {
        let label = document.getElementById('label4');
        label.className = "glyphicon glyphicon-triangle-top";
        let element = document.getElementById("message-block");
        element.scrollIntoView({ behavior: 'smooth' });
        move = 1;
    }
    else {
        let label = document.getElementById('label4');
        label.className = "glyphicon glyphicon-triangle-bottom";
        let element = document.getElementById("nav");
        element.scrollIntoView({ behavior: 'smooth' });
        move = 0;
    }
}
// 热力图按钮
var hotbtn_click = 0
function hotbtn() {
    let hot = document.getElementById('hotbtn');
    if (hotbtn_click == 0) {
        heatmap.hide();
        hot.innerHTML = '打开热力图';
        hotbtn_click = 1
    }
    else {
        heatmap.show();
        hot.innerHTML = '关闭热力图';
        hotbtn_click = 0
    }
}

//加载用户信息
window.onload = function () {
    //设置用户名
    let div = document.getElementById('username');
    div.innerHTML = "欢迎回来！" + localStorage.string;
    //请求头像信息
    let formData = new FormData();
    let user = localStorage.string;
    formData.append('user', user);
    $.ajax({
        url: "http://39.108.108.16:5000/getSculpture",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response['sculpture'] != '') {
                let sculpture = document.getElementById('head-sculpture');
                sculpture.src = response['sculpture'];
            }
        }
    })
    refresh();
}

// 地图初始化
var clickListener, map = new AMap.Map('map-container', {
    zoom: 15,
    mapStyle: 'amap://styles/whitesmoke',
});
//热力图初始化
var heatmap;
map.plugin(["AMap.HeatMap"], function () {
    //初始化heatmap对象
    heatmap = new AMap.HeatMap(map, {
        radius: 90, //给定半径
        opacity: [0.1, 1],
        gradient: {
            0.3: 'rgb(252,251,253)',
            0.4: 'rgb(239,237,245)',
            0.5: 'rgb(218,218,235)',
            0.6: 'rgb(188,189,220)',
            0.7: 'rgb(158,154,200)',
            0.8: 'rgb(128,125,186)',
            0.9: 'rgb(106,81,163)',
            1: 'rgb(74,20,134)',


        }
    });

})

//labelslayer点图层初始化
var labelsLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 1000,
    // 该层内标注是否避让
    collision: true,
    // 设置 allowCollision：true，可以让标注避让用户的标注
    allowCollision: true,
});
map.add(labelsLayer);

let deletepoint = []//全局变量储存要删除的点的信息
let manualPosition = []//全局变量储存手选点坐标
let poiPosition = []//全局变量储存坐标
var keywords = [] //获取输入框内地名信息
// let manualPositionName = []//全局变量储存手选点坐标附近的poi名称

AMap.plugin(['AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
    //poi选择点
    var autoOptions = {
        input: "location"
    };
    var auto = new AMap.AutoComplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        // city: "0755", // 兴趣点城市
        // citylimit: true,  //是否强制限制在设置的城市内搜索
        map: map, // 展现结果的地图实例
        panel: "panel", // 结果列表将在此容器中进行展示。
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    });  //构造地点查询类
    auto.on("select", select);//注册监听，当选中某条记录时会触发
    function select(e) {//成功查找后触发函数
        //禁用手动坐标
        let manual = document.getElementById('addMarker')
        manual.setAttribute("disabled", "disabled")
        //查找
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name, function (status, result) {//关键字查询查询
            //当查找成功
            if (result.info == 'OK') {
                keywords = document.getElementById('location').value
                ////按地名匹配坐标，push进poilocation
                for (let i = 0; i < result.poiList.pois.length; i++) {
                    if (result.poiList.pois[i].name == keywords) {
                        poiPosition = []
                        poiPosition.push(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat)
                        // console.log(poiPosition)
                    }
                }
                //绑定点击事件
                //鼠标选择中的dom
                var poiMarker = document.getElementsByClassName('amap-marker');
                var poiList = document.getElementsByClassName('poibox');

                //为每个点和list添加事件
                for (let i = 0; i < poiMarker.length; i++) {
                    //绑定poi点与坐标获取
                    poiMarker[i].addEventListener('click', function () {
                        //点击的地名在列表active中
                        keywords = document.getElementsByClassName('poibox active')[0].children[1].innerText;
                        //更改输入框的信息为地名
                        var text = document.getElementById('location')
                        text.value = keywords
                        //根据地名提取坐标poiPosition
                        for (let i = 0; i < result.poiList.pois.length; i++) {
                            //找到对应的坐标，push进poilocation
                            if (result.poiList.pois[i].name == keywords) {
                                poiPosition = []
                                poiPosition.push(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat)
                                // console.log(poiPosition)
                            }
                        }
                    });
                    //绑定poi列表与坐标获取
                    poiList[i].addEventListener('click', function () {
                        //点击的地名在列表active中
                        keywords = document.getElementsByClassName('poibox active')[0].children[1].innerText;
                        //更改输入框的信息为地名
                        var text = document.getElementById('location')
                        text.value = keywords
                        //根据地名提取坐标poiPosition
                        for (let i = 0; i < result.poiList.pois.length; i++) {
                            //找到对应的坐标，push进poilocation
                            if (result.poiList.pois[i].name == keywords) {
                                poiPosition = []
                                poiPosition.push(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat)
                                // console.log(poiPosition)
                            }
                        }
                    });
                }
            }
        });
    }

    //手选点
    //点击事件
    let clickListener = function (e) {

        if (typeof (marker) != "undefined") {
            map.remove(marker);
            manualPosition = [];
        }
        // 创建一个 icon
        var icon2 = new AMap.Icon({
            size: new AMap.Size(32, 32),
            image: '../static/icon/pin.png',
            imageSize: new AMap.Size(32, 32)
        });
        marker = new AMap.Marker({
            position: e.lnglat,
            map: map,
            icon: icon2,
            anchor: 'bottom-center', // 设置锚点方位
        });
        // console.log(e.lnglat.getLng(), e.lnglat.getLat());
        manualPosition.push(e.lnglat.getLng())
        manualPosition.push(e.lnglat.getLat())
        placeSearch.searchNearBy('', manualPosition, 200, function (status, result) {
            // console.log(result)
            // manualPositionName.push(result.poiList.pois[0].name)
            let text = document.getElementById("location")
            text.value = result.poiList.pois[0].name + '附近';
            keywords = result.poiList.pois[0].name + '附近';
            //绑定点击事件
            //鼠标选择中的dom
            var poiMarker = document.getElementsByClassName('amap-marker');
            var poiList = document.getElementsByClassName('poibox');
            // console.log(poiMarker.length,poiList.length)
            //为每个点和list添加事件
            for (let i = 0; i < poiMarker.length - 1; i++) {//我们手选点也是poimarker类，所以减1
                //绑定poi点与坐标获取
                poiMarker[i].addEventListener('click', function () {
                    //点击的地名在列表active中
                    keywords = document.getElementsByClassName('poibox active')[0].children[1].innerText + '附近';
                    //更改输入框的信息为地名
                    text.value = keywords
                    //更改坐标
                    manualPosition = []
                    manualPosition.push(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat)
                });
                //绑定poi列表与坐标获取
                poiList[i].addEventListener('click', function () {
                    //点击的地名在列表active中
                    keywords = document.getElementsByClassName('poibox active')[0].children[1].innerText + '附近';
                    //更改输入框的信息为地名
                    text.value = keywords
                    //更改坐标
                    manualPosition = []
                    manualPosition.push(result.poiList.pois[i].location.lng, result.poiList.pois[i].location.lat)
                });
            }
        });
    };//clickListener
    //手选点btn
    var addMarkerBtn = document.getElementById('addMarker');
    addMarkerBtn.addEventListener('click', function () {
        map.on("click", clickListener);
        //禁用poi坐标
        let input = document.getElementById("location")
        input.setAttribute('disabled', 'disabled')
    });

    // //精确定位
    // var geolocation = new AMap.Geolocation({
    //     // 是否使用高精度定位，默认：true
    //     enableHighAccuracy: true,
    //     // 设置定位超时时间，默认：无穷大
    //     timeout: 10000,
    //     // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
    //     buttonOffset: new AMap.Pixel(10, 20),
    //     //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    //     zoomToAccuracy: true,
    //     //  定位按钮的排放位置,  RB表示右下
    //     buttonPosition: 'RB'
    // })
    // map.addControl(geolocation);
    // geolocation.getCurrentPosition(function (status, result) {
    //     if (status == 'complete') {
    //         if (result.accuracy) {
    //             console.log('精度：' + result.accuracy + ' 米');
    //         }//如为IP精确定位结果则没有精度信息
    //         console.log('是否经过偏移：' + (result.isConverted ? '是' : '否'));
    //         console.log(result.position)
    //     } else {
    //         console.log(result.message)
    //     }
    // });

    //总取消 
    cancelAll = function () {
        //删除手选点
        if (typeof (marker) != "undefined")
            map.remove(marker);
        //解除监听
        map.off('click', clickListener);
        //解除禁用
        let manual = document.getElementById('addMarker');
        manual.removeAttribute("disabled");
        let input = document.getElementById('location');
        input.removeAttribute("disabled");
        //清空text1，2两个输入框的信息
        let text = document.getElementById('location');
        text.value = "";
        text.placeholder = '输入地点名称查询添加'
        let text2 = document.getElementById('message');
        text2.value = "";
        //清空坐标
        manualPosition = []
        poiPosition = []
        //移除poi搜索框
        placeSearch.clear();
        //关闭图片预览
        previewImage.style.display = 'none';
        file.value = '';
        //清空照片
        img = []
        $(".wordsNum_v1").html('0');
        $(".wordsNum_v1").css("color", "rgb(51,51,51)");
    };
    var cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', cancelAll);
});

//提交
function submitTo() {
    let message = document.getElementById('message').value;
    let user = localStorage.string;
    let mytime = new Date();
    let time = mytime.getFullYear() + '/' + (mytime.getMonth() + 1) + '/' + mytime.getDate() + ' ' + mytime.getHours() + '时' + mytime.getMinutes() + '分' + mytime.getSeconds() + '秒'
    // console.log(manualPosition, poiPosition)
    if (message == []) {
        alert('信息为空')
        refresh();
        cancelAll();
        return;
    }
    if (message.length > 200) {
        alert('信息长度超限')
        refresh();
        cancelAll();
        return;
    }
    if (poiPosition.length != 0 && manualPosition.length == 0) {
        let lng = poiPosition[0];
        let lat = poiPosition[1];
        let formData = new FormData()
        formData.append('user', user)
        formData.append('message', message)
        formData.append('lng', lng)
        formData.append('lat', lat)
        formData.append('time', time)
        formData.append('img', img)
        formData.append('poi', keywords)
        $.ajax({
            url: "http://39.108.108.16:5000/uploadData",
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // console.log(response)
            }
        })
    }
    else if (poiPosition.length == 0 && manualPosition.length != 0) {
        let lng = manualPosition[0];
        let lat = manualPosition[1];
        let formData = new FormData()
        formData.append('user', user)
        formData.append('message', message)
        formData.append('lng', lng)
        formData.append('lat', lat)
        formData.append('time', time)
        formData.append('img', img)
        formData.append('poi', keywords)
        $.ajax({
            url: "http://39.108.108.16:5000/uploadData",
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                // console.log(response)
            }
        })

    }
    else {
        alert("坐标错误")
    }
    refresh();
    cancelAll();
}
//删除点
function removePoint() {
    // console.log(deletepoint)
    let formData = new FormData()
    let user = deletepoint[0];
    let lng = deletepoint[1];
    let lat = deletepoint[2];
    let message = deletepoint[3];
    let time = deletepoint[4];
    formData.append('user', user)
    formData.append('message', message)
    formData.append('time', time)
    formData.append('lng', lng)
    formData.append('lat', lat)
    $.ajax({
        url: "http://39.108.108.16:5000/removePoint",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            // console.log(response)
        }
    })
    refresh();
    cancelAll();
}

//全局变量储存用户/信息统计数据
let messageCount = 0
let userCount = 0

//刷新函数
function refresh() {
    // console.log('refresh')
    $.ajax({
        url: "http://39.108.108.16:5000/getInfo",
        type: 'post',
        contentType: false,
        processData: false,
        success: function (response) {
            //清空地图与列表
            map.clearMap();
            let listGroup = document.getElementById('list-group');
            while (listGroup.firstChild) {
                listGroup.removeChild(listGroup.firstChild);
            }
            let userNameGroup = document.getElementById('collapseOne');
            while (userNameGroup.firstChild) {
                userNameGroup.removeChild(userNameGroup.firstChild);
            }
            //生成点与窗口
            let data = response['data']
            //点
            let labelMarkers = []
            //热力点
            let points = []
            //用户信息数统计
            let thisCount = 0
            //信息窗口
            let infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -35) });
            //此for循环将每个点的设置set好（重要！）
            for (let i = 0; i < data.length; i++) {
                //为热力图做数据准备
                points.push({ 'lng': data[i].lng, 'lat': data[i].lat, 'count': 500 })
                //设置点记文本
                var text = {
                    // 要展示的文字内容
                    content: data[i].user,
                    // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
                    direction: 'right',
                    // 在 direction 基础上的偏移量
                    offset: [10, -10],
                    // 文字样式
                    style: {
                        // 字体大小
                        fontSize: 12,
                        // 字体颜色
                        fillColor: '#22886f',
                        // 描边颜色
                        strokeColor: '#fff',
                        // 描边宽度
                        strokeWidth: 2,
                    }
                };
                //请求头像信息
                let iconSculpture = []
                let formData = new FormData();
                formData.append('user', data[i].user);
                $.ajax({
                    url: "http://39.108.108.16:5000/getSculpture",
                    type: 'post',
                    data: formData,
                    contentType: false,//在传信息到后端时要设置
                    processData: false,//在传信息到后端时要设置
                    success: function (response) {
                        if (response['sculpture'] != '')
                            iconSculpture = response['sculpture'];
                        else
                            iconSculpture = '../static/icon/street-view.png'
                        var icon1 = {
                            // 图标类型，现阶段只支持 image 类型
                            type: 'image',
                            // 图片 url
                            image: iconSculpture,
                            // 图片尺寸
                            size: [32, 32],
                            // 图片相对 position 的锚点，默认为 bottom-center
                            anchor: 'bottom-center',

                        };
                        //单个labelmarker
                        var labelMarker = new AMap.LabelMarker({
                            name: data[i].user + '-' + i, // 此属性非绘制文字内容，仅为标识使用
                            position: [data[i].lng, data[i].lat],
                            zIndex: 16,
                            // 将第一步创建的 icon 对象传给 icon 属性
                            icon: icon1,
                            // 将第二步创建的 text 对象传给 text 属性
                            text: text,
                        });
                        //设置文本换行
                        let slashedText = data[i].message;
                        let slash = 0
                        for (let j = 0; j < slashedText.length; j++) {
                            if (j % 40 == 0 && j != 0) {
                                slashedText = slashedText.substring(0, (j + slash)) + '</br>' + slashedText.substring((j + slash), slashedText.length);
                                slash = slash + 5
                            }
                        }

                        //设置信息窗体
                        if (data[i].img != "")
                            labelMarker.content = "<img class='windowImg' id='" + data[i].user + '-' + i + '-img' + "'src=" + data[i].img + ">" + slashedText;
                        else
                            labelMarker.content = slashedText;

                        labelMarker.on('click', markerClick);
                        //把每一个marker放入label markers
                        labelMarkers.push(labelMarker)
                        //绑定列表，当列表被点击缩放至点以及弹出窗体
                        $('#' + data[i].user + '-' + i).on('click', function () {
                            labelMarker.emit('click', { target: labelMarkers[i] });
                        })
                        //点加载入地图
                        labelsLayer.add(labelMarkers);
                    }
                })



                //添加列表项
                let listGroup = document.getElementById('list-group');
                let a = document.createElement('a');
                let a_head = document.createElement('h4');
                let a_text = document.createElement('p');
                let a_info = document.createElement('h6');
                let a_heart = document.createElement('img');
                let a_count = document.createElement('p');
                //如果是本用户，列表框添加蓝色，删除按钮
                if (localStorage.string == data[i].user) {
                    thisCount++//累计发布数
                    a.setAttribute('class', 'list-group-item active');
                    let a_btn = document.createElement('button');
                    a_btn.setAttribute('class', 'btn btn-danger pull-right');
                    a_btn.setAttribute('data-toggle', "modal");
                    a_btn.setAttribute('data-target', "#deleteModal")
                    a_btn.setAttribute('id', data[i].user + '-' + i + 'btn');
                    a_btn.innerHTML = 'delete';
                    a.appendChild(a_btn);
                }
                //否则
                else
                    a.setAttribute('class', 'list-group-item');

                //set新子元素属性
                a.setAttribute('id', data[i].user + '-' + i);
                a.setAttribute('href', '#' + data[i].user + '-' + i);
                a_head.setAttribute('class', 'list-group-item-heading');
                a_text.setAttribute('class', 'list-group-item-text');
                a_count.setAttribute('class', 'likeCount')
                a_info.setAttribute('class', "listInfo")
                a_heart.setAttribute('src', '../static/icon/heart.svg')
                a_heart.setAttribute('class', 'heart')
                a_heart.setAttribute('clicked', '0')
                a_heart.setAttribute('id', data[i].user + '-' + i + 'like');
                a_count.setAttribute('id', data[i].user + '-' + i + 'count')
                //dom加入列表
                listGroup.appendChild(a);
                a.appendChild(a_head);
                a.appendChild(a_info);
                a.appendChild(a_text);
                a.appendChild(a_count);
                a.appendChild(a_heart);
                //设置innertext
                a_head.innerHTML = data[i].user;
                a_text.innerHTML = "“" + data[i].message + "”";
                a_count.innerHTML = data[i].likeCount;
                if (data[i].poi != "")
                    a_info.innerHTML = data[i].time + "--" + data[i].poi;
                else
                    a_info.innerHTML = data[i].time

                //绑定删除按钮，点击后把坐标送到deletepoint数组
                $('#' + data[i].user + '-' + i + 'btn').on('click', function () {
                    deletepoint = []
                    deletepoint.push(data[i].user, data[i].lng, data[i].lat, data[i].message, data[i].time)
                })
                //绑定点赞
                $('#' + data[i].user + '-' + i + 'like').on('click', function () {
                    let likeIcon = document.getElementById(data[i].user + '-' + i + 'like')
                    if (likeIcon.getAttribute('clicked') == '0') {//如果没有一开始没有点赞则点赞
                        likeIcon.setAttribute('src', '../static/icon/heart-free-icon-font.svg')
                        likeIcon.setAttribute('clicked', '1')
                        let formData = new FormData()
                        formData.append('user', data[i].user)
                        formData.append('lng', data[i].lng)
                        formData.append('lat', data[i].lat)
                        formData.append('message', data[i].message)
                        formData.append('time', data[i].time)
                        formData.append('state', "1")
                        $.ajax({
                            url: "http://39.108.108.16:5000/editLike",
                            type: 'post',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                // console.log(response)
                                let likeCount = document.getElementById(data[i].user + '-' + i + 'count')
                                likeCount.innerHTML = response['likeCount']
                            }
                        })
                    }
                    else {//如果没有点赞则取消点赞
                        likeIcon.setAttribute('src', '../static/icon/heart.svg')
                        likeIcon.setAttribute('clicked', '0')
                        let formData = new FormData()
                        formData.append('user', data[i].user)
                        formData.append('lng', data[i].lng)
                        formData.append('lat', data[i].lat)
                        formData.append('message', data[i].message)
                        formData.append('time', data[i].time)
                        formData.append('state', "0")
                        $.ajax({
                            url: "http://39.108.108.16:5000/editLike",
                            type: 'post',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                // console.log(response)
                                let likeCount = document.getElementById(data[i].user + '-' + i + 'count')
                                likeCount.innerHTML = response['likeCount']
                            }
                        })
                    }
                })
            }
            //点击点或列表时触发的函数
            function markerClick(e) {
                cleanSelect()
                //窗体
                infoWindow.setContent(e.target.content);
                infoWindow.open(map, e.target.getPosition());
                //缩放
                map.setZoomAndCenter(16, e.target.getPosition());
                //列表锚点定位
                let list = document.getElementById("list-group");
                list = document.querySelector('#' + e.target._opts.name).scrollIntoView({ behavior: 'smooth' })
                //设置选中样式
                let item = document.getElementById(e.target._opts.name);
                item.style.opacity = "0.7"
                //图片绑定模态框
                $('#' + e.target._opts.name + "-img").on('click', function () {//id为：用户名-此用户信息编号-img
                    let targetImg = document.getElementById(e.target._opts.name + "-img")
                    let modalImg2 = document.getElementById("modal-img2");
                    modalImg2.setAttribute("src", targetImg.src)
                    $('#previewModal2').modal('show')
                })


            }

            //热力点加载入热力图
            map.plugin(["AMap.HeatMap"], function () {
                heatmap.setDataSet({
                    data: points,
                    max: 1000
                });
            })
            //读取用户与数据信息
            let messageWindow = document.getElementById('messageWindow')
            let userWindow = document.getElementById('userWindow')
            messageCount = response['messageCount']
            userCount = response['userCount']
            messageWindow.innerHTML = "当前信息总量：" + messageCount + " 你已发布：" + thisCount
            userWindow.innerHTML = "当前发布用户总量：" + userCount
            let hotWords = response['hotwords']
            let inputMessage = document.getElementById('message')
            inputMessage.removeAttribute('placeholder')
            if (hotWords.length == 0)
                inputMessage.setAttribute('placeholder', '信息')
            for (let i = 0; i < hotWords.length; i++) {
                let oldPlaceholder = inputMessage.placeholder
                inputMessage.setAttribute('placeholder', oldPlaceholder + '#' + hotWords[i])
            }
            let userGroup = response['userGroup'];
            let userNameList = document.getElementById('collapseOne')
            for (let i = 0; i < userGroup.length; i++) {
                let L = document.createElement('div')
                L.setAttribute('class', 'panel-body')
                L.innerHTML = userGroup[i]
                if (i > 5) {
                    L.innerHTML = '......'
                    userNameList.appendChild(L)
                    break;
                }
                userNameList.appendChild(L)
            }
        }//success
    })
}
