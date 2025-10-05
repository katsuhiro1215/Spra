// Form Components Examples

import { useState } from 'react';
import { 
    FormWrapper,
    FormField,
    FormActions,
    TextInput,
    TextArea,
    Select,
    Checkbox,
    RadioGroup,
    FileInput,
    StoreButton,
    BasicButton
} from '@/Components';

export default function FormExamples() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        category: '',
        newsletter: false,
        gender: '',
        files: []
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const categoryOptions = [
        { value: 'general', label: '一般的な質問' },
        { value: 'support', label: 'サポート' },
        { value: 'billing', label: '請求について' }
    ];

    const genderOptions = [
        { value: 'male', label: '男性' },
        { value: 'female', label: '女性' },
        { value: 'other', label: 'その他' }
    ];

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Form Components Examples</h1>
            
            <FormWrapper
                title="お問い合わせフォーム"
                description="以下のフォームにご記入ください。"
                onSubmit={handleSubmit}
            >
                <FormField
                    label="お名前"
                    required
                    error={errors.name}
                >
                    <TextInput
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="山田 太郎"
                        className="w-full"
                    />
                </FormField>

                <FormField
                    label="メールアドレス"
                    required
                    error={errors.email}
                >
                    <TextInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@example.com"
                        className="w-full"
                    />
                </FormField>

                <FormField
                    label="カテゴリ"
                    required
                    error={errors.category}
                >
                    <Select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="カテゴリを選択してください"
                        options={categoryOptions}
                        className="w-full"
                    />
                </FormField>

                <FormField
                    label="性別"
                    error={errors.gender}
                >
                    <RadioGroup
                        name="gender"
                        options={genderOptions}
                        value={formData.gender}
                        onChange={(value) => handleInputChange('gender', value)}
                        direction="horizontal"
                    />
                </FormField>

                <FormField
                    label="メッセージ"
                    required
                    error={errors.message}
                    description="詳細な内容をご記入ください。"
                >
                    <TextArea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="お問い合わせ内容をご記入ください"
                        rows={5}
                        className="w-full"
                    />
                </FormField>

                <FormField
                    label="添付ファイル"
                    description="画像やドキュメントファイルをアップロードできます。"
                >
                    <FileInput
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        showPreview
                        maxSize={5 * 1024 * 1024} // 5MB
                        onChange={(e) => handleInputChange('files', e.target.files)}
                    />
                </FormField>

                <FormField>
                    <label className="flex items-center">
                        <Checkbox
                            checked={formData.newsletter}
                            onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            ニュースレターを受信する
                        </span>
                    </label>
                </FormField>

                <FormActions align="between">
                    <BasicButton variant="outline" type="button">
                        キャンセル
                    </BasicButton>
                    <StoreButton type="submit">
                        送信
                    </StoreButton>
                </FormActions>
            </FormWrapper>

            {/* フォームデータ表示（デバッグ用） */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">フォームデータ（デバッグ用）:</h3>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
}