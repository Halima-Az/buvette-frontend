<template>
    <HeaderPageMenu title ="Profile"/>
    <Profile   :ordersLength="orders.length" 
               :pendinLength="pending.length" 
               :user="user" 
               :lastChanged="lastChanged"
               @goToMyOrders="goToMyOrders"
               @change-password="ChangPassword" />
    <FooterPageMenu/>

</template>
<script setup>
import { ref,onMounted,computed } from 'vue';
import axios from 'axios';
import HeaderPageMenu from '@/components/client/HeaderPageMenu.vue';
import FooterPageMenu from '@/components/client/FooterPageMenu.vue';
import Profile from '@/components/shared/Profile.vue';
import { timeAgo } from '@/utils/timeUtils'
import { useRouter } from 'vue-router'
const router=useRouter()
const orders = ref([])
const pending=ref([])

const user = ref({
  fname: '',
  lname: '',
  role: '',
  username: '',
  email: '',
  dob: null
})

const changeIn = ref('')
const fetchOrders = async () => {
  const token = localStorage.getItem("token")
  if (!token) return

  const res = await axios.get("http://localhost:8088/client/orders", {
    headers: { Authorization: `Bearer ${token}` }
  })

  orders.value = res.data
  pending.value = res.data.filter(o => o.status === 'PENDING')
}

const fetchUser = async () => {
  const token = localStorage.getItem("token")
  if (!token) return

  const res = await axios.get("http://localhost:8088/user", {
    headers: { Authorization: `Bearer ${token}` }
  })

  user.value = res.data
  changeIn.value = res.data.lastPasswordChange
    ? new Date(res.data.lastPasswordChange)
    : null
}

onMounted(async () => {
  await fetchUser()
  await fetchOrders()
})

const lastChanged = computed(() => 
  timeAgo(changeIn.value)
)
const goToMyOrders = () => {
  router.push('/orders')
}

const ChangPassword = async (data) => {

  const token = localStorage.getItem("token")
  if (!token) return
  try {
    const res = await axios.post("http://localhost:8088/change-password", {

      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    is_change.value = false
  }
  catch (err) {
    console.error("Error in updating password", err)
  }
}

</script>