<template>
    <div class="delete">
        <div class="search-box">
            <div class="radio-box">
                <el-radio v-model="searchInfo.keyword" label="carnum">车牌号</el-radio>
                <el-radio v-model="searchInfo.keyword" label="carCate">车型</el-radio>
            </div>
            <div class="input-box">
                <div class="input">
                    <input type="text" v-model="searchInfo.value"
                           class="keyword"
                           placeholder="请输入需要检索的内容">
                </div>
                <button @click="search">搜索</button>
            </div>
        </div>
        <div class="result">
            <div class="result-box">
                <el-table :data="tableData" stripe style="">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="车牌号" prop="carnum"></el-table-column>
                    <el-table-column label="车型" prop="carCate">
                        <template slot-scope="scope">
                            <span>{{ scope.row.carCate|carCategory}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="开始时间" width="200px">
                        <template slot-scope="scope">
                            <i class="el-icon-time"></i>
                            <span style="margin-left: 10px">{{ scope.row.startTime|goodtime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="showBox(scope.$index, scope.row)">出库
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');
    export default {
        name: "CarDelete",
        data() {
            return {
                searchInfo: {
                    keyword: 'carnum',
                    value: '川A74110'
                },
                tableData: [
                    { carCate: '0',
                        carcolor: '白色',
                        carnum: '川A74110',
                        endTime: '',
                        price: '',
                        startTime: 1560272042690 }
                ],
                isSearched: false,
                money: [],
                wirte: []
            }
        },
        methods: {
            showBox(index, row) {
                let flag = false
                let fee = 0
                let str = ''
                //判断是否是白名单用户

                for(let [index, item] of this.wirte.entries()){
                    if(item.carnum == row.carnum ){
                        str += "您在白名单内，无需缴费"
                        flag = true
                        break
                    }
                }
                //判断是否有余额
                if(!flag) {
                    for (let [index, item] of this.money.entries()) {
                        if (item.carnum == row.carnum) {
                            str += `您有余额${item.money}元，无需缴费`
                            flag = true
                            break
                        }
                    }
                }
                if(!flag) {
                    console.log(index, row);
                    let s = (new Date() - row.startTime) / 1000
                    let min = s / 60
                    let hours = Math.floor(min / 60)
                    fee = Math.round(min / 30) * 5
                    str = '您本次停车'
                    console.log(hours, min, fee)
                    if (hours > 0) {
                        str += `${hours}小时`
                    } else if (Math.ceil(min / 30)) {
                        str += `${Math.floor(min - hours * 60)}分`
                    }
                    str += `，需要交纳费用${fee}元`
                }


                this.$prompt(str, '缴费', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: new RegExp(fee),
                    inputErrorMessage: '请输入正确的金额'
                }).then(({value}) => {
                    this.handleDelete(index, row, fee)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '暂未出库'
                    });
                });

            },
            handleDelete(index, row, fee) {
                console.log(index, row);
                ipcRenderer.send('delete', {carnum: row.carnum, price: fee})

                // 得到删除数据的返回
                ipcRenderer.on('deleteRes', (event, data) => {
                    if (data.status === 0) {
                        console.log('index:' + index)
                        this.tableData.splice(index, 1)
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(data.msg)

                    }
                })
            },
            search() {
                ipcRenderer.send('search', this.searchInfo)

                // 得到删除数据的返回
                ipcRenderer.on('searchRes', (event, data) => {
                    console.log(data)
                    if (data.status === 0) {
                        this.tableData = data.data
                    } else {
                        this.tableData = []
                    }
                })
            }
        },
        mounted() {
            ipcRenderer.send('getCarList')
            // 得到所有数据
            ipcRenderer.on('carListData', (event, data) => {
                if (data.status === 0) {
                    this.tableData = data.data
                    console.log(1111)
                    console.log(data)
                    console.log(this.tableData)
                } else {
                    this.tableData = []
                }
            })

            ipcRenderer.send('getMoney')
            ipcRenderer.on('getMoneyRes', (event, data) => {
                if (data.status === 0) {
                    this.money = data.data
                } else {
                    this.money = []
                }
            })

            ipcRenderer.send('getWrite')
            ipcRenderer.on('getWriteRes', (event, data) => {
                if (data.status === 0) {
                    this.wirte = data.data
                } else {
                    this.wirte = []
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .delete {
        padding: 20px;
    }

    .search-box {
        width: 600px;
        margin: auto;

        .radio-box {
            padding: 10px 0;

            .el-radio__label {
                font-size: 12px;
                font-weight: bolder;
            }
        }

        .input-box {
            font-size: 18px;
            display: flex;

            .input {
                position: relative;
                width: 80%;

                .keyword {
                    width: 100%;
                    display: inline-block;
                    font-size: inherit;
                    height: 46px;
                    padding-left: 10px;
                    vertical-align: top;
                    border-radius: 5px 0 0 5px;
                    border: 1px solid #66afe9;
                    box-sizing: border-box;
                    outline: none;
                    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)
                }

                .recommend {
                    list-style: none;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    border: 1px solid #acb2b7;
                    position: absolute;
                    z-index: 10;
                    background-color: #ffffff;

                    li {
                        padding: 4px 10px;

                        &:hover {
                            background-color: #5bc0de;
                        }
                    }
                }
            }

            button {
                width: 20%;
                height: 46px;
                background-color: #5bc0de;
                border: #46b8da;
                border-radius: 0 5px 5px 0;
                color: #ffffff;
                font-size: inherit;
                cursor: pointer;
            }
        }
    }
</style>查询