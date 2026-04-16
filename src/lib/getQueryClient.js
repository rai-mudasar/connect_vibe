import { cache } from 'react';
import { QueryClient } from '@tanstack/react-query';

// cache() ensures the client is shared during a single request
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;