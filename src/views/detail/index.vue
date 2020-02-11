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
              svgClasses="h-10 w-10"
            />
            <div class="text-xl self-end font-semibold italic mx-4">Name:</div>
            <div class="text-xl self-end truncate">{{ template.name }}</div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <feather-icon
              class="title"
              icon="UserIcon"
              svgClasses="h-10 w-10"
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
              icon="MessageSquareIcon"
              svgClasses="h-10 w-10"
            />
            <div class="text-xl self-end font-semibold italic mx-4">
              Description:
            </div>
            <div class="text-xl self-end truncate">
              {{ template.description }}
            </div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <feather-icon
              class="title"
              icon="AwardIcon"
              svgClasses="h-10 w-10"
            />
            <div
              class="bg-success flex text-white mx-4 px-2 py-1 rounded cursor-pointer"
              @click="handleRate(true)"
            >
              <span class="text-xl mx-2">{{ template.upVote }}</span>
              <feather-icon icon="ChevronUpIcon" svgClasses="h-8 w-8" />
            </div>
            <div
              class="bg-danger flex text-white mx-4 px-2 py-1 rounded cursor-pointer"
              @click="handleRate(false)"
            >
              <span class="text-xl mx-2">{{ template.downVote }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-8 w-8" />
            </div>
          </vs-col>
          <vs-col class="my-5" vs-type="flex" vs-w="12">
            <div class="text-xl font-semibold italic mx-4">Categories:</div>
            <div>
              <vs-chip
                color="#24c1a0"
                class="mr-2"
                v-for="item in template.categories"
                :key="item.id"
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
                svgClasses="h-8 w-8"
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['id'],
  data() {
    return {
      template: null,
      viewport: 'desktop'
    }
  },
  computed: {
    ...mapGetters(['activeUser', 'currentTemplate'])
  },
  methods: {
    ...mapActions(['getTemplate', 'rate']),
    setviewPort(view) {
      this.viewport = view == 'desktop' ? 'desktop' : 'mobile'
    },
    handleDesign() {
      if (this.activeUser) {
        this.$router.push('/user/workspace')
      } else {
        this.$router.push('/login?return=workspace')
      }
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
    }
  },
  async mounted() {
    this.template = await this.getTemplate(this.id)
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
</style>
