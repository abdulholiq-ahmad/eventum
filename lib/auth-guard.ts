import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { unauthorized } from './api-response';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { response: unauthorized('Please sign in'), session: null as any } as const;
  }
  return { response: null as any, session } as const;
}
