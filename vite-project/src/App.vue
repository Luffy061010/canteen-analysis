<template>
  <div id="app">
    <!-- 品牌栏 - 固定顶部 -->
    <BrandBar />
    
    <!-- 用户栏 - 固定右上角 -->
    <Header />
    
    <!-- 主布局 -->
    <div class="layout-container">
      <!-- 侧边栏 -->
      <Sidebar />
      
      <!-- 主内容区 -->
      <main class="main-content">
        <div class="content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import BrandBar from '@/components/Layout/BrandBar.vue'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
</script>

<style>
/* 全局样式已在global.scss中定义 */
</style>