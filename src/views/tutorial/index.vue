<template>
  <div style="width: 1300px; margin:auto;">
    <vs-row>
      <vs-col :key="tut.id" v-for="tut in tutorials" vs-type="flex" vs-w="4">
        <div
          class="tutorial cursor-pointer"
          style="width: 100%; transition: 0.35s;"
          @click="showTutorialDetail(tut.id)"
        >
          <vx-card class="overflow-hidden">
            <template slot="no-body">
              <div class="h-64 img-holder">
                <img
                  :src="tut.thumbnail"
                  :alt="tut.name"
                  style="width: 100%; height: 100%;"
                />
              </div>
              <p
                class="px-5 pb-1"
                style="font-size: 16px; color: grey; text-transform: capitalize;"
              >
                <feather-icon icon="ClockIcon" svgClasses="h-4 w-4" />
                {{ tut.date | duration('humanize') }}
              </p>
              <p
                class="truncate-two font-semibold px-5 pb-2"
                style="font-size: 22px; color: #33caad"
              >
                {{ tut.name }}
              </p>
              <p class="truncate-three px-5 pb-1" style="font-size: 14px">
                {{ tut.description }}
              </p>
            </template>
          </vx-card>
        </div>
      </vs-col>
    </vs-row>
    <CustomPopup :title="title" fullscreen :active.sync="popupDetails">
      <div v-html="content" />
    </CustomPopup>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CustomPopup from '@/components/CustomPopup.vue'
export default {
  name: 'UserTutorial',
  components: {
    CustomPopup
  },
  data() {
    return {
      title: '',
      popupDetails: false,
      content: ''
    }
  },
  computed: {
    ...mapGetters(['tutorials'])
  },
  methods: {
    ...mapActions(['getTutorials', 'getTutorial']),
    async showTutorialDetail(id) {
      const tutorial = await this.getTutorial(id)
      this.popupDetails = true
      this.content = tutorial.content
      this.title = tutorial.name
    }
  },
  async mounted() {
    this.handleCallAPI(this.getTutorials)
  }
}
</script>
<style>
img.thumbnail {
  width: 100px;
  float: left;
  padding: 30px;
}
div.title {
  width: 700px;
  float: left;
}
div.title > p.name {
  color: black;
  font-size: 30px;
  margin-top: 5px;
}
div.box {
  vertical-align: middle;
  display: inline-block;
  padding: 20px;
}

.tutorial:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}

.img-holder {
  position: relative;
}

.img-holder::before {
  content: '';
  width: 102%;
  height: 100%;
  position: absolute;
  left: -2px;
  bottom: -3px;
  z-index: 2;
  background: url(../../assets/images/wave-line-black-white.svg) 100% 100%
    no-repeat;
  background-size: 100%;
}
</style>
