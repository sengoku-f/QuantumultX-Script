/*

[task_local]
6 9 * * *  saigaocy.js

*/

const cookieName = 'saigaocy'
const cookieKey = 'chavy_cookie_saigaocy'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)

sign()
function getUesrMission() {
  let url = {
    url: `https://saigaocy.moe/wp-json/b2/v1/getUserMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.moe'
  url.headers['Referer'] = 'https://saigaocy.moe/mission/today'
  url.headers['path'] = '/wp-json/b2/v1/getUserMission'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 获取任务
    if (result && result.code == 0) {
      let subTitle = `获取结果: 成功`
      let detail = `账号信息`: ${result.data.credit}/${result.data.my_credit}星币, 说明: ${result.data.text}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result && result.code == 1011040) {
      getsigninfo()
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败`
      let detail = `说明: ${result.message}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${data}`)
  })

  chavy.done()
}
function sign() {
  let url = {
    url: `https://saigaocy.moe/wp-json/b2/v1/userMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.moe'
  url.headers['Referer'] = 'https://saigaocy.moe/mission/today'
  url.headers['path'] = '/wp-json/b2/v1/userMission'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 签到成功
    if (result && result.code == 0) {
      let subTitle = `签到结果: 成功`
      let detail = `连续签到: ${result.data.always}, 获得${result.data.credit}星币, 总计${result.data.my_credit}星币, 说明: ${result.data.text}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result && result.code == 1011040) {
      getsigninfo()
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败`
      let detail = `说明: ${result.message}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${data}`)
  })

  chavy.done()
}
function getsigninfo() {
  let url = {
    url: `https://saigaocy.moe/wp-json/b2/v1/getUserMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.moe'
  url.headers['Referer'] = 'https://saigaocy.moe/mission/today'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'

  chavy.post(url, (error, response, data) => {
    let title = `${cookieName}`
    let subTitle = `签到结果: 成功 (重复签到)`
    let detail = ``
    let result = JSON.parse(data)
    if (result && result.code == 0) detail = `本月累计: ${result.data.credit}/${result.data.my_credit}次, 说明: ${result.data.text}`
    chavy.msg(title, subTitle, detail)
  })
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
