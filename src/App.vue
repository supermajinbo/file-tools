<template>
  <div class="main">
    <div class="flex">
      <el-select v-model="mode" class="wid200">
        <template #prefix>
          <div class="select-prefix">
            模式
          </div>
        </template>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="addType" v-if="isAdd" class="wid220">
        <template #prefix>
          <div class="select-prefix">
            添加模式
          </div>
        </template>
        <el-option label="文件名前" value="before" />
        <el-option label="文件名后" value="after" />
      </el-select>
      <el-input v-model="addBeforeText" placeholder="请输入内容" class="wid30p" clearable>
        <template #prepend>{{ isAdd ? '添加内容' : '原内容' }}</template>
      </el-input>
      <el-input v-if="!isAdd" v-model="addAfterText" placeholder="请输入内容" class="wid30p" clearable>
        <template #prepend>新内容</template>
      </el-input>
      <el-button type="primary" @click="reNameFile">{{ isAdd ? '添加' : '替换' }}</el-button>
    </div>
    <div class="flex">
      <label for="directory">
        <el-button type="primary" @click="handleClick">选择文件夹</el-button>
        <input type="file" id="directory" webkitdirectory directory style="display: none;" />
      </label>
      <label for="file">
        <el-button type="primary" @click="handleClick">选择文件</el-button>
        <input type="file" id="file" multiple style="display: none;" />
      </label>
      <el-button type="primary" @click="handleClear">清空文件列表</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-if="tableData?.length">
      <el-table-column prop="oldFileName" label="源文件名" />
      <el-table-column prop="newFileName" label="新文件名" />
    </el-table>
    <el-empty v-else description="请选择文件或文件夹" />
  </div>
</template>

<script setup>
import { ipcRenderer } from 'electron';
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'

let directoryDom = null
let fileDom = null
const options = [
  { value: 'add', label: "添加文字" },
  { value: 'replace', label: "替换文字" }
]
const mode = ref('replace')
const addType = ref('before')
const isAdd = computed(() => {
  return mode.value === 'add'
})
const addBeforeText = ref('')
const addAfterText = ref('')

const tableData = ref([])

const handleClick = (even) => {
  even.target.parentNode.click()
}

const handleClear = () => {
  tableData.value = []
}

function reNameFile() {
  if (!tableData.value.length) {
    ElMessage.warning('请选择文件或文件夹')
    return
  }
  ipcRenderer.send('nodejs-rename-file',
    JSON.stringify(tableData.value.map(e => ({
      oldFileName: e.oldFileName,
      newFileName: e.newFileName
    }))));
}

function getFiles(e) {
  const fileArr = []
  var files = e.target.files;

  for (var i = 0; i < files.length; i++) {
    const pathArr = files[i]?.path?.split('/')
    pathArr.pop()
    const path = pathArr.join('/')
    fileArr.push({
      path,
      name: files[i].name,
      oldFileName: files[i].path,
      newFileName: files[i].path
    })
  }
  tableData.value = fileArr
}

watchEffect(() => {
  if (mode.value === 'add') {
    tableData.value.forEach(item => {
      if (addType.value === 'before') {
        item.newFileName = item.path + '/' + addBeforeText.value + item.name
      } else {
        item.newFileName = item.path + '/' + item.name + addBeforeText.value
      }
    })
  } else if (mode.value === 'replace') {
    tableData.value.forEach(item => {
      if (addBeforeText.value === '') {
        item.newFileName = item.oldFileName
      } else {
        item.newFileName = item.path + '/' + item.name.replaceAll(addBeforeText.value, addAfterText.value)
      }
    })
  }
})

const addEventListener = () => {
  directoryDom = document.getElementById('directory')
  fileDom = document.getElementById('file')
  if (directoryDom) {
    directoryDom.addEventListener("change", getFiles);
  }
  if (fileDom) {
    fileDom.addEventListener("change", getFiles);
  }
}

const removeEventListener = () => {
  if (directoryDom) {
    directoryDom.removeEventListener("change", getFiles);
  }
  if (fileDom) {
    fileDom.removeEventListener("change", getFiles);
  }
}

onMounted(() => {
  addEventListener()
  ipcRenderer.on('nodejs-result', (_, result) => {
    // 处理 nodejs 返回的结果
    if (result.success) {
      ElMessage.success(result.msg)
      tableData.value.forEach(item => {
        item.oldFileName = item.newFileName
      })
    } else {
      ElMessage.error(result.msg)
    }
  });
})

onBeforeUnmount(removeEventListener)
</script>

<style>
.main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

.flex {
  display: flex;
  gap: 20px;
  align-items: center;
}

.wid200 {
  min-width: 180px;
  max-width: 180px;
}

.wid220 {
  min-width: 220px;
  max-width: 220px;
}

.wid30p {
  width: 30%;
  min-width: 200px;
  max-width: 600px;
}

.select-prefix {
  position: relative;
  left: -10px;
  background-color: var(--el-fill-color-light);
  padding: 0 20px;
  border-radius: 3px 0 0 3px;
  border-right: 1px solid #ddd;
}
</style>
