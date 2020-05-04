<template>
  <div style="background-color: white; padding: 10px;">
    <vs-row class="mt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col
        vs-type="flex"
        vs-align="center"
        vs-w="2"
        v-for="block in userBlocks"
        :key="block.id"
      >
        <vx-card
          class="grid-view-item mb-base overflow-hidden cursor-pointer user-block"
        >
          <template slot="no-body">
            <div
              style="text-align: center"
              class="m-2"
              @click="handleEdit(block.id)"
            >
              <div
                class="my-2 px-5 font-medium truncate"
                style="font-size: 16px"
              >
                {{ block.name }}
              </div>
              <i
                class="mb-2 fa"
                :class="`fa-${block.icon}`"
                style="font-size: 80px"
              ></i>
            </div>
            <div class="mb-3 flex justify-center">
              <vs-button
                class="mx-2"
                type="gradient"
                icon="edit"
                radius
                @click="handlePopupUpdate(block)"
              />
              <vs-button
                class="mx-2"
                type="gradient"
                icon="sync"
                radius
                color="success"
                @click="handlePopupSync(block.id)"
              />
              <vs-button
                class="ml-2"
                type="gradient"
                icon="delete"
                radius
                color="danger"
                @click="handleDelete(block.id)"
              />
            </div>
          </template>
        </vx-card>
      </vs-col>

      <vs-col vs-type="flex" vs-align="center" vs-w="1">
        <vx-card
          class="grid-view-item mb-base overflow-hidden cursor-pointer new-box-wrapper"
        >
          <template slot="no-body">
            <div
              class="flex items-center justify-center align-center"
              style="height: 125px"
              @click="handlePopupAdd"
            >
              <div
                id="new-box"
                :style="{
                  backgroundImage:
                    'url(' + require('@/assets/images/add.png') + ')'
                }"
              />
            </div>
          </template>
        </vx-card>
      </vs-col>
    </vs-row>

    <vs-popup
      id="create-popup"
      title="CREATE NEW BLOCK"
      :active.sync="popupCreate"
    >
      <vs-row>
        <vs-col vs-w="12">
          Enter block name:
          <vs-input
            class="mt-3"
            v-model="name"
            placeholder="Name"
            style="width: 100%"
          />
        </vs-col>
        <vs-col
          class="my-5"
          vs-w="12"
          style="max-height: 200px; overflow: auto"
        >
          <vs-row>
            <vs-col
              class="icon-wrapper"
              vs-type="flex"
              vs-justify="center"
              vs-w="2"
              v-for="(i, index) in iconsDisplay"
              :key="index"
            >
              <input
                v-model="icon"
                :id="`add-${i}`"
                :value="i"
                type="radio"
                name="icon"
                style="display: none"
              />
              <label :for="`add-${i}`">
                <i
                  class="m-3 cursor-pointer fa"
                  :class="`fa-${i}`"
                  style="font-size: 42px"
                ></i
              ></label>
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-w="12">
          <vs-button
            color="primary"
            type="filled"
            class="float-right my-3"
            @click="handleAdd"
            :disabled="!name || !icon"
            >Create</vs-button
          >
        </vs-col>
      </vs-row>
    </vs-popup>

    <vs-popup id="update-popup" title="UPDATE BLOCK" :active.sync="popupUpdate">
      <vs-row>
        <vs-col vs-w="12">
          Enter block name:
          <vs-input
            class="mt-3"
            v-model="nameUpdate"
            placeholder="Name"
            style="width: 100%"
          />
        </vs-col>
        <vs-col
          class="my-5"
          vs-w="12"
          style="max-height: 200px; overflow: auto"
        >
          <vs-row>
            <vs-col
              class="icon-wrapper"
              vs-type="flex"
              vs-justify="center"
              vs-w="2"
              v-for="(i, index) in iconsDisplay"
              :key="index"
            >
              <input
                v-model="iconUpdate"
                :id="`update-${i}`"
                :value="i"
                type="radio"
                name="icon"
                style="display: none"
              />
              <label :for="`update-${i}`">
                <i
                  class="m-3 cursor-pointer fa"
                  :class="`fa-${i}`"
                  style="font-size: 42px"
                ></i
              ></label>
            </vs-col>
          </vs-row>
        </vs-col>
        <vs-col vs-w="12">
          <vs-button
            color="primary"
            type="filled"
            class="float-right my-3"
            :disabled="!nameUpdate || !iconUpdate"
            @click="handleUpdate"
            >Update</vs-button
          >
        </vs-col>
      </vs-row>
    </vs-popup>

    <vs-popup
      id="sync-popup"
      title="SYNCHRONIZE BLOCK"
      :active.sync="popupSync"
    >
      <vs-row>
        <vs-col vs-w="12">
          Choose templates to sync:
          <multiselect
            v-model="templates"
            track-by="id"
            label="name"
            selectLabel=""
            selectedLabel=""
            deselectLabel=""
            group-values="raw"
            group-label="workspace"
            :options="templatesDisplay"
            :multiple="true"
            :close-on-select="false"
            :searchable="false"
          >
          </multiselect>
        </vs-col>
        <vs-col vs-w="12">
          <vs-button
            color="primary"
            class="float-right my-5 ml-2"
            @click="handleCheckAll"
            >{{ titleDisplay }}</vs-button
          >
          <vs-button
            color="primary"
            class="float-right my-5 mr-2"
            :disabled="!templates.length"
            @click="handleSync"
            >Sync</vs-button
          >
        </vs-col>
      </vs-row>
    </vs-popup>
  </div>
