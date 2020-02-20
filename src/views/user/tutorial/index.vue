<template>
  <div>
    <div id="data-list-list-view" class="data-list-container mt-3">
      <vs-table ref="table" :data="tutorials">
        <template slot-scope="{ data }">
          <tbody>
            <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">
              <div @click="showTutorialDetail(tr.id)">
                <div class="box">
                  <img :src="tr.thumbnail" class="thumbnail" />
                  <div class="title">
                    <p class="name">{{ tr.name }}</p>
                    <p class="description">{{ tr.description }}</p>
                  </div>
                </div>
              </div>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
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
</style>
