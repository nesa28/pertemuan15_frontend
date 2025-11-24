'use client';

import Link from "next/link";
import {useParams} from "next/navigation";

export default function TodoDetail() {
    const {id} = useParams<{id:string}>();

    return (
        <main style={{padding: "2rem"}}>
            <h1>Detail Barang belanja</h1>
            <p>ID Barang: {id}</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga quod deleniti rem magni, ducimus explicabo quidem officiis hic quasi vitae maiores provident ipsa. Nemo pariatur vel magni dolore aperiam eos?</p>
            <Link className="btn btn-info" href="/">Kembali ke Daftar Utama</Link>
        </main>
    );
}   