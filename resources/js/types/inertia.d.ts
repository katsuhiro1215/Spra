declare module "@inertiajs/react" {
    export interface PageProps {
        auth?: {
            user: {
                id: number;
                name: string;
                email: string;
            };
        };
        flash?: {
            message?: string;
            error?: string;
        };
        [key: string]: any;
    }

    export interface InertiaAppProps {
        initialPage: Page;
        resolveComponent: (name: string) => Component;
    }

    export interface Page {
        component: string;
        props: PageProps;
        url: string;
        version: string;
    }

    export type Component = React.ComponentType<PageProps>;
}

// Inertia.render()で使用可能なコンポーネント一覧の型定義
declare global {
    namespace Inertia {
        interface Components {
            "Admin/Homepage/Pages/Index": React.ComponentType<{
                pages: Array<{
                    id: number;
                    title: string;
                    slug: string;
                    template: string;
                    is_published: boolean;
                    sort_order: number;
                    updated_at: string;
                }>;
            }>;
            "Admin/Homepage/Pages/Create": React.ComponentType<{
                templates: Record<string, string>;
            }>;
            "Admin/Homepage/Pages/Edit": React.ComponentType<{
                page: any;
                templates: Record<string, string>;
            }>;
            "Admin/Homepage/Pages/Show": React.ComponentType<{
                page: any;
            }>;
            "Admin/Dashboard": React.ComponentType<{}>;
        }
    }
}
