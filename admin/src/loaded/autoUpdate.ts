import { getScriptTagFromHtmlText } from "@/utils/RegularUtils.ts";
import { arrayUtils, baseUtils } from "@dcts/common";
import { adminConfig } from "@dcts/config";
import { final } from "@/utils/base.ts";

const whiteList = [
  {
    type: 'start',
    content: 'chrome-extension://'
  },
  {
    type: 'start',
    content: 'https://dev.virtualearth.net'
  }
];

async function main() {
  await baseUtils.sleep(1000)
  const oldHtml = document.documentElement.outerHTML
  const oldTag_ = getScriptTagFromHtmlText(oldHtml)
  // 去除一些干扰项
  const oldTag = oldTag_.filter(str => {
    if (
      whiteList.filter(item => item.type === 'start').some(item => str.startsWith(item.content))
      || whiteList.filter(item => item.type === 'full').some(item => item.content === str)
    ) {
      return false
    }
    return true
  })
  const html = await fetch(`/?timestamp=${new Date().getTime()}`).then(res => res.text())
  const newTag = getScriptTagFromHtmlText(html)
  const currentConfig = adminConfig.currentConfig();
  if (currentConfig.VITE_MODE === final.DEV) {
    console.log(oldTag, newTag)
  }
  const ifNeedUpdate = !arrayUtils.ifSameArray(oldTag, newTag)
  if (ifNeedUpdate) {
    const result = confirm('检测到新版本，请点击确定更新。')
    if (result) {
      location.reload()
    }
  }
}

main()
