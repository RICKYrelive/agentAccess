<template>
  <div>
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">创建 MCP 工具</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <!-- Builtin Import -->
      <button
        @click="$emit('open-builtin')"
        class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-dashed border-primary-300 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition-all text-left group"
      >
        <div class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 flex items-center justify-center text-primary-500 dark:text-primary-400 mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="font-semibold text-slate-900 dark:text-white mb-2">从官方商店导入</h3>
        <p class="text-sm text-slate-500 leading-relaxed">从官方工具商店浏览和导入内置的 MCP 工具。</p>
      </button>

      <!-- Custom Tool -->
      <button
        @click="$emit('open-custom')"
        class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group"
      >
        <div class="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 class="font-semibold text-slate-900 dark:text-white mb-2">自定义第三方工具</h3>
        <p class="text-sm text-slate-500 leading-relaxed">配置自定义的第三方 MCP 工具，提供 URL 和认证信息。</p>
      </button>

      <!-- Image Deployment -->
      <button
        @click="$emit('open-image')"
        class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-left group"
      >
        <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="font-semibold text-slate-900 dark:text-white mb-2">导入镜像</h3>
        <p class="text-sm text-slate-500 leading-relaxed">从 npx 或 uvx 镜像仓库导入和部署 MCP 工具。</p>
      </button>

      <!-- OpenAPI Import -->
      <button
        @click="$emit('open-openapi')"
        class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-dashed border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all text-left group"
      >
        <div class="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 flex items-center justify-center text-green-500 dark:text-green-400 mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 class="font-semibold text-slate-900 dark:text-white mb-2">导入 OpenAPI</h3>
        <p class="text-sm text-slate-500 leading-relaxed">上传 JSON 或 YAML OpenAPI 规范自动生成工具定义。最大 10MB。</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  openBuiltin: []
  openCustom: []
  openImage: []
  openOpenapi: []
}>()
</script>
