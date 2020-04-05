/*

[task_local]
6 9 * * *  sengoku/zds/zds.js

*/

const cookieName = '外卖最大社'
const cookieKey = 'chavy_cookie_zds'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)

sign()
function sign() {
  let url = {
    url: `http://zds.xmanfulong.com/api/v1/user/signin`,
    headers: {
      Authorization: cookieVal
    }
  }
  url.headers['Host'] = `zds.xmanfulong.com`
  url.headers['Origin'] = 'http://zds.xmanfulong.com'
  url.headers['Referer'] = 'http://zds.xmanfulong.com/score'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.11(0x17000b21) NetType/WIFI Language/zh_CN'

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 获取任务
    if (result && result.code == 200) {
      let subTitle = `签到结果: 成功🎉`
      let detail = `签到奖励: ${result.data.score}积分`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result && result.code == 1017) {
      let subTitle = `签到结果: 成功 (重复签到)`
      let detail = `说明: ${result.msg}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败❗️`
      let detail = `说明: ${result.message}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${data}`)
  })

  chavy.done()
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClientpost(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
