<template>
  <div style="position: absolute; z-index: 1; top: 0px; right: 0px">
    <div class="d-flex justify-content-end">
      <button class="me-2 mt-2" type="button" @click="navbarEvent()">
        <img src="../assets/menu.png" style="width: 40px" alt="" />
      </button>
    </div>
    <div id="nav" class="navClose bg-white mt-2">
      <ul>
        <li>test</li>
        <li>test</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navClose: false,
    };
  },

  methods: {
    navbarEvent() {
      this.navClose = !this.navClose;
      const navbar = document.getElementById("nav");
      if (this.navClose) {
        navbar.classList.remove("navClose");
        navbar.classList.add("navOpen");
      } else {
        navbar.classList.remove("navOpen");
        navbar.classList.add("navClose");
      }
    },
  },
};
</script>

<style>
.navOpen {
  opacity: 1;
  height: auto;
  transition: opacity .5s ease-in;
}

.navClose {
  opacity: 0;
  transition: opacity .5s ease-out;
}
</style>