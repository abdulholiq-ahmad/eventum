export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string };

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json({ success: true, data }, init);
}

export function badRequest(message = 'Bad Request', init?: ResponseInit) {
  return Response.json({ success: false, error: message }, { status: 400, ...init });
}

export function unauthorized(message = 'Unauthorized', init?: ResponseInit) {
  return Response.json({ success: false, error: message }, { status: 401, ...init });
}

export function forbidden(message = 'Forbidden', init?: ResponseInit) {
  return Response.json({ success: false, error: message }, { status: 403, ...init });
}

export function notFound(message = 'Not Found', init?: ResponseInit) {
  return Response.json({ success: false, error: message }, { status: 404, ...init });
}

export function serverError(message = 'Server Error', init?: ResponseInit) {
  return Response.json({ success: false, error: message }, { status: 500, ...init });
}
