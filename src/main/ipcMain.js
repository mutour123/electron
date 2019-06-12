const {ipcMain} = require('electron')
//初始化数据
const n = 60
console.log('here:')
console.log(parkingLot)


// 主进程处理渲染进程广播数据
ipcMain.on('add', (event, data) => {
    if (parkingLot.length < n) {
        let flag = false
        for (let [index, item] of parkingLot.entries()) {
            if (item.carnum === data.carnum) {
                event.sender.send('addInfo', {status: -1, msg: `该车已存在`, data: ''})
                return
            }
        }
        parkingLot.push(data)
        event.sender.send('addInfo', {status: 0, msg: '录入成功', data: '录入成功'})

    } else {
        event.sender.send('addInfo', {status: -1, msg: `录入失败，数量已经超过${n}`, data: ''})
    }
})

ipcMain.on('getCarList', (event, data) => {
    console.log(111111111111)
    console.log(parkingLot)
    event.sender.send('carListData', {status: 0, msg: '', data: parkingLot})
})

ipcMain.on('delete', (event, data) => {
    console.log('data:\n', data)

    let his
    for (let [index, item] of parkingLot.entries()) {
        if (item.carnum === data.carnum) {
            [his] = parkingLot.splice(index, 1)
            his.endTime = new Date().getTime()
            his.price = data.price
            history.push(his)
            console.log(1111111111111111111111)
            event.sender.send('deleteRes', {status: 0, msg: ``, data: '删除成功'})
            return
        }
    }
    event.sender.send('deleteRes', {status: -1, msg: `没有符合的数据`, data: ''})
})

ipcMain.on('getHistory', (event, data) => {
    event.sender.send('getHistoryRes', {status: 0, msg: '', data: history})
})


ipcMain.on('search', (event, data) => {
    let result = []
    for (let [index, item] of parkingLot.entries()) {
        if (data.keyword === 'carnum') { // 车牌号
            if (item.carnum === data.value) {
                result.push(item)
                break
            }
        } else if (data.keyword === 'carCate') {
            if (item.carCate === data.value) {
                result.push(item)
            }
        }
    }

    event.sender.send('searchRes', {status: 0, msg: '', data: result})
})


ipcMain.on('searchHistory', (event, data) => {
    let result = []
    for (let [index, item] of parkingLot.entries()) {
        if (data.keyword === 'carnum') { // 车牌号
            if (item.carnum === data.value) {
                result.push(item)
            }
        } else if (data.keyword === 'carCate') {
            if (item.carCate === data.value) {
                result.push(item)
            }
        }
    }

    event.sender.send('searchHistoryRes', {status: 0, msg: '', data: result})
})

ipcMain.on('addWrite', (event, data) => {
    for (let [index, item] of write.entries()) {
        if(item.carnum === data.carnum) {
            event.sender.send('addWriteRes', {status: -1, msg: '该车已经存在', data: ''})
            return
        }
    }
    write.push(data)
    event.sender.send('addWriteRes', {status: 0, msg: '', data: '添加成功'})
})

ipcMain.on('getWrite', (event, data) => {
    event.sender.send('getWriteRes', {status: 0, msg: '', data: write})
})

ipcMain.on('deleteWrite', (event, data) => {
    for (let [index, item] of write.entries()) {
        if(item.carnum === data.carnum) {
            write.splice(index, 1)
            event.sender.send('deleteWriteRes', {status: 0, msg: '', data: '删除成功'})
            return
        }
    }
    event.sender.send('deleteWriteRes', {status: -1, msg: '该数据不存在', data: ''})

})

ipcMain.on('addMoney', (event, data) => {
    for (let [index, item] of money.entries()) {
        if(item.carnum === data.carnum) {
            item.money = item.money*1 + data.money*1
            event.sender.send('addMoneyRes', {status: 0, msg: '', data: '充值成功'})
            return
        }
    }
    money.push(data)
    event.sender.send('addMoneyRes', {status: 0, msg: '', data: '充值成功'})

})

ipcMain.on('getMoney', (event, data) => {
    event.sender.send('getMoneyRes', {status: 0, msg: '', data: money})

})
