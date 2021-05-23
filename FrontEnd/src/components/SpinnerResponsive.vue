<template>
  <div class="spinner-area">
    <div class="inner-box">
        <div class="spinner">
        </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.spinner-area {
    display: flex;
    min-width: 5rem;
    min-height: 5rem;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.inner-box {
  display: flex;
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;
}

.spinner {
    position: absolute;
    top: 15%;
    left: 15%;
    bottom: 15%;
    right: 15%;
    border : solid 6px;
    border-color: black transparent black transparent;
    border-radius: 50%;
    animation: spinner-rotation 2s linear infinite;
}

@keyframes spinner-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>