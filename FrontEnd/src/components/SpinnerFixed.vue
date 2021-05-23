<template>
    <div class="spinner-area">
        <div class="spinner" :style="sizeRem">
        </div>
    </div>
</template>

<script>
export default {
  props: ['size'],
  computed: {
    sizeRem() {
      if (Number.isNaN( Number.parseInt(this.size))) {
        return { width : '5rem', height: '5rem' };
      } else {
        const sizeNumber = Number.parseInt(this.size);
        // Le côté minimum du spinner est de 5rem
        const spinnerSide = sizeNumber < 5 ? '5rem' : `${sizeNumber}rem`;
        return { width : spinnerSide, height: spinnerSide };
      }
    }
  }
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

.spinner {
    border : solid 6px black;
    border-color: black black black transparent;
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