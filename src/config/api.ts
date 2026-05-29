const USE_LOCAL_API = process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true';
const LOCAL_API_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:4000/api/v1';
const PRODUCTION_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_PRODUCTION_API_URL ||
  'https://offer-hub-api-production.up.railway.app/api/v1';

export function getApiUrl(): string {
  return USE_LOCAL_API ? LOCAL_API_URL : PRODUCTION_API_URL;
}

export const API_URL = getApiUrl();

export const BACKEND_URL = API_URL.replace('/api/v1', '');

if (process.env.NODE_ENV === 'development') {
  console.log(`[API Config] Using ${USE_LOCAL_API ? 'LOCAL' : 'PRODUCTION'} API: ${API_URL}`);
}
