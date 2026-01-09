import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Event from '@/models/Event';
import { ok, badRequest, notFound, serverError, forbidden } from '@/lib/api-response';
import { updateEventSchema } from '@/schemas/event.schema';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const event = await Event.findById(id)
      .populate('host', 'name email image')
      .populate('attendees', 'name email image');
    if (!event) return notFound('Event not found');
    return ok(event);
  } catch (e) {
    return serverError('Failed to fetch event');
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response, session } = await requireAuth();
  if (response) return response;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateEventSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join(', ');
      return badRequest(msg);
    }

    await dbConnect();
    const event = await Event.findById(id);
    if (!event) return notFound('Event not found');

    const userId = (session!.user as any).id;
    if (event.host.toString() !== userId) {
      return forbidden('Only host can update event');
    }

    Object.assign(event, parsed.data);
    await event.save();
    
    const populated = await Event.findById(event._id)
      .populate('host', 'name email image')
      .populate('attendees', 'name email image');
      
    return ok(populated);
  } catch (e) {
    return serverError('Failed to update event');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response, session } = await requireAuth();
  if (response) return response;

  try {
    const { id } = await params;
    await dbConnect();
    const event = await Event.findById(id);
    if (!event) return notFound('Event not found');

    const userId = (session!.user as any).id;
    if (event.host.toString() !== userId) {
      return forbidden('Only host can delete event');
    }

    await Event.deleteOne({ _id: id });
    return ok({ message: 'Event deleted' });
  } catch (e) {
    return serverError('Failed to delete event');
  }
}
