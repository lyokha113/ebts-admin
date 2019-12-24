<template>
  <div>
    <vs-row vs-align="center">
      <vs-col vs-type="flex" vs-align="center" vs-w="4">
        <vs-select
          class="mr-2"
          label="Workspaces"
          width="270px"
          v-model="workspace"
          @change="handleChange"
        >
          <vs-select-item
            v-for="item in workspaces"
            :key="item.id"
            :value="item.id"
            :text="item.name"
          />
        </vs-select>
        <vs-button
          v-if="workspaceName != 'Default workspace'"
          class="mx-2 mt-6"
          type="gradient"
          icon="edit"
          @click="handlePopupUpdate"
        ></vs-button>
        <vs-button
          class="mx-2 mt-6"
          type="gradient"
          icon="add"
          @click="handlePopupAdd"
        ></vs-button>
        <vs-button
          v-if="workspaceName != 'Default workspace'"
          class="mx-2 mt-6"
          type="gradient"
          icon="delete_forever"
          color="danger"
          @click="handleDelete"
        ></vs-button>
      </vs-col>
    </vs-row>
    <vs-row class="mt-5" vs-type="flex" vs-align="center" vs-w="12">
      <vs-col
        v-for="item in rawTemplates"
        :key="item.id"
        vs-type="flex"
        vs-align="center"
        vs-w="2"
      >
        <WorkspaceItem :raw="item" @updateRaw="handlePopupUpdateRaw($event)" />
      </vs-col>
      <vs-col vs-type="flex" vs-align="center" vs-w="2">
        <vx-card class="grid-view-item mb-base overflow-hidden">
          <template slot="no-body">
            <div
              class="flex items-center justify-center align-center cursor-pointer"
              @click="handlePopupAddRaw"
            >
              <div style="height: 250px;">
                <span
                  style="display: inline-block; height: 23%; vertical-align: middle;"
                ></span>
                <img src="@/assets/images/new.png" width="100%" />
              </div>
            </div>
          </template>
        </vx-card>
      </vs-col>
    </vs-row>

    <vs-popup id="create-popup" title="CREATE NEW" :active.sync="popupCreate">
      <div>
        Enter workspace name:
        <vs-input
          placeholder="Name"
          v-model="name"
          style="width: 250px"
          class="my-2"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleAdd"
          >Create</vs-button
        >
      </div>
    </vs-popup>

    <vs-popup id="update-popup" title="UPDATE" :active.sync="popupUpdate">
      <div>
        Enter workspace name:
        <vs-input
          placeholder="Name"
          v-model="name"
          style="width: 250px"
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

    <vs-popup
      id="create-template-popup"
      title="CREATE TEMPLATE"
      :active.sync="popupCreateTemplate"
    >
      <div>
        Enter name:
        <vs-input
          placeholder="Name"
          v-model="templateName"
          style="width: 250px"
          class="mt-1 mb-4"
        />
        Enter description:
        <vs-input
          placeholder="Description"
          v-model="templateDescription"
          style="width: 250px"
          class="mt-1 mb-4"
        />
        <vs-checkbox v-model="templateBlank">Set blank content</vs-checkbox>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handlePopupCreateTemplate"
          >Create</vs-button
        >
      </div>
    </vs-popup>

    <CustomPopup
      id="template-popup"
      title="TEMPLATES"
      fullscreen
      button-close-hidden
      :active.sync="popupTemplates"
    >
      <TemplateList @back="handleBack" @getTemplate="handleAddRaw" />
    </CustomPopup>

    <CustomPopup
      id="update-template-popup"
      title="Publish info"
      :active.sync="popupUpdateTemplate"
    >
      <div>
        Enter name:
        <vs-input
          placeholder="Name"
          style="width: 250px"
          v-model="templateName"
          class="mt-1 mb-4"
        />Enter description:
        <vs-input
          placeholder="Description"
          style="width: 250px"
          v-model="templateDescription"
          class="mt-1 mb-4"
        />
        <vs-select
          class="mb-4"
          label="Workspace"
          v-model="templateWorkspace"
          width="250px"
        >
          <vs-select-item
            :key="item.id"
            :value="item.id"
            :text="item.name"
            v-for="item in workspaces"
          />
        </vs-select>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleUpdateRaw"
          >Update</vs-button
        >
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import CustomPopup from '@/components/CustomPopup.vue'
import WorkspaceItem from '@/components/workspace/WorkspaceItem'
import TemplateList from '@/components/workspace/TemplateList'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CustomPopup,
    TemplateList,
    WorkspaceItem
  },
  data() {
    return {
      workspace: '',
      workspaceName: '',
      name: '',
      templateName: '',
      templateDescription: '',
      templateWorkspace: '',
      templateBlank: false,
      templateToUpdate: null,
      popupCreate: false,
      popupUpdate: false,
      popupTemplates: false,
      popupCreateTemplate: false,
      popupUpdateTemplate: false
    }
  },
  computed: {
    ...mapGetters(['workspaces']),
    rawTemplates() {
      const ws = this.workspaces.find(w => w.id == this.workspace)
      return ws ? ws.rawTemplates : []
    }
  },
  methods: {
    ...mapActions([
      'getWorkspaces',
      'createWorkspace',
      'updateWorkspace',
      'deleteWorkspace',
      'createRawTemplate',
      'updateRawTemplate'
    ]),
    handleChange() {
      this.workspaceName = this.workspaces.find(
        w => w.id == this.workspace
      ).name
    },
    handlePopupAdd() {
      this.name = ''
      this.popupCreate = true
    },
    handlePopupUpdate() {
      const ws = this.workspaces.find(w => w.id == this.workspace)
      this.name = ws.name
      this.popupUpdate = true
    },
    handlePopupAddRaw() {
      this.templateName = ''
      this.templateDescription = ''
      this.templateBlank = false
      this.popupCreateTemplate = true
    },
    handlePopupUpdateRaw(raw) {
      this.templateToUpdate = raw
      this.templateName = raw.name
      this.templateDescription = raw.description
      this.templateWorkspace = raw.workspaceId
      this.popupUpdateTemplate = true
    },
    handlePopupCreateTemplate() {
      if (!this.templateName || !this.templateDescription) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      if (this.templateBlank) {
        return this.handleAddRaw(null)
      }

      this.popupCreateTemplate = false
      this.popupTemplates = true
    },
    handleBack() {
      this.popupTemplates = false
      this.popupCreateTemplate = true
    },
    async handleAddRaw(templateId) {
      const raw = {
        name: this.templateName,
        description: this.templateDescription,
        workspaceId: this.workspace,
        templateId: templateId
      }

      if (templateId != null) {
        if (await this.handleCallAPI(this.createRawTemplate, raw)) {
          this.popupTemplates = false
          this.popupCreateTemplate = false
        } else {
          this.handleBack()
        }
      } else {
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: `Confirm`,
          text: `Do you want to create this workspace ?`,
          accept: async () => {
            if (await this.handleCallAPI(this.createRawTemplate, raw)) {
              this.popupCreateTemplate = false
            }
          }
        })
      }
    },
    async handleUpdateRaw() {
      if (!this.templateName || !this.templateDescription) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const raw = {
        id: this.templateToUpdate.id,
        name: this.templateName,
        description: this.templateDescription,
        workspaceId: this.templateWorkspace,
        currentWS: this.templateToUpdate.workspaceId
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this workspace ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.updateRawTemplate, raw)) {
            this.popupUpdateTemplate = false
            if (raw.currentWS != raw.workspaceId) {
              this.workspace = raw.workspaceId
              this.handleChange()
            }
          }
        }
      })
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
    await this.handleCallAPI(this.getWorkspaces)
    this.workspace = this.workspaces.find(w => w.name == 'Default workspace').id
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 285px;
}

#create-template-popup,
#update-template-popup,
#template-popup,
#create-popup,
#update-popup {
  z-index: 51100;
}
</style>
