<template>
  <v-container class="fill-height" fluid grid-list-xl>
    <v-row justify="center">
      <v-col cols="12">
        <material-card
          color="green"
          flat
          full-width
          title="Template categories"
          text="Each template can have multiple categories"
        >
          <v-data-table
            :headers="headers"
            :items="categories"
            sort-by="calories"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <!-- <v-toolbar-title>Caterory list</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>-->
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="8" md="8">
                            <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4" md="4">
                            <v-text-field v-model="editedItem.calories" label="Templates" disabled></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="submitData">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              <span>There is no any category</span>
            </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, map, mapActions } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      {
        text: 'Templates',
        align: 'center',
        value: 'templates'
      },

      { text: 'Actions', value: 'action', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      templates: 0,
      active: true
    },
    defaultItem: {
      name: '',
      templates: 0,
      active: true
    }
  }),

  computed: {
    ...mapGetters(['categories']),
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.closeDialog()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    ...mapActions({
      getCategories: 'category/getCategories',
      createCategory: 'category/createCategory',
      updateCategory: 'category/updateCategory'
    }),

    async fetchData() {
      this.getCategories()
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    closeDialog() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async submitData() {
      if (this.editedIndex > -1) {
        await this.updateCategory(this.editedItem)
      } else {
        await this.createCategory(this.editedItem)
      }
      this.closeDialog()
    }

    // deleteItem(item) {
    //   const index = this.desserts.indexOf(item)
    //   confirm('Are you sure you want to delete this item?') &&
    //     this.desserts.splice(index, 1)
    // },
  }
}
</script>
