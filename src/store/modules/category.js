import {
  getCategories,
  createCategory,
  updateCategory
} from '@/services/category'

const state = {
  categories: []
}

const mutations = {
  SET_CATEGORIES: (state, categories) => {
    state.categories = categories
  },
  CREATE_CATEGORY: (state, category) => {
    state.categories.unshift(category)
  },
  UPDATE_CATEGORY: (state, category) => {
    const current = state.categories.find(c => c.id === category.id)
    Object.assign(current, category)
  }
}

const actions = {
  async getCategories({ commit }) {
    const { data } = await getCategories()
    if (data.success) {
      commit('SET_CATEGORIES', data.data)
    }
  },

  async createCategory({ commit }, obj) {
    const { data } = await createCategory(obj)
    if (data.success) {
      commit('CREATE_CATEGORY', data.data)
    }
  },

  async updateCategory({ commit }, obj) {
    const { data } = await updateCategory(obj)
    if (data.success) {
      commit('UPDATE_CATEGORY', data.data)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