</template>

<script>
import icons from '@/components/userblock/icons.json'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      id: '',
      name: '',
      nameUpdate: '',
      icon: '',
      iconUpdate: '',
      templates: [],
      popupCreate: false,
      popupUpdate: false,
      popupSync: false
    }
  },
  computed: {
    ...mapGetters(['userBlocks', 'workspaces']),
    iconsDisplay() {
      return icons
    },
    templatesDisplay() {
      return this.workspaces.map(w => {
        return { workspace: w.name, raw: w.rawTemplates }
      })
    },
    titleDisplay() {
      let count = 0
      this.workspaces.forEach(w => (count += w.rawTemplates.length))
      return this.templates.length != count ? 'Select All' : 'Deselect All'
    }
  },
  methods: {
    ...mapActions([
      'getUserBlocks',
      'getUserBlock',
      'createUserBlock',
      'updateUserBlock',
      'deleteUserBlock',
      'getWorkspaces',
      'synchronizeContent'
    ]),
    handlePopupAdd() {
      this.name = ''
      this.icon = ''
      this.popupCreate = true
    },
    handlePopupUpdate(block) {
      this.nameUpdate = block.name
      this.iconUpdate = block.icon
      this.id = block.id
      this.popupUpdate = true
    },
    handlePopupSync(id) {
      this.id = id
      this.templates = []
      this.popupSync = true
    },
    handleCheckAll() {
      let count = 0
      this.workspaces.forEach(w => (count += w.rawTemplates.length))

      if (this.templates.length == count) {
        this.templates = []
      } else {
        this.templates = []
        this.workspaces.forEach(w => {
          this.templates = [...this.templates, ...w.rawTemplates]
        })
      }
    },
    async handleAdd() {
      let isErrors = false
      if (!this.icon) {
        this.handleErrorInput('Error input value', 'Please select icon')
        isErrors = true
      }

      if (this.name.trim().length < 1 || this.name.trim().length > 10) {
        this.handleErrorInput(
          'Error input value',
          'Block name must be 1 - 10 characters'
        )
        isErrors = true
      }

      if (isErrors) {
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to create new block ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.createUserBlock, {
              name: this.name.trim(),
              icon: this.icon
            })
          ) {
            this.popupCreate = false
          }
        }
      })
    },
    async handleUpdate() {
      let isErrors = false
      if (!this.iconUpdate) {
        this.handleErrorInput('Error input value', 'Please select icon')
        isErrors = true
      }

      if (
        this.nameUpdate.trim().length < 1 ||
        this.nameUpdate.trim().length > 10
      ) {
        this.handleErrorInput(
          'Error input value',
          'Block name must be 1 - 10 characters'
        )
        isErrors = true
      }

      if (isErrors) {
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to update this block ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.updateUserBlock, {
              id: this.id,
              name: this.nameUpdate.trim(),
              icon: this.iconUpdate
            })
          ) {
            this.popupUpdate = false
          }
        }
      })
    },
    async handleSync() {
      if (!this.templates.length) {
        this.handleErrorInput(
          'Error input value',
          'Please choose template to sync'
        )
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to synchronize this block content to selected design tempalates ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.synchronizeContent, {
              blockId: this.id,
              templates: this.templates
            })
          ) {
            this.popupSync = false
          }
        }
      })
    },
    async handleDelete(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this block ?`,
        accept: () => this.handleCallAPI(this.deleteUserBlock, id)
      })
    },
    handleEdit(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to design this block ?`,
        accept: async () => {
          await this.handleCallAPI(this.getUserBlock, id)
          this.$router.push(`/user/block/editor/`)
        }
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
      this.handleCallAPI(this.getWorkspaces, null, false),
      this.handleCallAPI(this.getUserBlocks, null, false)
    ])

    loader.hide()
  },
  destroyed() {
    this.popupCreate = false
    this.popupUpdate = false
  }
}
</script>

<style lang="scss" scoped>
#create-popup,
#update-popup {
  z-index: 51100;

  /deep/ .vs-popup {
    width: 800px;
    height: 420px;
  }
}

#sync-popup {
  z-index: 51100;

  /deep/ .vs-popup--content {
    overflow-y: scroll;
  }

  /deep/ .multiselect--active .multiselect__content-wrapper {
    display: contents;
  }
}

.new-box-wrapper,
.user-block {
  transition: ease-in-out 0.5s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }
}

#new-box {
  height: 50%;
  width: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-wrapper:hover {
  box-shadow: 0px 0px 3px 3px #7367f0;
}

input[type='radio']:checked + label {
  color: #7367f0;
}
</style>
