<template>
  <div>
    <vs-row>
      <vs-col :key="tut.id" v-for="tut in tutorials" vs-type="flex" vs-w="4">
        <div
          class="tutorial cursor-pointer mb-base"
          style="width: 100%; transition: 0.35s;"
          @click="showTutorialDetail(tut.id)"
        >
          <vx-card class="overflow-hidden">
            <template slot="no-body">
              <vs-row>
                <vs-col
                  vs-type="flex"
                  vs-justify="center"
                  vs-align="center"
                  vs-w="4"
                >
                  <div class="flex h-64 my-4">
                    <img
                      :src="tut.thumbnail"
                      :alt="tut.name"
                      style="max-width: 100%; max-height: 100%; margin: auto"
                    />
                  </div>
                </vs-col>
                <vs-col vs-w="8" class="my-4">
                  <p class="truncate-two font-semibold" style="font-size: 20px">
                    {{ tut.name }}
                  </p>
                  <p class="truncate-three mt-3" style="font-size: 18px">
                    {{ tut.description }}
                  </p>
                </vs-col>
              </vs-row>
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
</style>
