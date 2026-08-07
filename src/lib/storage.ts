import { getStorage } from 'firebase/storage';
import { app } from './firebase';

// Keep Firebase Storage out of the storefront bundle. It is only needed by admin upload pages.
export const storage = getStorage(app);
