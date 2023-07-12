import request from '@/utils/request'

// 校验验证码
export function CheckLoginCode(data) {
    return request({
        url: '/winbpweb/p',
        method: 'post',
        data: {
            action: 'login',
            beanaction: 'checkYZM',
            async: false,
            ...data
        }
    })
}

// 登录
export function LoginAPI(data) {
    return request({
        url: '/winbpweb/p',
        method: 'post',
        data: {
            action: 'login',
            beanaction: 'lg',
            async: false,
            ...data
        }
    })
}