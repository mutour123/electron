<template>
    <div class="car-add">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="车牌号">
                <el-input v-model="form.carnum"></el-input>
            </el-form-item>
            <el-form-item label="车主">
                <el-input v-model="form.carUser"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>


        <div style="margin-top: 30px;">
            <el-input placeholder="请输入内容" v-model="search.value" class="input-with-select" style="width: 100%;">
                <el-select slot="prepend" v-model="search.key" placeholder="请选择" style="width:100px;">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="searchM"></el-button>
            </el-input>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="carnum" label="车牌号" width="180">
            </el-table-column>
            <el-table-column prop="carUser" label="车主">
            </el-table-column>
            <el-table-column prop="time" label="日期" width="180">
                <template slot-scope="scope">
                    {{scope.row.time|simpletime}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');

    export default {
        name: "CarAdd",
        data() {
            return {
                options: [{
                    value: '车牌号',
                    label: '车牌号'
                }, {
                    value: '车主',
                    label: '车主'
                }],
                value: '',
                select: '',
                search: {
                    key: '车牌号',
                    value: '川A74110'
                },
                form: {
                    carnum: '川A74110',
                    carUser: '张三'
                },
                tableData: [],
                tableDataC: [],

            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
                this.form.time = new Date().getTime()
                ipcRenderer.send('addWrite', this.form)
                ipcRenderer.on('addWriteRes', (event, data) => {
                    if (data.status === 0) {
                        this.$message.success(data.data)
                        ipcRenderer.send('getWrite')
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            handleDelete(index, row){
                ipcRenderer.send('deleteWrite', {carnum: row.carnum})
                ipcRenderer.on('deleteWriteRes', (event, data) => {
                    if (data.status === 0) {
                        this.$message.success(data.data)
                        this.tableData.splice(index, 1)
                    } else {
                        this.$message.error(data.msg)
                    }
                })
            },
            searchM(){
                if(this.search.value != '') {
                    if (this.search.key === '车牌号') {
                        this.search.value.trim()
                        let arr = this.tableDataC.filter(item => {
                            console.log(item.carnum)
                            console.log(this.search.value)
                            console.log(item.carnum == this.search.value)
                            return item.carnum == this.search.value
                        })
                        console.log(arr)
                        this.tableData = arr
                    } else if (this.search.key === '车主') {
                        this.tableData = this.tableDataC.filter(item => item.carUser == this.search.value)
                    }
                }else {
                    this.tableData = this.tableDataC
                }
            }
        },
        mounted() {
            ipcRenderer.send('getWrite')
            ipcRenderer.on('getWriteRes', (event, data) => {
                if (data.status === 0) {
                    this.tableData = data.data
                    this.tableDataC = data.data

                } else {
                    this.tableData = []
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .car-add {
        padding: 20px;
    }
</style>