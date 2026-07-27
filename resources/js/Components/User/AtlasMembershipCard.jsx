import { useEffect, useState } from "react";
import axios from "axios";
import { KeyIcon } from "@heroicons/react/24/outline";

const BRAND_LABELS = {
    concierge: "Atlas Concierge",
    life: "Atlas Life",
    japan: "Atlas Japan",
};

const STATUS_MESSAGES = {
    pending: "会員登録は現在審査中です。承認までしばらくお待ちください。",
    active: "Private Roomでデモやケーススタディをご覧いただけます。",
    paused: "現在ご利用を一時停止しています。詳細はご担当者へお問い合わせください。",
    revoked: "このアカウントでのご利用は終了しています。",
};

export default function AtlasMembershipCard() {
    const [membership, setMembership] = useState(null);

    useEffect(() => {
        let cancelled = false;

        axios
            .get("/api/atlas/me")
            .then(({ data }) => {
                if (!cancelled && data?.member) {
                    setMembership(data);
                }
            })
            .catch(() => {
                // 紹介カードなので、取得に失敗しても静かに非表示のままにする
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (!membership) {
        return null;
    }

    return (
        <div className="rounded-xl bg-[#0d0d10] border border-white/10 p-6 text-neutral-200">
            <p className="text-xs tracking-[0.3em] text-amber-200/70 mb-3">
                ATLAS MEMBER
            </p>
            <h3 className="font-serif text-lg text-neutral-50 mb-2">
                {BRAND_LABELS[membership.brand] ?? "Atlas"}
            </h3>
            <p className="text-sm text-neutral-400 mb-5">
                {STATUS_MESSAGES[membership.status] ??
                    "会員情報をご確認ください。"}
            </p>
            <a
                href={membership.room_url}
                className="inline-flex items-center gap-2 text-sm text-amber-200 hover:text-amber-100"
            >
                <KeyIcon className="w-4 h-4" />
                Atlasサイトへ移動
            </a>
        </div>
    );
}
