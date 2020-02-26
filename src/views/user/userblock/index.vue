<template>
  <div style="background-color: white; padding: 10px;">
    <vs-row class="mt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col
        vs-type="flex"
        vs-align="center"
        vs-w="1"
        v-for="block in userBlocks"
        :key="block.id"
      >
        <vx-card class="grid-view-item mb-base overflow-hidden cursor-pointer">
          <template slot="no-body">
            <div
              style="text-align: center"
              class="m-2"
              @click="handlePopupUpdate(block)"
            >
              <div class="my-2 font-medium truncate" style="font-size: 16px">
                {{ block.name }}
              </div>
              <i
                class="mb-2 fa"
                :class="`fa-${block.icon}`"
                style="font-size: 80px"
              ></i>
            </div>
          </template>
        </vx-card>
      </vs-col>

      <vs-col vs-type="flex" vs-align="center" vs-w="1">
        <vx-card class="grid-view-item mb-base overflow-hidden cursor-pointer">
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
                    'url(' + require('@/assets/images/new.png') + ')'
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
                :id="i"
                :value="i"
                type="radio"
                name="icon"
                style="display: none"
              />
              <label :for="i">
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
                :id="i"
                :value="i"
                type="radio"
                name="icon"
                style="display: none"
              />
              <label :for="i">
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
            @click="handleUpdate"
            >Update</vs-button
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
      popupCreate: false,
      popupUpdate: false
    }
  },
  computed: {
    ...mapGetters(['userBlocks']),
    iconsDisplay() {
      return icons
    }
  },
  methods: {
    ...mapActions([
      'getUserBlocks',
      'createUserBlock',
      'updateUserBlock',
      'deleteUserBlock'
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
    async handleAdd() {
      if (!this.name || !this.icon) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
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
        text: `Do you want to create new block ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.createUserBlock, {
              name: this.name,
              icon: this.icon
            })
          ) {
            this.popupCreate = false
          }
        }
      })
    },
    async handleUpdate() {
      if (!this.nameUpdate || !this.iconUpdate) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
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
        text: `Do you want to update this block ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.updateUserBlock, {
              id: this.id,
              name: this.nameUpdate,
              icon: this.iconUpdate
            })
          ) {
            this.popupUpdate = false
          }
        }
      })
    },
    async handleDelete() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this workspace ?`,
        accept: async () => {
          const ws = this.workspaces.find(w => w.id == this.workspace)
          await this.handleCallAPI(this.deleteWorkspace, ws)
          this.workspace = this.workspaces.find(
            w => w.name == 'Default workspace'
          ).id
        }
      })
    }
  },
  async mounted() {
    await this.handleCallAPI(this.getUserBlocks, null)
  },
  destroyed() {
    this.popupCreate = false
    this.popupUpdate = false
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 800px;
  height: 420px;
}
#create-popup,
#update-popup {
  z-index: 51100;
}

#new-box {
  height: 50%;
  width: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(/img/new.cdb0a76b.png);
}

.icon-wrapper:hover {
  box-shadow: 0px 0px 3px 3px #7367f0;
}

input[type='radio']:checked + label {
  color: #7367f0;
}
</style>
