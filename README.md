# QuantumultX-Script

自用修改脚本

## 赛高次元

### 配置（QuanX）

```properties
[MITM]
saigaocy.com

[rewrite_local]
# 远程版本
^http?:\/\/saigaocy\.moe\/users url script-request-header https://raw.githubusercontent.com/sengoku-f/QuantumultX-Script/master/saigaocy/saigaocy.cookie.js
# 本地版本
^http?:\/\/saigaocy\.moe\/users url script-request-header sengoku/saigaocy/saigaocy.cookie.js

[task_local]
1 0 * * * sengoku/saigaocy/saigaocy.js
```

### 说明 (网页)

1. 先在浏览器登录 `(先登录! 先登录! 先登录!)`
2. 先把`saigaocy.com`加到`[MITM]`
3. 再配置重写规则:
   - Surge: 把两条远程脚本放到`[Script]`
   - QuanX: 把`saigaocy.cookie.js`和`saigaocy.js`传到`On My iPhone - Quantumult X - Scripts` (传到 iCloud 相同目录也可, 注意要打开 quanx 的 iCloud 开关)
4. 打开浏览器访问: http://saigaocy.moe/users
5. 系统提示: `获取Cookie: 成功`
6. 最后就可以把第 1 条脚本注释掉了

## 感谢

[@NobyDa](https://github.com/NobyDa)

[@lhie1](https://github.com/lhie1)

[@ConnersHua](https://github.com/ConnersHua)

[@chavyleung](https://github.com/chavyleung/scripts)