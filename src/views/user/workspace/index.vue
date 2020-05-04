<template>
  <div style="background-color: white; padding: 10px;">
    <vs-row vs-align="center">
      <vs-col vs-type="flex" vs-align="center" vs-w="4">
        <vs-select
          v-model="workspace"
          class="mr-2"
          label="Workspaces"
          width="270px"
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
        <WorkspaceItem
          :raw="item"
          @updateRaw="handlePopupUpdateRaw($event)"
          @publishRaw="handlePopupPublishRaw($event)"
        />
      </vs-col>
      <vs-col vs-type="flex" vs-align="center" vs-w="2">
        <vx-card class="grid-view-item mb-base overflow-hidden new-box-wrapper">
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
      title="Create Workspace"
      :active.sync="popupCreate"
    >
      <div>
        Enter workspace name:
        <vs-input
          v-model="name"
          placeholder="Name"
          style="width: 100%"
          class="my-2"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          :disabled="!name"
          @click="handleAdd"
          >Create</vs-button
        >
      </div>
    </vs-popup>

    <vs-popup
      id="update-popup"
      title="Update Workspace"
      :active.sync="popupUpdate"
    >
      <div>
        Enter workspace name:
        <vs-input
          v-model="name"
          placeholder="Name"
          style="width: 100%"
          class="my-2"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          :disabled="!name"
          @click="handleUpdate"
          >Update</vs-button
        >
      </div>
    </vs-popup>

    <vs-popup
      id="create-template-popup"
      title="Create Template"
      :active.sync="popupCreateTemplate"
    >
      <div>
        Enter name:
        <vs-input
          v-model="templateName"
          placeholder="Name"
          style="width: 100%"
          class="mt-1 mb-4"
        />
        Enter description:
        <vs-textarea
          v-model="templateDescription"
          width="100%"
          class="mt-1 mb-5"
        />
        <vs-checkbox v-model="templateBlank">Set blank content</vs-checkbox>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          :disabled="!templateName || !templateDescription"
          @click="handlePopupCreateTemplate"
          >Create</vs-button
        >
      </div>
    </vs-popup>

    <CustomPopup
      id="template-popup"
      title="Templates"
      fullscreen
      button-close-hidden
      :active.sync="popupTemplates"
    >
      <TemplateList @back="handleBack" @getTemplate="handleAddRaw" />
    </CustomPopup>

    <CustomPopup
      id="update-template-popup"
      title="Update Template"
      :active.sync="popupUpdateTemplate"
    >
      <div>
        Enter name:
        <vs-input
          v-model="templateName"
          placeholder="Name"
          style="width: 100%"
          class="mt-1 mb-4"
        />
        Enter workspace:
        <multiselect
          v-model="templateWorkspace"
          track-by="id"
          label="name"
          placeholder=""
          selectLabel=""
          selectedLabel=""
          deselectLabel=""
          :options="workspaces"
          :searchable="false"
          :allow-empty="false"
        >
        </multiselect>
        Enter description:
        <vs-textarea
          v-model="templateDescription"
          width="100%"
          class="mt-1 mb-5"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-5"
          @click="handleUpdateRaw"
          :disabled="
            !templateName || !templateDescription || !templateWorkspace
          "
          >Update</vs-button
        >
      </div>
    </CustomPopup>

    <CustomPopup
      id="publish-template-popup"
      title="Publish Info"
      :active.sync="popupPublishTemplate"
    >
      <div>
        Enter name:
        <vs-input
          v-model="publishName"
          placeholder="Name"
          style="width: 100%"
          class="mt-1 mb-4"
        />
        Enter description:
        <vs-textarea
          v-model="publishDescription"
          width="100%"
          class="mt-1 mb-5"
        />
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-5"
          @click="handllePublishRaw"
          :disabled="!publishName || !publishDescription"
          >Submit</vs-button
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
      publishId: '',
      publishName: '',
      publishDescription: '',
      popupCreate: false,
      popupUpdate: false,
      popupTemplates: false,
      popupCreateTemplate: false,
      popupUpdateTemplate: false,
      popupPublishTemplate: false
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
      'getRawTemplate',
      'createRawTemplate',
      'updateRawTemplate',
      'getCategories',
      'getTemplates',
      'createPublish'
    ]),
    handleChange() {
      this.workspaceName = this.workspaces.find(
        w => w.id == this.workspace
      ).name
    },
    handlePopupPublishRaw(raw) {
      this.publishId = raw.id
      this.publishName = ''
      this.publishDescription = ''
      this.popupPublishTemplate = true
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
      this.templateWorkspace = this.workspaces.find(
        ws => ws.id == raw.workspaceId
      )
      this.popupUpdateTemplate = true
    },
    handlePopupCreateTemplate() {
      let isErrors = false
      if (
        this.templateName.trim().length < 5 ||
        this.templateName.trim().length > 30
      ) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        isErrors = true
      }

      if (
        this.templateDescription.trim().length < 5 ||
        this.templateDescription.trim().length > 300
      ) {
        this.handleErrorInput(
          'Error input value',
          'Description must be 5 - 300 characters'
        )
        isErrors = true
      }

      if (isErrors) {
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
        name: this.templateName.trim(),
        description: this.templateDescription.trim(),
        workspaceId: this.workspace,
        templateId: templateId
      }

      if (templateId != null) {
        const id = await this.handleCallAPI(this.createRawTemplate, raw)
        if (id) {
          await this.handleCallAPI(this.getRawTemplate, id)
          this.popupTemplates = false
          this.popupCreateTemplate = false
          this.$router.push(`/user/editor/`)
        } else {
          this.handleBack()
        }
      } else {
        this.$vs.dialog({
          type: 'confirm',
          title: `Confirm`,
          text: `Do you want to create a blank template ?`,
          accept: async () => {
            const id = await this.handleCallAPI(this.createRawTemplate, raw)
            if (id) {
              await this.handleCallAPI(this.getRawTemplate, id)
              this.popupTemplates = false
              this.popupCreateTemplate = false
              this.$router.push(`/user/editor/`)
            }
          }
        })
      }
    },
    async handllePublishRaw() {
      let isErrors = false
      if (
        this.publishName.trim().length < 5 ||
        this.publishName.trim().length > 30
      ) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        isErrors = true
      }

      if (
        this.publishDescription.trim().length < 5 ||
        this.publishDescription.trim().length > 300
      ) {
        this.handleErrorInput(
          'Error input value',
          'Description must be 5 - 300 characters'
        )
        isErrors = true
      }

      if (isErrors) {
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `We are really appreciate if you want to contribute this template. Are you sure to do that ?`,
        accept: async () => {
          const raw = await this.handleCallAPI(
            this.getRawTemplate,
            this.publishId
          )
          this.popupPublishTemplate = false
          await this.handleCallAPI(this.createPublish, {
            name: this.publishName.trim(),
            description: this.publishDescription.trim(),
            content: raw.content
          })
        }
      })
    },
    async handleUpdateRaw() {
      let isErrors = false
      if (
        this.templateName.trim().length < 5 ||
        this.templateName.trim().length > 30
      ) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        isErrors = true
      }

      if (
        this.templateDescription.trim().length < 5 ||
        this.templateDescription.trim().length > 300
      ) {
        this.handleErrorInput(
          'Error input value',
          'Description must be 5 - 300 characters'
        )
        isErrors = true
      }

      if (isErrors) {
        return
      }

      const raw = {
        id: this.templateToUpdate.id,
        name: this.templateName.trim(),
        description: this.templateDescription.trim(),
        workspaceId: this.templateWorkspace && this.templateWorkspace.id,
        currentWS: this.templateToUpdate.workspaceId
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to update this workspace ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.updateRawTemplate, raw)) {
            this.popupUpdateTemplate = false
            if (raw.workspaceId && raw.currentWS != raw.workspaceId) {
              this.workspace = raw.workspaceId
              this.handleChange()
            }
          }
        }
      })
    },
    async handleAdd() {
      if (this.name.trim().length < 5 || this.name.trim().length > 30) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to create new workspace ?`,
        accept: async () => {
          this.workspace = await this.handleCallAPI(this.createWorkspace, {
            name: this.name.trim()
          })
          if (this.workspace != undefined) {
            this.popupCreate = false
          }
        }
      })
    },
    async handleUpdate() {
      if (this.name.trim().length < 5 || this.name.trim().length > 30) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to update this workspace ?`,
        accept: async () => {
          if (
            await this.handleCallAPI(this.updateWorkspace, {
              id: this.workspace.trim(),
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
        title: `Confirm`,
        text: `All template on this workspace will be moved to 'Default Workspace'. Do you want to delete this workspace ?`,
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
    await this.handleCallAPI(this.getWorkspaces, null)
    this.workspace = this.workspaces.find(w => w.name == 'Default workspace').id
    Promise.all([
      this.handleCallAPI(this.getCategories, null, false),
      this.handleCallAPI(this.getTemplates, null, false)
    ])
  },
  destroyed() {
    this.popupCreate = false
    this.popupUpdate = false
    this.popupTemplates = false
    this.popupCreateTemplate = false
    this.popupUpdateTemplate = false
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 320px;
}

#publish-template-popup,
#create-template-popup,
#update-template-popup,
#template-popup,
#create-popup,
#update-popup {
  z-index: 51100;
}

.new-box-wrapper {
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
</style>
