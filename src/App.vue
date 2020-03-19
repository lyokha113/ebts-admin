<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import themeConfig from '@/../themeConfig.js'

export default {
  watch: {
    '$store.state.theme'(val) {
      this.toggleClassInBody(val)
    }
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme)
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
    this.$store.dispatch('updateWindowWidth', window.innerWidth)
    Notification.requestPermission()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    toggleClassInBody(className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark'))
          document.body.classList.remove('theme-semi-dark')
        document.body.classList.add('theme-dark')
      } else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark'))
          document.body.classList.remove('theme-dark')
        document.body.classList.add('theme-semi-dark')
      } else {
        if (document.body.className.match('theme-dark'))
          document.body.classList.remove('theme-dark')
        if (document.body.className.match('theme-semi-dark'))
          document.body.classList.remove('theme-semi-dark')
      }
    },
    handleWindowResize(event) {
      this.$store.dispatch('updateWindowWidth', event.currentTarget.innerWidth)
    }
  }
}
</script>

<style lang="scss">
.action-icon:hover {
  color: mediumslateblue;
}

#data-list-list-view {
  .vs-con-table {
    .vs-table--header {
      display: flex;
      flex-wrap: wrap-reverse;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          &.img-container {
            width: 1rem;
            background: #fff;

            span {
              display: flex;
              justify-content: center;
            }

            .product-img {
              height: 120px;
            }
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
.multiselect {
  .multiselect__single {
    font-size: 13px;
  }

  .multiselect__element {
    font-size: 13px;
  }
}

.truncate-two {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  overflow: hidden;
}
.truncate-three {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  overflow: hidden;
}
.truncate-six {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
  display: -webkit-box;
  overflow: hidden;
}
</style>
