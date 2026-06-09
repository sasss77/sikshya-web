
'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-sky-100">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">Dashboard</h1>
        
        <button
          onClick={() => router.push('/login')}
          className="rounded bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}