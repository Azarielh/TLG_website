import PocketBase from 'pocketbase';

const PB_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PB_URL)
  || window.PB_CONFIG?.PB_URL
  || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

export default pb;
