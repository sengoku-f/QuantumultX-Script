/*

[task_local]
6 9 * * *  sengoku/ssrcloud/ssrcloud.js

*/

const cookieName = '🍟薯条'
const cookieKey = 'chavy_cookie_ssrcloud'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)

sign()
function sign() {
  let url = {
    url: `https://ntt-co-jp.club/user/checkin`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Host'] = `ntt-co-jp.club`
  url.headers['Origin'] = 'https://ntt-co-jp.club'
  url.headers['Referer'] = 'https://ntt-co-jp.club/user'
  url.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01'
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 获取任务
    if (result && result.ret == 1) {
      let subTitle = `签到结果: 成功🎉`
      let detail = `${result.msg}, 今日已用: ${result.trafficInfo.todayUsedTraffic}, 过去已用: ${result.trafficInfo.lastUsedTraffic}, 剩余流量: ${result.trafficInfo.unUsedTraffic}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result && result.ret == 0) {
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
