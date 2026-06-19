export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/mine/index',
    'pages/activity-detail/index',
    'pages/create-activity/index',
    'pages/signup/index',
    'pages/grouping/index',
    'pages/budget/index',
    'pages/vote/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#7C3AED',
    navigationBarTitleText: '剧本杀约伴',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF5FF'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#7C3AED',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '活动'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
