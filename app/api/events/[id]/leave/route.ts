import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, notFound, serverError } from '@/lib/api-response';
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

    event.attendees = event.attendees.filter(a => a.toString() !== userId);
    await event.save();

    const populated = await Event.findById(event._id)
      .populate('host', 'name email image')
      .populate('attendees', 'name email image');

    return ok(populated);
  } catch (e) {
    return serverError('Failed to leave event');
  }
}
