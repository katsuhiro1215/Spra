import {
    TagIcon,
    CheckCircleIcon,
    EyeIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

export default function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <TagIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                総価格設定数
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                                {stats.total}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                アクティブ
                            </dt>
                            <dd className="text-lg font-medium text-green-900">
                                {stats.active}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <EyeIcon className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                表示中
                            </dt>
                            <dd className="text-lg font-medium text-blue-900">
                                {stats.visible}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <StarIcon className="h-8 w-8 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                デフォルト
                            </dt>
                            <dd className="text-lg font-medium text-yellow-900">
                                {stats.default}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <StarIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                                注目設定
                            </dt>
                            <dd className="text-lg font-medium text-purple-900">
                                {stats.featured}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
