import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || keySecret || 'dev-only-admin-session-secret';
const dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(dirname, 'dist');
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

app.use(express.json());

type OrderStatus =
  | 'Awaiting Prescription'
  | 'Prescription Confirmed'
  | 'Lens Manufacturing'
  | 'Quality Check'
  | 'Shipped'
  | 'Delivered';

const allowedStatuses = new Set<OrderStatus>([
  'Awaiting Prescription',
  'Prescription Confirmed',
  'Lens Manufacturing',
  'Quality Check',
  'Shipped',
  'Delivered',
]);

const base64Url = (value: string | Buffer) =>
  Buffer.from(value)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

const signValue = (value: string) =>
  base64Url(crypto.createHmac('sha256', adminSessionSecret).update(value).digest());

const createAdminToken = () => {
  const payload = base64Url(JSON.stringify({
    role: 'admin',
    exp: Date.now() + 8 * 60 * 60 * 1000,
  }));
  return `${payload}.${signValue(payload)}`;
};

const verifyAdminToken = (token?: string) => {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signValue(payload) !== signature) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
};

const requireAdmin = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!verifyAdminToken(token)) {
    response.status(401).json({ error: 'Admin authorization required.' });
    return;
  }

  next();
};

const requireSupabaseAdmin = (response: express.Response) => {
  if (!supabaseAdmin) {
    response.status(500).json({
      error: 'Supabase service role key is not configured on the server.',
    });
    return false;
  }

  return true;
};

const toDbOrder = (order: any) => ({
  id: order.id,
  customer_name: order.customerName,
  email: order.email || null,
  phone: order.phone,
  address: order.address,
  items: order.items || [],
  total: order.total,
  status: order.status || 'Awaiting Prescription',
  payment_id: order.paymentId || null,
  created_at: order.date || new Date().toISOString(),
});

const fromDbOrder = (row: any) => ({
  id: row.id,
  customerName: row.customer_name,
  email: row.email || '',
  phone: row.phone,
  address: row.address,
  items: row.items || [],
  total: Number(row.total),
  status: row.status,
  paymentId: row.payment_id || '',
  date: row.created_at,
});

const fromDbAppointment = (row: any) => ({
  id: row.id,
  name: row.customer_name,
  phone: row.phone,
  date: row.created_at?.split('T')[0] || '',
  slot: 'To be confirmed',
  type: row.appointment_type,
  interestedIn: row.interest,
  message: row.message || '',
  status: row.status,
});

const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) => {
  if (!keySecret) return false;

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(String(razorpaySignature));
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

app.post('/api/admin/login', (request, response) => {
  if (!adminPassword) {
    response.status(500).json({ error: 'Admin password is not configured on the server.' });
    return;
  }

  const password = String(request.body.password || '');

  if (password !== adminPassword) {
    response.status(401).json({ error: 'Incorrect admin password.' });
    return;
  }

  response.json({ token: createAdminToken() });
});

app.post('/api/razorpay/order', async (request, response) => {
  if (!keyId || !keySecret) {
    response.status(500).json({ error: 'Razorpay server keys are not configured.' });
    return;
  }

  const amount = Number(request.body.amount);
  const receipt = String(request.body.receipt || `niyaz_${Date.now()}`).slice(0, 40);

  if (!Number.isInteger(amount) || amount < 100) {
    response.status(400).json({ error: 'Invalid amount.' });
    return;
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        payment_capture: 1,
        notes: request.body.notes || {},
      }),
    });

    const data = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('Razorpay order error:', data);
      response.status(razorpayResponse.status).json(data);
      return;
    }

    response.json(data);
  } catch (error) {
    console.error('Could not reach Razorpay:', error);
    response.status(502).json({
      error: 'Could not reach Razorpay from the server. Check internet connection and restart the server.',
    });
  }
});

