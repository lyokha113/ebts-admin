<template>
  <div>
    <vs-row vs-align="center" class="mt-5">
      <vs-col vs-type="flex" vs-justify="flex-start" vs-w="4">
        <multiselect
          v-model="filterCategories"
          track-by="id"
          label="name"
          placeholder="Choose filter categories"
          selectLabel=""
          selectedLabel=""
          deselectLabel=""
          @input="handleFilter"
          :options="categoriesNoTemplate"
          :multiple="true"
          :close-on-select="false"
          :searchable="false"
        >
          <template slot="singleLabel" slot-scope="{ item }">
            {{ item.name }} - {{ item.noOfTemplates }} templates`
          </template>
        </multiselect>
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
        vs-w="3"
      >
        <TemplateGridItems :template="item" @click="handleTemplate(item.id)" />
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
import TemplateGridItems from '@/components/TemplateGridItems'
import { mapGetters } from 'vuex'
export default {
  components: {
    TemplateGridItems
  },
  data() {
    return {
      filterCategories: [],
      items: []
    }
  },
  computed: {
    ...mapGetters(['categoriesNoTemplate', 'templates'])
  },
  mounted() {
    this.items = this.templates
  },
  methods: {
    handleFilter() {
      if (!this.filterCategories.length) {
        this.items = this.templates
      } else {
        this.items = this.templates.filter(t => {
          return t.categories.some(c =>
            this.filterCategories.find(fc => fc.id == c.id)
          )
        })
      }
    },
    handleTemplate(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Use this template for your content ?`,
        accept: () => this.$emit('getTemplate', id)
      })
    }
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

.con-vs-avatar.avatar-thumb {
  background: none !important;
  margin-left: 0px;
}

.template_category {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 77px;
    height: 25px;
    background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0), #fff);
  }

  span {
    border-radius: 4px;
    border: 1px solid #33caad;
    font-family: Montserrat;
    font-size: 9px;
    font-weight: 800;
    color: #33caad;
    display: inline-block;
    padding: 2px 4px;
    text-transform: uppercase;
    white-space: nowrap;
  }
}
</style>
