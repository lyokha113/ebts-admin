<template>
  <div style="width: 1400px; margin:auto;">
    <vs-row vs-align="center">
      <vs-col vs-type="flex" vs-align="center" vs-w="2">
        <img src="@/assets/images/logo/logo-rec.png" />
      </vs-col>
      <vs-col vs-align="center" vs-w="10">
        <div class="text-right text-4xl font-semibold" style="color: #33caad">
          Free and Professional HTML Email Templates
        </div>
        <div class="text-right text-xl font-medium">
          Choose your favorite template or suggest a new template
        </div>
      </vs-col>
    </vs-row>

    <vs-row vs-align="center" class="mt-5">
      <vs-col vs-type="flex" vs-align="center" vs-w="4">
        <div
          class="flex py-4 justify-center cursor-pointer"
          style="width: 70%; background-color: #33caad; color: white; border-radius: 10px"
        >
          <feather-icon
            class="mr-5"
            svgClasses="h-8 w-8"
            icon="EditIcon"
          ></feather-icon>
          <div class="text-xl self-center font-medium" @click="handleDesign">
            Start to design
          </div>
        </div>
      </vs-col>
      <vs-col vs-type="flex" vs-align="end" vs-w="8">
        <div
          class="flex py-4 px-4 justify-around items-end"
          style="width: 100%; background-color: white; border-radius: 10px"
        >
          <vs-select
            placeholder="Choose specific category"
            multiple
            label="Categories"
            width="300px"
            v-model="filterCategories"
            @change="handleFilter"
          >
            <vs-select-item
              :key="item.id"
              :value="item.id"
              :text="`${item.name} - ${item.noOfTemplates} templates`"
              v-for="item in categoriesNoTemplate"
            />
          </vs-select>
          <vs-input
            icon="search"
            label="Search"
            placeholder="Enter name to search"
            style="width: 300px"
            v-model="searchQuery"
          />
          <vs-button @click="handleSearch" style="height: 40px" type="gradient"
            >Search</vs-button
          >
        </div>
      </vs-col>
    </vs-row>

    <vs-row class="pt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col
        v-for="item in items"
        :key="item.id"
        vs-type="flex"
        vs-align="center"
        vs-w="3"
      >
        <TemplateGridItems :template="item" />
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TemplateGridItems from '@/components/home/TemplateGridItems'
const elasticlunr = require('elasticlunr')
export default {
  components: {
    TemplateGridItems
  },
  data() {
    return {
      filterCategories: [],
      filtereditems: [],
      items: [],
      searchQuery: '',
      elasticlunrIndex: null
    }
  },
  computed: {
    ...mapGetters(['categoriesNoTemplate', 'templates', 'activeUser'])
  },
  methods: {
    ...mapActions(['getCategories', 'getTemplates']),
    handleFilter() {
      this.searchQuery = ''
      if (!this.filterCategories.length) {
        this.items = this.templates
      } else {
        this.items = this.templates.filter(t => {
          return t.categories.some(
            c => this.filterCategories.indexOf(c.id) > -1
          )
        })
      }

      this.filtereditems = this.items
    },
    handleSearch() {
      if (!this.searchQuery) {
        return this.handleFilter()
      }

      let refs = this.elasticlunrIndex.search(this.searchQuery, {
        expand: true
      })
      refs = refs.map(r => r.ref).map(Number)
      this.items = this.filtereditems.filter(i => refs.indexOf(i.id) > -1)
    },
    handleDesign() {
      if (this.activeUser) {
        this.$router.push('/user/workspace')
      } else {
        this.$router.push('/login?return=workspace')
      }
    }
  },
  async mounted() {
    let loader = this.$loading.show({
      color: '#7367f0',
      loader: 'spinner',
      width: 64,
      height: 64,
      backgroundColor: '#ffffff',
      opacity: 0.8,
      zIndex: 110000
    })

    await Promise.all([
      this.handleCallAPI(this.getCategories, null, false),
      this.handleCallAPI(this.getTemplates, null, false)
    ])

    loader.hide()

    this.items = this.templates
    this.filtereditems = this.templates

    this.elasticlunrIndex = elasticlunr(function() {
      this.addField('name')
      this.setRef('id')
    })
    this.templates.forEach(c => this.elasticlunrIndex.addDoc(c))
  }
}
</script>

<style></style>
