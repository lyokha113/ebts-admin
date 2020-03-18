<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div
        class="bg-white flex items-center justify-center cursor-pointer"
        @click="handleEdit(raw.id)"
      >
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
            svg-classes="h-4 w-4"
            class="mr-2"
          ></feather-icon>
          <span class="truncate font-semibold text-lg">{{ raw.name }}</span>
        </vs-col>
        <vs-col class="my-1" vs-type="flex" vs-align="center" vs-w="12">
          <feather-icon
            icon="ClockIcon"
            svg-classes="h-4 w-4"
            class="mr-2"
          ></feather-icon>
          <span class="text-sm">
            {{ raw.date | moment('DD-MM-YYYY, HH:mm:ss') }}
          </span>
        </vs-col>
        <vs-col vs-type="flex" vs-align="center" vs-w="12">
          <span class="truncate text-base">{{ raw.description }}</span>
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
          <vs-button
            class="mx-2"
            type="gradient"
            icon="edit"
            radius
            @click="handleUpdate(raw)"
          />
          <vs-button
            class="mx-2"
            type="gradient"
            icon="publish"
            radius
            color="success"
            @click="handlePublish(raw)"
          />
          <vs-button
            class="ml-2"
            type="gradient"
            icon="delete"
            radius
            color="danger"
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
    ...mapGetters(['editorContent'])
  },
  methods: {
    ...mapActions(['getRawTemplate', 'deleteRawTemplate']),
    async handlePreview(id) {
      await this.handleCallAPI(this.getRawTemplate, id)
      const preview = window.open('', '_blank')
      preview.document.write(this.editorContent)
    },
    async handleDelete(raw) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this template ?`,
        accept: async () =>
          await this.handleCallAPI(this.deleteRawTemplate, raw)
      })
    },
    handlePublish(raw) {
      this.$emit('publishRaw', raw)
    },
    handleUpdate(raw) {
      this.$emit('updateRaw', raw)
    },
    handleEdit(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to design this template ?`,
        accept: async () => {
          await this.handleCallAPI(this.getRawTemplate, id)
          this.$router.push(`/user/editor/`)
        }
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
