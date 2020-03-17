const cookieName = '芯次元'
const cookieKey = 'chavy_cookie_xinciyuan'
const chavy = init()
let cookieVal = chavy.getdata(cookieKey)

getHomepagePosts()
function getHomepagePosts() {
  let url = {
    url: `https://acg.ge/wp-admin/admin-ajax.php?action=e571040b22019a44af3119898364bfdf&0f00b9c5cfbbecc13be33c9d146f2d42%5Btype%5D=checkSigned&612fcd33343081a6015f71c070c8c9f1%5Btype%5D=checkUnread&1d53021ff5177e7590969a5ee570e5ea%5Btype%5D=getUnreadCount&2eaeae45d46d5bdb31e379c7d57c2ea8%5Btype%5D=getHomepagePosts`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Accept'] = '*/*'
  url.headers['Accept-Language'] = `zh-CN,zh;q=0.9`
  url.headers['Host'] = `acg.ge`
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'
  url.headers['Referer'] = 'https://acg.ge/'
  url.headers['Accept-Encoding'] = `gzip, deflate, br`
  url.headers['Connection'] = `keep-alive`

  chavy.get(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 获取签到代码
    if (result && result._nonce) {
      let subTitle = `获取结果: 成功🎉`
      let detail = `说明: ${result._nonce}`
      nonceKey = `${result._nonce}`
      chavy.msg(title, subTitle, detail)
      goSign()
    }
    // 获取失败
    else {
      let subTitle = `获取结果: 失败❗️`
      let detail = `说明: ${result.msg}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${nonceKey}`)
  })

  chavy.done()
}
function goSign() {
  let url = {
    url: `https://acg.ge/wp-admin/admin-ajax.php?_nonce=${nonceKey}&action=0f00b9c5cfbbecc13be33c9d146f2d42&type=goSign`,
    headers: {
      Cookie: cookieVal
    }
  }
  url.headers['Accept'] = '*/*'
  url.headers['Accept-Language'] = `zh-CN,zh;q=0.9`
  url.headers['Host'] = `acg.ge`
  url.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15'
  url.headers['Referer'] = 'https://acg.ge/'
  url.headers['Accept-Encoding'] = `gzip, deflate, br`
  url.headers['Connection'] = `keep-alive`

  chavy.get(url, (error, response, data) => {
    let result = JSON.parse(data)
    let title = `${cookieName}`
    // 签到成功
    if (result && result.code == 0) {
      let subTitle = `签到结果: 成功🎉`
      let detail = `说明: ${result.msg}`
      chavy.msg(title, subTitle, detail)
    }
    // 签到失败
    else {
      let subTitle = `签到结果: 失败❗️`
      let detail = `说明: ${result.msg}`
      chavy.msg(title, subTitle, detail)
    }
    chavy.log(`${cookieName}, data: ${data}`)
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
      $httpClient.get(url, cb)
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
