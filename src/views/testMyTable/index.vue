<template>
  <ProTable
    :table-columns="tableColumns"
    :request-api="requestApi"
    :data-call-back="dataCallBack"
  >
    <template #tableHeader>
      <w-button type="primary" link> 新增 </w-button>
    </template>
    <template #orgCode="scope">
      <w-button type="primary" link>
        {{ scope.row.orgCode }}
      </w-button>
    </template>
  </ProTable>
</template>

<script>
import ProTable from '@/components/ProTable'
import { getDeployList, getOrgList } from '@/api/test'

export default {
  name: 'TestMyTable',
  components: {
    ProTable
  },
  data() {
    return {
      tableColumns: [
        { prop: 'orgCode', label: '主机构编号', isShow: true,
          enum: getOrgList,
          search: { el: 'select', props: { filterable: true }},
          fieldNames: { label: 'orgName', value: 'orgCode' }
        },
        { prop: 'orgName', label: '机构名称', isShow: true, search: { el: 'input' }},
        {
          prop: 'isLocal', label: '部署方式', isShow: true,
          render: (scope) => {
            return (
              scope.row.isLocal == 1 ? <w-tag type='success'>本地</w-tag> : <w-tag type='success'>云端</w-tag>
            )
          },
          search: { el: 'select', props: { filterable: true }}
        },
        { prop: 'localWebUrl', label: '批处理地址', isShow: true },
        { prop: 'localBillUrl', label: '本地帐单地址', isShow: true },
        { prop: 'pmEmail', label: '项目经理邮箱', isShow: true },
        { prop: 'khEmail', label: '客户邮箱', isShow: true },
        {
          prop: 'action', label: '操作', isShow: true,
          render: (scope) => {
            return (
              <w-button type='primary' link> 查看 </w-button>
            )
          }
        }
      ],
      requestApi: getDeployList
    }
  },
  methods: {
    dataCallBack(res) {
      return res.jsonArray
    }
  }
}
</script>
