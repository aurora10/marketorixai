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

    const textColor = darkMode ? "text-gray-900" : "text-white";

    return (
        <div className={`flex items-center space-x-3 ${textColor}`}>
            <button
                onClick={() => switchLanguage('en')}
                className={`text-base font-medium tracking-wider transition-all duration-300 ${locale === 'en' ? 'text-yellow-400 scale-110' : 'opacity-70 hover:opacity-100 hover:text-yellow-400'}`}
            >
                EN
            </button>
            <span className="opacity-30">|</span>
            <button
                onClick={() => switchLanguage('nl')}
                className={`text-base font-medium tracking-wider transition-all duration-300 ${locale === 'nl' ? 'text-yellow-400 scale-110' : 'opacity-70 hover:opacity-100 hover:text-yellow-400'}`}
            >
                NL
            </button>
        </div>
    );
}
