"use client";

import {useState, useEffect, FormEvent, ChangeEvent} from "react";
import Link from "next/link";

type List_brg={
    id:number;
    title:string;
    completed:boolean;
};

export default function Home() {
    const [brg,setbrg]=useState<List_brg[]>([]);
    const [newList, setNewList] = useState<string>("");
    const [filterCompleted, setFilterCompleted] = useState<boolean>(false);

    const fetchItems = async () => {
        try {
                const res = await fetch('/api/belanja');
            if (res.ok) {
                const data: List_brg[] = await res.json();
                setbrg(data);
            } else {
                console.error("Gagal memuat item:", res.status);
            }
        } catch (error) {
            console.error("Kesalahan saat fetching item:", error);
        }
    };

    useEffect(() => {
      const fetchItems = async () => {
        try {
          const res = await fetch('/api/belanja');
          if (res.ok) {
            const data: List_brg[] = await res.json();
            setbrg(data); 
          } else {
            console.error("Gagal memuat item:", res.status);
          }
        } catch (error) {
          console.error("Kesalahan saat fetching item:", error);
        }
      };
      
      fetchItems();
      
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> =>{ 
        e.preventDefault();
        if(!newList.trim()) return;

        try {
            await fetch('/api/belanja', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newList.trim() }),
            });
            
            setNewList("");
            fetchItems(); 
        } catch (error) {
            console.error("Error saat menambahkan item:", error);
        }
    };

    const handleChange=(e:ChangeEvent<HTMLInputElement>):void =>{
        setNewList(e.target.value);
    };

    const toggleComplete = async (id: number, currentStatus: boolean): Promise<void> => { 
        try {
            await fetch(`/api/belanja/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentStatus }), 
            });
            fetchItems(); 
        } catch (error) {
            console.error("Error saat mengubah status:", error);
        }
    };
    const deleteList = async (id:number): Promise<void> =>{ 
        try {
            await fetch(`/api/belanja/${id}`, {
                method: 'DELETE',
            });
            fetchItems(); 
        } catch (error) {
            console.error("Error saat menghapus item:", error);
        }
    };

    const clearCompletedbrg = (): void => {
        setbrg((prev) => prev.filter((list) => !list.completed));
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFilterCompleted(e.target.checked);
    };
    
    const filteredbrg = brg.filter((list) => 
        filterCompleted ? list.completed : true
    );

    return (
        <main className="container py-5">
            <div className="mx-auto" style={{ maxWidth: 600 }}>
                <h6>Nama: Vanesa Yolanda</h6>
                <h6>NIM: 535240071</h6>
                <h6 className="pb-10 ">Topik: List Daftar Belanja</h6>

                <h1 className="mb-4 border-bottom border-secondary-subtle">List Daftar Belanja</h1>

                <form onSubmit={handleSubmit} className="d-flex mb-3" role="search">
                    <input
                        type="text"
                        placeholder="Masukkan item belanja baru..."
                        value={newList}
                        onChange={handleChange}
                        className="form-control me-2"
                        aria-label="Item baru"
                    />
                    <button type="submit" className="btn btn-primary">
                        Tambah
                    </button>
                </form>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input me-2"
                            type="checkbox"
                            checked={filterCompleted}
                            onChange={handleFilterChange}
                            id="filterCompleted"
                        />
                        <label className="form-check-label" htmlFor="filterCompleted">
                            Tampilkan Hanya Selesai Dibeli
                        </label>
                    </div>

                    <button
                        onClick={clearCompletedbrg}
                        disabled={brg.filter((t) => t.completed).length === 0}
                        className="btn btn-danger"
                        aria-disabled={brg.filter((t) => t.completed).length === 0}
                    >
                        Hapus Semua Selesai
                    </button>
                </div>

                <ul className="list-group mb-3">
                    {filteredbrg.map((list) => (
                        <li
                            key={list.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                list.completed ? "list-group-item-success" : ""
                            }`}
                        >
                            <div className="d-flex align-items-center">
                                <input
                                    className="form-check-input me-3"
                                    type="checkbox"
                                    checked={list.completed}
                                    onChange={() => toggleComplete(list.id, list.completed)} 
                                />
                                <Link href={`/list/${list.id}`} className={`text-decoration-none text-dark ${list.completed ? 'text-decoration-line-through' : ''}`}>
                                    {list.title}
                                </Link>
                            </div>

                            <button onClick={() => deleteList(list.id)} className="btn btn-danger btn-sm">
                                &times;
                            </button>
                        </li>
                    ))}
                </ul>

                {brg.length === 0 && <p className="text-muted">Belum ada item belanja. Tambahkan satu!</p>}
            </div>
        </main>
    );
}