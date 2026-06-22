<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto">
    <router-link to="/community" class="inline-block mb-8 text-sky-600 font-bold hover:underline">
      &larr; Back to community
    </router-link>

    <div v-if="loading" class="text-center py-20 text-slate-500 animate-pulse font-medium text-lg">Loading post...</div>
    <div
      v-else-if="!post"
      class="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-slate-500"
    >
      <p class="text-3xl font-extrabold text-slate-900 mb-4">Post not found</p>
      <p class="text-lg">This discussion may have been removed.</p>
    </div>
    <article v-else class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 md:p-12">
      <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{{ post.title }}</h1>
      <p class="text-slate-500 font-medium mb-8">{{ post.authorId?.name || 'Member' }} &bull; {{ formattedDate }}</p>
      <img
        v-if="post.imageUrl"
        :src="resolveMediaUrl(post.imageUrl)"
        :alt="post.title"
        class="w-full max-h-96 object-cover rounded-[2rem] mb-8 border border-slate-100"
      />
      <p class="text-slate-700 whitespace-pre-wrap text-lg leading-relaxed">{{ post.content }}</p>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { postsService } from '../services/posts.service';
import { resolveMediaUrl } from '../utils/media';

const route = useRoute();
const post = ref(null);
const loading = ref(true);

const formattedDate = computed(() =>
  post.value?.createdAt ? new Date(post.value.createdAt).toLocaleDateString() : ''
);

onMounted(async () => {
  try {
    post.value = await postsService.get(route.params.id);
  } catch (err) {
    console.error('Failed to fetch post:', err);
  } finally {
    loading.value = false;
  }
});
</script>
