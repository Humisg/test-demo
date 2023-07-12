<script>
import { handleProp } from '@/utils'
export default {
  name: 'TableColumn',
  props: {
    column: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    RenderTableColumn(item) {
      const slots = this.$scopedSlots
      // console.log('this.handleProp(item.prop)', this.handleProp(item.prop))
      return (
        <template>
          {item.isShow && (
            <el-table-column
              attrs={item}
              align={item.align ?? 'center'}
              showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== 'operation'}
              scopedSlots={{
                default: (scope) => {
                  if (item._children) return item._children.map((child) => this.RenderTableColumn(child))
                  if (item.render) return item.render(scope)
                  if (slots[handleProp(item.prop)]) return slots[handleProp(item.prop)](scope)
                  if (item.tag) {
                    return (
                      <el-tag type={this.getTagType(item, scope)}>
                        {this.renderCellData(item, scope)}
                      </el-tag>
                    )
                  }
                  return this.renderCellData(item, scope)
                },
                header: (scope) => {
                  if (item.headerRender) return item.headerRender(scope)
                  if (slots[`${handleProp(item.prop)}Header`]) slots[`${handleProp(item.prop)}Header`](scope)
                  return item.label
                }
              }}
            >
            </el-table-column>
          )}
        </template>
      )
    },
    renderCellData(item, scope) {
      return scope.row[item.prop]
      // if (item.enum) {
      //   if (typeof item.enum === 'function') {
      //     return item.enum(scope.row)
      //   }
      //   const enumItem = item.enum.find((item) => item.value === scope.row[item.prop])
      //   return enumItem ? enumItem.label : ''
      // }
      // return scope.row[item.prop]
    }
  },
  render(h, context) {
    return this.RenderTableColumn(this.column)
  }
}
</script>
