
<template>
  <section class="demo-wrapper">
    <w-button
      style="width: 100px; margin-bottom: 15px"
      type="primary"
      @click="onAddRow"
    >
      新 增
    </w-button>
    <w-button
      style="width: 100px; margin-bottom: 15px"
      type="primary"
      @click="getData"
    >
      请求数据
    </w-button>
    <w-table :data="tableData" style="width: 100%" border>
      <w-table-column prop="time" label="就诊时间">
        <template slot-scope="scope">
          <template v-if="isEditing && scope.$index === currentIndex">
            <w-date-picker
              v-model="scope.row.time"
              type="date"
              size="small"
              placeholder="请选择就诊时间"
              format="yyyy.MM.dd"
              value-format="yyyy.MM.dd"
            />
          </template>
          <template v-else>
            <template v-if="scope.row.time">
              <i style="color: #7e89a4" class="w-icon-time" />
              <span style="margin-left: 8px">{{ scope.row.time }}</span>
            </template>
          </template>
        </template>
      </w-table-column>
      <w-table-column prop="name" label="姓名" width="180">
        <template slot-scope="scope">
          <template v-if="isEditing && scope.$index === currentIndex">
            <w-input v-model="scope.row.name" size="small" placeholder="请输入姓名" />
          </template>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </w-table-column>
      <w-table-column prop="status" label="签约状态" width="180">
        <template slot-scope="scope">
          <!-- 通过绝对定位的方式,解决编辑状态单元格因dom结构变化造成的抖动 -->
          <div style="position: relative; height: 32px">
            <template v-if="isEditing && scope.$index === currentIndex">
              <w-select
                v-model="scope.row.status"
                size="small"
                placeholder="请选择签约状态"
                style="position: absolute"
              >
                <w-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </w-select>
            </template>
            <template v-else>
              <w-tag
                v-if="scope.row.status"
                :type="renderType(scope.row.status)"
                style="position: absolute"
              >
                {{ scope.row.status }}
              </w-tag>
            </template>
          </div>
        </template>
      </w-table-column>
      <w-table-column fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <template v-if="isEditing && scope.$index === currentIndex">
            <w-button
              style="color: #00AC44;"
              type="text"
              :disabled="disabledSaveBtn(scope.row)"
              @click="onSave(scope.row)"
            >
              保存
            </w-button>
            <w-button
              style="color: #666666;"
              type="text"
              @click="onResetData(scope.row)"
            >
              取消
            </w-button>
          </template>
          <template v-else>
            <w-button type="text" @click="onEditing(scope)">编辑</w-button>
            <w-popconfirm
              ref="popper"
              trigger="click"
              title="确定要删除该数据吗？"
              icon="w-icon-warning"
              icon-color="#ff8c00"
              placement="bottom"
              @confirm="handleDelete(scope.row)"
            >
              <w-button slot="reference" style="margin-left: 8px;" type="text">
                删除
              </w-button>
            </w-popconfirm>
          </template>
        </template>
      </w-table-column>
    </w-table>
  </section>
</template>

<script>
import { getList } from '@/api/test'
export default {
  name: 'TestTable',
  data() {
    return {
      isEditing: false,
      currentIndex: null,
      currentRow: null,
      newRow: {
        time: '',
        status: '',
        name: '',
        type: '',
        isAdding: true
      },
      options: [
        {
          value: '未签约',
          label: '未签约'
        },
        {
          value: '已签约',
          label: '已签约'
        },
        {
          value: '其他区签约',
          label: '其他区签约'
        }
      ],
      tableData: [
        {
          time: '2019.05.12',
          status: '其他区签约',
          name: '赵宇翔',
          type: '其他'
        },
        {
          time: '2019.05.12',
          status: '未签约',
          name: '肖新宇',
          type: '本地医保'
        },
        {
          time: '2019.05.13',
          status: '已签约',
          name: '陈慕杰',
          type: '本地医保'
        },
        {
          time: '2019.05.14',
          status: '未签约',
          name: '李自然',
          type: '本地医保'
        }
      ]
    }
  },
  methods: {
    disabledSaveBtn(row) {
      return JSON.stringify(row) === JSON.stringify(this.newRow)
    },
    onAddRow() {
      this.tableData.unshift({
        ...this.newRow
      })
      this.isEditing = true
      this.currentIndex = 0
      this.currentRow = {
        ...this.newRow
      }
    },
    onSave(row) {
      // 请求保存接口
      // ...
      this.$Message({
        message: '保存成功!',
        type: 'success'
      })
      this.$set(row, 'isAdding', false)
      // 改变状态值
      this.isEditing = false
      this.currentIndex = null
    },
    onEditing(scope) {
      this.isEditing = true
      this.currentIndex = scope.$index
      this.currentRow = {
        ...scope.row
      }
    },
    renderType(status) {
      if (status === '未签约') {
        return 'warning'
      } else if (status === '已签约') {
        return 'success'
      }
      return ''
    },
    checkRowEmpty(row) {
      return ['time', 'status', 'name', 'type'].every((value) => row[value] === '')
    },
    onResetData(row) {
      // todo 气泡确认框
      const { isAdding } = row
      const empty = this.checkRowEmpty(row)

      if (isAdding && empty) {
        // 如果是新增，且没有填入任何值时，点击取消则为删除
        this.isEditing = false
        this.currentRow = null
        this.currentIndex = null
        const index = this.tableData.findIndex((item) => item === row)
        this.tableData.splice(index, 1)
        return
      }

      if (isAdding && !empty) {
        this.$Confirm('确定取消新增?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isEditing = false
            this.currentRow = null
            this.currentIndex = null
            const index = this.tableData.findIndex((item) => item === row)
            this.tableData.splice(index, 1)
          })
          .catch(() => {
            this.$Message({
              type: 'info',
              message: '已取消操作'
            })
          })
        return
      }

      this.$Confirm('确定要取消编辑状态吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 还原该行数据
          const index = this.tableData.findIndex((item) => item === row)
          this.$set(this.tableData, index, this.currentRow)
          // 还原状态值
          this.isEditing = false
          this.currentIndex = null
        })
        .catch(() => {
          this.$Message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleDelete(row) {
      const index = this.tableData.findIndex((item) => item === row)
      this.tableData.splice(index, 1)
      this.$Message({
        type: 'success',
        message: '删除成功!'
      })
    },
    getData() {
      // 请求数据接口
      // winbpweb/p?action=newupay&beanaction=getOrgInfoConfigs&jlzt=0
      getList().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
