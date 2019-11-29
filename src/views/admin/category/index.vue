<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-popup
      id="create-popup"
      title="CREATE NEW CATEGORY"
      :active.sync="addPrompt"
    >
      <div>
        Enter category name:
        <vs-input
          placeholder="Name"
          v-model="name"
          style="width: 270px"
          class="my-2"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleAdd"
          >Add</vs-button
        >
      </div>
    </vs-popup>

    <vs-popup
      id="update-popup"
      title="UPDATE CATEGORY"
      :active.sync="updatePrompt"
    >
      <div>
        Enter category name to update:
        <vs-input
          placeholder="Name"
          v-model="updateName"
          style="width: 270px"
          class="my-2"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleUpdate"
          >Update</vs-button
        >
      </div>
    </vs-popup>

    <vs-table
      ref="table"
      pagination
      search
      :max-items="itemsPerPage"
      :data="categories"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click=";(name = ''), (addPrompt = true)"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
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
              <p class="product-category">{{ tr.templates ? tr.templates.length : 0 }}</p>
            </vs-td>

            <vs-td>
              <vs-chip
                :color="tr.active ? 'success' : 'danger'"
                class="product-order-status"
              >
                <vs-avatar :icon="tr.active ? 'done' : 'lock'" />
                {{ tr.active ? 'Active' : 'Locked' }}
              </vs-chip>
            </vs-td>

            <vs-td>
              <span class="action-icon mx-1" @click.stop="handleStatus(tr)">
                <vs-icon
                  size="small"
                  :icon="tr.active ? 'lock' : 'lock_open'"
                />
              </span>
              <span
                class="action-icon mx-1"
                @click.stop="
                  ;(selected = JSON.parse(JSON.stringify(tr))),
                    (updateName = selected.name),
                    (updatePrompt = true)
                "
              >
                <vs-icon size="small" icon="create" />
              </span>
            </vs-td>

            <template class="expand-user" slot="expand">
              <vs-row appear>
                <vs-col
                  v-for="template in tr.templates"
                  :key="template.id"
                  vs-type="flex"
                  vs-justify="center"
                  vs-align="center"
                  vs-w="4"
                >
                  <ItemGridView :template="template" />
                </vs-col>
              </vs-row>
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
    ...mapGetters(['categories']),
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
      if (!this.name) {
        this.$vs.notify({
          title: 'Empty tutorial',
          text: 'Please enter categoryname',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to create new category ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.createCategory, { name: this.name })
          ) {
            this.addPrompt = false
          }
        }
      })
    },
    handleUpdate() {
      if (!this.updateName) {
        this.$vs.notify({
          title: 'Empty tutorial',
          text: 'Please enter categoryname',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this category ?`,
        accept: async () => {
          this.selected.name = this.updateName
          if (await this.handleCallAPI(this.updateCategory, this.selected)) {
            this.updatePrompt = false
          }
        }
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
        accept: async () => {
          this.selected.active = !this.selected.active
          await this.handleCallAPI(this.updateCategory, this.selected)
        }
      })
    }
  },
  async created() {
    await this.handleCallAPI(this.getCategories)
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

#create-popup {
  z-index: 51100;
}

#update-popup {
  z-index: 51100;
}
</style>
