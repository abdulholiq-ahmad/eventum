import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, notFound, serverError, forbidden } from '@/lib/api-response';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response, session } = await requireAuth();
  if (response) return response;

  try {
    const { id } = await params;
    const userId = (session!.user as any).id;

    await dbConnect();
    const event = await Event.findById(id);
    if (!event) return notFound('Event not found');

    // Check capacity limit
    if (event.capacity && event.attendees.length >= event.capacity) {
      return forbidden('Event is at capacity');
    }

    // Check if already attending
    if (event.attendees.some(a => a.toString() === userId)) {
      return ok({ message: 'Already attending' });
    }

    event.attendees.push(userId as any);
    await event.save();

    const populated = await Event.findById(event._id)
      .populate('host', 'name email image')
      .populate('attendees', 'name email image');

    return ok(populated);
  } catch (e) {
    return serverError('Failed to attend event');
  }
}
