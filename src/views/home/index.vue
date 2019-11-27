<template>
  <div style="width: 1400px; margin:auto">
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
          <div class="text-xl self-center font-medium">Start to design</div>
        </div>
      </vs-col>
      <vs-col vs-type="flex" vs-align="center" vs-w="8">
        <div
          class="flex py-4 px-4 justify-end"
          style="width: 100%; background-color: white; border-radius: 10px"
        >
          <vs-select
            placeholder="Choose specific category"
            multiple
            label="Categories"
            width="300px"
            v-model="filterCategories"
          >
            <vs-select-item
              :key="item.id"
              :value="item.id"
              :text="`${item.name} - ${item.templates.length} templates`"
              v-for="item in homeCategories"
            />
          </vs-select>
        </div>
      </vs-col>
    </vs-row>

    <vs-row
      class="pt-5"
      vs-type="flex"
      vs-align="center"
      vs-justify="center"
      vs-w="12"
    >
      <vs-col
        v-for="item in templatesToShow"
        :key="item.id"
        vs-type="flex"
        vs-justify="center"
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
export default {
  components: {
    TemplateGridItems
  },
  data() {
    return {
      filterCategories: []
    }
  },
  computed: {
    ...mapGetters(['homeCategories']),
    templatesToShow() {
      let result = this.filterCategories.length
        ? this.homeCategories.filter(
            c => this.filterCategories.indexOf(c.id) > -1
          )
        : this.homeCategories
      result = result.map(c => c.templates).flat()
      return Array.from(new Set(result.map(c => c.id))).map(id => {
        return result.find(c => c.id === id)
      })
    }
  },
  methods: {
    ...mapActions(['getHomeCategories'])
  },
  async mounted() {
    await this.handleCallAPI(this.getHomeCategories)
  }
}
</script>

<style></style>
