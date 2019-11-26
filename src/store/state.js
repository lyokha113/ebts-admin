import navbarSearchAndPinList from '@/layouts/components/navbarSearchAndPinList'
import themeConfig from '@/../themeConfig.js'
import colors from '@/../themeConfig.js'

import { getToken } from '@/plugin/auth'

const state = {
  isSidebarActive: true,
  breakpoint: null,
  sidebarWidth: 'default',
  reduceButton: themeConfig.sidebarCollapsed,
  bodyOverlay: false,
  sidebarItemsMin: false,
  theme: themeConfig.theme || 'semi-dark',
  navbarSearchAndPinList: navbarSearchAndPinList,
  activeUser: null,
  accessToken: getToken(),
  themePrimaryColor: colors.primary,
  starredPages: navbarSearchAndPinList.data.filter(
    page => page.highlightAction
  ),
  windowWidth: null,

  // ////////////////////////////////////////////
  // ACCOUNT
  // ////////////////////////////////////////////
  accounts: [],

  // ////////////////////////////////////////////
  // CATEGORY
  // ////////////////////////////////////////////
  categories: [],

  // ////////////////////////////////////////////
  // FILE
  // ////////////////////////////////////////////
  files: [],

  // ////////////////////////////////////////////
  // TUTORIAL
  // ////////////////////////////////////////////
  tutorials: []
}

export default state
