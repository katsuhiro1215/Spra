<script setup>
import { ref, computed } from "vue";
import { router } from "@inertiajs/vue3";
import axios from "axios";
import Modal from "@/Components/Modal/Modal.vue";
import { PrimaryButton } from "@/Components/Button";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  mediaList: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  uploadRoute: {
    type: String,
    required: true,
  },
  createMediaRoute: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["close", "select", "mediaUploaded"]);

// 選択されたメディア
const selectedMediaIds = ref([]);

// ドラッグ&ドロップ
const isDragging = ref(false);
const uploadingFiles = ref([]);

const handleDragEnter = (e) => {
  e.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  e.preventDefault();
  isDragging.value = false;
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = async (e) => {
  e.preventDefault();
  isDragging.value = false;

  const files = Array.from(e.dataTransfer.files);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  if (imageFiles.length === 0) {
    alert("画像ファイルのみアップロード可能です");
    return;
  }

  uploadFiles(imageFiles);
};

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  uploadFiles(files);
};

const uploadFiles = async (files) => {
  uploadingFiles.value = files.map((file) => ({
    file,
    name: file.name,
    uploading: true,
  }));

  for (const fileData of uploadingFiles.value) {
    try {
      const formData = new FormData();
      formData.append("image", fileData.file);
      formData.append("title", fileData.file.name.split(".")[0]);

      // axiosでアップロード（画面遷移を防ぐ）
      const response = await axios.post(props.uploadRoute, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      fileData.uploading = false;

      // アップロード成功したら自動的に選択状態にする
      if (response.data.media) {
        const mediaId = response.data.media.id;
        if (props.multiple) {
          if (!selectedMediaIds.value.includes(mediaId)) {
            selectedMediaIds.value.push(mediaId);
          }
        } else {
          selectedMediaIds.value = [mediaId];
        }

        // mediaListに新しいメディアを追加（即座に表示）
        emit("mediaUploaded", response.data.media);
      }
    } catch (error) {
      console.error("Upload error:", error);
      fileData.uploading = false;
      fileData.error =
        error.response?.data?.message || "アップロードに失敗しました";
    }
  }

  // アップロード完了後、アップロード中リストをクリア
  setTimeout(() => {
    uploadingFiles.value = [];
  }, 2000);
};

const selectMedia = (mediaId) => {
  if (props.multiple) {
    const index = selectedMediaIds.value.indexOf(mediaId);
    if (index > -1) {
      selectedMediaIds.value.splice(index, 1);
    } else {
      selectedMediaIds.value.push(mediaId);
    }
  } else {
    selectedMediaIds.value = [mediaId];
  }
};

const isSelected = (mediaId) => {
  return selectedMediaIds.value.includes(mediaId);
};

const confirmSelection = () => {
  if (selectedMediaIds.value.length === 0) {
    alert("メディアを選択してください");
    return;
  }

  if (props.multiple) {
    emit("select", selectedMediaIds.value);
  } else {
    emit("select", selectedMediaIds.value[0]);
  }

  close();
};

const close = () => {
  selectedMediaIds.value = [];
  uploadingFiles.value = [];
  emit("close");
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const hasMedia = computed(() => props.mediaList.length > 0);
</script>

<template>
  <Modal :show="show" @close="close" maxWidth="5xl">
    <template #header>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        画像を選択
      </h3>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- 新規アップロードセクション -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            新規アップロード
          </h4>

          <!-- ドラッグ&ドロップエリア -->
          <div
            @dragenter="handleDragEnter"
            @dragleave="handleDragLeave"
            @dragover="handleDragOver"
            @drop="handleDrop"
            :class="[
              'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
              isDragging
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500',
            ]"
          >
            <input
              type="file"
              accept="image/*"
              :multiple="multiple"
              @change="handleFileSelect"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div class="space-y-2">
              <svg
                class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium text-indigo-600 dark:text-indigo-400">
                  クリックしてファイルを選択
                </span>
                またはドラッグ&ドロップ
              </div>

              <p class="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF, WebP（最大10MB）
              </p>
            </div>

            <!-- アップロード中の表示 -->
            <div v-if="uploadingFiles.length > 0" class="mt-4 space-y-2">
              <div
                v-for="(fileData, index) in uploadingFiles"
                :key="index"
                class="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
              >
                <span class="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {{ fileData.name }}
                </span>
                <span
                  v-if="fileData.uploading"
                  class="text-xs text-indigo-600 dark:text-indigo-400"
                >
                  アップロード中...
                </span>
                <span
                  v-else-if="fileData.error"
                  class="text-xs text-red-600 dark:text-red-400"
                >
                  {{ fileData.error }}
                </span>
                <span v-else class="text-xs text-green-600 dark:text-green-400">
                  完了
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 区切り線 -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-300 dark:border-gray-600"
            ></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              または
            </span>
          </div>
        </div>

        <!-- 既存の画像から選択 -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            既存の画像から選択
          </h4>

          <!-- メディア一覧グリッド -->
          <div v-if="hasMedia">
            <div
              class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 max-h-[400px] overflow-y-auto p-1"
            >
              <div
                v-for="media in mediaList"
                :key="media.id"
                @click="selectMedia(media.id)"
                :class="[
                  'group relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all',
                  isSelected(media.id)
                    ? 'border-indigo-600 ring-2 ring-indigo-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400',
                ]"
              >
                <!-- 選択インジケーター -->
                <div
                  v-if="isSelected(media.id)"
                  class="absolute top-2 right-2 z-10 bg-indigo-600 text-white rounded-full p-1"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>

                <!-- 画像プレビュー -->
                <div
                  class="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    :src="media.original_url"
                    :alt="media.alt_text || media.title || 'メディア'"
                    class="h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <!-- 情報オーバーレイ -->
                <div class="p-2 bg-white dark:bg-gray-800">
                  <h5
                    class="truncate text-xs font-medium text-gray-900 dark:text-white"
                  >
                    {{ media.title || media.original_filename }}
                  </h5>
                  <div
                    class="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400"
                  >
                    <span>{{ media.format?.toUpperCase() }}</span>
                    <span>{{ formatFileSize(media.original_file_size) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- メディアがない場合 -->
          <div
            v-else
            class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              メディアがありません
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              上のエリアから新しい画像をアップロードしてください
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <PrimaryButton @click="close" buttonType="secondary" buttonSize="lg">
        キャンセル
      </PrimaryButton>
      <PrimaryButton
        v-if="selectedMediaIds.length > 0"
        @click="confirmSelection"
        buttonType="primary"
        buttonSize="lg"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{
          multiple
            ? `選択した画像を使用 (${selectedMediaIds.length})`
            : "この画像を使用"
        }}
      </PrimaryButton>
    </template>
  </Modal>
</template>
