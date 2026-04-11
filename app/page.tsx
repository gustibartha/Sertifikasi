'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Sertifikasi = {
  id?: string
  nama: string
  nip: string
  unit: string
  jabatan: string
  sertifikasi: string
  tanggal_expired: string
}

export default function Home() {
  const [data, setData] = useState<Sertifikasi[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<Sertifikasi>({
    nama: '',
    nip: '',
    unit: '',
    jabatan: '',
    sertifikasi: '',
    tanggal_expired: ''
  })

  useEffect(() => {
    getData()
  }, [])

  // 🔥 GET DATA
  async function getData() {
    setLoading(true)

    const { data, error } = await supabase
      .from('sertifikasi')
      .select('*')
      .order('tanggal_expired', { ascending: true })

    console.log('DATA:', data)
    console.log('ERROR:', error)

    if (data) setData(data)
    setLoading(false)
  }

  // 🔥 TAMBAH DATA
  async function tambahData() {
    const { error } = await supabase.from('sertifikasi').insert([form])

    if (error) {
      alert('Gagal simpan!')
      console.log(error)
      return
    }

    alert('Data berhasil ditambah')

    setForm({
      nama: '',
      nip: '',
      unit: '',
      jabatan: '',
      sertifikasi: '',
      tanggal_expired: ''
    })

    getData()
  }

  // 🔥 KIRIM WA
  async function kirimWA(item: Sertifikasi) {
    try {
      const res = await fetch('/api/send-wa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '628991905928',
          message: `⚠️ Sertifikasi ${item.nama} akan expired pada ${item.tanggal_expired}`
        })
      })

      const result = await res.json()
      console.log('WA RESULT:', result)

      alert('WA dikirim')
    } catch (err) {
      console.error(err)
      alert('Gagal kirim WA')
    }
  }

  // 🔥 FILTER
  const filtered = data.filter(item =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 30, background: '#f5f7fb', minHeight: '100vh' }}>

      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        📊 Monitoring Sertifikasi
      </h1>

      {/* SEARCH */}
      <input
        placeholder="🔍 Cari nama..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          width: '100%',
          marginBottom: 20,
          borderRadius: 8,
          border: '1px solid #ddd'
        }}
      />

      {/* FORM */}
      <div style={{
        background: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20
      }}>
        <h3>➕ Tambah Data</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10
        }}>
          <input placeholder="Nama" value={form.nama}
            onChange={e => setForm({ ...form, nama: e.target.value })} />

          <input placeholder="NIP" value={form.nip}
            onChange={e => setForm({ ...form, nip: e.target.value })} />

          <input placeholder="Unit" value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })} />

          <input placeholder="Jabatan" value={form.jabatan}
            onChange={e => setForm({ ...form, jabatan: e.target.value })} />

          <input placeholder="Sertifikasi" value={form.sertifikasi}
            onChange={e => setForm({ ...form, sertifikasi: e.target.value })} />

          <input type="date" value={form.tanggal_expired}
            onChange={e => setForm({ ...form, tanggal_expired: e.target.value })} />
        </div>

        <button
          onClick={tambahData}
          style={{
            marginTop: 15,
            padding: 10,
            background: '#2563eb',
            color: 'white',
            borderRadius: 8
          }}
        >
          Simpan
        </button>
      </div>

      {/* DATA */}
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 20
      }}>

        {loading && <p>Loading...</p>}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center' }}>
            ❌ Tidak ada data
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Sertifikasi</th>
                <th>Expired</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(item => {
                const diff =
                  (new Date(item.tanggal_expired).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)

                return (
                  <tr key={item.id}
                    style={{
                      background: diff <= 7 ? '#ffe5e5' : 'white'
                    }}>
                    <td>{item.nama}</td>
                    <td>{item.sertifikasi}</td>
                    <td>{item.tanggal_expired}</td>
                    <td>
                      <button
                        onClick={() => kirimWA(item)}
                        style={{
                          padding: 5,
                          background: 'green',
                          color: 'white',
                          borderRadius: 6
                        }}
                      >
                        WA
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}