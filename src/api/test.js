import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/winbpweb/p?action=newupay&beanaction=getOrgInfoConfigs&jlzt=0',
    method: 'get',
    params
  })
}

export function login(data) {
  return request({
    url: '/winbpweb/p?action=newupay&beanaction=getOrgInfoConfigs&jlzt=0',
    method: 'post',
    data
  })
}

// 部署列表接口
export function getDeployList(params) {
  return request({
    url: '/winbpweb/p?action=newupay&beanaction=getOrgInfoConfigList',
    method: 'get',
    params
  })
}