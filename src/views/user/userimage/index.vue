<template>
  <div>
    <vs-row class="mb-3" vs-justify="flex-end">
      <vs-col vs-type="flex" vs-align="center" vs-justify="flex-end" vs-w="3">
        <vs-select width="300px" class="ml-3" v-model="type">
          <vs-select-item value="Active" text="Active" />
          <vs-select-item value="Deleted" text="Deleted" />
        </vs-select>
        <Uploader />
      </vs-col>
    </vs-row>
    <vs-row v-if="filteredFiles.length">
      <vs-col
        v-for="file in filteredFiles"
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
                <vs-button
                  v-if="type == 'Active'"
                  class="ml-2"
                  type="gradient"
                  icon="delete"
                  radius
                  @click="handleChangeStatusFile(file, false)"
                />
                <vs-button
                  v-if="type == 'Deleted'"
                  class="ml-2"
                  type="gradient"
                  icon="restore"
                  radius
                  @click="handleChangeStatusFile(file, true)"
                />
              </vs-col>
            </vs-row>
          </div>
        </vx-card>
      </vs-col>
    </vs-row>
    <vs-row v-else>
      <vs-col vs-w="12">
        <p class="text-center text-xl font-semibold mt-10">
          {{
            type == 'Active'
              ? `You haven't upload any image. Upload to use them in editor`
              : `No temporary deleted image`
          }}
        </p>
      </vs-col>
    </vs-row>
    <ViewImage v-if="viewSrc" :src="viewSrc" />
  </div>
</template>

<script>
import Uploader from '@/components/manageimage/Uploader.vue'
import ViewImage from '@/components/manageimage/ViewImage.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Uploader,
    ViewImage
  },
  data() {
    return {
      viewSrc: '',
      type: 'Active'
    }
  },
  methods: {
    ...mapActions(['getFiles', 'changeStatusFile']),
    handleChangeStatusFile(selected, active) {
      const file = {
        id: selected.id,
        active: active
      }
      const message = active
        ? 'Do you want to restore this file ?'
        : 'This action could be affect to tutorials which using it. File will be temporary moved to "Deleted" and permanently delete later.'
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: message,
        accept: async () =>
          await this.handleCallAPI(this.changeStatusFile, file)
      })
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'files']),
    filteredFiles() {
      return this.type == 'Active'
        ? this.files.filter(f => f.active)
        : this.files.filter(f => !f.active)
    }
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
  background-color: transparent;
}
</style>
