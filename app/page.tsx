'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    nama: '',
    nip: '',
    unit: '',
    jabatan: '',
    sertifikasi: '',
    tanggal_expired: ''
  })

  useEffect(() => {
    checkUser()
    getData()
  }, [])

  // 🔐 CEK LOGIN
  async function checkUser() {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push('/login')
    }
  }

  // 🔔 KIRIM WA
  async function kirimNotifikasi(item) {
    await fetch('/api/send-wa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '628991905928', //
        message: `⚠️ Sertifikasi ${item.nama} akan expired pada ${item.tanggal_expired}`
      })
    })
  }

  // 📥 GET DATA + CEK EXPIRED
  async function getData() {
    const { data, error } = await supabase
      .from('sertifikasi')
      .select('*')
      .order('tanggal_expired', { ascending: true })

    if (!error) {
      setData(data)

      // 🔥 AUTO NOTIF H-7
      data.forEach(item => {
        const today = new Date()
        const exp = new Date(item.tanggal_expired)

        const diff = (exp - today) / (1000 * 60 * 60 * 24)

        if (diff <= 7 && diff > 0) {
          kirimNotifikasi(item)
        }
      })
    }
  }

  // ⏰ CEK EXPIRED
  const isExpired = (date) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  // ➕ TAMBAH DATA
  async function tambahData() {
    if (!form.nama || !form.sertifikasi || !form.tanggal_expired) {
      alert('Isi data wajib')
      return
    }

    const { error } = await supabase
      .from('sertifikasi')
      .insert([
        {
          nama: form.nama,
          nip: form.nip,
          unit: form.unit,
          jabatan: form.jabatan,
          sertifikasi: form.sertifikasi,
          tanggal_expired: form.tanggal_expired
        }
      ])

    if (error) {
      alert('Error: ' + error.message)
    } else {
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
  }

  // 🔍 SEARCH
  const filteredData = data.filter((item) =>
    item.nama?.toLowerCase().includes(search.toLowerCase())
  )

  // 📊 DASHBOARD
  const total = data.length
  const expired = data.filter(item => isExpired(item.tanggal_expired)).length
  const aktif = total - expired

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Monitoring Sertifikasi</h1>

      {/* DASHBOARD */}
      <div style={{ marginBottom: 20 }}>
        <p>Total: {total}</p>
        <p style={{ color: 'green' }}>Aktif: {aktif}</p>
        <p style={{ color: 'red' }}>Expired: {expired}</p>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Cari nama..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {/* FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />

        <input
          placeholder="NIP"
          value={form.nip}
          onChange={(e) =>
            setForm({ ...form, nip: e.target.value })
          }
        />

        <input
          placeholder="Unit"
          value={form.unit}
          onChange={(e) =>
            setForm({ ...form, unit: e.target.value })
          }
        />

        <input
          placeholder="Jabatan"
          value={form.jabatan}
          onChange={(e) =>
            setForm({ ...form, jabatan: e.target.value })
          }
        />

        <input
          placeholder="Sertifikasi"
          value={form.sertifikasi}
          onChange={(e) =>
            setForm({ ...form, sertifikasi: e.target.value })
          }
        />

        <input
          type="date"
          value={form.tanggal_expired}
          onChange={(e) =>
            setForm({ ...form, tanggal_expired: e.target.value })
          }
        />

        <br /><br />

        <button onClick={tambahData}>
          ➕ Tambah Data
        </button>
      </div>

      {/* DATA */}
      {filteredData.length === 0 && <p>Belum ada data</p>}

      {filteredData.map((item) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            padding: 10,
            marginBottom: 10,
            borderRadius: 8
          }}
        >
          <p><b>Nama:</b> {item.nama}</p>
          <p><b>Sertifikasi:</b> {item.sertifikasi}</p>
          <p><b>Expired:</b> {item.tanggal_expired}</p>

          <p style={{
            color: isExpired(item.tanggal_expired) ? 'red' : 'green',
            fontWeight: 'bold'
          }}>
            {isExpired(item.tanggal_expired)
              ? '❌ EXPIRED'
              : '✅ AKTIF'}
          </p>
        </div>
      ))}
    </div>
  )
}