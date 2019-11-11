<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ selected ? 'UPDATE ACCOUNT' : 'ADD NEW ACCOUNT' }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar class="scroll-area--data-list-add-new pt-4 pb-6" :settings="settings">
      <div class="p-6">
        <vs-input
          label="Email"
          name="email"
          v-model="email"
          class="mt-5 w-full"
          :readonly="selected"
        />
        <vs-input label="Full name" name="fullname" v-model="fullName" class="mt-5 w-full" />
        <vs-input
          label="Password"
          name="password"
          type="password"
          v-model="password"
          class="mt-5 w-full"
        />

        <vs-select v-model="provider" label="Provider" class="mt-5 w-full" disabled>
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in providers"
          />
        </vs-select>

        <vs-select v-model="role" label="Role" class="mt-5 w-full" disabled>
          <vs-select-item
            :key="item.value"
            :value="item.value"
            :text="item.text"
            v-for="item in roles"
          />
        </vs-select>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center justify-center p-6" slot="footer">
      <vs-button class="mr-6" @click="handleSubmit">{{ selected ? 'Update' : 'Create' }}</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
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
    selected: {
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
      if (this.selected) {
        this.email = this.selected.email
        this.fullName = this.selected.fullName
        this.provider = this.selected.provider.toUpperCase()
        this.role = this.selected.roleName.toUpperCase()
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
      if (this.selected) {
        const obj = {
          id: this.selected.id,
          active: this.selected.active,
          fullName: this.fullName,
          password: this.password
        }
        await this.handleCallAPI(this.updateAccount, obj)
        this.$emit('closeSidebar')
        this.$vs.notify({
          title: 'Information',
          text: 'Account updated',
          color: 'success',
          position: 'top-right'
        })
      } else {
        const obj = {
          email: this.email,
          fullName: this.fullName,
          password: this.password,
          roleId: 1
        }
        await this.handleCallAPI(this.createAccount, obj)
        this.$emit('closeSidebar')
        this.$vs.notify({
          title: 'Information',
          text: 'Account created',
          color: 'success',
          position: 'top-right'
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
    z-index: 52010;
  }

  /deep/ .vs-sidebar {
    z-index: 52010;
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
