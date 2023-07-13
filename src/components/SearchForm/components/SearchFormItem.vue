<template>
  <component
    :is="column.search && column.search.render || `w-${column.search && column.search.el}`"
    v-model.trim="_searchParam[column.search && column.search.key || handleProp(column.prop)]"
    v-bind="{ ...handleSearchProps, ...placeholder, searchParam: _searchParam, clearable }"
    :data="column.search && column.search.el === 'tree-select' ? columnEnum : []"
    :options="['cascader'].includes(column.search && column.search.el) ? columnEnum : []"
    v-on="getListeners()"
  >
    <template v-if="column.search && column.search.el === 'cascader'" #default="{ data }">
      <span style="width: 100px;">{{ data[fieldNames.label] }}</span>
    </template>
    <template v-if="column.search && column.search.el === 'select'">
      <component
        :is="`w-option`"
        v-for="(col, index) in columnEnum"
        :key="index"
        :style="selectOptionStyle"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
      />
    </template>
    <slot v-else />
  </component>
</template>

<script>
import { handleProp } from '@/utils'
export default {
  name: 'SearchFormItem',
  // inject enumMap
  inject: ['enumMap'],
  props: {
    column: {
      type: Object,
      default: () => ({})
    },
    searchParam: {
      type: Object,
      default: () => ({})
    },
    // 搜索方法
    search: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      handleProp: handleProp,
      selectOptionStyle: {}
    }
  },
  computed: {
    _searchParam() {
      return this.searchParam
    },
    columnEnum() {
      const enumData = this.enumMap[this.column.prop]
      if (!enumData) return []
      return enumData
    },
    fieldNames() {
      return {
        label: this.column.fieldNames?.label ?? 'label',
        value: this.column.fieldNames?.value ?? 'value',
        children: this.column.fieldNames?.children ?? 'children'
      }
    },
    // 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
    handleSearchProps() {
      const label = this.fieldNames.label
      const value = this.fieldNames.value.value
      const children = this.fieldNames.value.children
      const searchEl = this.column.search?.el
      let searchProps = this.column.search?.props ?? {}
      if (searchEl === 'cascader') {
        searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children }}
      }
      return searchProps
    },
    // 处理默认的 placeholder
    placeholder() {
      const search = this.column.search
      if (['datetimerange', 'daterange', 'monthrange'].includes(search?.props?.type) || search?.props?.isRange) {
        return { rangeSeparator: '至', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }
      }
      const placeholder = search?.props?.placeholder ?? (search?.el?.includes('input') ? '请输入' : '请选择')
      return { placeholder }
    },
    // 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
    clearable() {
      const search = this.column.search
      return search?.props?.clearable ?? (search?.defaultValue === null || search?.defaultValue === undefined)
    }
  },
  methods: {
    getListeners() {
      const listeners = this.column.search?.listeners ?? {}
      if (this.column.search.el === 'select') {
        // select 的 focus特殊处理，解决下拉框宽度远超过输入框的问题
        listeners.focus = (evt) => {
          this.$nextTick(() => {
            const width = evt.srcElement.offsetWidth + 'px'
            this.selectOptionStyle = { width }
          })
        }
        // select的值改变时，调用搜索方法
        listeners.change = (val) => {
          this.search()
        }
      }
      return listeners
    }
  }
}
</script>
