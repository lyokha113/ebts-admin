<template>
  <div
    v-if="template"
    style="background-color: white; width: 1500px; min-width: 1500px; margin:auto"
  >
    <vs-row class="mt-5 pb-5">
      <vs-col vs-type="flex" vs-w="8">
        <vs-row class="mt-5 content-start">
          <vs-col
            class="mb-5"
            vs-type="flex"
            vs-align="center"
            vs-justify="center"
            vs-w="12"
          >
            <vs-button
              class="previewIcon mr-5"
              type="gradient"
              icon="laptop_windows"
              color="success"
              @click="setviewPort('desktop')"
            ></vs-button>
            <vs-button
              class="previewIcon ml-5"
              type="gradient"
              icon="phone_android"
              color="success"
              @click="setviewPort('mobile')"
            ></vs-button>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-w="12">
            <div :class="viewport">
              <div class="content">
                <iframe
                  :srcdoc="template.content"
                  style="height: 100%; width: 100%; border:none"
                />
              </div>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col vs-type="flex" vs-w="4">
        <vs-row class="mt-12 pt-12 content-start">
          <vs-col vs-type="flex" vs-w="12">
            <div class="text-4xl font-semibold" style="color: #33caad">
              Free and Professional HTML Email Templates
            </div>
          </vs-col>
          <vs-col class="mb-5 mt-12" vs-type="flex" vs-w="12">
            <feather-icon
              class="title"
              icon="FileIcon"
              svg-classes="h-10 w-10"
            />
            <div class="text-xl self-end font-semibold italic mx-4">Name:</div>
            <div class="text-xl self-end truncate">{{ template.name }}</div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <feather-icon
              class="title"
              icon="UserIcon"
              svg-classes="h-10 w-10"
            />
            <div class="text-xl self-end font-semibold italic mx-4">
              Author:
            </div>
            <div class="text-xl self-end truncate">
              {{ template.authorName }}
            </div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <feather-icon
              class="title"
              icon="AwardIcon"
              svg-classes="h-10 w-10"
            />
            <div
              class="bg-success flex text-white mx-4 px-2 py-1 rounded cursor-pointer"
              @click="handleRate(true)"
            >
              <span class="text-xl mx-2">{{ template.upVote }}</span>
              <feather-icon icon="ChevronUpIcon" svg-classes="h-8 w-8" />
            </div>
            <div
              class="bg-danger flex text-white mx-4 px-2 py-1 rounded cursor-pointer"
              @click="handleRate(false)"
            >
              <span class="text-xl mx-2">{{ template.downVote }}</span>
              <feather-icon icon="ChevronDownIcon" svg-classes="h-8 w-8" />
            </div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <div class="text-xl font-semibold italic mx-4">
              Description:
            </div>
            <div class="text-xl truncate-six">
              {{ template.description }}
            </div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <div class="text-xl font-semibold italic mx-4">Categories:</div>
            <div>
              <vs-chip
                v-for="item in template.categories"
                :key="item.id"
                color="#24c1a0"
                class="mr-2"
                style="font-size: 13px"
                >{{ item.name }}</vs-chip
              >
            </div>
          </vs-col>
          <vs-col class="my-3" vs-type="flex" vs-w="12">
            <div
              class="flex py-4 justify-center cursor-pointer"
              style="width: 50%; background-color: #33caad; color: white; border-radius: 10px; margin: auto"
            >
              <feather-icon
                class="mr-5"
                svg-classes="h-8 w-8"
                icon="EditIcon"
              ></feather-icon>
              <div
                class="text-xl self-center font-medium"
                @click="handleDesign"
              >
                Start To Design
              </div>
            </div>
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
    <vs-row v-if="getOtherTemplates.length" class="mt-5 pb-5">
      <vs-col vs-type="flex" vs-w="12" vs-justify="center" class="mb-5">
        <h1 class="font-bold">Top by same Author</h1>
      </vs-col>
      <vs-col
        v-for="item in getOtherTemplates"
        :key="item.id"
        vs-type="flex"
        vs-align="center"
        vs-w="3"
      >
        <TemplateGridItems
          :template="item"
          @click="$router.push(`/detail/${item.id}`).catch(err => {})"
        />
      </vs-col>
    </vs-row>

    <CustomPopup
      id="create-template-popup"
      class="pa-3"
      title="CREATE TEMPLATE"
      :active.sync="popupCreateTemplate"
    >
      <div>
        Enter name:
        <vs-input
          v-model="name"
          placeholder="Name"
          style="width: 100%"
          class="mt-1 mb-4"
        />
        Enter description:
        <vs-input
          v-model="description"
          placeholder="Description"
          style="width: 100%"
          class="mt-1 mb-5"
        />
        Choose workspace:
        <multiselect
          v-model="workspace"
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
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-5"
          @click="handleCreateTemplate"
          >Create</vs-button
        >
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TemplateGridItems from '@/components/TemplateGridItems'
import CustomPopup from '@/components/CustomPopup.vue'
export default {
  components: {
    CustomPopup,
    TemplateGridItems
  },
  data() {
    return {
      id: this.$route.params.id,
      template: null,
      viewport: 'desktop',
      popupCreateTemplate: false,
      name: '',
      description: '',
      workspace: ''
    }
  },
  computed: {
    ...mapGetters([
      'activeUser',
      'currentTemplate',
      'workspaces',
      'templatesByAuthor'
    ]),
    getOtherTemplates() {
      return this.templatesByAuthor
        .filter(t => t.id != this.template.id)
        .slice(0, 4)
    }
  },
  methods: {
    ...mapActions([
      'getTemplate',
      'getTemplatesByAuthor',
      'getWorkspaces',
      'getRawTemplate',
      'createRawTemplate',
      'rate'
    ]),
    setviewPort(view) {
      this.viewport = view == 'desktop' ? 'desktop' : 'mobile'
    },
    handleDesign() {
      if (this.activeUser) {
        this.popupCreateTemplate = true
      } else {
        this.$router.push('/login?return=workspace')
      }
    },
    async handleCreateTemplate() {
      if (!this.name || !this.description || !this.workspace) {
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
        text: `Do you want to create with this template content ?`,
        accept: async () => {
          const raw = {
            name: this.name,
            description: this.description,
            workspaceId: this.workspace.id,
            templateId: this.id
          }
          const id = await this.handleCallAPI(this.createRawTemplate, raw)
          if (id) {
            await this.handleCallAPI(this.getRawTemplate, id)
            this.popupCreateTemplate = false
            this.$router.push(`/user/editor/`)
            return
          }
        }
      })
    },
    async handleRate(isVote) {
      if (this.activeUser) {
        const rating = await this.handleCallAPI(this.rate, {
          templateId: this.template.id,
          vote: isVote
        })
        this.template.upVote = rating.upVote
        this.template.downVote = rating.downVote
      } else {
        this.$router.push(`/login?return=detail-${this.template.id}`)
      }
    },
    async fetchData() {
      this.template = await this.handleCallAPI(this.getTemplate, this.id)

      if (this.activeUser) {
        await Promise.all([
          this.handleCallAPI(
            this.getTemplatesByAuthor,
            this.template.authorId,
            false
          ),
          this.handleCallAPI(this.getWorkspaces, null, false)
        ])
      } else {
        await this.handleCallAPI(
          this.getTemplatesByAuthor,
          this.template.authorId,
          false
        )
      }
    }
  },
  async mounted() {
    this.fetchData()
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.params.id
    this.fetchData()
    next()
  }
}
</script>

