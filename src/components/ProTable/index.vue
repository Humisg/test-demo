<template>
  <div>
    <!-- 查询表单 card -->
    <SearchForm
      v-show="isShowSearch"
      :search="search"
      :reset="reset"
      :columns="searchColumns"
      :search-param="searchParam"
    />
    <!-- 表格内容 card -->
    <div class="card table-main">
      <!-- 表格头部 操作按钮 -->
      <div class="table-header">
        <div class="header-button-lf">
          <slot name="tableHeader" :selected-list-ids="selectedListIds" :selected-list="selectedList" :is-selected="isSelected" />
        </div>
        <div v-if="toolButton" class="header-button-ri">
          <slot name="toolButton">
            <w-button icon="el-icon-refresh" circle @click="getTableList" />
            <w-button icon="el-icon-search" circle @click="isShowSearch = !isShowSearch" />
          </slot>
        </div>
      </div>
      <!-- 表格主体 -->
      <w-table
        ref="tableRef"
        v-bind="$attrs"
        :data="data || tableData"
        :border="border"
        :row-key="rowKey"
        @selection-change="selectionChange"
      >
        <!-- 默认插槽 -->
        <slot />
        <div v-for="item in tableColumns" :key="item[rowKey]">
          <!-- selection || index || expand -->
          <w-table-column
            v-if="item.type && ['selection', 'index', 'expand'].includes(item.type)"
            v-bind="item"
            :align="item.align || 'center'"
            :reserve-selection="item.type === 'selection'"
          >
            <template v-if="item.type === 'expand'" #default="scope">
              <component :is="item.render" v-if="item.render" v-bind="scope" />
              <slot v-else :name="item.type" v-bind="scope" />
            </template>
          </w-table-column>
          <!-- other -->
          <TableColumn :column="item">
            <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </TableColumn>
        </div>
        <!-- 插入表格最后一行之后的插槽 -->
        <template #append>
          <slot name="append" />
        </template>
        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <!-- <img src="@/assets/images/notData.png" alt="notData" /> -->
              <div>暂无数据</div>
            </slot>
          </div>
        </template>
      </w-table>
      <!-- 分页组件 -->
      <slot name="pagination">
        <Pagination
          v-if="isPageable"
          v-bind="pageable"
          :handle-size-change="handleSizeChange"
          :handle-current-change="handleCurrentChange"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import TableColumn from './components/TableColumn.vue'
import Pagination from './components/Pagination.vue'
import SearchForm from '@/components/SearchForm'
import { handleProp } from '@/utils'

