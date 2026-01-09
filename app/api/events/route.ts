import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, badRequest, serverError } from '@/lib/api-response';
import { createEventSchema } from '@/schemas/event.schema';
import { requireAuth } from '@/lib/auth-guard';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({ visibility: 'public' })
      .populate('host', 'name email image')
      .populate('attendees', 'name email image')
      .sort({ startsAt: 1 })
      .lean();
    return ok(events);
  } catch (e) {
    return serverError('Failed to fetch events');
  }
}

export async function POST(req: NextRequest) {
  const { response, session } = await requireAuth();
  if (response) return response;

  try {
    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return badRequest(msg);
    }

    await dbConnect();

    const doc = await Event.create({
      ...parsed.data,
      host: (session!.user as any).id,
      attendees: [(session!.user as any).id],
    });
    
    const populated = await Event.findById(doc._id)
      .populate('host', 'name email image')
      .populate('attendees', 'name email image');
      
    return ok(populated, { status: 201 });
  } catch (e) {
    return serverError('Failed to create event');
  }
}
