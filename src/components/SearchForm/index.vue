<template>
  <!-- w-form存在样式问题，暂用el-form  -->
  <div v-if="columns.length" class="card">
    <el-form ref="formRef" :model="searchParam">
      <el-form-item
        v-for="(item, index) in columns"
        :key="item.prop"
        :index="index"
        :label="`${item.label} :`"
      >
        <SearchFormItem :column="item" :search-param="searchParam" :search="search" />
      </el-form-item>
      <div v-if="showOperation" class="operation">
        <w-button type="primary" @click="search"> 搜索 </w-button>
        <!--        <el-button :icon="Delete" @click="reset"> 重置 </el-button>-->
        <!--        <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">-->
        <!--          {{ collapsed ? "展开" : "合并" }}-->
        <!--        </el-button>-->
      </div>
    </el-form>
  </div>
</template>
<script>
import SearchFormItem from './components/SearchFormItem'
export default {
  name: 'SearchForm',
  components: {
    SearchFormItem
  },
  props: {
    // 搜索方法
    search: {
      type: Function,
      default: () => {}
    },
    // 重置方法
    reset: {
      type: Function,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => []
    },
    // 搜索参数
    searchParam: {
      type: Object,
      default: () => ({})
    },
    searchCol: {
      type: Number,
      default: 4
    },
    showOperation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否默认折叠搜索项目
      collapsed: true
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
