import { TeamSwatch } from '@/components/TeamSwatch'
import { Table, Td, Th } from '@/components/ui/table'
import { season } from '@/data/season'
import { constructorStandings } from '@/lib/standings'

export function ConstructorStandingsPage() {
  const rows = constructorStandings(season.races)
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Constructor standings</h1>
      <Table>
        <caption className="sr-only">2025 constructor standings</caption>
        <thead>
          <tr>
            <Th>Pos</Th>
            <Th>Team</Th>
            <Th>Wins</Th>
            <Th>Points</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <Td>{row.position}</Td>
              <Td>
                <TeamSwatch constructorId={row.id} />
              </Td>
              <Td>{row.wins}</Td>
              <Td>{row.points}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
