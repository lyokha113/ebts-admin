<template>
  <div id="data-list-list-view" class="data-list-container">
    <add-new-data-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="addNewDataSidebar = false"
    />

    <vs-table
      ref="table"
      multiple
      v-model="selected"
      pagination
      :max-items="itemsPerPage"
      search
      :data="users"
    >
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center">
          <!-- ACTION - DROPDOWN -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mr-4 mb-4">
            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32"
            >
              <span class="mr-2">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>
              <vs-dropdown-item>
                <span>Delete</span>
              </vs-dropdown-item>
              <vs-dropdown-item>
                <span>Archive</span>
              </vs-dropdown-item>
              <vs-dropdown-item>
                <span>Print</span>
              </vs-dropdown-item>
              <vs-dropdown-item>
                <span>Another Action</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <!-- ADD NEW -->
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addNewDataSidebar = true"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span
              class="mr-2"
            >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ users.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : users.length }} of {{ users.length }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage=4">
              <span>4</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=15">
              <span>15</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage=20">
              <span>20</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th sort-key="name">Name</vs-th>
        <vs-th sort-key="category">Category</vs-th>
        <vs-th sort-key="popularity">Popularity</vs-th>
        <vs-th sort-key="order_status">Order Status</vs-th>
        <vs-th sort-key="price">Price</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-name font-medium">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.category }}</p>
            </vs-td>

            <vs-td>
              {{ typeof tr.popularity }}
              <vs-progress
                :percent="Number(tr.popularity)"
                :color="getPopularityColor(Number(tr.popularity))"
                class="shadow-md"
              />
            </vs-td>

            <vs-td>
              <vs-chip
                :color="getOrderStatusColor(tr.order_status)"
                class="product-order-status"
              >{{ tr.order_status }}</vs-chip>
            </vs-td>

            <vs-td>
              <p class="product-price">${{ tr.price }}</p>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import AddNewDataSidebar from '@/components/account/AddNewDataSidebar.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AddNewDataSidebar
  },
  data() {
    return {
      selected: [],
      users: [],
      itemsPerPage: 4,
      isMounted: false,
      addNewDataSidebar: false,
      testData: [
          {
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc474-55f5-11e9-8e2c-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Apple Watch series 4 GPS"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 69.99
},
popularity: {
integerValue: "97"
}
},
createTime: "2019-04-03T09:46:25.013666Z",
updateTime: "2019-04-03T09:53:19.277248Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc475-55f5-11e9-8be5-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "83"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Beats HeadPhones"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 69.99
}
},
createTime: "2019-04-03T09:46:25.095597Z",
updateTime: "2019-04-03T09:53:59.762699Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc476-55f5-11e9-a874-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "57"
}
},
createTime: "2019-04-03T09:46:25.020301Z",
updateTime: "2019-04-03T10:10:34.778304Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc477-55f5-11e9-ac58-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "65"
}
},
createTime: "2019-04-03T09:46:25.077403Z",
updateTime: "2019-04-03T09:46:25.077403Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc478-55f5-11e9-8c82-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Portable Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "87"
}
},
createTime: "2019-04-03T09:46:25.101312Z",
updateTime: "2019-04-03T09:46:25.101312Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc479-55f5-11e9-a385-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "55"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 39.99
}
},
createTime: "2019-04-03T09:46:25.077401Z",
updateTime: "2019-04-03T09:46:25.077401Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47a-55f5-11e9-84b1-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Altec Lansing - Mini H2O Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 39.99
},
popularity: {
integerValue: "99"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
}
},
createTime: "2019-04-03T09:46:25.025005Z",
updateTime: "2019-04-03T09:46:25.025005Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47b-55f5-11e9-8d85-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 39.99
},
popularity: {
integerValue: "91"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
}
},
createTime: "2019-04-03T09:46:25.077386Z",
updateTime: "2019-04-03T09:46:25.077386Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47c-55f5-11e9-acc9-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "52"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Altec Lansing - Mini H2O Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 39.99
}
},
createTime: "2019-04-03T09:46:25.077398Z",
updateTime: "2019-04-03T09:46:25.077398Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47d-55f5-11e9-9022-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "64"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Mini H2O Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 39.99
}
},
createTime: "2019-04-03T09:46:25.077378Z",
updateTime: "2019-04-03T09:46:25.077378Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47e-55f5-11e9-ab50-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "93"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
}
},
createTime: "2019-04-03T09:46:25.046020Z",
updateTime: "2019-04-03T09:46:25.046020Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc47f-55f5-11e9-a49b-f46d04ef8ec3",
fields: {
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "75"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.025142Z",
updateTime: "2019-04-03T09:46:25.025142Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc480-55f5-11e9-8ea5-f46d04ef8ec3",
fields: {
category: {
stringValue: "Audio"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "88"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
}
},
createTime: "2019-04-03T09:46:25.077402Z",
updateTime: "2019-04-03T09:46:25.077402Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc481-55f5-11e9-9ed0-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Altec Lansing - Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "86"
}
},
createTime: "2019-04-03T09:46:25.019230Z",
updateTime: "2019-04-03T09:46:25.019230Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc482-55f5-11e9-9876-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Aluratek - Bluetooth Audio Receiver"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 29.99
},
popularity: {
integerValue: "62"
}
},
createTime: "2019-04-03T09:46:25.032917Z",
updateTime: "2019-04-03T09:46:25.032917Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc483-55f5-11e9-b0b9-f46d04ef8ec3",
fields: {
category: {
stringValue: "Audio"
},
price: {
doubleValue: 29.99
},
popularity: {
integerValue: "51"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Aluratek - Bluetooth Audio Transmitter"
}
},
createTime: "2019-04-03T09:46:25.077376Z",
updateTime: "2019-04-03T09:46:25.077376Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc484-55f5-11e9-a157-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Aluratek - iStream Bluetooth Audio Receiver"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 29.99
},
popularity: {
integerValue: "51"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
}
},
createTime: "2019-04-03T09:46:25.029441Z",
updateTime: "2019-04-03T09:46:25.029441Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc485-55f5-11e9-ad97-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "65"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Antec - Nano Diamond Thermal Compound"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 14.99
}
},
createTime: "2019-04-03T09:46:25.077372Z",
updateTime: "2019-04-03T09:46:25.077372Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc486-55f5-11e9-8ecc-f46d04ef8ec3",
fields: {
name: {
stringValue: "Antec - SmartBean Bluetooth Adapter"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 39.99
},
popularity: {
integerValue: "63"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.034806Z",
updateTime: "2019-04-03T09:46:25.034806Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc487-55f5-11e9-823b-f46d04ef8ec3",
fields: {
name: {
stringValue: "Basis - Peak Fitness and Sleep Tracker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "72"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.077410Z",
updateTime: "2019-04-03T09:46:25.077410Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc488-55f5-11e9-8305-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "77"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Basis - Peak Fitness and Sleep Tracker"
}
},
createTime: "2019-04-03T09:46:25.095596Z",
updateTime: "2019-04-03T09:46:25.095596Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc489-55f5-11e9-841f-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Beats by Dr. Dre - 3' USB-to-Micro USB Cable"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 19.99
},
popularity: {
integerValue: "65"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
}
},
createTime: "2019-04-03T09:46:25.077396Z",
updateTime: "2019-04-03T09:46:25.077396Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48a-55f5-11e9-9a23-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "60"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Beats by Dr. Dre - Bike Mount for Pill Speakers"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 49.99
}
},
createTime: "2019-04-03T09:46:25.077387Z",
updateTime: "2019-04-03T09:46:25.077387Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48b-55f5-11e9-8619-f46d04ef8ec3",
fields: {
category: {
stringValue: "Audio"
},
price: {
doubleValue: 49.99
},
popularity: {
integerValue: "59"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Beats by Dr. Dre - Support Stand for Speakers"
}
},
createTime: "2019-04-03T09:46:25.043578Z",
updateTime: "2019-04-03T09:46:25.043578Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48c-55f5-11e9-9ae7-f46d04ef8ec3",
fields: {
name: {
stringValue: "Beats by Dr. Dre - Support Stand for Pill Speakers"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 49.99
},
popularity: {
integerValue: "87"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.077369Z",
updateTime: "2019-04-03T09:46:25.077369Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48d-55f5-11e9-ad44-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 49.99
},
popularity: {
integerValue: "95"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Beats by Dr. Dre - Support Stand for Pill Speakers"
}
},
createTime: "2019-04-03T09:46:25.047685Z",
updateTime: "2019-04-03T09:46:25.047685Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48e-55f5-11e9-add7-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Beats by Dr. Dre - Support Stand for Speakers"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 49.99
},
popularity: {
integerValue: "98"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
}
},
createTime: "2019-04-03T09:46:25.077395Z",
updateTime: "2019-04-03T09:46:25.077395Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc48f-55f5-11e9-99d4-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Beats by Dr. Dre - Support Stand"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 49.99
},
popularity: {
integerValue: "75"
}
},
createTime: "2019-04-03T09:46:25.034804Z",
updateTime: "2019-04-03T09:46:25.034804Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc490-55f5-11e9-b85b-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Beats by Dr. Dre - Pill 2.0 Bluetooth Speaker"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "81"
}
},
createTime: "2019-04-03T09:46:25.077399Z",
updateTime: "2019-04-03T09:46:25.077399Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478dc491-55f5-11e9-a874-f46d04ef8ec3",
fields: {
name: {
stringValue: "Beats by Dr. Dre - Pill 2.0 Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "91"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "canceled"
}
},
createTime: "2019-04-03T09:46:25.077400Z",
updateTime: "2019-04-03T09:46:25.077400Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb86-55f5-11e9-bd34-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Beats by Dr. Dre - Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "79"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
}
},
createTime: "2019-04-03T09:46:25.040177Z",
updateTime: "2019-04-03T09:46:25.040177Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb87-55f5-11e9-8d01-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "95"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Beats by Dr. Dre - Portable Speaker + Headphones"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 699.99
}
},
createTime: "2019-04-03T09:46:25.009182Z",
updateTime: "2019-04-03T09:46:25.009182Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb88-55f5-11e9-a6d0-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "90"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Beats by Dr. Dre - Pill 2.0 Portable Stereo Speaker"
}
},
createTime: "2019-04-03T09:46:25.043780Z",
updateTime: "2019-04-03T09:46:25.043780Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb89-55f5-11e9-81f9-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Bose® - SoundLink® III Cover"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "81"
}
},
createTime: "2019-04-03T09:46:25.034800Z",
updateTime: "2019-04-03T09:46:25.034800Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8a-55f5-11e9-a64a-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Bose® - Bose® SoundLink® III Cover"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "81"
}
},
createTime: "2019-04-03T09:46:25.041145Z",
updateTime: "2019-04-03T09:46:25.041145Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8b-55f5-11e9-8f18-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Bose® - SoundLink® III Cover"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "69"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
}
},
createTime: "2019-04-03T09:46:25.077408Z",
updateTime: "2019-04-03T09:46:25.077408Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8c-55f5-11e9-8e81-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "95"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Bose® - SoundLink® Mini Soft Cover"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 24.99
}
},
createTime: "2019-04-03T09:46:25.077407Z",
updateTime: "2019-04-03T09:46:25.077407Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8d-55f5-11e9-b400-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - SoundLink® Color Bluetooth Speaker"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "100"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.077409Z",
updateTime: "2019-04-03T09:46:25.077409Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8e-55f5-11e9-974e-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - SoundLink® Color Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "89"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.095601Z",
updateTime: "2019-04-03T09:46:25.095601Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb8f-55f5-11e9-8f5f-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - SoundLink® Color Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "75"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.077393Z",
updateTime: "2019-04-03T09:46:25.077393Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb90-55f5-11e9-bf8d-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "54"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - SoundLink® Color Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
}
},
createTime: "2019-04-03T09:46:25.077405Z",
updateTime: "2019-04-03T09:46:25.077405Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb91-55f5-11e9-9ecd-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - SoundLink® Color Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "98"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "delivered"
}
},
createTime: "2019-04-03T09:46:25.039086Z",
updateTime: "2019-04-03T09:46:25.039086Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb92-55f5-11e9-9ff7-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - SoundLink® Color Carry Case"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "95"
}
},
createTime: "2019-04-03T09:46:25.077381Z",
updateTime: "2019-04-03T09:46:25.077381Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb93-55f5-11e9-a6bf-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "76"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Bose® - SoundLink® III Cover"
}
},
createTime: "2019-04-03T09:46:25.046563Z",
updateTime: "2019-04-03T09:46:25.046563Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb94-55f5-11e9-8aa8-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Bose® - SoundLink® III Cover"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "98"
}
},
createTime: "2019-04-03T09:46:25.043136Z",
updateTime: "2019-04-03T09:46:25.043136Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb95-55f5-11e9-87df-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 34.99
},
popularity: {
integerValue: "70"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - SoundLink® III Cover"
}
},
createTime: "2019-04-03T09:46:25.021997Z",
updateTime: "2019-04-03T09:46:25.021997Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb96-55f5-11e9-84e4-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - Mini Bluetooth Speaker II"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "62"
}
},
createTime: "2019-04-03T09:46:25.034803Z",
updateTime: "2019-04-03T09:46:25.034803Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb97-55f5-11e9-8069-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Bose® - Bluetooth Speaker II"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "63"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
}
},
createTime: "2019-04-03T09:46:25.032531Z",
updateTime: "2019-04-03T09:46:25.032531Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb98-55f5-11e9-8729-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Bose® - SoundLink® Mini Bluetooth Speaker Soft Cover"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "90"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
}
},
createTime: "2019-04-03T09:46:25.034801Z",
updateTime: "2019-04-03T09:46:25.034801Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb99-55f5-11e9-bdb7-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - Bluetooth Speaker Soft Cover"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "98"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "canceled"
}
},
createTime: "2019-04-03T09:46:25.077392Z",
updateTime: "2019-04-03T09:46:25.077392Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9a-55f5-11e9-b363-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "55"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Bose® - Bluetooth Speaker Soft Cover"
}
},
createTime: "2019-04-03T09:46:25.077377Z",
updateTime: "2019-04-03T09:46:25.077377Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9b-55f5-11e9-9524-f46d04ef8ec3",
fields: {
category: {
stringValue: "Audio"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "53"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - Bluetooth Speaker"
}
},
createTime: "2019-04-03T09:46:25.039874Z",
updateTime: "2019-04-03T09:46:25.039874Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9c-55f5-11e9-84c4-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "82"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - SoundLink® Mini Bluetooth Speaker Soft Cover"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 24.99
}
},
createTime: "2019-04-03T09:46:25.077374Z",
updateTime: "2019-04-03T09:46:25.077374Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9d-55f5-11e9-b141-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - Bluetooth Speaker Travel Bag"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 44.99
},
popularity: {
integerValue: "78"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.015936Z",
updateTime: "2019-04-03T09:46:25.015936Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9e-55f5-11e9-9e48-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 24.99
},
popularity: {
integerValue: "81"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Bose® - SoundLink® Mini Soft Cover"
}
},
createTime: "2019-04-03T09:46:25.077388Z",
updateTime: "2019-04-03T09:46:25.077388Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deb9f-55f5-11e9-b1e8-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "94"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Bose® - SoundLink® Mini Soft Cover"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 24.99
}
},
createTime: "2019-04-03T09:46:25.077384Z",
updateTime: "2019-04-03T09:46:25.077384Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba0-55f5-11e9-a332-f46d04ef8ec3",
fields: {
name: {
stringValue: "Bose® - Bluetooth Speaker III"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 299.99
},
popularity: {
integerValue: "97"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.077370Z",
updateTime: "2019-04-03T09:46:25.077370Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba1-55f5-11e9-9109-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "89"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Bose® - SoundLink® Soft Cover"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 24.99
}
},
createTime: "2019-04-03T09:46:25.025259Z",
updateTime: "2019-04-03T09:46:25.025259Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba2-55f5-11e9-8491-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Bose® - Bluetooth Music Adapter"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "53"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
}
},
createTime: "2019-04-03T09:46:25.077390Z",
updateTime: "2019-04-03T09:46:25.077390Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba3-55f5-11e9-8b79-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 349.98
},
popularity: {
integerValue: "79"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Bowers & Wilkins - Bluetooth Speaker"
}
},
createTime: "2019-04-03T09:46:25.095598Z",
updateTime: "2019-04-03T09:46:25.095598Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba4-55f5-11e9-9a8f-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "BRAVEN - Balance Portable Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "82"
}
},
createTime: "2019-04-03T09:46:25.107736Z",
updateTime: "2019-04-03T09:46:25.107736Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba5-55f5-11e9-88ba-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "pending"
},
name: {
stringValue: "BRAVEN - Balance Portable Bluetooth Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "80"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
}
},
createTime: "2019-04-03T09:46:25.034799Z",
updateTime: "2019-04-03T09:46:25.034799Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba6-55f5-11e9-9bdf-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "86"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "BRAVEN - Outdoor Speaker"
}
},
createTime: "2019-04-03T09:46:25.033345Z",
updateTime: "2019-04-03T09:46:25.033345Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba7-55f5-11e9-b0bd-f46d04ef8ec3",
fields: {
name: {
stringValue: "BRAVEN - BRV-X Outdoor Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 199.99
},
popularity: {
integerValue: "61"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.025387Z",
updateTime: "2019-04-03T09:46:25.025387Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba8-55f5-11e9-8991-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "BRAVEN - Portable Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 299.99
},
popularity: {
integerValue: "85"
}
},
createTime: "2019-04-03T09:46:25.077385Z",
updateTime: "2019-04-03T09:46:25.077385Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478deba9-55f5-11e9-8b57-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "BRAVEN - Portable Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "81"
}
},
createTime: "2019-04-03T09:46:25.023333Z",
updateTime: "2019-04-03T09:46:25.023333Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1294-55f5-11e9-88a7-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "BRAVEN - Wireless Bluetooth Speaker"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "50"
}
},
createTime: "2019-04-03T09:46:25.077397Z",
updateTime: "2019-04-03T09:46:25.077397Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1295-55f5-11e9-93ba-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "BRAVEN - Wireless Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "93"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
}
},
createTime: "2019-04-03T09:46:25.040983Z",
updateTime: "2019-04-03T09:46:25.040983Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1296-55f5-11e9-b7b3-f46d04ef8ec3",
fields: {
name: {
stringValue: "BRAVEN - Wireless Bluetooth Speaker"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "51"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.077373Z",
updateTime: "2019-04-03T09:46:25.077373Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1297-55f5-11e9-80b9-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 69.99
},
popularity: {
integerValue: "77"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Craig - Tower Speaker"
}
},
createTime: "2019-04-03T09:46:25.009052Z",
updateTime: "2019-04-03T09:46:25.009052Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1298-55f5-11e9-a0e0-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Craig - Portable Wireless Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 29.99
},
popularity: {
integerValue: "89"
}
},
createTime: "2019-04-03T09:46:25.032165Z",
updateTime: "2019-04-03T09:46:25.032165Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e1299-55f5-11e9-8920-f46d04ef8ec3",
fields: {
name: {
stringValue: "Definitive Technology - Wireless Speaker"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 399.98
},
popularity: {
integerValue: "81"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
}
},
createTime: "2019-04-03T09:46:25.077380Z",
updateTime: "2019-04-03T09:46:25.077380Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129a-55f5-11e9-82ac-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 699.98
},
popularity: {
integerValue: "76"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Definitive Technology - Wireless Speaker"
}
},
createTime: "2019-04-03T09:46:25.077404Z",
updateTime: "2019-04-03T09:46:25.077404Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129b-55f5-11e9-9651-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 399.98
},
popularity: {
integerValue: "88"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/08.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Denon - Wireless Speaker"
}
},
createTime: "2019-04-03T09:46:25.077371Z",
updateTime: "2019-04-03T09:46:25.077371Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129c-55f5-11e9-bf86-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Denon - HEOS 7 Wireless Speaker"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 599.98
},
popularity: {
integerValue: "100"
}
},
createTime: "2019-04-03T09:46:25.077375Z",
updateTime: "2019-04-03T09:46:25.077375Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129d-55f5-11e9-a2e5-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "52"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "ECOXGEAR - Waterproof Bluetooth Speaker"
}
},
createTime: "2019-04-03T09:46:25.016036Z",
updateTime: "2019-04-03T09:46:25.016036Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129e-55f5-11e9-aa0b-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Charge HR Activity Tracker + Heart Rate (Large)"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 149.99
},
popularity: {
integerValue: "66"
}
},
createTime: "2019-04-03T09:46:25.043137Z",
updateTime: "2019-04-03T09:46:25.043137Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e129f-55f5-11e9-bda5-f46d04ef8ec3",
fields: {
name: {
stringValue: "Fitbit - Charge HR Activity Tracker + Heart Rate (Large)"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 149.99
},
popularity: {
integerValue: "66"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "delivered"
}
},
createTime: "2019-04-03T09:46:25.077391Z",
updateTime: "2019-04-03T09:46:25.077391Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a0-55f5-11e9-987e-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "96"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Fitbit - Activity Tracker + Heart Rate (Large)"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 149.99
}
},
createTime: "2019-04-03T09:46:25.049182Z",
updateTime: "2019-04-03T09:46:25.049182Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a1-55f5-11e9-b734-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 149.99
},
popularity: {
integerValue: "92"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Fitbit - Charge HR Activity Tracker + Heart Rate (Small)"
}
},
createTime: "2019-04-03T09:46:25.034805Z",
updateTime: "2019-04-03T09:46:25.034805Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a2-55f5-11e9-b98e-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "82"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Fitbit - Charge HR Activity Tracker + Heart Rate (Small)"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 149.99
}
},
createTime: "2019-04-03T09:46:25.095599Z",
updateTime: "2019-04-03T09:46:25.095599Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a3-55f5-11e9-b068-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "100"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Activity Tracker + Heart Rate (Small)"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 149.99
}
},
createTime: "2019-04-03T09:46:25.034802Z",
updateTime: "2019-04-03T09:46:25.034802Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a4-55f5-11e9-9765-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "100"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/01.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Activity Tracker + Sleep Wristband"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 149.99
}
},
createTime: "2019-04-03T09:46:25.013756Z",
updateTime: "2019-04-03T09:46:25.013756Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a5-55f5-11e9-b1aa-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Activity Tracker (Large)"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "52"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
}
},
createTime: "2019-04-03T09:46:25.032259Z",
updateTime: "2019-04-03T09:46:25.032259Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a6-55f5-11e9-bcbd-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "51"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Fitbit - Charge Wireless Activity Tracker (Large)"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
}
},
createTime: "2019-04-03T09:46:25.077382Z",
updateTime: "2019-04-03T09:46:25.077382Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a7-55f5-11e9-ad98-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Charge Wireless Activity Tracker (Large)"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "80"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/04.png"
}
},
createTime: "2019-04-03T09:46:25.046019Z",
updateTime: "2019-04-03T09:46:25.046019Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a8-55f5-11e9-818c-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "99"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/02.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Fitbit - Charge Wireless Activity Tracker (Small)"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
}
},
createTime: "2019-04-03T09:46:25.077389Z",
updateTime: "2019-04-03T09:46:25.077389Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12a9-55f5-11e9-975d-f46d04ef8ec3",
fields: {
category: {
stringValue: "Computers"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "75"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Fitbit - Activity Tracker (Small)"
}
},
createTime: "2019-04-03T09:46:25.095600Z",
updateTime: "2019-04-03T09:46:25.095600Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12aa-55f5-11e9-bfe7-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 129.99
},
popularity: {
integerValue: "80"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Charge Wireless Activity Tracker (Small)"
}
},
createTime: "2019-04-03T09:46:25.049456Z",
updateTime: "2019-04-03T09:46:25.049456Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12ab-55f5-11e9-8c60-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Fitbit - Charging Cable for Activity Trackers"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 19.99
},
popularity: {
integerValue: "50"
}
},
createTime: "2019-04-03T09:46:25.022874Z",
updateTime: "2019-04-03T09:46:25.022874Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12ac-55f5-11e9-a65c-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Fitbit - Clip for Activity and Sleep Trackers"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 14.99
},
popularity: {
integerValue: "57"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
}
},
createTime: "2019-04-03T09:46:25.077383Z",
updateTime: "2019-04-03T09:46:25.077383Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12ad-55f5-11e9-a6b9-f46d04ef8ec3",
fields: {
name: {
stringValue: "Fitbit - Clip for Wireless Activity and Sleep Trackers"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 14.99
},
popularity: {
integerValue: "80"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.010841Z",
updateTime: "2019-04-03T09:46:25.010841Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12ae-55f5-11e9-aa8d-f46d04ef8ec3",
fields: {
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Fitbit - Clip for Zip Wireless Activity Trackers"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 14.99
},
popularity: {
integerValue: "78"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
}
},
createTime: "2019-04-03T09:46:25.041287Z",
updateTime: "2019-04-03T09:46:25.041287Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12af-55f5-11e9-8c90-f46d04ef8ec3",
fields: {
name: {
stringValue: "Fitbit - Flex 1 USB Charging Cable"
},
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 14.99
},
popularity: {
integerValue: "81"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/05.png"
},
order_status: {
stringValue: "on hold"
}
},
createTime: "2019-04-03T09:46:25.077394Z",
updateTime: "2019-04-03T09:46:25.077394Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b0-55f5-11e9-89f2-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Fitbit - Flex 1 USB Charging Cable"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 14.99
},
popularity: {
integerValue: "51"
}
},
createTime: "2019-04-03T09:46:25.019388Z",
updateTime: "2019-04-03T09:46:25.019388Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b1-55f5-11e9-b339-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/03.png"
},
order_status: {
stringValue: "canceled"
},
name: {
stringValue: "Fitbit - Flex Clasp for Activity Trackers"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 4.99
},
popularity: {
integerValue: "56"
}
},
createTime: "2019-04-03T09:46:25.024897Z",
updateTime: "2019-04-03T09:46:25.024897Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b2-55f5-11e9-8fff-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/07.png"
},
order_status: {
stringValue: "on hold"
},
name: {
stringValue: "Fitbit - Flex Wireless Activity + Sleep Tracker Wristband"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "95"
}
},
createTime: "2019-04-03T09:46:25.077406Z",
updateTime: "2019-04-03T09:46:25.077406Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b3-55f5-11e9-8d1b-f46d04ef8ec3",
fields: {
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Fitbit - Flex Wireless Activity + Sleep Tracker Wristband"
},
category: {
stringValue: "Audio"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "85"
}
},
createTime: "2019-04-03T09:46:25.035804Z",
updateTime: "2019-04-03T09:46:25.035804Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b4-55f5-11e9-901c-f46d04ef8ec3",
fields: {
popularity: {
integerValue: "50"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/09.png"
},
order_status: {
stringValue: "pending"
},
name: {
stringValue: "Fitbit - Flex Wireless Activity and Sleep Wristband"
},
category: {
stringValue: "Computers"
},
price: {
doubleValue: 99.99
}
},
createTime: "2019-04-03T09:46:25.077379Z",
updateTime: "2019-04-03T09:46:25.077379Z"
},
{
name: "projects/vuesax-admin/databases/(default)/documents/products/478e12b5-55f5-11e9-ade5-f46d04ef8ec3",
fields: {
category: {
stringValue: "Fitness"
},
price: {
doubleValue: 99.99
},
popularity: {
integerValue: "72"
},
img: {
stringValue: "https://pixinvent.com/demo/vuesax-vuejs-admin-dashboard-template/products/06.png"
},
order_status: {
stringValue: "delivered"
},
name: {
stringValue: "Fitbit - Activity Tracker"
}
},
createTime: "2019-04-03T09:46:25.043448Z",
updateTime: "2019-04-03T09:46:25.043448Z"
}
      ]
    }
  },
  computed: {
    ...mapGetters(['accounts']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    getOrderStatusColor(status) {
      if (status == 'on hold') return 'warning'
      if (status == 'delivered') return 'success'
      if (status == 'canceled') return 'danger'
      return 'primary'
    },
    getPopularityColor(num) {
      if (num > 90) return 'success'
      if (num > 70) return 'primary'
      if (num >= 50) return 'warning'
      if (num < 50) return 'danger'
      return 'primary'
    },
    formatData(data) {
      // formats data received from API
      let formattedData = data.map(item => {
        const fields = item.fields
        let obj = {}
        for (const key of Object.keys(fields)) {
          obj[key] =
            Number(fields[key].integerValue) ||
            Number(fields[key].doubleValue) ||
            fields[key].stringValue
        }
        return obj
      })
      return formattedData
    },
    ...mapActions(['getAccounts'])
  },
  async created() {
    await this.getAccounts()
    this.users = this.formatData(this.testData)
    // const thisIns = this
    // this.$http
    //   .get(
    //     'https://firestore.googleapis.com/v1/projects/vuesax-admin/databases/(default)/documents/products/?pageSize=100'
    //   )
    //   .then(function(response) {
    //     thisIns.
    //   })
    //   .catch(function(error) {
    //     thisIns.$vs.notify({
    //       title: 'Error',
    //       text: error,
    //       color: 'danger',
    //       iconPack: 'feather',
    //       icon: 'icon-alert-circle'
    //     })
    //   })
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss">
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
</style>
