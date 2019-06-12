<template>
    <div id="app">
        <el-container>
            <el-aside class="nav" width="160px;">
                <el-menu
                        default-active="/"
                        class="el-menu-vertical-demo"
                        background-color="#1c2a3a"
                        text-color="#fff"
                        router
                        active-text-color="#ffd04b">
                    <el-menu-item index="/">
                        <i class="el-icon-document"></i>
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <el-menu-item index="/car-add">
                        <i class="el-icon-setting"></i>
                        <span slot="title">白名单</span>
                    </el-menu-item>
                    <el-menu-item index="/car-list">
                        <i class="el-icon-menu"></i>
                        <span slot="title">充值平台</span>
                    </el-menu-item>
                    <el-menu-item index="/car-delete">
                        <i class="el-icon-setting"></i>
                        <span slot="title">快速出库</span>
                    </el-menu-item>
                    <el-menu-item index="/history">
                        <i class="el-icon-menu"></i>
                        <span slot="title">历史记录</span>
                    </el-menu-item>

                </el-menu>
            </el-aside>
            <el-main style="padding: 0;">
                <div class="main">
                    <router-view/>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import LandingPage from '@/components/LandingPage'

    export default {
        name: 'my-project',
        components: {
            LandingPage
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted() {

            console.log(111)
        }
    }
</script>

<style scoped lang="scss">
    #app {
        display: flex;
        height: 100vh;
        min-height: 400px;
        .nav {
            background-color: #1c2a3a;
            width: 160px;
            min-height: 400px;
            height: 100vh;

            .el-menu {
                border-color: #1c2a3a;
            }
        }

        .main {
            min-height: 400px;
            height: 100vh;
            overflow: auto;
        }
    }
</style>
