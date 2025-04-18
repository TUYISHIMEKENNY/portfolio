import AdminHeader from "@/components/admin-header"

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminHeader />
      {children}
    </div>
  )
}
