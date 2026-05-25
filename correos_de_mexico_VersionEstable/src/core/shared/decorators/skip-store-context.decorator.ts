import { SetMetadata } from '@nestjs/common';

export const SKIP_STORE_CONTEXT_KEY = 'skipStoreContext';

// marca handler para saltar validación de storecontextguard
export const SkipStoreContext = () =>
  SetMetadata(SKIP_STORE_CONTEXT_KEY, true);
