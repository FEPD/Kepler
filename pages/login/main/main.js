import util from '../loginPluginUtils.js'

Page({
  dologinResListener(event={}){
    util.handleComponentRedirect(event.detail)
  }
})
