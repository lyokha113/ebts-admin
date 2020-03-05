<template>
  <div class=" flex w-full">
    <div class="flex justify-around items-end w-1/5">
      <vs-input
        class="inline-block w-3/4"
        label="Design Invitation"
        placeholder="Email"
      />
      <vs-button class="inline-block btn-command" icon="group_add"></vs-button>
    </div>
    <div class="flex w-4/5 px-5 text-center justify-center">
      <div>
        <span class="text-lg font-semibold">Online: 3/4</span>
        <vs-button class="w-2/3 mt-1">KICK ALL</vs-button>
      </div>

      <ul class="sessions">
        <li class="online">lyokha113@gmail.com</li>
        <li class="online">lyokha113@gmail.com</li>
        <li class="offine">lyokha113@gmail.com</li>
        <li class="online">lyokha113@gmail.com</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions([''])
  }
}
</script>

<style lang="scss" scoped>
.btn-command {
  /deep/ i {
    font-size: 20px !important;
  }
}

.sessions {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  align-items: center;
  padding-left: 0;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(90deg, #7367f0, #44d1b3) 1 round;

  li {
    flex: 0 0 50%;
    cursor: pointer;

    &:hover {
      color: red;
    }
  }

  .online {
    color: royalblue;
  }

  .offine {
    color: darkgrey;
  }
}
</style>
