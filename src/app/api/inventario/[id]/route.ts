import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { data, error } = await supabase.from('inventario').update(body).eq('id', id).select()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabase.from('inventario').delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ message: 'Deletado com sucesso' })
}
