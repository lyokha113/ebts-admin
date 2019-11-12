<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-popup title="Add new category" :active.sync="addPrompt">
      <div>
        Enter category name:
        <vs-input placeholder="Name" v-model="name" style="width: 270px" class="my-2" />
        <vs-button color="primary" type="filled" class="float-right mt-2" @click="handleAdd">Add</vs-button>
      </div>
    </vs-popup>

    <vs-popup title="Update category" :active.sync="updatePrompt">
      <div>
        Enter category name:
        <vs-input placeholder="Name" v-model="updateName" style="width: 270px" class="my-2" />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleUpdate"
        >Update</vs-button>
      </div>
    </vs-popup>

    <vs-table ref="table" pagination search :max-items="itemsPerPage" :data="categories">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="(name = '', addPrompt = true)"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2">
              {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
              categories.length - currentPage * itemsPerPage > 0
              ? currentPage * itemsPerPage
              : categories.length
              }}
              of {{ categories.length }}
            </span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 20">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 50">
              <span>50</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 100">
              <span>100</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th sort-key="name">Category Name</vs-th>
        <vs-th>Num of Templates</vs-th>
        <vs-th sort-key="active">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td style="width: 800px">
              <p class="product-name font-medium">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.templates.length }}</p>
            </vs-td>

            <vs-td>
              <vs-chip :color="tr.active ? 'success' : 'danger'" class="product-order-status">
                <vs-avatar :icon="tr.active ? 'done' : 'lock'" />
                {{ tr.active ? 'Active' : 'Locked' }}
              </vs-chip>
            </vs-td>

            <vs-td>
              <span
                v-if="activeUser && activeUser.id != tr.id"
                class="action-icon mx-1"
                @click="(updateName ='', selected = JSON.parse(JSON.stringify(tr)), updatePrompt = true)"
              >
                <vs-icon size="small" icon="create" />
              </span>

              <span
                v-if="activeUser && activeUser.id != tr.id"
                class="action-icon mx-1"
                @click="handleStatus(tr)"
              >
                <vs-icon size="small" :icon="tr.active ? 'lock' : 'lock_open'" />
              </span>
            </vs-td>

            <template class="expand-user" slot="expand">
              <div>
                <div class="items-grid-view vx-row match-height" v-if="tr.templates.length" appear>
                  <div class="vx-col w-full" v-for="template in tr.templates" :key="template.id">
                    <ItemGridView :template="template" />
                  </div>
                </div>
              </div>
            </template>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import ItemGridView from '@/components/category/ItemGridView.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ItemGridView
  },
  data() {
    return {
      selected: null,
      itemsPerPage: 10,
      isMounted: false,
      addPrompt: false,
      name: '',
      updatePrompt: false,
      updateName: ''
    }
  },
  computed: {
    ...mapGetters(['categories', 'activeUser']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getCategories', 'createCategory', 'updateCategory']),
    handleAdd() {
      this.addPrompt = false
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to create new category ?`,
        accept: this.handleAddConfirm
      })
    },
    handleUpdate() {
      this.updatePrompt = false
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this category ?`,
        accept: this.handleUpdatedConfirm
      })
    },
    handleStatus(category) {
      this.selected = JSON.parse(JSON.stringify(category))
      const actionMsg = category.active ? 'lock' : 'unlock'
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action could be affect to other parts. Do you want to ${actionMsg} this category ?`,
        accept: this.handleStatusConfirm
      })
    },
    async handleAddConfirm() {
      await this.handleCallAPI(this.createCategory, { name: this.name })
      this.$vs.notify({
        title: 'Information',
        text: 'Category created',
        color: 'success',
        position: 'top-right'
      })
    },
    async handleUpdatedConfirm() {
      this.selected.name = this.updateName
      await this.handleCallAPI(this.updateCategory, this.selected)
      this.$vs.notify({
        title: 'Information',
        text: 'Category updated',
        color: 'success',
        position: 'top-right'
      })
    },
    async handleStatusConfirm() {
      this.selected.active = !this.selected.active
      await this.handleCallAPI(this.updateCategory, this.selected)
      this.$vs.notify({
        title: 'Information',
        text: 'Category status updated',
        color: 'success',
        position: 'top-right'
      })
    }
  },
  async created() {
    await this.handleCallAPI(this.getCategories, null)
  },
  mounted() {
    this.isMounted = true
  }
}
</script>


<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 300px;
}

.action-icon:hover {
  color: mediumslateblue;
}
</style>


