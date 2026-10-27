import { useContext } from 'react';

import { MessagerieContext } from './MessagerieContext';
import type { ValeurMessagerie } from './MessagerieContext';

export function useMessagerieContexte(): ValeurMessagerie {
    return useContext(MessagerieContext);
}
