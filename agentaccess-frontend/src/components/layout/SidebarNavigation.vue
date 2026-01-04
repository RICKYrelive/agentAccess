<template>
  <div class="h-full bg-white border-r border-slate-200 flex flex-col">
    <!-- Logo and App Name -->
    <div class="p-4 border-b border-slate-200">
      <div class="flex items-center space-x-3">
        <!-- Modern Logo: Abstract "AA" with connection dots -->
        <div class="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 relative overflow-hidden">
          <!-- Decorative background pattern -->
          <div class="absolute inset-0 opacity-20">
            <svg viewBox="0 0 40 40" class="w-full h-full">
              <circle cx="8" cy="8" r="6" fill="currentColor" class="text-white"/>
              <circle cx="32" cy="32" r="4" fill="currentColor" class="text-white"/>
            </svg>
          </div>
          <!-- Main Logo Icon: Stylized "A" with connection node -->
          <svg class="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L4 20h3l1.5-4h7l1.5 4h3L12 3z" fill="currentColor" fill-opacity="0.9"/>
            <circle cx="12" cy="11" r="2" fill="white"/>
            <circle cx="12" cy="11" r="4" stroke="white" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg font-display font-bold text-slate-900 leading-tight">AgentAccess</h1>
          <span class="text-xs text-slate-400 font-medium tracking-wide">AI AGENT PLATFORM</span>
        </div>
      </div>
    </div>

    <!-- New Conversation Button -->
    <div class="p-4">
      <button
        @click="startNewConversation"
        class="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>发起 Access</span>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
      <!-- Main Navigation - Home, Template Management, Recent Conversations -->
      <div class="space-y-1 pb-4">
        <!-- Home -->
        <button
          @click="goToHome"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200 group',
            isShowingHome
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="transition-transform duration-200 group-hover:scale-105 inline-block">主页</span>
        </button>

        <!-- Access Template Management -->
        <button
          @click="switchToView('template-management')"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200 group',
            activeView === 'template-management'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span class="transition-transform duration-200 group-hover:scale-105 inline-block">Access 模板管理</span>
        </button>

        <!-- Recent Conversations -->
        <button
          @click="toggleRecentConversations"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center justify-between transition-all duration-200 group',
            'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span class="transition-transform duration-200 group-hover:scale-105 inline-block">最近 Access 会话</span>
          </div>
          <svg
            class="w-4 h-4 text-slate-400 transform transition-transform"
            :class="{ 'rotate-90': isRecentConversationsOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Recent Conversation Items -->
        <div v-if="isRecentConversationsOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="conv in recentConversations"
            :key="conv.id"
            class="group px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md cursor-pointer flex items-center justify-between"
            @click="selectRecentConversation(conv)"
          >
            <span class="truncate flex-1">{{ conv.title }}</span>
            <button
              @click.stop="deleteRecentConversation(conv.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity flex-shrink-0"
              title="删除 Access 会话"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-slate-100 my-2"></div>

      <!-- Agent Section (No separators between items) -->
      <div class="space-y-1 pb-4">
        <!-- Agent Editor -->
        <button
          @click="switchToView('workflow')"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200 group',
            activeView === 'workflow'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span class="transition-transform duration-200 group-hover:scale-105 inline-block">Agent 编辑器</span>
        </button>

        <!-- FastGPT Status Indicator -->
        <div
          v-if="fastgptConnected"
          class="ml-8 mt-1 flex items-center space-x-2 text-xs text-green-600"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>FastGPT 已连接</span>
        </div>

        <!-- My Agents -->
        <button
          @click="handleMyAgentsClick"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center justify-between transition-all duration-200 group',
            activeView === 'my-agents'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="transition-transform duration-200 group-hover:scale-105 inline-block">我的 Agent</span>
          </div>
          <svg
            v-if="recentAgents.length > 0"
            class="w-4 h-4 text-slate-400 transform transition-transform"
            :class="{ 'rotate-90': isMyAgentsOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Recent Agent Shortcuts -->
        <div v-if="recentAgents.length > 0 && isMyAgentsOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="agent in recentAgents"
            :key="agent.id"
            class="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md cursor-pointer flex items-center space-x-2"
            @click="openAgentInEditor(agent.id)"
            :title="agent.name"
          >
            <svg
              class="w-4 h-4 text-primary-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span class="truncate">{{ agent.name }}</span>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-slate-100 my-2"></div>

      <!-- Tools & Memory Section (No separators between items) -->
      <div class="space-y-1 pb-4">
        <!-- MCP Management -->
        <div>
          <button
            @click="handleMCPManagementClick"
            :class="[
              'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center justify-between transition-all duration-200 group',
              (activeView === 'mcp-tools' || activeView === 'mcp-gateway')
                ? 'bg-primary/5 text-primary font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
            ]"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span class="transition-transform duration-200 group-hover:scale-105 inline-block">MCP 管理</span>
            </div>
            <svg
              class="w-4 h-4 text-slate-400 transform transition-transform"
              :class="{ 'rotate-90': isMCPManagementOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- MCP Management Sub-items -->
          <div v-if="isMCPManagementOpen" class="mt-1 ml-8 space-y-1">
            <button
              @click="switchToView('mcp-tools')"
              :class="[
                'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200',
                activeView === 'mcp-tools'
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
              ]"
            >
              <svg class="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>MCP 工具</span>
            </button>
            <button
              @click="switchToView('mcp-gateway')"
              :class="[
                'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200',
                activeView === 'mcp-gateway'
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
              ]"
            >
              <svg class="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>MCP 网关</span>
            </button>
          </div>
        </div>

        <!-- System Tools -->
        <div>
          <button
            @click="handleSystemToolsClick"
            :class="[
              'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center justify-between transition-all duration-200 group',
              activeView === 'sandboxed-environments' || activeView === 'builtin-tools'
                ? 'bg-primary/5 text-primary font-semibold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
            ]"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="transition-transform duration-200 group-hover:scale-105 inline-block">系统工具</span>
            </div>
            <svg
              class="w-4 h-4 text-slate-400 transform transition-transform"
              :class="{ 'rotate-90': isSystemToolsOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <!-- System Tools Sub-items -->
          <div v-if="isSystemToolsOpen" class="mt-1 ml-8 space-y-1">
            <!-- Sandboxed Environments -->
            <button
              @click="switchToView('sandboxed-environments')"
              :class="[
                'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200',
                activeView === 'sandboxed-environments'
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
              ]"
            >
              <svg class="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>沙箱环境</span>
            </button>

            <!-- Built-in Tools -->
            <button
              @click="switchToView('builtin-tools')"
              :class="[
                'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200',
                activeView === 'builtin-tools'
                  ? 'bg-primary/5 text-primary font-semibold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
              ]"
            >
              <svg class="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>内置工具</span>
            </button>
          </div>
        </div>

        <!-- Memory (记忆体) -->
        <button
          @click="switchToView('memory')"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200 group',
            activeView === 'memory'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span class="transition-transform duration-200 group-hover:scale-105 inline-block">记忆体</span>
        </button>
      </div>

      <!-- Separator -->
      <div class="border-t border-slate-100 my-2"></div>

      <!-- Knowledge Base -->
      <div class="space-y-1 pb-4">
        <button
          @click="handleKnowledgeBaseClick"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center space-x-3 transition-all duration-200 group',
            activeView === 'knowledge-base'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span class="transition-transform duration-200 group-hover:scale-105 inline-block">知识库</span>
        </button>
      </div>

      <!-- Separator -->
      <div class="border-t border-slate-100 my-2"></div>

      <!-- Team Management Section -->
      <div class="space-y-1 pb-4">
        <button
          @click="handleTeamManagementClick"
          :class="[
            'w-full text-left px-4 py-3 text-sm font-display font-medium rounded-xl flex items-center justify-between transition-all duration-200 group',
            activeView === 'team-agents'
              ? 'bg-primary/5 text-primary font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-primary',
          ]"
        >
          <div class="flex items-center space-x-3">
            <svg
              class="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span class="transition-transform duration-200 group-hover:scale-105 inline-block">团队管理</span>
          </div>
          <svg
            v-if="myTeams.length > 0"
            class="w-4 h-4 text-slate-400 transform transition-transform"
            :class="{ 'rotate-90': isTeamManagementOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Team Items (my teams) -->
        <div v-if="myTeams.length > 0 && isTeamManagementOpen" class="mt-1 ml-8 space-y-1">
          <div
            v-for="team in myTeams"
            :key="team.id"
            class="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md cursor-pointer flex items-center space-x-2"
            :title="team.description || team.name"
            @click="handleTeamClick(team.id)"
          >
            <svg
              class="w-4 h-4 text-primary-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="truncate">{{ team.name }}</span>
            <span
              v-if="isTeamAdmin(team.id)"
              class="text-xs bg-primary/5 text-primary font-semibold px-1 rounded"
              title="管理员"
              >管理员</span
            >
          </div>
        </div>
      </div>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-slate-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-slate-900">{{ user.name }}</p>
        </div>
        <!-- User Menu Dropdown -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="p-1 text-slate-400 hover:text-slate-600"
            title="用户菜单"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
          >
            <button
              @click="openUserSettings"
              class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>用户设置</span>
            </button>
            <div class="border-t border-slate-200 my-1"></div>
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { User, ExtendedAgent } from '@/types'
import { useAgentsStore } from '@/stores/agents'
import { useWorkflowStore } from '@/stores/workflow'
import { useChatStore } from '@/stores/chat'
import { useTeamsStore } from '@/stores/teams'

