

<template>
  <vx-card class="grid-view-item mb-base overflow-hidden">
    <template slot="no-body">
      <div class="item-img-container bg-white h-64 flex items-center justify-center mb-4">
        <img :src="template.thumbnail" :alt="template.name" class="grid-view-img px-4" />
      </div>
      <div class="item-details px-4">
        <div class="flex justify-between items-center">
          <div class="bg-success flex text-white py-1 px-2 pr-4 rounded">
            <span class="text-sm mr-2">{{ template.upVote }}</span>
            <feather-icon icon="ChevronUpIcon" svgClasses="h-4 w-4" />
          </div>
          <div class="bg-danger flex text-white py-1 px-2 pl-4 rounded">
            <span class="text-sm mr-2">{{ template.upVote }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
        </div>

        <div class="my-4">
          <h6 class="truncate font-semibold mb-1">{{ template.name }}</h6>
          <p class="item-description truncate text-sm">{{ template.authorName }}</p>
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
</style>