<style lang="scss" scoped>
/deep/ .title {
  svg {
    color: cadetblue !important;
  }
}

.previewIcon {
  width: 60px !important;
  height: 60px !important;

  /deep/ .vs-icon {
    font-size: 2.5rem;
  }
}

.desktop {
  position: relative;
  width: 700px;
  height: 520px;
  margin: auto;
  border-radius: 10px;
  border-style: solid;
  border-color: black;
  border-width: 16px 16px 48px;
  transition: all 0.5s;

  &::after {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    bottom: -55px;
    transform: translate(-50%, -50%);
    background: #333;
    border-radius: 50%;
  }

  .content {
    padding: 10px;
    width: 668px;
    height: 440px;
    overflow: hidden;
    border: none;
  }
}

.mobile {
  position: relative;
  width: 360px;
  height: 640px;
  margin: auto;
  border: 16px black solid;
  border-top-width: 60px;
  border-bottom-width: 60px;
  border-radius: 36px;
  transition: all 0.5s;

  &:before {
    content: '';
    display: block;
    width: 60px;
    height: 5px;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #333;
    border-radius: 10px;
  }

  &:after {
    content: '';
    display: block;
    width: 35px;
    height: 35px;
    position: absolute;
    left: 50%;
    bottom: -65px;
    transform: translate(-50%, -50%);
    background: #333;
    border-radius: 50%;
  }

  .content {
    width: 330px;
    height: 520px;
    background: white;
  }
}

/deep/ .vs-popup {
  width: 350px;
}

#create-template-popup {
  z-index: 51100;
}
</style>
