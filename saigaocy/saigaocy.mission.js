/*

[task_local]
6 9 * * *  saigaocy.mission.js

*/

const cookieName = '赛高次元'
const cookieKey = 'chavy_cookie_saigaocy'
const authorizationKey = 'chavy_authorization_saigaocy'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)
const authorizationVal = chavy.getdata(authorizationKey)

getUserMission()
function getUserMission() {
  let url = {
    url: `https://saigaocy.xyz/wp-json/b2/v1/getUserMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.xyz'
  url.headers['Referer'] = 'https://saigaocy.xyz/mission/today'
  url.headers['path'] = '/wp-json/b2/v1/getUserMission'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1'
  url.headers['Authorization'] = `${authorizationVal}`

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}获取签到任务`
    // 获取信息,判断是否获取到用户信息
    if (result && result.mission) {
      let subTitle = `获取结果: 成功🎉`
      let detail = `上次签到奖励: ${result.mission.credit}星币, 总计: ${result.mission.my_credit}星币, ${result.mission.date}`
      // chavy.msg(title, subTitle, detail)
      // 打印日志
      // chavy.log(`${title}, ${subTitle}, ${detail}`)
      userMission()
    }
    // 获取失败
    else {
      let subTitle = `获取结果: 失败❗️`
      let detail = `说明: ${result.message}, 日志: ${data}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}获取签到任务, data: ${data}`)
  })

  chavy.done()
}
function userMission() {
  let url = {
    url: `https://saigaocy.xyz/wp-json/b2/v1/userMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.xyz'
  url.headers['Referer'] = 'https://saigaocy.xyz/mission/today'
  url.headers['path'] = '/wp-json/b2/v1/userMission'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1'
  url.headers['Authorization'] = `${authorizationVal}`

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}签到`
    // 签到成功
    if (result && result.mission) {
      let subTitle = `签到结果: 成功🎉`
      let detail = `签到奖励: ${result.mission.credit}星币, 总计: ${result.mission.my_credit}星币, ${result.mission.date}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result > 0) {
      getuserinfo()
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败❗️`
      let detail = `说明: ${result.message}, 日志: ${data}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}签到, data: ${data}`)
  })
}
function getuserinfo() {
  let url = {
    url: `https://saigaocy.xyz/wp-json/b2/v1/getUserMission`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Origin'] = 'https://saigaocy.xyz'
  url.headers['Referer'] = 'https://saigaocy.xyz/mission/today'
  url.headers['path'] = '/wp-json/b2/v1/getUserMission'
  url.headers['Accept'] = 'application/json, text/plain, */*'
  url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1'
  url.headers['Authorization'] = `${authorizationVal}`

  chavy.post(url, (error, response, data) => {
    let title = `${cookieName}签到`
    let subTitle = `签到结果: 成功 (重复签到)`
    let detail = ``
    let result = JSON.parse(data)
    if (result && result.mission.credit > 0) detail = `签到奖励: ${result.mission.credit}星币, 总计: ${result.mission.my_credit}星币, ${result.mission.date}`
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
