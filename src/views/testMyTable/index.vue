<template>
  <ProTable
    :table-columns="tableColumns"
    :request-api="getList"
    :data-call-back="dataCallBack"
  >
    <template #orgCode="scope">
      <el-button type="primary" link>
        {{ scope.row.orgCode }}
      </el-button>
    </template>
  </ProTable>
</template>

<script>
import ProTable from '@/components/ProTable'
import axios from 'axios'

export default {
  name: 'TestMyTable',
  components: {
    ProTable
  },
  data() {
    return {
      tableColumns: [
        { prop: 'orgCode', label: '主机构编号', isShow: true },
        { prop: 'orgName', label: '机构名称', isShow: true },
        {
          prop: 'isLocal', label: '部署方式', isShow: true,
          render: (scope) => {
            return (
              scope.row.isLocal == 1 ? <el-tag type='success'>本地</el-tag> : <el-tag type='success'>云端</el-tag>
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
              <el-button type='primary' link> 查看 </el-button>
            )
          }
        }
      ],
      data: []
    }
  },
  methods: {
    getList(params) {
      console.log('getList', params)
      return axios.get('winbpweb/p?action=newupay&beanaction=getOrgInfoConfigList', { params })
    },
    dataCallBack(res) {
      return res.jsonArray
    }
  }
}
</script>
