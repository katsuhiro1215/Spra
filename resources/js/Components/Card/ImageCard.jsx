export default function ImageCard({
    title,
    subtitle,
    children,
    className = "",
    ...props
}) {
    return (
        <div class="group relative bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image Section */}
            <div class="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                {/* Hover Overlay with Actions */}
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div class="space-y-2">
                        {/* Default Action Slot */}
                        <slot name="actions">
                            <Link class="inline-flex items-center px-4 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors">
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
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                詳細を見る
                            </Link>
                        </slot>
                    </div>
                </div>
            </div>

            {/* Title and Footer Section title subtitle footer */}
            <div class="p-4" {...props}>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white truncate mb-1">
                    {{ title }}
                </h3>
                <p
                    v-if="subtitle"
                    class="text-sm text-slate-600 dark:text-slate-400 truncate"
                >
                    {{ subtitle }}
                </p>
                {/* Footer Section */}
                <slot name="footer"></slot>
            </div>
        </div>
    );
}
