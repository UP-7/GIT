<template>
    <div>
        <svg :style="{width,height}">
      <use :xlink:href ="prefix + name" :fill="color" >

      </use>
    </svg>
    </div>
</template>

<script setup lang="ts">
//接受父组件传过来的参数
defineProps({
    //xlin:href属性值的前缀
    prefix: {
        type: String,
        default:'#icon-'
    },
    name: String,
    color: {
        type: String,
        default:''
    },
    width: {
        type: String,
        default:'16px'
    },
    height: {
        type: String,
        default:'16px'
    }
})
</script>

<style scoped>

</style>