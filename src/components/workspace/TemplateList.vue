<template>
  <div>
    <vs-row vs-align="center" class="mt-5">
      <vs-col vs-type="flex" vs-justify="flex-start" vs-w="4">
        <vs-select
          placeholder="Choose specific category"
          multiple
          label="Categories"
          width="270px"
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
      </vs-col>
      <vs-col vs-type="flex" vs-justify="flex-end" vs-w="8">
        <vs-button type="gradient" @click="$emit('back')">
          Back
        </vs-button>
      </vs-col>
    </vs-row>

    <vs-row class="pt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col
        v-for="item in items"
        :key="item.id"
        vs-type="flex"
        vs-align="center"
        vs-w="2"
      >
        <vx-card class="grid-view-item mb-base overflow-hidden cursor-pointer">
          <template slot="no-body">
            <div
              class="bg-white flex items-center justify-center"
              @click="handleTemplate(item.id)"
            >
              <div
                class="thumbnail mx-3 mt-3"
                :style="{ backgroundImage: `url(${item.thumbnail})` }"
              />
            </div>
          </template>
        </vx-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      filterCategories: [],
      items: []
    }
  },
  computed: {
    ...mapGetters(['categoriesNoTemplate', 'templates'])
  },
  methods: {
    ...mapActions(['getCategories', 'getTemplates']),
    handleFilter() {
      if (!this.filterCategories.length) {
        this.items = this.templates
      } else {
        this.items = this.templates.filter(t => {
          return t.categories.some(
            c => this.filterCategories.indexOf(c.id) > -1
          )
        })
      }
    },
    handleTemplate(id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Use this template for your content ?`,
        accept: () => this.$emit('getTemplate', id)
      })
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
  }
}
</script>

<style lang="scss" scoped>
.grid-view-item {
  .thumbnail {
    height: 400px;
    width: 100%;
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    transition: ease-in-out 3s;

    &:hover {
      background-position: bottom;
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }
}
</style>