interface Props {
  activeView:
    | 'home'
    | 'workflow'
    | 'my-agents'
    | 'team-agents'
    | 'team-detail'
    | 'mcp-tools'
    | 'mcp-gateway'
    | 'sandboxed-environments'
    | 'builtin-tools'
    | 'memory'
    | 'knowledge-base'
    | 'knowledge-base-detail'
  isShowingHome: boolean
}

interface Emits {
  (
    e: 'view-change',
    view:
      | 'home'
      | 'workflow'
      | 'my-agents'
      | 'team-agents'
      | 'mcp-tools'
      | 'mcp-gateway'
      | 'sandboxed-environments'
      | 'builtin-tools'
      | 'memory'
      | 'knowledge-base',
  ): void
  (e: 'open-user-settings'): void
  (e: 'start-new-conversation'): void
  (e: 'go-to-home'): void
  (e: 'start-chat-with-agent', agent: any): void
  (e: 'select-recent-conversation', conversation: any): void
  (e: 'open-agent-in-editor', agentId: string): void
  (e: 'view-team', teamId: string): void
  (e: 'delete-conversation', conversationId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const agentsStore = useAgentsStore()
const { myAgents, teamAgents } = storeToRefs(agentsStore)
const { getRecentAgents, markAgentAsUsed } = agentsStore

const workflowStore = useWorkflowStore()
const { fastgptConnected } = storeToRefs(workflowStore)

const chatStore = useChatStore()
const { conversations } = storeToRefs(chatStore)
const { isDemoConversation } = chatStore

const teamsStore = useTeamsStore()
const { myTeams } = storeToRefs(teamsStore)
const { isTeamAdmin } = teamsStore

// Get recent agents
const recentAgents = computed(() => getRecentAgents(3))

// Get recent conversations from store (limit to 10)
const recentConversations = computed(() => conversations.value.slice(0, 10))

const isRecentConversationsOpen = ref(false)
const isMCPManagementOpen = ref(false)
const isSystemToolsOpen = ref(false)
const isMemoryOpen = ref(false)
const isTeamManagementOpen = ref(false)
const isMyAgentsOpen = ref(false)
const showUserMenu = ref(false)

// Memory data
const memoryTypes = ref([
  {
    id: 'mem-short',
    name: '短期记忆',
    size: '128 条',
    description: '当前会话的临时记忆',
    iconColor: 'text-orange-500',
    iconPath: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    id: 'mem-long',
    name: '长期记忆',
    size: '2.3 MB',
    description: '持久化的知识和经验',
    iconColor: 'text-indigo-500',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    id: 'mem-vector',
    name: '向量记忆',
    size: '156 个向量',
    description: '基于向量嵌入的语义记忆',
    iconColor: 'text-teal-500',
    iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 2.15-2.15l-5-5A2 2 0 009 10.172V5L8 4z',
  },
])

const user: User = {
  id: '03928',
  name: '用户03928',
}

const switchToView = (
  view:
    | 'home'
    | 'workflow'
    | 'my-agents'
    | 'team-agents'
    | 'mcp-tools'
    | 'mcp-gateway'
    | 'sandboxed-environments'
    | 'builtin-tools'
    | 'memory'
    | 'knowledge-base',
) => {
  emit('view-change', view)
}

const startNewConversation = () => {
  // 清空当前 Access 会话，切换到聊天界面
  emit('start-new-conversation')
}

const goToHome = () => {
  // 切换到主页，重置显示状态
  emit('go-to-home')
}

const openAgentInEditor = (agentId: string) => {
  // Mark agent as used
  markAgentAsUsed(agentId)
  // Emit event to load agent in workflow editor
  emit('open-agent-in-editor', agentId)
}

const handleKnowledgeBaseClick = () => {
  switchToView('knowledge-base')
}

const handleMCPManagementClick = () => {
  // Toggle MCP Management submenu or navigate to default page
  if (props.activeView === 'mcp-tools' || props.activeView === 'mcp-gateway') {
    // Already on MCP page, just toggle submenu
    isMCPManagementOpen.value = !isMCPManagementOpen.value
  } else {
    // Navigate to MCP Tools as default
    switchToView('mcp-tools')
  }
}

const handleSystemToolsClick = () => {
  // Toggle System Tools submenu or navigate to default page
  if (props.activeView === 'sandboxed-environments' || props.activeView === 'builtin-tools') {
    // Already on System Tools page, just toggle submenu
    isSystemToolsOpen.value = !isSystemToolsOpen.value
  } else {
    // Navigate to Sandboxed Environments as default
    switchToView('sandboxed-environments')
  }
}

const handleMemoryClick = () => {
  switchToView('memory')
}

const toggleRecentConversations = () => {
  isRecentConversationsOpen.value = !isRecentConversationsOpen.value
}

const toggleTeamAgents = () => {
  isTeamManagementOpen.value = !isTeamManagementOpen.value
}

const handleMyAgentsClick = () => {
  // Always switch to my-agents view
  switchToView('my-agents')
  // Submenu will auto-expand via watch
}

const handleTeamManagementClick = () => {
  // Always switch to team-agents view
  switchToView('team-agents')
  // Submenu will auto-expand via watch
}

const handleTeamClick = (teamId: string) => {
  emit('view-team', teamId)
}

const startChatWithAgent = (agent: any) => {
  emit('start-chat-with-agent', agent)
}

const selectRecentConversation = (conversation: any) => {
  emit('select-recent-conversation', conversation)
}

const deleteRecentConversation = (conversationId: string) => {
  console.log('🗑️ Attempting to delete conversation:', conversationId)
  // Check if this is a demo conversation that cannot be deleted
  if (isDemoConversation(conversationId)) {
    alert('演示中，该 Access 会话不支持删除')
    return
  }

  if (confirm('确定要删除这个 Access 会话吗？')) {
    emit('delete-conversation', conversationId)
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const openUserSettings = () => {
  showUserMenu.value = false
  emit('open-user-settings')
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    // TODO: Implement logout logic
    console.log('Logout')
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Watch activeView to auto-expand/collapse submenus
watch(
  () => props.activeView,
  (newView) => {
    if (newView === 'my-agents') {
      // Auto-expand when entering my-agents view
      isMyAgentsOpen.value = true
    } else if (newView === 'workflow') {
      // Keep expanded when editing an agent in workflow view
      // Don't collapse when going to workflow editor from my-agents
    } else {
      // Auto-collapse when leaving my-agents view
      isMyAgentsOpen.value = false
    }

    if (newView === 'team-agents' || newView === 'team-detail') {
      // Auto-expand when entering team-agents or team-detail view
      isTeamManagementOpen.value = true
    } else {
      // Auto-collapse when leaving team views
      isTeamManagementOpen.value = false
    }

    if (newView === 'mcp-tools' || newView === 'mcp-gateway') {
      isMCPManagementOpen.value = true
    } else {
      isMCPManagementOpen.value = false
    }

    if (newView === 'sandboxed-environments' || newView === 'builtin-tools') {
      isSystemToolsOpen.value = true
    } else {
      isSystemToolsOpen.value = false
    }

    if (newView === 'memory') {
      isMemoryOpen.value = true
    } else {
      isMemoryOpen.value = false
    }
  },
)
</script>
