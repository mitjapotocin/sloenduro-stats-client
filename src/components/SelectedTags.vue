<template>
  <div>
    <el-tag
      v-for="tag in selected"
      :disable-transitions="false"
      @close="handleClose(tag)"
      :key="tag.Name"
      closable
    >{{tag.Name}}</el-tag>
    <!-- type="success" -->
  </div>
</template>

<script>
export default {
  name: "SelectedTags",
  props: {
    selected: {
      type: Array,
      default: []
    }
  },
  methods: {
    handleClose(tag) {
      tag.selected = false;
      this.$parent.updateSelectedList(tag);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>