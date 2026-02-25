import gsap from "gsap";

export const scrollReveal = (element: Element | string, options = {}) => {
    return gsap.fromTo(
        element,
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none none",
            },
            ...options,
        }
    );
};
