<template>
  <div class="page-header-row">
    <div>
      <h1 class="page-title">{{ title }}</h1>
      <p class="breadcrumb-nav">
        <router-link to="/dashboard" style="color:#aaa;text-decoration:none">Home</router-link>
        <template v-for="(crumb, i) in crumbs" :key="i">
          &rsaquo;
          <router-link v-if="crumb.to" :to="crumb.to" style="color:#aaa;text-decoration:none">{{ crumb.label }}</router-link>
          <span v-else style="color:#26B99A">{{ crumb.label }}</span>
        </template>
      </p>
    </div>
    <div v-if="$slots.actions" class="flex-row gap-8">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title:  { type: String, required: true },
  crumbs: { type: Array,  default: () => [] },  // [{ label, to? }]
})
</script>
