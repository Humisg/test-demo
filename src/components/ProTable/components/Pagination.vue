<template>
  <!-- 分页组件 -->
  <el-pagination
    :background="true"
    :current-page="pageNum"
    :page-size="pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    pageableChange: {
      type: Function,
      default: null
    },
    handleSizeChange: {
      type: Function,
      default: null
    },
    handleCurrentChange: {
      type: Function,
      default: null
    }
  }
}
</script>
