import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
    // Provide a static default locale, but we can read from cookies if preferred later
    // Because we will use middleware to set cookies or detect locale
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ko';

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
