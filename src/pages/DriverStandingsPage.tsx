import { TeamSwatch } from '@/components/TeamSwatch'
import { Table, Td, Th } from '@/components/ui/table'
import { driverById, season } from '@/data/season'
import { driverStandings } from '@/lib/standings'

// The team a driver raced for most recently (drivers can change seat mid-season).
const latestTeam = (driverId: string): string | undefined => season.races.flatMap((r) => r.results).findLast((row) => row.driverId === driverId)?.constructorId

export function DriverStandingsPage() {
  const rows = driverStandings(season.races)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Driver standings</h1>
      <Table>
        <caption className="sr-only">2025 driver standings</caption>
        <thead>
          <tr>
            <Th>Pos</Th>
            <Th>Driver</Th>
            <Th>Team</Th>
            <Th>Wins</Th>
            <Th>Points</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const d = driverById(row.id)
            const team = latestTeam(row.id)
            return (
              <tr key={row.id}>
                <Td>{row.position}</Td>
                <Td>{d ? `${d.givenName} ${d.familyName}` : row.id}</Td>
                <Td>{team ? <TeamSwatch constructorId={team} /> : '—'}</Td>
                <Td>{row.wins}</Td>
                <Td>{row.points}</Td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
