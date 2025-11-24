import prisma from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

// GET 
export async function GET() {
    try {
        const items = await prisma.shoppingItem.findMany({
            orderBy: {
                id: 'asc', // Urutkan berdasarkan ID
            },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat daftar belanja' }, { status: 500 });
    }
}

// POST 
export async function POST(request: Request) {
    try {
        const { title } = await request.json();

        if (!title || title.trim() === "") {
             return NextResponse.json({ error: 'Judul tidak boleh kosong.' }, { status: 400 });
        }

        const newItem = await prisma.shoppingItem.create({
            data: {
                title: title.trim(),
                completed: false,
            },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menambahkan item baru' }, { status: 500 });
    }
}