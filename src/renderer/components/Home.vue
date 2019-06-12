<template>
    <div class="home">
        <div class="status">
            <h3>当前状态</h3>
            <div>车位： 60</div>
            <div>当前车辆：{{n_carnum}} 量</div>
        </div>
        <div class="car-add">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="车牌号">
                    <el-input v-model="form.carnum"></el-input>
                </el-form-item>
                <el-form-item label="颜色">
                    <el-input v-model="form.carcolor"></el-input>
                </el-form-item>
                <el-form-item label="车型">
                    <el-select v-model="form.carCate" >
                        <el-option label="小汽车" value="0"></el-option>
                        <el-option label="小卡" value="1"></el-option>
                        <el-option label="中卡" value="2"></el-option>
                        <el-option label="大卡" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');

    export default {
        name: "Home.vue",
        data(){
            return {
                n_carnum: 0,
                form: {
                    carnum: '川A74110',
                    carcolor: '白色',
                    carCate: '0',
                    startTime: '',
                    endTime: '',
                    price: ''
                },
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
                this.form.startTime = new Date().getTime()
                ipcRenderer.send('add', this.form)
                ipcRenderer.on('addInfo', (event, data) => {
                    if(data.status === 0) {
                        this.$message.success(data.data)
                        this.n_carnum += 1
                    }else {
                        this.$message.error(data.msg)
                    }
                })
            }
        },
        mounted(){
            ipcRenderer.send('getCarList')
            // 得到所有数据
            ipcRenderer.on('carListData', (event, data) => {
                if (data.status === 0) {
                    this.n_carnum = data.data.length
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    .home {
        padding: 20px;
        .status {
            display: flex;
            margin-bottom: 40px;
        }
    }
</style>