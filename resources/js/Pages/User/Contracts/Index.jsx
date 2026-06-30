import React, { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// Components
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
// Constants
import { PageConfig } from "@/Constants/PageConfig";

export default function Index({ contracts }) {

    return (
        <AuthenticatedLayout header="契約管理">
            <Head title={PageConfig.users.documentTitle} />
            <div className="space-y-6">test</div>
        </AuthenticatedLayout>
    );
}
