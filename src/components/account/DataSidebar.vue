<template>
  <vs-sidebar
    v-model="isSidebarActiveLocal"
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ isCreating ? 'UPDATE ACCOUNT' : 'CREATE NEW ACCOUNT' }}</h4>
      <feather-icon
        icon="XIcon"
        class="cursor-pointer"
        @click.stop="isSidebarActiveLocal = false"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar
      class="scroll-area--data-list-add-new pt-4 pb-6"
      :settings="settings"
    >
      <div class="p-6">
        <vs-input
          v-model="email"
          label="Email"
          name="email"
          class="mt-5 w-full"
          :readonly="isCreating"
        />
        <vs-input
          v-model="fullName"
          label="Full name"
          name="fullname"
          class="mt-5 w-full"
        />
        <vs-input
          v-model="password"
          label="Password (Leave blank to not update)"
          name="password"
          type="password"
          class="mt-5 w-full"
        />

        <vs-select
          v-model="provider"
          label="Provider"
          class="mt-5 w-full"
          disabled
        >
          <vs-select-item
            v-for="item in providers"
            :key="item.value"
            :value="item.value"
            :text="item.text"
          />
        </vs-select>

        <vs-select v-model="role" label="Role" class="mt-5 w-full" disabled>
          <vs-select-item
            v-for="item in roles"
            :key="item.value"
            :value="item.value"
            :text="item.text"
          />
        </vs-select>
      </div>
    </VuePerfectScrollbar>

    <div slot="footer" class="flex flex-wrap items-center justify-center p-6">
      <vs-button class="mr-6" @click="handleSubmit">{{
        isCreating ? 'Update' : 'Create'
      }}</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
        >Cancel</vs-button
      >
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { mapActions } from 'vuex'
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      default: true
    },
    isCreating: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      email: '',
      fullName: '',
      password: '',
      provider: null,
      role: null,
      providers: [
        { text: 'LOCAL', value: 'LOCAL' },
        { text: 'GMAIL', value: 'GMAIL' }
      ],
      roles: [
        { text: 'ADMINISTRATOR', value: 'ADMINISTRATOR' },
        { text: 'USER', value: 'USER' }
      ],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive
      },
      set(val) {
        if (!val) {
          this.$emit('closeSidebar')
        }
      }
    }
  },
  watch: {
    isSidebarActive() {
      if (this.isCreating) {
        this.email = this.isCreating.email
        this.fullName = this.isCreating.fullName
        this.provider = this.isCreating.provider.toUpperCase()
        this.role = this.isCreating.roleName.toUpperCase()
      } else {
        this.initForm()
      }
    }
  },
  methods: {
    ...mapActions(['updateAccount', 'createAccount']),
    initForm() {
      this.email = ''
      this.fullName = ''
      this.password = ''
      this.provider = 'LOCAL'
      this.role = 'ADMINISTRATOR'
    },
    async handleSubmit() {
      let isError = false

      if (!this.validateEmail(this.email)) {
        this.handleErrorInput(
          'Email format incorrect',
          'Please re-check your email'
        )
        isError = true
      }

      if (!this.fullName.length < 5 || this.fullName.length > 30) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
        isError = true
      }

      if (
        !this.isCreating &&
        this.password.length != 0 &&
        (this.password.length < 6 || this.password.length > 30)
      ) {
        this.handleErrorInput(
          'Error input value',
          'Password must be 6 - 30 characters'
        )
      } else if (
        this.isCreating &&
        (this.password.length < 6 || this.password.length > 30)
      ) {
        this.handleErrorInput(
          'Error input value',
          'Password must be 6 - 30 characters'
        )
      }

      if (isError) {
        return
      }

      if (this.isCreating) {
        this.$vs.dialog({
          type: 'confirm',
          title: `Confirm`,
          text: `Please check all information to create new account`,
          accept: async () => {
            const obj = {
              id: this.isCreating.id,
              active: this.isCreating.active,
              fullName: this.fullName,
              password: this.password
            }
            if (await this.handleCallAPI(this.updateAccount, obj)) {
              this.$emit('closeSidebar')
            }
          }
        })
      } else {
        this.$vs.dialog({
          type: 'confirm',
          title: `Confirm`,
          text: `Please check all information to update account`,
          accept: async () => {
            const obj = {
              email: this.email,
              fullName: this.fullName,
              password: this.password,
              roleId: 1
            }
            if (await this.handleCallAPI(this.createAccount, obj)) {
              this.$emit('closeSidebar')
            }
          }
        })
      }
    }
  },
  components: {
    VuePerfectScrollbar
  }
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
  /deep/ .vs-sidebar--background {
    z-index: 52004;
  }

  /deep/ .vs-sidebar {
    z-index: 52004;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  height: calc(100% - 4.3rem);
}
</style>
