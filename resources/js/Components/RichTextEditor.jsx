import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichTextEditor = ({
    value,
    onChange,
    placeholder = "コンテンツを入力してください...",
    height = 400,
    id = "rich-text-editor",
}) => {
    const editorRef = useRef(null);

    const handleEditorChange = (content, editor) => {
        if (onChange) {
            onChange(content);
        }
    };

    return (
        <Editor
            apiKey="no-api-key" // 本番環境では実際のAPIキーを使用
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={handleEditorChange}
            init={{
                height: height,
                menubar: false,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "preview",
                    "help",
                    "wordcount",
                ],
                toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                toolbar_mode: "sliding",
                content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                placeholder: placeholder,
                branding: false,
                resize: "vertical",
                statusbar: true,
                elementpath: false,
                language: "ja",
                setup: (editor) => {
                    editor.on("init", () => {
                        editor.getContainer().style.transition =
                            "border-color 0.15s ease-in-out";
                    });

                    editor.on("focus", () => {
                        editor.getContainer().style.borderColor = "#3b82f6";
                        editor.getContainer().style.boxShadow =
                            "0 0 0 1px #3b82f6";
                    });

                    editor.on("blur", () => {
                        editor.getContainer().style.borderColor = "#d1d5db";
                        editor.getContainer().style.boxShadow = "none";
                    });
                },
                style_formats: [
                    { title: "見出し 1", block: "h1" },
                    { title: "見出し 2", block: "h2" },
                    { title: "見出し 3", block: "h3" },
                    { title: "見出し 4", block: "h4" },
                    { title: "見出し 5", block: "h5" },
                    { title: "見出し 6", block: "h6" },
                    { title: "段落", block: "p" },
                    { title: "コードブロック", block: "pre" },
                ],
                // カスタムCSS
                content_css: [
                    "//fonts.googleapis.com/css?family=Noto+Sans+JP:300,400,500,600,700&display=swap",
                ],
                font_family_formats:
                    "Noto Sans JP=Noto Sans JP,sans-serif;Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n",
                // 画像アップロード設定
                images_upload_handler: (blobInfo, success, failure) => {
                    const formData = new FormData();
                    formData.append(
                        "file",
                        blobInfo.blob(),
                        blobInfo.filename()
                    );

                    // CSRFトークンを追加
                    const csrfToken = document.querySelector(
                        'meta[name="csrf-token"]'
                    );
                    if (csrfToken) {
                        formData.append(
                            "_token",
                            csrfToken.getAttribute("content")
                        );
                    }

                    fetch(route("admin.homepage.blogs.upload-editor-image"), {
                        method: "POST",
                        body: formData,
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    })
                        .then((response) => response.json())
                        .then((result) => {
                            if (result.location) {
                                success(result.location);
                            } else {
                                failure("画像のアップロードに失敗しました。");
                            }
                        })
                        .catch(() => {
                            failure("画像のアップロードに失敗しました。");
                        });
                },
                // リンクの設定
                link_default_target: "_blank",
                link_title: false,
                // テーブルの設定
                table_default_attributes: {
                    class: "table table-striped",
                },
                table_default_styles: {
                    width: "100%",
                },
                // その他の設定
                paste_data_images: true,
                paste_as_text: false,
                smart_paste: true,
                browser_spellcheck: true,
                contextmenu: false,
                // モバイル対応
                mobile: {
                    menubar: false,
                    plugins: "autosave lists autolink",
                    toolbar: "undo bold italic styles",
                },
            }}
        />
    );
};

export default RichTextEditor;
