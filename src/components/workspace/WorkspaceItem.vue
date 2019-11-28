<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div class="bg-white flex items-center justify-center">
        <div
          class="thumbnail mx-3 mt-3"
          :style="{ backgroundImage: `url(${raw.thumbnail})` }"
        />
      </div>
      <vs-divider border-style="dashed" class="my-3" />
      <vs-row class="mb-3" vs-align="center" vs-justify="center">
        <vs-col vs-type="flex" vs-align="center" vs-w="12">
          <feather-icon
            icon="FileIcon"
            svgClasses="h-4 w-4"
            class="mr-2"
          ></feather-icon>
          <span class="truncate font-semibold text-lg">{{ raw.name }}</span>
        </vs-col>
        <vs-col class="my-1" vs-type="flex" vs-align="center" vs-w="12">
          <feather-icon
            icon="ClockIcon"
            svgClasses="h-4 w-4"
            class="mr-2"
          ></feather-icon>
          <span class="text-sm">{{
            raw.date | moment('DD-MM-YYYY, HH:mm:ss')
          }}</span>
        </vs-col>
        <vs-col vs-type="flex" vs-align="center" vs-w="12">
          <span class="truncate text-base">
            {{ raw.description }}
          </span>
        </vs-col>
        <vs-col
          class="mt-3"
          vs-justify="center"
          vs-type="flex"
          vs-align="center"
          vs-w="12"
        >
          <vs-button
            class="mr-2"
            type="gradient"
            icon="search"
            radius
            @click="handlePreview(raw.id)"
          />
          <vs-button class="mx-2" type="gradient" icon="edit" radius />
          <vs-button
            class="ml-2"
            type="gradient"
            icon="delete"
            radius
            @click="handleDelete(raw)"
          />
        </vs-col>
      </vs-row>
    </template>
  </vx-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    raw: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentRaw'])
  },
  methods: {
    ...mapActions(['getRawTemplate', 'deleteRawTemplate']),
    async handlePreview(id) {
      if (this.getRawTemplate.id != id) {
        await this.handleCallAPI(this.getRawTemplate, id)
      }
      const preview = window.open('', '_blank')
      preview.document.write(this.currentRaw.content)
    },
    async handleDelete(raw) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this template ?`,
        accept: async () =>
          await this.handleCallAPI(this.deleteRawTemplate, raw)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-view-item {
  .thumbnail {
    height: 300px;
    width: 100%;
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    transition: ease-in-out 3s;

    &:hover {
      background-position: bottom;
    }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
  }
}
</style>
