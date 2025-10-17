import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { router } from "@inertiajs/react";
import ValidatedInput from "../../../resources/js/Components/ValidatedInput";
import "@testing-library/jest-dom";

// Inertiaのモック
jest.mock("@inertiajs/react", () => ({
    router: {
        post: jest.fn(),
        visit: jest.fn(),
    },
    usePage: () => ({
        props: {
            errors: {
                name: ["名前は必須です。"],
                email: [
                    "メールアドレスには有効なメールアドレスを入力してください。",
                ],
            },
        },
    }),
}));

describe("ValidatedInput Japanese Validation", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("名前フィールドで日本語のバリデーションメッセージが表示される", async () => {
        render(
            <ValidatedInput name="name" type="text" label="名前" required />
        );

        const input = screen.getByLabelText("名前 *");

        // フィールドをフォーカスしてからblur
        fireEvent.focus(input);
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.getByText("名前は必須です。")).toBeInTheDocument();
        });
    });

    it("メールフィールドで日本語のバリデーションメッセージが表示される", async () => {
        render(
            <ValidatedInput
                name="email"
                type="email"
                label="メールアドレス"
                required
            />
        );

        const input = screen.getByLabelText("メールアドレス *");

        // 無効なメールアドレスを入力
        fireEvent.change(input, { target: { value: "invalid-email" } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(
                screen.getByText(
                    "メールアドレスには有効なメールアドレスを入力してください。"
                )
            ).toBeInTheDocument();
        });
    });

    it("パスワードフィールドで最小文字数の日本語メッセージが表示される", async () => {
        // usePage のモックを一時的に変更
        const originalUsePage = require("@inertiajs/react").usePage;
        require("@inertiajs/react").usePage = () => ({
            props: {
                errors: {
                    password: ["パスワードは8文字以上で入力してください。"],
                },
            },
        });

        render(
            <ValidatedInput
                name="password"
                type="password"
                label="パスワード"
                required
            />
        );

        const input = screen.getByLabelText("パスワード *");

        // 短いパスワードを入力
        fireEvent.change(input, { target: { value: "short" } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(
                screen.getByText("パスワードは8文字以上で入力してください。")
            ).toBeInTheDocument();
        });

        // モックを元に戻す
        require("@inertiajs/react").usePage = originalUsePage;
    });

    it("バリデーションエラーがない場合はメッセージが表示されない", () => {
        // エラーなしのモック
        const originalUsePage = require("@inertiajs/react").usePage;
        require("@inertiajs/react").usePage = () => ({
            props: {
                errors: {},
            },
        });

        render(
            <ValidatedInput name="name" type="text" label="名前" required />
        );

        // エラーメッセージが表示されないことを確認
        expect(screen.queryByText("名前は必須です。")).not.toBeInTheDocument();

        // モックを元に戻す
        require("@inertiajs/react").usePage = originalUsePage;
    });
});
