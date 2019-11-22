<template>
  <div>
    <vs-row class="mb-4">
      <vs-col vs-type="flex" vs-align="center" vs-w="11">
        <div
          class="flex search-full-container w-full h-full absolute left-0 rounded-lg"
        >
          <div class="flex items-center relative">
            <vs-input
              ref="input"
              class="z-50"
              icon-pack="feather"
              icon="icon-search"
              icon-no-border
            ></vs-input>
          </div>
        </div>
        <feather-icon
          icon="SearchIcon"
          class="cursor-pointer navbar-fuzzy-search ml-4"
        ></feather-icon>
      </vs-col>
      <vs-col vs-type="flex" vs-align="center" vs-justify="end" vs-w="1">
        <Uploader />
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col
        v-for="file in files"
        :key="file.id"
        vs-type="flex"
        vs-justify="center"
        vs-align="center"
        vs-w="2"
      >
        <vx-card class="grid-view-item mb-base overflow-hidden">
          <div
            class="item-img-container bg-white h-64 flex items-center justify-center mx-3"
          >
            <img :src="file.link" class="grid-view-img" />
          </div>
          <vs-divider border-style="dashed" />
          <div class="item-details px-3 text-center">
            <div>
              <h6 class="truncate font-semibold mb-1">{{ file.name }}</h6>
            </div>
            <vs-row class="my-2">
              <vs-col
                vs-type="flex"
                vs-align="center"
                vs-justify="center"
                vs-w="12"
              >
                <vs-button
                  class="mr-2"
                  type="gradient"
                  icon="search"
                  radius
                  @click="viewSrc = file.link"
                />
                <vs-button class="ml-2" type="gradient" icon="delete" radius />
              </vs-col>
            </vs-row>
          </div>
        </vx-card>
      </vs-col>
    </vs-row>
    <ViewImage v-if="viewSrc" :src="viewSrc" />
  </div>
</template>

<script>
import VxAutoSuggest from '@/components/vx-auto-suggest/VxAutoSuggest.vue'
import Uploader from '@/components/manageimage/Uploader.vue'
import ViewImage from '@/components/manageimage/ViewImage.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Uploader,
    ViewImage,
    VxAutoSuggest
  },
  data() {
    return {
      viewSrc: ''
    }
  },
  methods: {
    ...mapActions(['getFiles'])
  },
  computed: {
    ...mapGetters(['accessToken', 'files'])
  },
  mounted() {
    this.handleCallAPI(this.getFiles)
  }
}
</script>

<style lang="scss" scoped>
.grid-view-item {
  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
}

/deep/ .con-img-upload {
  display: flex;
  justify-content: center;
}
</style>
