interface Submission {
  id: number
  content: string
  submittedAt: string
  user?: { email: string }
}

interface DataTableProps {
  submissions: Submission[]
}

export default function DataTable({ submissions }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Content</th>
            <th className="border border-gray-300 p-2">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td className="border border-gray-300 p-2">{sub.id}</td>
              <td className="border border-gray-300 p-2">{sub.user?.email || 'N/A'}</td>
              <td className="border border-gray-300 p-2">{sub.content}</td>
              <td className="border border-gray-300 p-2">{new Date(sub.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
