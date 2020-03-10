<template>
  <div class=" flex w-full">
    <div class="flex justify-around items-end w-1/5">
      <vs-input
        class="inline-block w-3/4"
        label="Design Invitation"
        placeholder="Email"
        v-model="contributorEmail"
      />
      <vs-button
        class="inline-block btn-command"
        icon="group_add"
        @click="handleInvite"
      ></vs-button>
    </div>
    <div class="flex w-4/5 px-5 text-center justify-center">
      <div>
        <span class="text-lg font-semibold">Online: {{ countOnline }}/4</span>
        <vs-button
          class="w-2/3 mt-1 font-bold"
          :disabled="!contributors.length"
          @click="handleKickAll"
        >
          KICK ALL
        </vs-button>
      </div>

      <ul class="sessions w-3/4">
        <li
          class="truncate"
          :class="{ online: contributor.online }"
          v-for="contributor in contributors"
          :key="contributor.contributorId"
          @click="handleKick(contributor.contributorId)"
        >
          {{ contributor.contributorEmail }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      contributorEmail: ''
    }
  },
  computed: {
    ...mapGetters(['editorRawId', 'contributors', 'accessToken']),
    countOnline() {
      return this.contributors.filter(s => s.online).length
    }
  },
  methods: {
    ...mapActions(['createContributor', 'kickContributors', 'kickContributor']),
    handleInvite() {
      if (!this.validateEmail(this.contributorEmail)) {
        this.$vs.notify({
          title: 'Email empty or format incorrect',
          text: 'Please re-check your input email',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      if (this.contributors.length >= 4) {
        this.$vs.notify({
          title: 'Maximum contributors',
          text: 'We currently support maximum 4 contributors at the same time',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `User are invited can EDIT and USE this design with you.
        They also can upload/access your public files during editing. Do you want to invite this user ?`,
        accept: () => this.handleInviteConfirm()
      })
    },
    handleKick(contributorId) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to remove this contributor ?.`,
        accept: () => this.handleKickConfirm(contributorId)
      })
    },
    handleKickAll() {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to remove all contributors ?`,
        accept: () => this.handleKickAllConfirm()
      })
    },
    async handleInviteConfirm() {
      const invitation = {
        contributorEmail: this.contributorEmail,
        rawId: this.editorRawId
      }
      if (await this.handleCallAPI(this.createContributor, invitation)) {
        this.contributorEmail = ''
      }
    },
    async handleKickConfirm(contributorId) {
      const request = {
        contributorId: contributorId,
        rawId: this.editorRawId
      }
      await this.handleCallAPI(this.kickContributor, request)
    },
    async handleKickAllConfirm() {
      await this.handleCallAPI(this.kickContributors, this.editorRawId)
    }
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>
.btn-command {
  /deep/ i {
    font-size: 19px !important;
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
  border-image: linear-gradient(90deg, #44d1b3, #7367f0, #10163a) 1 round;

  li {
    text-align: left;
    padding: 0 1em 0 1em;
    flex: 0 0 50%;
    cursor: pointer;
    color: darkgrey;
    transition: 0.5s ease-in-out;

    &:hover {
      color: rgb(240, 96, 96);
    }
  }

  .online {
    color: royalblue;
  }
}
</style>
