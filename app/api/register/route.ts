import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/schemas/auth.schema';
import { badRequest, ok, serverError } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return badRequest(msg);
    }
    const { name, email, password } = parsed.data;

    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) return badRequest('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    return ok({ id: user._id.toString(), email: user.email, name: user.name });
  } catch (err) {
    return serverError('Failed to register');
  }
}
