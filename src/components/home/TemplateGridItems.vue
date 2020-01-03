<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div
        class="bg-white flex items-center justify-center cursor-pointer"
        @click="$router.push(`detail/${template.id}`).catch(err => {})"
      >
        <div
          class="thumbnail mx-3 mt-3"
          :style="{ backgroundImage: `url(${template.thumbnail})` }"
        />
      </div>
      <vs-divider border-style="dashed" class="my-3" />
      <div class="item-details px-3">
        <div class="flex items-center">
          <div class="bg-success flex text-white py-1 px-2 pr-2 mr-2 rounded">
            <span class="text-sm mr-2">{{ template.upVote }}</span>
            <feather-icon icon="ChevronUpIcon" svgClasses="h-4 w-4" />
          </div>
          <div class="bg-danger flex text-white py-1 px-2 pl-2 mx-2 rounded">
            <span class="text-sm mr-2">{{ template.downVote }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <span class="truncate" style="margin-left: auto">
            {{ template.authorName }}</span
          >
        </div>

        <div class="my-4">
          <h6 class="truncate font-semibold mb-1">
            <span>
              <feather-icon icon="FileIcon" svgClasses="h-4 w-4" />
              {{ template.name }}
            </span>
          </h6>
          <p class="item-description truncate text-sm">
            {{ template.description }}
          </p>
        </div>
      </div>
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
  .thumbnail {
    height: 350px;
    width: 100%;
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
    transition: ease-in-out 2s;

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
