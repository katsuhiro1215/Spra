import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ChatBubbleLeftRightIcon,
    StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

gsap.registerPlugin(ScrollTrigger);

const RatingStars = ({ rating }) => {
    if (!rating) return null;

    return (
        <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, index) => (
                <StarSolidIcon
                    key={index}
                    className={`w-4 h-4 ${
                        index < rating ? "text-amber-400" : "text-gray-200"
                    }`}
                />
            ))}
        </div>
    );
};

export default function VoiceSection({
    voices = [],
    title = "お客様の声",
    subtitle = "ご利用いただいたお客様からいただいた、生の声をご紹介します",
    className = "",
}) {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef(null);

    useEffect(() => {
        if (voices.length === 0) return;

        const section = sectionRef.current;
        const titleEl = titleRef.current;
        const cards = cardsRef.current?.children;

        gsap.fromTo(
            titleEl,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            },
        );

        if (cards && cards.length > 0) {
            gsap.fromTo(
                cards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardsRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                },
            );
        }
    }, [voices.length]);

    if (voices.length === 0) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            className={`py-24 bg-gray-50 ${className}`}
        >
            <div className="container mx-auto px-6">
                <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                        <ChatBubbleLeftRightIcon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {voices.map((voice) => (
                        <div
                            key={voice.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-6 flex flex-col transition-shadow duration-300"
                        >
                            <RatingStars rating={voice.rating} />
                            <p className="text-gray-700 leading-relaxed flex-1 mb-6">
                                &ldquo;{voice.content}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                {voice.avatar_url ? (
                                    <img
                                        src={voice.avatar_url}
                                        alt={voice.display_name}
                                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {(voice.display_name || "?").charAt(
                                            0,
                                        )}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 truncate">
                                        {voice.display_name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate">
                                        {[
                                            voice.author_title,
                                            voice.company_name,
                                        ]
                                            .filter(Boolean)
                                            .join(" / ")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