app.post('/api/razorpay/verify', (request, response) => {
  if (!keySecret) {
    response.status(500).json({ error: 'Razorpay key secret is not configured.' });
    return;
  }

  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = request.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    response.status(400).json({ verified: false, error: 'Missing Razorpay verification fields.' });
    return;
  }

  const verified = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!verified) {
    response.status(400).json({ verified: false, error: 'Signature mismatch.' });
    return;
  }

  response.json({ verified: true });
});

app.post('/api/razorpay/verify-and-create-order', async (request, response) => {
  if (!keySecret) {
    response.status(500).json({ error: 'Razorpay key secret is not configured.' });
    return;
  }

  if (!requireSupabaseAdmin(response)) return;

  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    order,
  } = request.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !order) {
    response.status(400).json({ verified: false, error: 'Missing payment verification or order fields.' });
    return;
  }

  const verified = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!verified) {
    response.status(400).json({ verified: false, error: 'Signature mismatch.' });
    return;
  }

  const dbOrder = toDbOrder({
    ...order,
    paymentId: razorpayPaymentId,
    status: 'Awaiting Prescription',
    date: new Date().toISOString(),
  });

  const { data, error } = await supabaseAdmin!
    .from('orders')
    .insert(dbOrder)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase create order error:', error);
    response.status(500).json({ verified: true, error: error.message });
    return;
  }

  response.json({ verified: true, order: fromDbOrder(data) });
});

app.get('/api/orders', requireAdmin, async (_request, response) => {
  if (!requireSupabaseAdmin(response)) return;

  const { data, error } = await supabaseAdmin!
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase get orders error:', error);
    response.status(500).json({ error: error.message });
    return;
  }

  response.json({ orders: (data || []).map(fromDbOrder) });
});

app.patch('/api/orders/:id/status', requireAdmin, async (request, response) => {
  if (!requireSupabaseAdmin(response)) return;

  const status = request.body.status as OrderStatus;

  if (!allowedStatuses.has(status)) {
    response.status(400).json({ error: 'Invalid order status.' });
    return;
  }

  const { data, error } = await supabaseAdmin!
    .from('orders')
    .update({ status })
    .eq('id', request.params.id)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase update order status error:', error);
    response.status(500).json({ error: error.message });
    return;
  }

  response.json({ order: fromDbOrder(data) });
});

app.get('/api/appointments', requireAdmin, async (_request, response) => {
  if (!requireSupabaseAdmin(response)) return;

  const { data, error } = await supabaseAdmin!
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase get appointments error:', error);
    response.status(500).json({ error: error.message });
    return;
  }

  response.json({ appointments: (data || []).map(fromDbAppointment) });
});

app.patch('/api/appointments/:id/status', requireAdmin, async (request, response) => {
  if (!requireSupabaseAdmin(response)) return;

  const status = String(request.body.status || '');
  const allowedAppointmentStatuses = new Set(['Pending', 'Confirmed', 'Completed', 'Cancelled']);

  if (!allowedAppointmentStatuses.has(status)) {
    response.status(400).json({ error: 'Invalid appointment status.' });
    return;
  }

  const { data, error } = await supabaseAdmin!
    .from('appointments')
    .update({ status })
    .eq('id', request.params.id)
    .select('*')
    .single();

  if (error) {
    console.error('Supabase update appointment status error:', error);
    response.status(500).json({ error: error.message });
    return;
  }

  response.json({ appointment: fromDbAppointment(data) });
});

app.delete('/api/appointments/:id', requireAdmin, async (request, response) => {
  if (!requireSupabaseAdmin(response)) return;

  const { error } = await supabaseAdmin!
    .from('appointments')
    .delete()
    .eq('id', request.params.id);

  if (error) {
    console.error('Supabase delete appointment error:', error);
    response.status(500).json({ error: error.message });
    return;
  }

  response.json({ ok: true });
});

app.use(express.static(distPath));
app.get('*', (_request, response) => {
  response.sendFile(path.join(distPath, 'index.html'));
});

// Vercel imports the Express app as a serverless function. Keep app.listen for
// the local Node server, but never start a second listener inside Vercel.
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Niyaz server running on http://localhost:${port}`);
  });
}

export default app;
