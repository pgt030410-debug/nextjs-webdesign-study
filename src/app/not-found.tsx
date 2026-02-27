import Link from 'next/link';

export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">404 - Not Found</h2>
            <p className="mt-4 text-lg text-gray-600">The page you are looking for does not exist.</p>
            <Link href="/" className="mt-8 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-all">
                Go back home
            </Link>
        </div>
    );
}
