<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div
        class="item-img-container shadow-md bg-white h-64 flex items-center justify-center my-3 mx-3"
      >
        <img
          :src="template.thumbnail"
          :alt="template.name"
          class="grid-view-img"
        />
      </div>
      <vs-divider border-style="dashed" class="my-3" />
      <vs-row class="px-3 mb-1">
        <vs-col vs-type="flex" vs-align="center" vs-w="12">
          <span class="truncate font-semibold text-lg">
            <feather-icon icon="FileIcon" svg-classes="h-4 w-4" />
            {{ template.name }}
          </span>
        </vs-col>
      </vs-row>
      <vs-row class="px-3 mb-2">
        <vs-col vs-type="flex" vs-align="center" vs-w="8">
          <vs-avatar
            class="avatar-thumb shadow-md"
            :src="template.authorAvatar"
          />
          <span class="truncate"> {{ template.authorName }}</span>
        </vs-col>
        <vs-col vs-type="flex" vs-align="center" vs-justify="center" vs-w="4">
          <div class="bg-success flex text-white py-1 px-2 pr-2 mr-1 rounded">
            <span class="text-sm mr-2">{{ template.upVote }}</span>
            <feather-icon icon="ChevronUpIcon" svg-classes="h-4 w-4" />
          </div>
          <div class="bg-danger flex text-white py-1 px-2 pl-2 ml-1 rounded">
            <span class="text-sm mr-2">{{ template.downVote }}</span>
            <feather-icon icon="ChevronDownIcon" svg-classes="h-4 w-4" />
          </div>
        </vs-col>
      </vs-row>
      <vs-row class="px-3 pb-2">
        <vs-col class="template_category" vs-align="center">
          <span
            v-for="item in template.categories"
            :key="item.id"
            class="m-1"
            color="#24c1a0"
            >{{ item.name }}</span
          >
        </vs-col>
      </vs-row>
    </template>
  </vx-card>
</template>

<script>
export default {
  props: {
    template: {
      type: Object,
      required: true
    }
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

.con-vs-avatar.avatar-thumb {
  background: none !important;
  margin-left: 0px;
}
</style>
