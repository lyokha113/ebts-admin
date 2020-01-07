<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div
        class="item-img-container shadow-md bg-white h-64 flex items-center justify-center my-3 mx-3"
      >
        <img :src="template.thumbnail" :alt="template.name" class="grid-view-img" />
      </div>
      <vs-divider border-style="dashed" class="my-3" />
      <div class="item-details px-3">
        <div class="flex items-center">
          <div class="bg-success flex text-white py-1 px-2 pr-2 mr-2 rounded">
            <span class="text-sm mr-2">{{ template.upVote }}</span>
            <feather-icon icon="ChevronUpIcon" svgClasses="h-4 w-4" />
          </div>
          <div class="bg-danger flex text-white py-1 px-2 pl-2 mx-2 rounded">
            <span class="text-sm mr-2">{{ template.downVote }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <span class="truncate" style="margin-left: auto">
            {{
            template.authorName
            }}
          </span>
        </div>

        <div class="my-4">
          <h6 class="truncate font-semibold mb-1">{{ template.name }}</h6>
          <p class="item-description truncate text-sm">{{ template.description }}</p>
        </div>

        <div class="my-4">
          <vs-row class="my-2">
            <vs-col vs-type="flex" vs-align="center" vs-justify="center" vs-w="12">
              <vs-button
                class="mx-2"
                type="gradient"
                icon="search"
                radius
                @click="handlePreview(template.id)"
              />
              <vs-button
                class="mx-2"
                type="gradient"
                icon="edit"
                radius
                @click="handleUpdatePopup(template)"
              />
              <vs-button
                class="mx-2"
                type="gradient"
                icon="delete"
                color="danger"
                radius
                @click="handleDelete(template.id)"
              />
            </vs-col>
          </vs-row>
        </div>
      </div>

      <CustomPopup id="update-popup" title="UPDATE TEMPLATE" :active.sync="popup">
        <div>
          Enter name:
          <vs-input placeholder="Name" v-model="name" style="width: 250px" class="mt-1 mb-4" />Enter description:
          <vs-input
            placeholder="Description"
            v-model="description"
            style="width: 250px"
            class="mt-1 mb-4"
          />
          <vs-select class="mb-4" label="Categories" v-model="categories" width="250px">
            <div>
              <vs-select-group title="Active">
                <vs-select-item
                  :key="item.id"
                  :value="item.id"
                  :text="item.name"
                  v-for="item in categoriesNoTemplate.filter(c => c.active)"
                />
              </vs-select-group>
            </div>
            <div>
              <vs-select-group title="Locked">
                <vs-select-item
                  :key="item.id"
                  :value="item.id"
                  :text="item.name"
                  v-for="item in categoriesNoTemplate.filter(c => !c.active)"
                />
              </vs-select-group>
            </div>
          </vs-select>
          <vs-button
            color="primary"
            type="filled"
            class="float-right mt-2"
            @click="handleUpdate"
          >Update</vs-button>
        </div>
      </CustomPopup>
    </template>
  </vx-card>
</template>

<script>
import CustomPopup from '@/components/CustomPopup.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    CustomPopup
  },
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      id: '',
      name: '',
      description: '',
      categories: [],
      popup: false
    }
  },
  computed: {
    ...mapGetters(['currentTemplate', 'categoriesNoTemplate'])
  },
  methods: {
    ...mapActions([
      'getTemplate',
      'deleteTemplate',
      'updateTemplate',
      'getCategories'
    ]),
    async handlePreview(id) {
      if (this.currentTemplate == null || this.currentTemplate.id != id) {
        await this.handleCallAPI(this.getTemplate, id)
      }
      const preview = window.open('', '_blank')
      preview.document.write(this.currentTemplate.content)
    },
    async handleDelete(id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this template ?`,
        accept: async () => await this.handleCallAPI(this.deleteTemplate, id)
      })
    },
    handleUpdatePopup(template) {
      this.id = template.id
      this.name = template.name
      this.description = template.description
      this.categories = template.categories.map(c => c.id)
      this.popup = true
    },
    async handleUpdate() {
      if (
        !this.id ||
        !this.name ||
        !this.description ||
        !this.categories.length
      ) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const template = {
        id: this.id,
        name: this.name,
        description: this.description,
        categoryIds: this.categories,
        active: true
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this template ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.updateTemplate, template)) {
            this.popup = false
          }
        }
      })
    }
  },
  async mounted() {
    await this.handleCallAPI(this.getCategories)
  }
}
</script>

<style lang="scss" scoped>
.grid-view-item {
  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
}

/deep/ .vs-popup {
  width: 280px;
}

#update-popup {
  z-index: 51100;
}
</style>
