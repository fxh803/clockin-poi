
var dom = document.getElementById('echart-container');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};
//设置锚点时间限制在现在时间的一分钟之内
anchorTime = new Date();
anchorDate1 = anchorTime.getFullYear() + '/' + (anchorTime.getMonth() + 1) + '/' + anchorTime.getDate() + ' ' + anchorTime.getHours() + ':' + anchorTime.getMinutes() + ':00';
anchorDate2 = anchorTime.getFullYear() + '/' + (anchorTime.getMonth() + 1) + '/' + anchorTime.getDate() + ' ' + anchorTime.getHours() + ':' + (anchorTime.getMinutes() + 1) + ':00';
var option;
var anchor = [
    { name: anchorDate1, value: [anchorDate1, 0] },
    { name: anchorDate2, value: [anchorDate2, 0] }
];
//全局贮存信息总数
var val=[]
//查询信息总数
function getMessageCount(){
    $.ajax({
        url: "http://39.108.108.16:5000/getInfo",
        type: 'post',
        // async: false,
        success: function (response) {
            val = response['messageCount'];
        }
    })
}
//设置好数据
function messageData() {
    now = new Date();
    nowDate = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    let value =val;
    return {
        name: [nowDate],
        value: [
            nowDate,
            value
        ]
    };
}
let data = [];
option = {
    title: {
        text: '数据总量(若有波动请刷新页面更新)'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            params = params[0];
            var date = new Date(params.data.name);
            return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' : ' + params.value[1];
        },
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },
    series: [{
        name: '模拟数据',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: data
    },
    {
        name: '.anchor',
        type: 'line',
        showSymbol: false,
        data: anchor,
        itemStyle: { normal: { opacity: 0 } },
        lineStyle: { normal: { opacity: 0 } }
    }]
};
setInterval(function () {
    // data.shift();
    getMessageCount();
    data.push(messageData());
    myChart.setOption({
        series: [
            {
                data: data
            }
        ]
    });
}, 10000);
if (option && typeof option === 'object') {
    myChart.setOption(option);
}
window.addEventListener('resize', myChart.resize);
