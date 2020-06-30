/*

[task_local]
6 9 * * *  saigaocy.js

*/

const cookieName = '赛高次元'
const cookieKey = 'chavy_cookie_saigaocy'
const chavy = init()
const cookieVal = chavy.getdata(cookieKey)

sign()

function sign() {
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
  url.headers['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc2FpZ2FvY3kueHl6IiwiaWF0IjoxNTkxNjMyMzE2LCJuYmYiOjE1OTE2MzIzMTYsImV4cCI6MTU5MjIzNzExNiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjgyMzkifX19.zJzOJLlbdU8eqHB0U1U4gZH4FrjmQCegWOL8-UeAqDM'

  chavy.post(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 签到成功
    if (result && result.mission) {
      let subTitle = `签到结果: 成功🎉`
      let detail = `签到奖励: ${result.mission.credit}星币, 总计: ${result.mission.my_credit}星币, ${result.mission.date}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到重复
    else if (result > 0) {
      getsigninfo()
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败❗️`
      let detail = `说明: ${result.message}, 日志: ${data}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${data}`)
  })

  chavy.done()
}
function getsigninfo() {
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
  url.headers['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc2FpZ2FvY3kueHl6IiwiaWF0IjoxNTkxNjMyMzE2LCJuYmYiOjE1OTE2MzIzMTYsImV4cCI6MTU5MjIzNzExNiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjgyMzkifX19.zJzOJLlbdU8eqHB0U1U4gZH4FrjmQCegWOL8-UeAqDM'

  chavy.post(url, (error, response, data) => {
    let title = `${cookieName}`
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
