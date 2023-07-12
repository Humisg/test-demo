<!--<template>-->
<!--  <div v-if="columns.length" class="card table-search">-->
<!--    <el-form ref="formRef" :model="searchParam">-->
<!--      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">-->
<!--        <GridItem v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">-->
<!--          <el-form-item :label="`${item.label} :`">-->
<!--            <SearchFormItem :column="item" :search-param="searchParam" />-->
<!--          </el-form-item>-->
<!--        </GridItem>-->
<!--        <GridItem suffix>-->
<!--          <div class="operation">-->
<!--            <el-button type="primary" :icon="Search" @click="search"> 搜索 </el-button>-->
<!--            <el-button :icon="Delete" @click="reset"> 重置 </el-button>-->
<!--            <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">-->
<!--              {{ collapsed ? "展开" : "合并" }}-->
<!--&lt;!&ndash;              <el-icon class="el-icon&#45;&#45;right">&ndash;&gt;-->
<!--&lt;!&ndash;                <component :is="collapsed ? ArrowDown : ArrowUp"></component>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-icon>&ndash;&gt;-->
<!--            </el-button>-->
<!--          </div>-->
<!--        </GridItem>-->
<!--      </Grid>-->
<!--    </el-form>-->
<!--  </div>-->
<!--</template>-->

<template>
  <div v-if="columns.length" class="card table-search">
    <el-form ref="formRef" :model="searchParam">
      <!--      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">-->
      <!--        <GridItem v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">-->
      <div v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
        <el-form-item :label="`${item.label} :`">
          <SearchFormItem :column="item" :search-param="searchParam" />
        </el-form-item>
      </div>

      <!--        </GridItem>-->
      <!--        <GridItem suffix>-->
      <div class="operation">
<!--        <el-button type="primary" :icon="Search" @click="search"> 搜索 </el-button>-->
        <!--            <el-button :icon="Delete" @click="reset"> 重置 </el-button>-->
<!--        <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">-->
<!--          {{ collapsed ? "展开" : "合并" }}-->
          <!--              <el-icon class="el-icon&#45;&#45;right">-->
          <!--                <component :is="collapsed ? ArrowDown : ArrowUp"></component>-->
          <!--              </el-icon>-->
<!--        </el-button>-->
      </div>
      <!--        </GridItem>-->
      <!--      </Grid>-->
    </el-form>
  </div>
</template>
<script>
import Grid from '@/components/Grid'
import GridItem from '@/components/Grid/components/GridItem'
import SearchFormItem from './components/SearchFormItem'
export default {
  name: 'SearchForm',
  components: {
    // Grid,
    // GridItem,
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
    }
  },
  data() {
    return {
      // 是否默认折叠搜索项目
      collapsed: true
    }
  },
  computed: {
    showCollapse() {
      let show = false
      this.columns.reduce((prev, current) => {
        prev +=
          (current.search[this.breakPoint.value]?.span ?? current.search?.span ?? 1) +
          (current.search[this.breakPoint.value]?.offset ?? current.search?.offset ?? 0)
        if (typeof this.searchCol !== 'number') {
          if (prev >= this.searchCol[this.breakPoint.value]) show = true
        } else {
          if (prev >= this.searchCol) show = true
        }
        return prev
      }, 0)
      return show
    },
    breakPoint() {
      const width = this.$refs.formRef.$el.clientWidth
      if (width < 768) {
        return { value: 'xs' }
      } else if (width < 992) {
        return { value: 'sm' }
      } else if (width < 1200) {
        return { value: 'md' }
      } else if (width < 1920) {
        return { value: 'lg' }
      } else {
        return { value: 'xl' }
      }
    }
  },
  methods: {
    getResponsive(item) {
      return {
        span: item.search?.span,
        offset: item.search?.offset ?? 0,
        xs: item.search?.xs,
        sm: item.search?.sm,
        md: item.search?.md,
        lg: item.search?.lg,
        xl: item.search?.xl
      }
    },
  }
}
</script>
