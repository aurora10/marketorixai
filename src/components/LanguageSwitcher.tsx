"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher({ darkMode = false }: { darkMode?: boolean }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLocale: string) => {
        if (!pathname) return;
        const pathParts = pathname.split('/');
        if (pathParts.length > 1 && (pathParts[1] === 'en' || pathParts[1] === 'nl')) {
            pathParts[1] = newLocale;
        } else {
            pathParts.splice(1, 0, newLocale);
        }
        const newPath = pathParts.join('/');
        router.replace(newPath);
    };

    const textColor = darkMode ? "text-gray-800" : "text-gray-200";

    return (
        <div className={`flex items-center space-x-2 ${textColor}`}>
            <button
                onClick={() => switchLanguage('en')}
                className={`text-sm tracking-wider ${locale === 'en' ? 'font-bold' : 'opacity-60 hover:opacity-100 hover:font-bold'}`}
            >
                EN
            </button>
            <span className="opacity-40">|</span>
            <button
                onClick={() => switchLanguage('nl')}
                className={`text-sm tracking-wider ${locale === 'nl' ? 'font-bold' : 'opacity-60 hover:opacity-100 hover:font-bold'}`}
            >
                NL
            </button>
        </div>
    );
}
