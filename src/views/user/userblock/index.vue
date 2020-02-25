<template>
  <div style="background-color: white; padding: 10px;">
    <vs-row class="mt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col vs-type="flex" vs-align="center" vs-w="2">
        <vx-card class="grid-view-item mb-base overflow-hidden">
          <template slot="no-body">
            <div
              class="flex items-center justify-center align-center cursor-pointer"
              style="height: 250px"
              @click="handlePopupAddRaw"
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
      <div>
        Enter block name:
        <vs-input
          v-model="name"
          placeholder="Name"
          style="width: 270px"
          class="my-2"
        />
        Choose workspace:
        <vs-select v-model="workspace" class="mt-1 mb-4" style="width: 270px">
          <vs-select-item
            v-for="(item, index) in icons"
            :key="index"
            :value="'fa ' + item"
            :text="item"
          />
        </vs-select>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleAdd"
          >Create</vs-button
        >
      </div>
    </vs-popup>
  </div>
</template>

<script>
import icons from '@/components/userblock/icons.json'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      name: '',
      icon: '',
      popupCreate: false,
      popupUpdate: false
    }
  },
  computed: {
    ...mapGetters(['userBlocks'])
  },
  methods: {
    ...mapActions(['getUserBlocks']),
    handlePopupAdd() {
      this.name = ''
      this.popupCreate = true
    },
    handlePopupUpdate() {
      const ws = this.workspaces.find(w => w.id == this.workspace)
      this.name = ws.name
      this.popupUpdate = true
    },
    async handleAdd() {
      if (!this.name) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter workspace name',
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
        text: `Do you want to create new workspace ?`,
        accept: async () => {
          this.workspace = await this.handleCallAPI(this.createWorkspace, {
            name: this.name
          })
          if (this.workspace != undefined) {
            this.popupCreate = false
          }
        }
      })
    },
    async handleUpdate() {
      if (!this.name) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter workspace name',
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
        text: `Do you want to update this workspace ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.updateWorkspace, {
              id: this.workspace,
              name: this.name
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
  width: 300px;
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
</style>
