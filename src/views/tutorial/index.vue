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
                class="truncate-two font-semibold px-5 py-2"
                style="font-size: 20px; color: #33caad"
              >
                {{ tut.name }}
              </p>
              <p class="truncate-three px-5 pb-2" style="font-size: 14px">
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

/* .wave-bottom {
  position: relative;
}

.wave-bottom::before,
.wave-bottom::after {
  border-top: 5px solid rgba(237, 30, 30, 1);
}

.wave-bottom::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 10px;
  background-size: 20px 40px;
  background-image: radial-gradient(
    circle at 10px -15px,
    transparent 20px,
    #fff 21px
  );
}

.wave-bottom::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 15px;
  background-size: 40px 40px;
  background-image: radial-gradient(
    circle at 10px 26px,
    #fff 20px,
    transparent 21px
  );
} */

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
  background: url(https://stripo.email/img/front/wave-line-black-white.svg) 100%
    100% no-repeat;
  background-size: 100%;
}
</style>
