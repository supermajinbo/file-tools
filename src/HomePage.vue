<template>
    <div class="main">
        <div class="func" @click="() => handleClick('/replace')">
            <ReplaceIcon :size="64" color="currentColor" />
            <span>批量重命名</span>
        </div>
        <div class="func" @click="() => handleClick('delete')">
            <DeleteIcon :size="64" color="currentColor" />
            <span>批量删除</span>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import ReplaceIcon from './components/ReplaceIcon'
import DeleteIcon from './components/DeleteIcon'

const router = useRouter()
const handleClick = (path) => {
    router.push(path)
}
</script>

<style scoped>
.main {
    display: flex;
    gap: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.func {
    --len: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    border: 1px solid #ddd;
    width: var(--len);
    height: var(--len);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
}

.func:hover {
    border-color: #fff;
    background-color: #409EFF;
    color: #fff;
}

.main .img {
    width: 64px;
    height: 64px;
}
</style>

