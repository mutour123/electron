<template>
    <div class="history">
        <h3>历史记录： {{historyNum}}条</h3>
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
                <button @click="search">图书检索</button>
            </div>
        </div>
        <div class="result">
            <el-table :data="tableData" align="center">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="车牌号" prop="carnum"></el-table-column>
                <el-table-column label="颜色" prop="carcolor"></el-table-column>
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
                <el-table-column label="结束时间" width="200px">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.endTime|goodtime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="缴纳费用">
                    <template slot-scope="scope">
                        <span>{{scope.row.price}}元</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');
    export default {
        name: "History",
        data() {
            return {
                searchInfo: {
                    keyword: 'carnum',
                    value: '川A74110'
                },
                tableData: [],
                historyNum: 0,
                isSearched: false
            }
        },
        methods: {
            search() {
                ipcRenderer.send('searchHistory', this.searchInfo)
                // 得到删除数据的返回
                ipcRenderer.on('searchHistoryRes', (event, data) => {
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
            ipcRenderer.send('getHistory')
            // 得到所有数据
            ipcRenderer.on('getHistoryRes', (event, data) => {
                if (data.status === 0) {
                    this.tableData = data.data
                    this.historyNum = data.data.length
                } else {
                    this.tableData = []
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .history {
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
</style>