// Basic Button Examples

import { 
    BasicButton,
    CreateButton, 
    StoreButton, 
    ShowButton, 
    EditButton, 
    UpdateButton, 
    DeleteButton 
} from '@/Components';

export default function ButtonExamples() {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Button Examples</h1>
            
            {/* Basic Button Variants */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Basic Button Variants</h2>
                <div className="flex flex-wrap gap-4">
                    <BasicButton variant="primary">Primary</BasicButton>
                    <BasicButton variant="secondary">Secondary</BasicButton>
                    <BasicButton variant="success">Success</BasicButton>
                    <BasicButton variant="danger">Danger</BasicButton>
                    <BasicButton variant="warning">Warning</BasicButton>
                    <BasicButton variant="info">Info</BasicButton>
                    <BasicButton variant="outline">Outline</BasicButton>
                    <BasicButton variant="ghost">Ghost</BasicButton>
                </div>
            </section>

            {/* Button Sizes */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Button Sizes</h2>
                <div className="flex items-center gap-4">
                    <BasicButton size="xs">Extra Small</BasicButton>
                    <BasicButton size="sm">Small</BasicButton>
                    <BasicButton size="md">Medium</BasicButton>
                    <BasicButton size="lg">Large</BasicButton>
                    <BasicButton size="xl">Extra Large</BasicButton>
                </div>
            </section>

            {/* Button with Icons */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Buttons with Icons</h2>
                <div className="flex flex-wrap gap-4">
                    <BasicButton 
                        icon="M12 4.5v15m7.5-7.5h-15"
                        iconPosition="left"
                    >
                        Left Icon
                    </BasicButton>
                    <BasicButton 
                        icon="M12 4.5v15m7.5-7.5h-15"
                        iconPosition="right"
                    >
                        Right Icon
                    </BasicButton>
                    <BasicButton 
                        icon="M12 4.5v15m7.5-7.5h-15"
                        size="sm"
                    />
                </div>
            </section>

            {/* CRUD Buttons */}
            <section>
                <h2 className="text-lg font-semibold mb-4">CRUD Operation Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <CreateButton />
                    <StoreButton />
                    <ShowButton />
                    <EditButton />
                    <UpdateButton />
                    <DeleteButton />
                </div>
            </section>

            {/* Button States */}
            <section>
                <h2 className="text-lg font-semibold mb-4">Button States</h2>
                <div className="flex flex-wrap gap-4">
                    <BasicButton>Normal</BasicButton>
                    <BasicButton disabled>Disabled</BasicButton>
                    <BasicButton loading>Loading</BasicButton>
                </div>
            </section>
        </div>
    );
}