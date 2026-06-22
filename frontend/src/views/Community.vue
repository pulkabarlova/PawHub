<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto">
    <header
      class="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100"
    >
      <div>
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Community Forums</h1>
        <p class="mt-3 text-lg text-slate-500 font-medium">Join the discussion with other pet lovers.</p>
      </div>
      <button
        v-if="isAuthenticated"
        @click="showForm = !showForm"
        class="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-md hover:-translate-y-1 w-full md:w-auto text-lg"
      >
        {{ showForm ? 'Cancel Post' : 'Create New Post' }}
      </button>
      <div v-else class="text-sm bg-sky-50 text-sky-800 px-6 py-4 rounded-2xl border border-sky-100 font-medium">
        <router-link to="/login" class="font-bold underline hover:text-sky-900">Log in</router-link> to start a
        discussion.
      </div>
    </header>

    <main>
      <!-- Create Post Form -->
      <section
        v-if="showForm && isAuthenticated"
        class="bg-slate-50 border border-slate-200 p-10 rounded-[3rem] shadow-sm mb-12 transition-all"
      >
        <h2 class="text-2xl font-extrabold mb-6 text-slate-900">Start a new discussion</h2>
        <form @submit.prevent="submitPost" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input
              v-model="newPost.title"
              required
              type="text"
              class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-white"
              placeholder="What's on your mind?"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Content</label>
            <textarea
              v-model="newPost.content"
              required
              rows="4"
              class="block w-full rounded-2xl border-slate-200 shadow-sm focus:border-sky-500 focus:ring-sky-500 px-5 py-4 border bg-white"
              placeholder="Share your thoughts..."
            ></textarea>
          </div>
          <p v-if="errorMsg" class="text-red-600 font-medium">{{ errorMsg }}</p>
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="bg-sky-500 text-white px-8 py-4 rounded-full font-bold hover:bg-sky-600 transition-all disabled:opacity-50 shadow-md hover:-translate-y-1 text-lg"
              :disabled="submitting"
            >
              {{ submitting ? 'Posting...' : 'Submit Post' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Post List -->
      <section>
        <div v-if="loading" class="text-center py-16 text-slate-500 animate-pulse font-medium text-lg">
          Loading discussions...
        </div>
        <div
          v-else-if="posts.length === 0"
          class="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100 text-slate-500"
        >
          <p class="text-2xl font-bold text-slate-700">No posts yet.</p>
          <p class="text-lg mt-2 font-medium">Be the first to start a conversation!</p>
        </div>
        <div v-else class="space-y-8">
          <article
            v-for="post in posts"
            :key="post._id"
            class="bg-white shadow-sm border border-slate-100 rounded-[2.5rem] p-8 md:p-10 hover:shadow-md transition-all"
          >
            <div class="flex flex-col lg:flex-row gap-8 items-start">
              <div class="flex-1 w-full">
                <h3 class="text-2xl font-bold text-slate-900 mb-4">{{ post.title }}</h3>
                <p class="text-slate-600 whitespace-pre-wrap text-lg leading-relaxed mb-6">{{ post.content }}</p>
              </div>

              <!-- Post Image Display -->
              <div
                v-if="post.imageUrl"
                class="w-full lg:w-1/3 shrink-0 relative overflow-hidden rounded-[2rem] bg-slate-100 border border-slate-100 shadow-inner max-h-64"
              >
                <img :src="resolveMediaUrl(post.imageUrl)" alt="Post attachment" class="w-full h-full object-cover" />
              </div>
            </div>

            <footer
              class="pt-6 mt-6 border-t border-slate-100 text-sm font-medium text-slate-500 flex justify-between items-center"
            >
              <span class="text-slate-700 font-bold bg-slate-100 px-4 py-2 rounded-full">{{
                post.authorId?.name || 'Member'
              }}</span>
              <span>{{
                new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              }}</span>
            </footer>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { postsService } from '../services/posts.service';
import { resolveMediaUrl } from '../utils/media';

const posts = ref([]);
const loading = ref(true);
const showForm = ref(false);
const submitting = ref(false);
const errorMsg = ref('');
const { isAuthenticated } = storeToRefs(useAuthStore());

const newPost = ref({ title: '', content: '' });

const fetchPosts = async () => {
  loading.value = true;
  try {
    posts.value = await postsService.list();
  } catch (err) {
    console.error('Failed to fetch posts:', err);
  } finally {
    loading.value = false;
  }
};

const submitPost = async () => {
  submitting.value = true;
  errorMsg.value = '';
  try {
    const createdPost = await postsService.create(newPost.value);
    posts.value.unshift(createdPost);
    newPost.value = { title: '', content: '' };
    showForm.value = false;
  } catch (err) {
    errorMsg.value = err.message || 'Failed to create post. Please try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchPosts);
</script>
