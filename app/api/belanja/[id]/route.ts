import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
        return new NextResponse("ID tidak valid", { status: 400 });
    }

    try {
        await prisma.shoppingItem.delete({ where: { id: id } });
        return new NextResponse(null, { status: 204 }); // 204 No Content
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menghapus item' }, { status: 500 });
    }
}

// UPDATE
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return new NextResponse("ID tidak valid", { status: 400 });
    }

    try {
        const { completed, title } = await request.json(); 

        const updatedItem = await prisma.shoppingItem.update({
            where: { id: id },
            data: { 
                ...(typeof completed === 'boolean' && { completed }),
                ...(typeof title === 'string' && { title: title.trim() }),
            },
        });
        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memperbarui item' }, { status: 500 });
    }
}