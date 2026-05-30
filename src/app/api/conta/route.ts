import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('conta').select('*')
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase.from('conta').insert(body).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}
