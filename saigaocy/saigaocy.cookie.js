/*

[rewrite_local]
^http?:\/\/saigaocy\.moe\/users url script-request-header saigaocy.cookie.js
[mitm]
saigaocy.com

*/
/* 
let headerCookie = $request.headers["Cookie"];

if (headerCookie) {
  if ($prefs.valueForKey("saigaocyCookie") != undefined) {
    if ($prefs.valueForKey("saigaocyCookie") != headerCookie) {
      var cookie = $prefs.setValueForKey(headerCookie, "saigaocyCookie");
      if (!cookie) {
        $notify("更新赛高次元Cookie失败！", "", "");
      } else {
        $notify("更新赛高次元Cookie成功！", "", "");
      }
    }
  } else {
    let cookie = $prefs.setValueForKey(headerCookie, "saigaocyCookie");
    if (!cookie) {
      $notify("首次写入赛高次元Cookie失败！", "", "");
    } else {
      $notify("首次写入赛高次元Cookie成功！", "", "");
    }
  }
}
$done({});
 */
const cookieName = 'saigaocy'
const cookieKey = 'chavy_cookie_saigaocy'
const chavy = init()
const cookieVal = $request.headers['Cookie']
if (cookieVal) {
  if (chavy.setdata(cookieVal, cookieKey)) {
    chavy.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chavy.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal}`)
  }
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
chavy.done()
