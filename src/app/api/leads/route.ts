import { createLead } from "@/lib/catalog";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  message: z.string().optional(),
  source: z.string().optional(),
  productId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        name: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = leadSchema.parse(body);
    const lead = await createLead(data);
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
