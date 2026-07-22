import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";
import HeroSection from "@/Pages/Public/Section/HeroSection";
import AboutSection from "@/Pages/Public/Section/AboutSection";
import ServiceSection from "@/Pages/Public/Section/ServiceSection";
import BannerSection from "@/Pages/Public/Section/BannerSection";
import BlogSection from "@/Pages/Public/Section/BlogSection";
import VoiceSection from "@/Pages/Public/Section/VoiceSection";
import ContactSection from "@/Pages/Public/Section/ContactSection";

export default function Home({
    services,
    newsItems,
    blogPosts,
    voices,
    hero,
    about,
    cta,
    auth,
}) {
    return (
        <PublicLayout
            auth={auth}
            showLoading={true}
            title="Smart Sprouts | スプラ公式サイト"
        >
            <Head title="Home" />
            <HeroSection images={hero?.images} />
            <AboutSection {...about} />
            <ServiceSection services={services} />
            <BannerSection />
            <BlogSection newsItems={newsItems} blogPosts={blogPosts} />
            <VoiceSection voices={voices} />
            <ContactSection {...cta} />
        </PublicLayout>
    );
}