export default {
  name: 'ProTable',
  // provide enumMap
  provide() {
    return {
      enumMap: this.enumMap
    }
  },
  components: {
    TableColumn,
    Pagination,
    SearchForm
  },
  props: {
    tableColumns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: null
    },
    border: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: 'orgCode'
    },
    toolButton: {
      type: Boolean,
      default: true
    },
    requestApi: {
      type: Function,
      default: null
    },
    // 初始化请求参数
    initParam: {
      type: Object,
      default: () => {}
    },
    // 是否分页
    isPageable: {
      type: Boolean,
      default: true
    },
    // 返回数据的回调函数，可以对数据进行处理
    dataCallBack: {
      type: Function,
      default: null
    },
    // 是否自动执行请求
    requestAuto: {
      type: Boolean,
      default: true
    },
    requestError: {
      type: Function,
      default: null
    },
    // 是否显示搜索
    isShowSearch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 分页数据
      pageable: {
        // 当前页数
        pageNum: 1,
        // 每页显示条数
        pageSize: 10,
        // 总条数
        total: 0
      },
      // 查询参数(只包括查询)
      searchParam: {},
      // 初始化默认的查询参数
      searchInitParam: {},
      // 总参数(包含分页和查询参数)
      totalParam: {},
      enumMap: {},
      flatColumns: {},
      searchColumns: [],
      isSelected: false,
      selectedList: []
    }
  },
  computed: {
    //  分页查询参数
    pageParam() {
      return {
        pageNum: this.pageable.pageNum,
        pageSize: this.pageable.pageSize
      }
    },
    // 当前选中的所有的ids数组
    selectedListIds() {
      const ids = []
      this.selectedList.forEach(item => ids.push(item[this.rowKey]))
      return ids
    }
  },
  created() {
    this.flatColumns = this.flatColumnsFunc(this.tableColumns)
    this.initSearchColumns()
  },
  mounted() {
    // 是否自动执行请求
    this.requestAuto && this.getTableList()
  },
  methods: {
    /**
     * @description 获取表格数据
     * @return void
     * */
    async getTableList() {
      if (!this.requestApi) return
      const api = this.requestApi
      try {
        // 先把初始化参数和分页参数放到总参数里面
        Object.assign(this.totalParam, this.initParam, this.isPageable ? this.pageParam : {})
        let data = await api({ ...this.searchInitParam, ...this.totalParam })
        this.dataCallBack && (data = this.dataCallBack(data))
        // this.tableData = this.isPageable ? data.list : data
        this.tableData = data
        // 解构后台返回的分页数据 (如果有分页更新分页信息)
        if (this.isPageable) {
          // const { pageNum, pageSize, total } = data
          const total = data.length
          this.updatePageable({ total })
        }
      } catch (error) {
        this.requestError && this.requestError(error)
      }
    },
    /**
     * @description 更新分页信息
     * @param {Object} pageable 后台返回的分页数据
     * @return void
     * */
    updatePageable(pageable) {
      Object.assign(this.pageable, pageable)
    },
    /**
     * @description 每页条数改变
     * @param {Number} val 当前条数
     * @return void
     * */
    handleSizeChange(val) {
      this.pageable.pageNum = 1
      this.pageable.pageSize = val
      this.getTableList()
    },
    /**
     * @description 当前页改变
     * @param {Number} val 当前页
     * @return void
     * */
    handleCurrentChange(val) {
      this.pageable.pageNum = val
      this.getTableList()
    },
    selectionChange(rowArr) {
      rowArr.length ? (this.isSelected = true) : (this.isSelected = false)
      this.selectedList = rowArr
    },
    flatColumnsFunc(columns, flatArr = []) {
      columns.forEach(async col => {
        if (col._children?.length) flatArr.push(...this.flatColumnsFunc(col._children))
        flatArr.push(col)
        // 给每一项 column 添加 isShow && isFilterEnum 默认属性
        col.isShow = col.isShow ?? true
        col.isFilterEnum = col.isFilterEnum ?? true
        // 设置 enumMap
        await this.setEnumMap(col)
      })
      return flatArr.filter(item => !item._children?.length)
    },
    async setEnumMap(col) {
      if (!col.enum) return
      // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
      if (typeof col.enum !== 'function') return this.$set(this.enumMap, col.prop, col.enum)
      const res = await col.enum()
      const data = res.data || res.jsonArray || res
      this.$set(this.enumMap, col.prop, data)
    },
    initSearchColumns() {
      // 过滤需要搜索的配置项
      this.searchColumns = this.flatColumns.filter(item => item.search?.el || item.search?.render)
      // 设置搜索表单排序默认值 && 设置搜索表单项的默认值
      this.searchColumns.forEach((column, index) => {
        column.search.order = column.search.order ?? index + 2
        if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
          this.searchInitParam[column.search.key ?? handleProp(column.prop)] = column.search?.defaultValue
          this.searchParam[column.search.key ?? handleProp(column.prop)] = column.search?.defaultValue
        }
      })
      // 排序搜索表单项
      this.searchColumns.sort((a, b) => a.search.order - b.search.order)
    },
    search() {
      this.$set(this.pageable, 'pageNum', 1)
      this.updatedTotalParam()
      this.getTableList()
    },
    /**
     * @description 更新查询参数
     * @return void
     * */
    updatedTotalParam() {
      this.totalParam = {}
      // 处理查询参数，可以给查询参数加自定义前缀操作
      const nowSearchParam = {}
      // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
      for (const key in this.searchParam) {
        // * 某些情况下参数为 false/0 也应该携带参数
        if (this.searchParam[key] || this.searchParam[key] === false || this.searchParam[key] === 0) {
          nowSearchParam[key] = this.searchParam[key]
        }
      }
      Object.assign(this.totalParam, nowSearchParam, this.isPageable ? this.pageParam : {})
    },
    /**
     * @description 表格数据重置
     * @return void
     * */
    reset() {
      this.pageable.pageNum = 1
      this.searchParam = {}
      // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
      Object.keys(this.searchInitParam).forEach(key => {
        this.searchParam[key] = this.searchInitParam[key]
      })
      this.updatedTotalParam()
      this.getTableList()
    }
  }
}
</script>
